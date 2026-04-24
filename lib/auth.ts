"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  email: string | null;
  phone: string | null;
  address: string | null;
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

  redirect(nextPath ?? "/admin");
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

  const { data, error } = await supabase.auth.signUp({ email, password });

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
      email,
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    redirect(buildAuthRedirect("/sign-up", "organization", nextPath));
  }

  await admin.from("organization_users").insert({
    organization_id: organization.id,
    user_id: data.user.id,
    role: "owner",
  });

  if (plan) {
    await admin.from("subscriptions").insert({
      organization_id: organization.id,
      plan_id: plan.id,
      status: "trialing",
    });
  }

  redirect(nextPath ?? "/admin");
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

  const { data: membership } = await supabase!
    .from("organization_users")
    .select("role, organizations(id, name, email, phone, address)")
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return null;
  }

  const organization = Array.isArray(membership.organizations)
    ? membership.organizations[0]
    : membership.organizations;

  if (!organization) {
    return null;
  }

  return {
    userId: userData.user.id,
    id: organization.id,
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    address: organization.address,
    role: membership.role as "owner" | "staff",
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
    email: process.env.NEXT_PUBLIC_DEV_OWNER_EMAIL?.trim() || "owner@mydogportal.local",
    phone: null,
    address: null,
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
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
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
