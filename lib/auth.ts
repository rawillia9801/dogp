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

export type SubscriptionContext = {
  status: string;
  planKey: PlanKey;
  planName: string;
};

const DEVELOPMENT_USER_ID = "00000000-0000-4000-8000-000000000001";
const DEVELOPMENT_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000002";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next"));
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(buildAuthRedirect("/sign-in", "config", nextPath));
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildAuthRedirect("/sign-in", "signin", nextPath));
  }

  redirect(nextPath ?? await getDefaultSignedInDestination());
}

export async function signUpAction(formData: FormData) {
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(formData.get("next"));
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(buildAuthRedirect("/sign-up", "config", nextPath));
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await getAppBaseUrl()}/auth/confirm?next=/dashboard`,
    },
  });

  if (error || !data.user) {
    redirect(buildAuthRedirect("/sign-up", "signup", nextPath));
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    redirect(buildAuthRedirect("/sign-up", "config", nextPath));
  }

  const { data: plan } = await admin
    .from("plans")
    .select("id")
    .eq("name", "Starter")
    .maybeSingle();

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
    redirect(buildAuthRedirect("/sign-up", "organization", nextPath));
  }

  const { error: membershipError } = await admin.from("organization_users").insert({
    organization_id: organization.id,
    user_id: data.user.id,
    role: "owner",
  });

  if (membershipError) {
    console.error("organization_users insert failed during sign up", membershipError);
  }

  if (plan) {
    const { error: subscriptionError } = await admin.from("subscriptions").insert({
      organization_id: organization.id,
      plan_id: plan.id,
      status: "trialing",
    });

    if (subscriptionError) {
      console.error("subscription insert failed during sign up", subscriptionError);
    }
  }

  redirect(nextPath ?? await getDefaultSignedInDestination());
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/");
}

export async function requireOrganization() {
  const organization = await getAuthenticatedOrganization();

  if (!organization) {
    redirect("/sign-in");
  }

  return organization;
}

export async function requireAdminOrganization() {
  const organization = await getOptionalAdminOrganization();

  if (organization) {
    return organization;
  }

  redirect("/sign-in");
}

export async function getOptionalAdminOrganization() {
  const organization = await getAuthenticatedOrganization();

  if (organization) {
    return organization;
  }

  const developmentOrganization = getDevelopmentOrganization();

  if (developmentOrganization) {
    return developmentOrganization;
  }

  return null;
}

async function getAuthenticatedOrganization(): Promise<OrganizationContext | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase!.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data: membership, error: membershipError } = await supabase!
    .from("organization_users")
    .select("role, organizations(id, name, legal_name, email, phone, website, timezone)")
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();

  if (!membershipError && membership) {
    const organization = Array.isArray(membership.organizations)
      ? membership.organizations[0]
      : membership.organizations;

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
        role: membership.role as "owner" | "staff",
      };
    }
  }

  if (!userData.user.email) {
    return null;
  }

  const { data: fallbackOrganization } = await supabase!
    .from("organizations")
    .select("id, name, legal_name, email, phone, website, timezone")
    .eq("email", userData.user.email)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!fallbackOrganization) {
    return null;
  }

  return {
    userId: userData.user.id,
    id: fallbackOrganization.id,
    name: fallbackOrganization.name,
    legalName: fallbackOrganization.legal_name,
    email: fallbackOrganization.email,
    phone: fallbackOrganization.phone,
    website: fallbackOrganization.website,
    timezone: fallbackOrganization.timezone,
    role: "owner",
  };
}

function getDevelopmentOrganization(): OrganizationContext | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return {
    userId: DEVELOPMENT_USER_ID,
    id: DEVELOPMENT_ORGANIZATION_ID,
    name: "Development Kennel",
    legalName: "Development Kennel",
    email: process.env.NEXT_PUBLIC_DEV_OWNER_EMAIL?.trim() || "owner@mydogportal.local",
    phone: null,
    website: null,
    timezone: process.env.DEFAULT_ORGANIZATION_TIMEZONE || "America/New_York",
    role: "owner",
  };
}

export async function updateOrganizationAction(formData: FormData) {
  const organization = await requireAdminOrganization();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/settings");
  }

  await supabase
    .from("organizations")
    .update({
      name: String(formData.get("name") ?? ""),
      legal_name: String(formData.get("legalName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      website: String(formData.get("website") ?? ""),
      timezone: String(formData.get("timezone") ?? ""),
    })
    .eq("id", organization.id);

  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export async function getSubscription() {
  const organization = await requireAdminOrganization();
  return getSubscriptionForOrganization(organization.id);
}

export async function getSubscriptionForOrganization(organizationId: string): Promise<SubscriptionContext> {
  const fallback = {
    status: "trialing",
    planKey: "starter" as const,
    planName: "Starter",
  };

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!
    .from("subscriptions")
    .select("status, plans(name)")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!data) {
    const { data: organization } = await supabase!
      .from("organizations")
      .select("subscription_status")
      .eq("id", organizationId)
      .maybeSingle();

    return {
      status: organization?.subscription_status ?? fallback.status,
      planKey: fallback.planKey,
      planName: fallback.planName,
    };
  }

  const plan = Array.isArray(data?.plans) ? data?.plans[0] : data?.plans;
  const planKey = normalizePlanKey(plan?.name ?? "Starter");

  return {
    status: data?.status ?? "inactive",
    planKey,
    planName: displayPlanName(planKey),
  };
}

function sanitizeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}

function buildAuthRedirect(pathname: "/sign-in" | "/sign-up", error: string, nextPath: string | null) {
  const params = new URLSearchParams({ error });

  if (nextPath) {
    params.set("next", nextPath);
  }

  return `${pathname}?${params.toString()}`;
}

function buildOrganizationSlug(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const fallback = base.length > 0 ? base : "breeder";
  return `${fallback}-${Date.now().toString(36)}`;
}

async function getAppBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

async function getDefaultSignedInDestination() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (appUrl) {
    return `${appUrl.replace(/\/+$/, "")}/dashboard`;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (host === "mydogportal.site" || host === "www.mydogportal.site") {
    return `${protocol}://app.mydogportal.site/dashboard`;
  }

  return "/dashboard";
}
