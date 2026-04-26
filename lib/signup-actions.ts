"use server";

import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { PlanKey } from "@/lib/plans";
import { displayPlanName } from "@/lib/upgrade";
import { buildAccountVerificationEmail, sendEmail } from "@/lib/email";

const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";
const APP_DOMAIN = "app.mydogportal.site";
const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";

const SIGNUP_PLAN_TO_PLAN_KEY: Record<string, PlanKey> = {
  documents: "starter",
  starter: "starter",
  "breeder-os": "pro",
  breeder_os: "pro",
  pro: "pro",
  professional: "pro",
  "full-system": "elite",
  full_system: "elite",
  elite: "elite",
  premium: "elite",
};

export async function signUpWithPlanAction(formData: FormData) {
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next"));
  const selectedPlanKey = normalizeSignupPlan(formData.get("plan"));

  if (await shouldForceAuthToAppDomain()) {
    redirect(await buildAppAuthUrl("/sign-up", nextPath, selectedPlanKey));
  }

  const admin = createSupabaseAdminClient();
  if (!admin) redirect(await buildAuthRedirect("config", nextPath, selectedPlanKey));

  const { data: createdUser, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  if (userError) redirect(await buildAuthRedirect(classifySignupError(userError), nextPath, selectedPlanKey));
  if (!createdUser.user) redirect(await buildAuthRedirect("signup_no_user", nextPath, selectedPlanKey));

  const { data: plan } = await admin.from("plans").select("id").eq("name", displayPlanName(selectedPlanKey)).maybeSingle();
  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({
      name: organizationName,
      legal_name: organizationName,
      slug: buildOrganizationSlug(organizationName),
      email,
      status: "active",
      subscription_status: "trialing",
      onboarding_completed: false,
      timezone: process.env.DEFAULT_ORGANIZATION_TIMEZONE || "America/New_York",
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    await admin.auth.admin.deleteUser(createdUser.user.id);
    redirect(await buildAuthRedirect("organization", nextPath, selectedPlanKey));
  }

  await admin.from("organization_users").insert({
    organization_id: organization.id,
    user_id: createdUser.user.id,
    role: "owner",
  });

  if (plan) {
    await admin.from("subscriptions").insert({
      organization_id: organization.id,
      plan_id: plan.id,
      status: "trialing",
    });
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const { error: tokenError } = await admin.from("email_verification_tokens").insert({
    user_id: createdUser.user.id,
    email,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  });

  if (tokenError) redirect(await buildAuthRedirect("verification", nextPath, selectedPlanKey));

  const verifyUrl = `${await getAppBaseUrl()}/auth/verify-account?token=${rawToken}`;

  try {
    await sendEmail({
      to: email,
      subject: "Confirm your MyDogPortal account",
      html: buildAccountVerificationEmail({ businessName: organizationName, verifyUrl }),
    });
  } catch {
    redirect(await buildAuthRedirect("email_send", nextPath, selectedPlanKey));
  }

  redirect(`/sign-in?notice=check_email&next=${encodeURIComponent(nextPath ?? "/dashboard")}`);
}

function classifySignupError(error: { code?: string; status?: number; message?: string | null }) {
  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  if (code.includes("already") || message.includes("already registered") || message.includes("already exists")) return "signup_exists";
  if (code.includes("weak_password") || message.includes("password")) return "signup_password";
  if (message.includes("invalid") && message.includes("email")) return "signup_email";
  if (error.status === 429 || message.includes("rate") || message.includes("too many")) return "signup_rate_limit";
  return "signup";
}

function normalizeSignupPlan(value: FormDataEntryValue | string | null | undefined): PlanKey {
  if (typeof value !== "string") return "starter";
  return SIGNUP_PLAN_TO_PLAN_KEY[value.trim().toLowerCase()] ?? "starter";
}

function sanitizeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  return trimmed;
}

async function buildAuthRedirect(error: string, nextPath: string | null, planKey: PlanKey) {
  const params = new URLSearchParams({ error, plan: planKey });
  if (nextPath) params.set("next", nextPath);
  const pathname = "/sign-up";
  if (await shouldUseAbsoluteAppAuthUrls()) return `${await getAppBaseUrl()}${pathname}?${params.toString()}`;
  return `${pathname}?${params.toString()}`;
}

function buildOrganizationSlug(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return `${base || "breeder"}-${Date.now().toString(36)}`;
}

async function shouldForceAuthToAppDomain() {
  if (process.env.NODE_ENV === "development") return false;
  const host = await getCurrentHost();
  return host === PUBLIC_ROOT_DOMAIN || host === PUBLIC_WWW_DOMAIN;
}

async function shouldUseAbsoluteAppAuthUrls() {
  if (process.env.NODE_ENV === "development") return false;
  const host = await getCurrentHost();
  return host === PUBLIC_ROOT_DOMAIN || host === PUBLIC_WWW_DOMAIN;
}

async function getCurrentHost() {
  const headerStore = await headers();
  return (headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "").split(":")[0].toLowerCase();
}

async function getAppBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "development") return `https://${APP_DOMAIN}`;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return host ? `${protocol}://${host}` : DEFAULT_LOCAL_APP_URL;
}

async function buildAppAuthUrl(pathname: "/sign-up", nextPath: string | null, planKey: PlanKey) {
  const params = new URLSearchParams({ plan: planKey });
  if (nextPath) params.set("next", nextPath);
  const query = params.toString();
  return `${await getAppBaseUrl()}${pathname}${query ? `?${query}` : ""}`;
}
