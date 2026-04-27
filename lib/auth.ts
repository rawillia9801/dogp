"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase";
import type { PlanKey } from "@/lib/plans";
import { displayPlanName, normalizePlanKey } from "@/lib/upgrade";

export type OrganizationContext = {
  userId: string;
  id: string;
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  timezone: string | null;
  role: "owner" | "staff";
};

export type SubscriptionContext = { status: string; planKey: PlanKey; planName: string };

const DEVELOPMENT_USER_ID = "00000000-0000-4000-8000-000000000001";
const DEVELOPMENT_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000002";
const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";
const APP_DOMAIN = "app.mydogportal.site";
const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next")) ?? "/dashboard";
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(`/sign-in?error=config&next=${encodeURIComponent(nextPath)}`);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/sign-in?error=signin&next=${encodeURIComponent(nextPath)}`);
  redirect(nextPath);
}

export async function signUpAction(formData: FormData) {
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next"));
  if (await shouldForceAuthToAppDomain()) redirect(await buildAppAuthUrl("/sign-up", nextPath));
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(await buildAuthRedirect("/sign-up", "config", nextPath));
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${await getAppBaseUrl()}/auth/confirm?next=/dashboard` } });
  if (error || !data.user) redirect(await buildAuthRedirect("/sign-up", "signup", nextPath));
  const admin = createSupabaseAdminClient();
  if (!admin) redirect(await buildAuthRedirect("/sign-up", "config", nextPath));
  const { data: plan } = await admin.from("plans").select("id").eq("name", "Starter").maybeSingle();
  const { data: organization, error: organizationError } = await admin.from("organizations").insert({ name: organizationName, legal_name: organizationName, slug: buildOrganizationSlug(organizationName), email, status: "active", subscription_status: "trialing", onboarding_completed: false, timezone: process.env.DEFAULT_ORGANIZATION_TIMEZONE || "America/New_York" }).select("id").single();
  if (organizationError || !organization) redirect(await buildAuthRedirect("/sign-up", "organization", nextPath));
  const { error: membershipError } = await admin.from("organization_users").insert({ organization_id: organization.id, auth_user_id: data.user.id, role: "owner", is_owner: true, is_active: true });
  if (membershipError) console.error("organization_users insert failed during sign up", membershipError);
  if (plan) {
    const { error: subscriptionError } = await admin.from("subscriptions").insert({ organization_id: organization.id, plan_id: plan.id, status: "trialing" });
    if (subscriptionError) console.error("subscription insert failed during sign up", subscriptionError);
  }
  redirect(nextPath ?? (await getDefaultSignedInDestination()));
}

export async function logoutAction() { const supabase = await createSupabaseServerClient(); await supabase?.auth.signOut(); redirect(await getPublicBaseUrl()); }
export async function requireOrganization() { const organization = await getAuthenticatedOrganization(); if (!organization) redirect(await buildAppAuthUrl("/sign-in", "/dashboard")); return organization; }
export async function requireAdminOrganization() { const organization = await getOptionalAdminOrganization(); if (organization) return organization; redirect(await buildAppAuthUrl("/sign-in", "/dashboard")); }
export async function getOptionalAdminOrganization() { const organization = await getAuthenticatedOrganization(); if (organization) return organization; const developmentOrganization = getDevelopmentOrganization(); if (developmentOrganization) return developmentOrganization; return null; }

async function getAuthenticatedOrganization(): Promise<OrganizationContext | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase!.auth.getUser();
  if (!userData.user) return null;

  const admin = createSupabaseAdminClient();
  const membershipClient = admin ?? supabase!;
  const { data: membership, error: membershipError } = await membershipClient
    .from("organization_users")
    .select("role, is_owner, is_active, organizations(id, name, legal_name, email, phone, website, timezone)")
    .eq("auth_user_id", userData.user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!membershipError && membership) {
    const organization = Array.isArray(membership.organizations) ? membership.organizations[0] : membership.organizations;
    if (organization) {
      return {
        userId: userData.user.id,
        id: organization.id,
        name: organization.name,
        legalName: organization.legal_name,
        email: organization.email,
        phone: organization.phone,
        website: organization.website,
        timezone: organization.timezone,
        role: (membership.role || (membership.is_owner ? "owner" : "staff")) as "owner" | "staff",
      };
    }
  }

  if (!userData.user.email) return null;
  const fallbackClient = admin ?? supabase!;
  const { data: fallbackOrganization } = await fallbackClient.from("organizations").select("id, name, legal_name, email, phone, website, timezone").eq("email", userData.user.email).order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (!fallbackOrganization) return null;
  return { userId: userData.user.id, id: fallbackOrganization.id, name: fallbackOrganization.name, legalName: fallbackOrganization.legal_name, email: fallbackOrganization.email, phone: fallbackOrganization.phone, website: fallbackOrganization.website, timezone: fallbackOrganization.timezone, role: "owner" };
}

function getDevelopmentOrganization(): OrganizationContext | null { if (process.env.NODE_ENV !== "development") return null; return { userId: DEVELOPMENT_USER_ID, id: DEVELOPMENT_ORGANIZATION_ID, name: "Development Kennel", legalName: "Development Kennel", email: process.env.NEXT_PUBLIC_DEV_OWNER_EMAIL?.trim() || "owner@mydogportal.local", phone: null, website: null, timezone: process.env.DEFAULT_ORGANIZATION_TIMEZONE || "America/New_York", role: "owner" }; }

export async function updateOrganizationAction(formData: FormData) {
  const organization = await requireAdminOrganization();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/settings");
  await supabase.from("organizations").update({ name: String(formData.get("name") ?? ""), legal_name: String(formData.get("legalName") ?? ""), email: String(formData.get("email") ?? ""), phone: String(formData.get("phone") ?? ""), website: String(formData.get("website") ?? ""), timezone: String(formData.get("timezone") ?? "") }).eq("id", organization.id);
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export async function getSubscription() { const organization = await requireAdminOrganization(); return getSubscriptionForOrganization(organization.id); }
export async function getSubscriptionForOrganization(organizationId: string): Promise<SubscriptionContext> {
  const fallback = { status: "trialing", planKey: "starter" as const, planName: "Starter" };
  if (!isSupabaseConfigured()) return fallback;
  const supabase = await createSupabaseServerClient();
  const client = createSupabaseAdminClient() ?? supabase!;
  const { data } = await client.from("subscriptions").select("status, plans(name)").eq("organization_id", organizationId).maybeSingle();
  if (!data) {
    const { data: organization } = await client.from("organizations").select("subscription_status").eq("id", organizationId).maybeSingle();
    return { status: organization?.subscription_status ?? fallback.status, planKey: fallback.planKey, planName: fallback.planName };
  }
  const plan = Array.isArray(data?.plans) ? data?.plans[0] : data?.plans;
  const planKey = normalizePlanKey(plan?.name ?? "Starter");
  return { status: data?.status ?? "inactive", planKey, planName: displayPlanName(planKey) };
}

function sanitizeNextPath(value: FormDataEntryValue | null) { if (typeof value !== "string") return null; const trimmed = value.trim(); if (!trimmed) return null; if (trimmed === `https://${APP_DOMAIN}` || trimmed === `https://${APP_DOMAIN}/`) return "/dashboard"; if (trimmed.startsWith(`https://${APP_DOMAIN}/`)) { const url = new URL(trimmed); return `${url.pathname}${url.search}${url.hash}`; } if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null; return trimmed; }
async function buildAuthRedirect(pathname: "/sign-in" | "/sign-up", error: string, nextPath: string | null) { const params = new URLSearchParams({ error }); if (nextPath) params.set("next", nextPath); if (await shouldUseAbsoluteAppAuthUrls()) return `${await getAppBaseUrl()}${pathname}?${params.toString()}`; return `${pathname}?${params.toString()}`; }
function buildOrganizationSlug(name: string) { const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48); const fallback = base.length > 0 ? base : "breeder"; return `${fallback}-${Date.now().toString(36)}`; }
async function shouldForceAuthToAppDomain() { if (process.env.NODE_ENV === "development") return false; const host = await getCurrentHost(); return host === PUBLIC_ROOT_DOMAIN || host === PUBLIC_WWW_DOMAIN; }
async function shouldUseAbsoluteAppAuthUrls() { if (process.env.NODE_ENV === "development") return false; const host = await getCurrentHost(); return host === PUBLIC_ROOT_DOMAIN || host === PUBLIC_WWW_DOMAIN; }
async function getCurrentHost() { const headerStore = await headers(); return (headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "").split(":")[0].toLowerCase(); }
async function getAppBaseUrl() { const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim(); if (envUrl) return envUrl.replace(/\/+$/, ""); if (process.env.NODE_ENV !== "development") return `https://${APP_DOMAIN}`; const headerStore = await headers(); const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host"); const protocol = headerStore.get("x-forwarded-proto") ?? "http"; if (host) return `${protocol}://${host}`; return DEFAULT_LOCAL_APP_URL; }
async function getPublicBaseUrl() { const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim(); if (envUrl) return envUrl.replace(/\/+$/, ""); if (process.env.NODE_ENV !== "development") return `https://${PUBLIC_WWW_DOMAIN}`; return "/"; }
async function buildAppAuthUrl(pathname: "/sign-in" | "/sign-up", nextPath: string | null) { const params = new URLSearchParams(); if (nextPath) params.set("next", nextPath); const query = params.toString(); return `${await getAppBaseUrl()}${pathname}${query ? `?${query}` : ""}`; }
async function getDefaultSignedInDestination() { const appUrl = await getAppBaseUrl(); const host = await getCurrentHost(); if (process.env.NODE_ENV !== "development") { if (host === APP_DOMAIN) return "/dashboard"; return `${appUrl}/dashboard`; } return "/dashboard"; }
