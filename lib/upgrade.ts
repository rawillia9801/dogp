import type { PlanKey } from "@/lib/plans";

export type FeatureKey =
  | "dashboard"
  | "dogs"
  | "breeding_program"
  | "litters"
  | "puppies"
  | "buyers"
  | "applications"
  | "payments"
  | "documents"
  | "transportation"
  | "automation"
  | "ai_documents"
  | "website_builder"
  | "chichi_advanced"
  | "settings"
  | "billing";

export type UsageKey =
  | "dogs"
  | "litters"
  | "users"
  | "puppies"
  | "buyers"
  | "automation_runs";

export type UpgradeEventTrigger =
  | "feature_lock_click"
  | "modal_open"
  | "upgrade_cta_click"
  | "dismissed_prompt";

export type SubscriptionContext = {
  status: string;
  planKey: PlanKey;
  planName: string;
};

export type UsageSummary = {
  dogs: number;
  litters: number;
  users: number;
  puppies: number;
  buyers: number;
  automationRuns: number;
};

export type UsagePrompt = {
  title: string;
  body: string;
  featureKey: FeatureKey;
  suggestedPlan: PlanKey;
  currentValue: number;
  limitValue: number;
};

export type UpgradeCopy = {
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  suggestedPlan: PlanKey;
};

const PLAN_ORDER: Record<PlanKey, number> = {
  starter: 0,
  pro: 1,
  elite: 2,
};

const FEATURE_REQUIREMENTS: Record<FeatureKey, PlanKey> = {
  dashboard: "starter",
  dogs: "starter",
  breeding_program: "starter",
  litters: "starter",
  puppies: "starter",
  buyers: "pro",
  applications: "pro",
  payments: "pro",
  documents: "pro",
  transportation: "pro",
  automation: "pro",
  ai_documents: "elite",
  website_builder: "elite",
  chichi_advanced: "elite",
  settings: "starter",
  billing: "starter",
};

const PLAN_LIMITS: Record<PlanKey, Record<UsageKey, number | "Unlimited">> = {
  starter: {
    dogs: 20,
    litters: 3,
    users: 1,
    puppies: 24,
    buyers: 0,
    automation_runs: 0,
  },
  pro: {
    dogs: 75,
    litters: 12,
    users: 4,
    puppies: 60,
    buyers: 75,
    automation_runs: 250,
  },
  elite: {
    dogs: "Unlimited",
    litters: "Unlimited",
    users: "Unlimited",
    puppies: "Unlimited",
    buyers: "Unlimited",
    automation_runs: "Unlimited",
  },
};

export function normalizePlanKey(planName: string | null | undefined): PlanKey {
  const normalized = (planName ?? "starter").trim().toLowerCase();

  if (normalized === "starter") {
    return "starter";
  }

  if (normalized === "pro" || normalized === "professional") {
    return "pro";
  }

  if (normalized === "elite" || normalized === "premium") {
    return "elite";
  }

  return "starter";
}

export function displayPlanName(planKey: PlanKey) {
  if (planKey === "pro") {
    return "Professional";
  }

  if (planKey === "elite") {
    return "Premium";
  }

  return "Starter";
}

export function hasFeatureAccess(planKey: PlanKey, featureKey: FeatureKey) {
  return PLAN_ORDER[planKey] >= PLAN_ORDER[FEATURE_REQUIREMENTS[featureKey]];
}

export function suggestedPlanForFeature(featureKey: FeatureKey) {
  return FEATURE_REQUIREMENTS[featureKey];
}

export function getUpgradeCopy(featureKey: FeatureKey): UpgradeCopy {
  switch (featureKey) {
    case "payments":
      return {
        title: "Track payments without spreadsheets",
        body: "Keep deposits, balances, and buyer payment records organized in one place.",
        primaryLabel: "Upgrade to Professional",
        secondaryLabel: "View Plans",
        suggestedPlan: "pro",
      };
    case "documents":
      return {
        title: "Unlock document management",
        body: "Track contracts, signed records, and buyer documents in one place.",
        primaryLabel: "Upgrade to Professional",
        secondaryLabel: "View Plans",
        suggestedPlan: "pro",
      };
    case "automation":
      return {
        title: "Unlock automation",
        body: "Send reminders, notices, and updates automatically with built-in workflows.",
        primaryLabel: "Upgrade to Professional",
        secondaryLabel: "View Plans",
        suggestedPlan: "pro",
      };
    case "ai_documents":
    case "website_builder":
    case "chichi_advanced":
      return {
        title: "Unlock AI tools",
        body: "Generate breeder documents, build your website, and use AI-assisted workflows with Premium.",
        primaryLabel: "Upgrade to Premium",
        secondaryLabel: "View Plans",
        suggestedPlan: "elite",
      };
    default:
      return {
        title: "Upgrade to unlock this workspace",
        body: "This feature is available in the Professional plan. Manage buyers, payments, records, and day-to-day business operations in one place.",
        primaryLabel: "Upgrade to Professional",
        secondaryLabel: "View Plans",
        suggestedPlan: "pro",
      };
  }
}

export function getUsageLimit(planKey: PlanKey, usageKey: UsageKey) {
  return PLAN_LIMITS[planKey][usageKey];
}

export function getUsageUpgradePrompt(planKey: PlanKey, usage: UsageSummary): UsagePrompt | null {
  if (planKey === "elite") {
    return null;
  }

  const checks: Array<{
    usageKey: UsageKey;
    featureKey: FeatureKey;
    currentValue: number;
  }> = [
    { usageKey: "dogs", featureKey: "dogs", currentValue: usage.dogs },
    { usageKey: "puppies", featureKey: "puppies", currentValue: usage.puppies },
    { usageKey: "buyers", featureKey: "buyers", currentValue: usage.buyers },
    { usageKey: "automation_runs", featureKey: "automation", currentValue: usage.automationRuns },
  ];

  for (const check of checks) {
    const limitValue = getUsageLimit(planKey, check.usageKey);
    if (typeof limitValue !== "number" || limitValue <= 0) {
      continue;
    }

    if (check.currentValue >= Math.ceil(limitValue * 0.8)) {
      return {
        title: "Your program is growing.",
        body: "Upgrade for more capacity and business tools.",
        featureKey: check.featureKey,
        suggestedPlan: nextPlan(planKey),
        currentValue: check.currentValue,
        limitValue,
      };
    }
  }

  return null;
}

export function getBillingHref(planKey: PlanKey, featureKey?: FeatureKey, sourceArea?: string) {
  const params = new URLSearchParams({
    upgrade: planKey,
  });

  if (featureKey) {
    params.set("feature", featureKey);
  }

  if (sourceArea) {
    params.set("source", sourceArea);
  }

  return `/admin/billing?${params.toString()}`;
}

function nextPlan(planKey: PlanKey): PlanKey {
  if (planKey === "starter") {
    return "pro";
  }

  return "elite";
}
