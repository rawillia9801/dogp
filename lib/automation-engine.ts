import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import type { Buyer, NoticeRule, NoticeTemplate, Puppy } from "@/types";

export type ScheduledNoticeCandidate = {
  dedupeKey: string;
  ruleId: string;
  ruleName: string;
  templateKey: string | null;
  noticeType: string;
  triggerType: string;
  buyerId: string | null;
  puppyId: string | null;
  relatedType: string;
  relatedId: string;
  scheduledAt: string;
  label: string;
  detail: string;
  metadata: Record<string, unknown>;
};

export type WorkflowEvaluation = {
  candidates: ScheduledNoticeCandidate[];
  activeRuleCount: number;
  healthScore: number;
  queuedCount: number;
  deliveredCount: number;
  failedCount: number;
};

export function evaluateWorkflowAutomation({
  automation,
  business,
  breeder,
  now = new Date(),
}: {
  automation: AutomationWorkspaceData;
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
  now?: Date;
}): WorkflowEvaluation {
  const candidates = evaluateAutomationCandidates({
    automation,
    business,
    breeder,
    now,
  });
  const activeRuleCount = automation.rules.filter((rule) => rule.enabled !== false && rule.isActive !== false).length;
  const deliveredCount = automation.logs.filter((log) => log.deliveryStatus === "sent").length;
  const failedCount = automation.logs.filter((log) => log.deliveryStatus === "failed").length;
  const queuedCount = automation.logs.filter((log) => log.deliveryStatus === "pending").length + candidates.length;
  const healthScore = Math.max(80, Math.min(99, 93 - failedCount * 4 + Math.min(deliveredCount, 6)));

  return {
    candidates: candidates.slice(0, 16),
    activeRuleCount,
    healthScore,
    queuedCount,
    deliveredCount,
    failedCount,
  };
}

export function evaluateAutomationCandidates({
  automation,
  business,
  breeder,
  now = new Date(),
}: {
  automation: AutomationWorkspaceData;
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
  now?: Date;
}) {
  const existingKeys = new Set(
    automation.logs.map((log) => log.dedupeKey).filter((key): key is string => Boolean(key)),
  );
  const templateMap = new Map(automation.templates.map((template) => [template.templateKey, template]));

  return automation.rules
    .filter((rule) => rule.enabled !== false && rule.isActive !== false)
    .flatMap((rule) => evaluateRule(rule, templateMap, business, breeder, existingKeys, now))
    .sort((left, right) => new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime());
}

export function emailDeliveryProvider(automation: AutomationWorkspaceData) {
  return {
    providerName: automation.settings?.providerName ?? "Resend",
    deliveryStatus: automation.settings?.noticesEnabled === false ? "paused" : "active",
    messageIdField: "provider_message_id",
    failureField: "failure_reason",
  };
}

export function renderNoticeTemplate(
  template: Pick<NoticeTemplate, "subject" | "body">,
  variables: Record<string, string | number | null | undefined>,
) {
  return {
    subject: replaceTemplateVariables(template.subject, variables),
    body: replaceTemplateVariables(template.body, variables),
  };
}

function evaluateRule(
  rule: NoticeRule,
  templateMap: Map<string, NoticeTemplate>,
  business: BusinessWorkspaceData,
  breeder: BreederWorkspaceData,
  existingKeys: Set<string>,
  now: Date,
) {
  switch (rule.triggerType) {
    case "payment_due":
      return business.paymentPlans.flatMap((plan) => {
        const buyer = buyerForId(business.buyers, plan.buyerId);
        const puppy = puppyForBuyer(breeder, plan.buyerId);
        const paid = business.payments
          .filter((payment) => payment.buyerId === plan.buyerId)
          .reduce((sum, payment) => sum + payment.amount, 0);
        const balance = Math.max(plan.totalPrice - paid, 0);

        if (!matchesConditions(rule.conditionJson ?? rule.filters, { balance, buyer, puppy })) {
          return [];
        }

        return candidate({
          existingKeys,
          rule,
          template: templateForRule(rule, templateMap),
          buyer,
          puppy,
          relatedType: "payment_plan",
          relatedId: plan.id,
          baseDate: plan.nextDueDate,
          label: "Payment Reminder",
          detail: buyer
            ? `${buyer.fullName} has ${currency(Math.max(plan.monthlyAmount, balance))} due ${shortDate(plan.nextDueDate)}`
            : "Payment reminder",
          metadata: {
            amount_due: Math.max(plan.monthlyAmount, balance),
            balance,
            due_date: plan.nextDueDate,
            payment_status: balance > 0 ? "due" : "paid",
          },
        });
      });
    case "payment_overdue":
      return business.paymentPlans.flatMap((plan) => {
        const buyer = buyerForId(business.buyers, plan.buyerId);
        const puppy = puppyForBuyer(breeder, plan.buyerId);
        const paid = business.payments
          .filter((payment) => payment.buyerId === plan.buyerId)
          .reduce((sum, payment) => sum + payment.amount, 0);
        const balance = Math.max(plan.totalPrice - paid, 0);

        if (!matchesConditions(rule.conditionJson ?? rule.filters, { balance, buyer, puppy })) {
          return [];
        }

        return candidate({
          existingKeys,
          rule,
          template: templateForRule(rule, templateMap),
          buyer,
          puppy,
          relatedType: "payment_plan",
          relatedId: plan.id,
          baseDate: plan.nextDueDate,
          label: "Overdue Notice",
          detail: buyer
            ? `${buyer.fullName} has an overdue balance of ${currency(balance)}`
            : "Overdue payment notice",
          metadata: {
            amount_due: Math.max(plan.monthlyAmount, balance),
            balance,
            due_date: plan.nextDueDate,
            payment_status: balance > 0 ? "overdue" : "paid",
          },
        }).filter((item) => new Date(item.scheduledAt).getTime() <= now.getTime());
      });
    case "application_submitted":
      return business.applications.flatMap((application) => {
        const buyer = buyerForId(business.buyers, application.buyerId);

        if (!matchesConditions(rule.conditionJson ?? rule.filters, { buyer })) {
          return [];
        }

        return candidate({
          existingKeys,
          rule,
          template: templateForRule(rule, templateMap),
          buyer,
          puppy: null,
          relatedType: "application",
          relatedId: application.id,
          baseDate: application.createdAt,
          label: "Application Follow-up",
          detail: buyer ? `${buyer.fullName} application is ready for follow-up` : "Application follow-up",
          metadata: {
            application_status: application.status,
            due_date: application.createdAt.slice(0, 10),
          },
        });
      });
    case "puppy_reserved":
      return breeder.puppies
        .filter((puppy) => puppy.status === "reserved" && Boolean(puppy.buyerId))
        .flatMap((puppy) => {
          const buyer = buyerForId(business.buyers, puppy.buyerId);

          if (!matchesConditions(rule.conditionJson ?? rule.filters, { buyer, puppy })) {
            return [];
          }

          return candidate({
            existingKeys,
            rule,
            template: templateForRule(rule, templateMap),
            buyer,
            puppy,
            relatedType: "puppy",
            relatedId: puppy.id,
            baseDate: puppy.updatedAt,
            label: "Puppy Reserved",
            detail: `${puppy.callName ?? puppy.puppyName ?? "Puppy"} has a recorded reservation`,
            metadata: {
              puppy_status: puppy.status,
              reserved_at: puppy.updatedAt,
            },
          });
        });
    case "delivery_upcoming":
      return business.transportation.flatMap((request) => {
        const buyer = buyerForId(business.buyers, request.buyerId);
        const puppy = breeder.puppies.find((item) => item.id === request.puppyId) ?? null;

        if (!matchesConditions(rule.conditionJson ?? rule.filters, { buyer, puppy, location: request.location })) {
          return [];
        }

        return candidate({
          existingKeys,
          rule,
          template: templateForRule(rule, templateMap),
          buyer,
          puppy,
          relatedType: "transportation",
          relatedId: request.id,
          baseDate: request.date,
          label: "Pickup Reminder",
          detail: `${request.type} scheduled for ${request.location ?? "delivery coordination"}`,
          metadata: {
            delivery_date: request.date,
            delivery_location: request.location,
            transport_type: request.type,
          },
        });
      });
    default:
      return [];
  }
}

function candidate({
  existingKeys,
  rule,
  template,
  buyer,
  puppy,
  relatedType,
  relatedId,
  baseDate,
  label,
  detail,
  metadata,
}: {
  existingKeys: Set<string>;
  rule: NoticeRule;
  template: NoticeTemplate | null;
  buyer: Buyer | null;
  puppy: Puppy | null;
  relatedType: string;
  relatedId: string;
  baseDate: string | null;
  label: string;
  detail: string;
  metadata: Record<string, unknown>;
}) {
  if (!baseDate) {
    return [];
  }

  const scheduledAt = applyDelay(baseDate, rule.delayMinutes ?? rule.timingOffset ?? 0);
  const dedupeKey = `${rule.id}:${relatedType}:${relatedId}:${scheduledAt.slice(0, 16)}`;

  if (existingKeys.has(dedupeKey)) {
    return [];
  }

  return [
    {
      dedupeKey,
      ruleId: rule.id,
      ruleName: rule.name,
      templateKey: rule.templateKey ?? rule.templateId ?? template?.templateKey ?? null,
      noticeType: template?.noticeType ?? rule.triggerType,
      triggerType: rule.triggerType,
      buyerId: buyer?.id ?? null,
      puppyId: puppy?.id ?? null,
      relatedType,
      relatedId,
      scheduledAt,
      label,
      detail,
      metadata: {
        ...metadata,
        buyer_name: buyer?.fullName ?? "",
        puppy_name: puppy?.callName ?? puppy?.puppyName ?? "",
        buyer_email: buyer?.email ?? "",
        template_key: rule.templateKey ?? rule.templateId ?? template?.templateKey ?? null,
      },
    },
  ];
}

function matchesConditions(
  conditions: Record<string, unknown> | undefined,
  subject: {
    balance?: number;
    buyer?: Buyer | null;
    puppy?: Puppy | null;
    location?: string | null;
  },
) {
  if (!conditions) {
    return true;
  }

  if (conditions.requires_balance === true && (subject.balance ?? 0) <= 0) {
    return false;
  }

  if (conditions.buyer_required === true && !subject.buyer) {
    return false;
  }

  if (conditions.buyer_email_required === true && !subject.buyer?.email) {
    return false;
  }

  if (conditions.location_required === true && !subject.location) {
    return false;
  }

  if (Array.isArray(conditions.puppy_statuses) && subject.puppy) {
    return conditions.puppy_statuses.includes(subject.puppy.status);
  }

  return true;
}

function templateForRule(rule: NoticeRule, templateMap: Map<string, NoticeTemplate>) {
  const key = rule.templateKey ?? rule.templateId;
  return key ? templateMap.get(key) ?? null : null;
}

function buyerForId(buyers: Buyer[], buyerId: string | null | undefined) {
  return buyerId ? buyers.find((buyer) => buyer.id === buyerId) ?? null : null;
}

function puppyForBuyer(breeder: BreederWorkspaceData, buyerId: string | null | undefined) {
  return breeder.puppies.find((puppy) => puppy.buyerId === buyerId) ?? null;
}

function applyDelay(value: string, delayMinutes: number) {
  const date = new Date(value.includes("T") ? value : `${value}T09:00:00`);
  date.setMinutes(date.getMinutes() + delayMinutes);
  return date.toISOString();
}

function replaceTemplateVariables(template: string, variables: Record<string, string | number | null | undefined>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key];
    return value === null || value === undefined || value === "" ? "" : String(value);
  });
}

function shortDate(value: string | null) {
  if (!value) {
    return "schedule date";
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(value.includes("T") ? value : `${value}T00:00:00`),
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
