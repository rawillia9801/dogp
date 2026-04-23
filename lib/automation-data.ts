import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  AutomationSettings,
  NoticeLog,
  NoticeRule,
  NoticeTemplate,
  WorkflowEvent,
  WorkflowRun,
} from "@/types";

type EmailTemplateRow = {
  id: string;
  organization_id: string | null;
  template_key: string;
  category: string | null;
  notice_type: string | null;
  subject: string;
  body: string;
  variables_json: string[] | Record<string, unknown> | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

type AutomationRuleRow = {
  id: string;
  organization_id: string;
  name: string;
  trigger_type: string;
  condition_json: Record<string, unknown> | null;
  action_type: string;
  delay_minutes: number;
  is_active: boolean;
  template_key: string | null;
  retry_limit: number | null;
  created_at: string;
  updated_at: string;
};

type AutomationRunRow = {
  id: string;
  organization_id: string;
  rule_id: string | null;
  buyer_id: string | null;
  puppy_id: string | null;
  template_key: string | null;
  notice_type: string | null;
  related_type: string | null;
  related_id: string | null;
  triggered_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: string;
  retry_count: number | null;
  provider: string | null;
  provider_message_id: string | null;
  dedupe_key: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type WorkflowRunRow = {
  id: string;
  organization_id: string;
  run_key: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  summary: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type WorkflowEventRow = {
  id: string;
  organization_id: string;
  run_id: string | null;
  event_key: string;
  event_type: string;
  related_type: string | null;
  related_id: string | null;
  status: string;
  payload: Record<string, unknown> | null;
  created_at: string;
};

type AutomationSettingsRow = {
  id: string;
  organization_id: string;
  notices_enabled: boolean;
  payment_notices_enabled: boolean;
  document_notices_enabled: boolean;
  transportation_notices_enabled: boolean;
  puppy_milestone_notices_enabled: boolean;
  provider_name: string;
  from_email: string | null;
  reply_to_email: string | null;
  quiet_hours: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type AutomationWorkspaceData = {
  templates: NoticeTemplate[];
  rules: NoticeRule[];
  logs: NoticeLog[];
  workflowRuns: WorkflowRun[];
  workflowEvents: WorkflowEvent[];
  settings: AutomationSettings | null;
};

export const noticeVariables = [
  "buyer_name",
  "puppy_name",
  "due_date",
  "delivery_date",
  "balance",
  "amount_due",
  "breeder_name",
];

const defaultTemplates: NoticeTemplate[] = [
  template(
    "payment_reminder",
    "Payment Reminder",
    "Payment Reminder",
    "Payment due for {{puppy_name}}",
    "Your payment for {{puppy_name}} is due on {{due_date}}.",
  ),
  template(
    "payment_overdue_notice",
    "Overdue Notice",
    "Overdue Notice",
    "Payment past due for {{puppy_name}}",
    "Your payment for {{puppy_name}} is past due.",
  ),
  template(
    "application_follow_up",
    "Application Follow-up",
    "Application Follow-up",
    "Application update for {{buyer_name}}",
    "We received your application and will follow up with next steps shortly.",
  ),
  template(
    "pickup_reminder",
    "Pickup Reminder",
    "Pickup Reminder",
    "Pickup scheduled for {{puppy_name}}",
    "Your puppy {{puppy_name}} is scheduled for pickup on {{delivery_date}}.",
  ),
];

const defaultRules: NoticeRule[] = [
  rule("payment-due", "Payment Reminder", "payment_due", -4320, "payment_reminder", {
    requires_balance: true,
  }),
  rule("payment-overdue", "Payment Overdue Notice", "payment_overdue", 2880, "payment_overdue_notice", {
    requires_balance: true,
  }),
  rule("application-follow-up", "Application Follow-up", "application_submitted", 0, "application_follow_up", {}),
  rule("puppy-reserved", "Puppy Reserved Notice", "puppy_reserved", 0, "application_follow_up", {
    buyer_required: true,
  }),
  rule("delivery-upcoming", "Pickup Reminder", "delivery_upcoming", -1440, "pickup_reminder", {
    buyer_required: true,
  }),
];

const emptyAutomationData: AutomationWorkspaceData = {
  templates: defaultTemplates,
  rules: defaultRules,
  logs: [],
  workflowRuns: [],
  workflowEvents: [],
  settings: null,
};

export async function getAutomationWorkspaceData(
  organizationId: string,
): Promise<AutomationWorkspaceData> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return emptyAutomationData;
  }

  const [
    templatesResult,
    rulesResult,
    runsResult,
    workflowRunsResult,
    workflowEventsResult,
    settingsResult,
  ] = await Promise.all([
    supabase
      .from("email_templates")
      .select("*")
      .or(`organization_id.eq.${organizationId},organization_id.is.null`)
      .order("created_at", { ascending: true })
      .returns<EmailTemplateRow[]>(),
    supabase
      .from("automation_rules")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true })
      .returns<AutomationRuleRow[]>(),
    supabase
      .from("automation_runs")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(120)
      .returns<AutomationRunRow[]>(),
    supabase
      .from("workflow_runs")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(12)
      .returns<WorkflowRunRow[]>(),
    supabase
      .from("workflow_events")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(40)
      .returns<WorkflowEventRow[]>(),
    supabase
      .from("automation_settings")
      .select("*")
      .eq("organization_id", organizationId)
      .limit(1)
      .returns<AutomationSettingsRow[]>(),
  ]);

  const templates = (templatesResult.data ?? []).map(mapTemplate);
  const rules = (rulesResult.data ?? []).map(mapRule);
  const logs = (runsResult.data ?? []).map(mapRunAsLog);

  return {
    templates: templates.length > 0 ? templates : defaultTemplates,
    rules: rules.length > 0 ? rules : defaultRules,
    logs,
    workflowRuns: (workflowRunsResult.data ?? []).map(mapWorkflowRun),
    workflowEvents: (workflowEventsResult.data ?? []).map(mapWorkflowEvent),
    settings: settingsResult.data?.[0] ? mapSettings(settingsResult.data[0]) : null,
  };
}

function template(
  templateKey: string,
  category: string,
  noticeType: string,
  subject: string,
  body: string,
): NoticeTemplate {
  const now = new Date().toISOString();

  return {
    id: templateKey,
    organizationId: null,
    templateKey,
    category,
    noticeType,
    subject,
    body,
    status: "enabled",
    isActive: true,
    timingRule: "Rule based",
    recipientRules: { buyer: true },
    variables: noticeVariables,
    createdAt: now,
    updatedAt: now,
  };
}

function rule(
  ruleKey: string,
  name: string,
  triggerType: string,
  delayMinutes: number,
  templateKey: string,
  conditionJson: Record<string, unknown>,
): NoticeRule {
  const now = new Date().toISOString();

  return {
    id: ruleKey,
    organizationId: "system",
    ruleKey,
    name,
    enabled: true,
    isActive: true,
    triggerType,
    conditionJson,
    timingOffset: delayMinutes,
    timingUnit: "minutes",
    delayMinutes,
    templateId: templateKey,
    templateKey,
    actionType: "send_email",
    retryLimit: 2,
    recipientBehavior: "buyer",
    filters: conditionJson,
    createdAt: now,
    updatedAt: now,
  };
}

function mapTemplate(row: EmailTemplateRow): NoticeTemplate {
  return {
    id: row.id,
    organizationId: row.organization_id,
    templateKey: row.template_key,
    category: row.category ?? humanizeTemplateKey(row.template_key),
    noticeType: row.notice_type ?? row.template_key,
    subject: row.subject,
    body: row.body,
    status: row.is_active === false ? "disabled" : "enabled",
    isActive: row.is_active ?? true,
    timingRule: "Rule based",
    recipientRules: { buyer: true },
    variables: extractVariables(row.variables_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRule(row: AutomationRuleRow): NoticeRule {
  return {
    id: row.id,
    organizationId: row.organization_id,
    ruleKey: row.id,
    name: row.name,
    enabled: row.is_active,
    isActive: row.is_active,
    triggerType: row.trigger_type,
    conditionJson: row.condition_json ?? {},
    timingOffset: row.delay_minutes,
    timingUnit: "minutes",
    delayMinutes: row.delay_minutes,
    templateId: row.template_key,
    templateKey: row.template_key,
    actionType: row.action_type,
    retryLimit: row.retry_limit ?? 2,
    recipientBehavior: "buyer",
    filters: row.condition_json ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRunAsLog(row: AutomationRunRow): NoticeLog {
  const metadata = row.metadata_json ?? {};

  return {
    id: row.id,
    organizationId: row.organization_id,
    noticeType: row.notice_type ?? String(metadata.notice_type ?? metadata.trigger_type ?? "automation_notice"),
    templateId: row.template_key,
    templateKey: row.template_key,
    ruleId: row.rule_id,
    buyerId: row.buyer_id,
    puppyId: row.puppy_id,
    relatedType: row.related_type,
    relatedId: row.related_id,
    scheduledAt: row.scheduled_at,
    sentAt: row.sent_at,
    deliveryStatus: row.status,
    failureReason: typeof metadata.failure_reason === "string" ? metadata.failure_reason : null,
    provider: row.provider,
    providerMessageId: row.provider_message_id,
    dedupeKey: row.dedupe_key,
    retryCount: row.retry_count ?? 0,
    metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWorkflowRun(row: WorkflowRunRow): WorkflowRun {
  return {
    id: row.id,
    organizationId: row.organization_id,
    runKey: row.run_key,
    status: row.status,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    summary: row.summary ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWorkflowEvent(row: WorkflowEventRow): WorkflowEvent {
  return {
    id: row.id,
    organizationId: row.organization_id,
    runId: row.run_id,
    eventKey: row.event_key,
    eventType: row.event_type,
    relatedType: row.related_type,
    relatedId: row.related_id,
    status: row.status,
    payload: row.payload ?? {},
    createdAt: row.created_at,
  };
}

function mapSettings(row: AutomationSettingsRow): AutomationSettings {
  return {
    id: row.id,
    organizationId: row.organization_id,
    noticesEnabled: row.notices_enabled,
    paymentNoticesEnabled: row.payment_notices_enabled,
    documentNoticesEnabled: row.document_notices_enabled,
    transportationNoticesEnabled: row.transportation_notices_enabled,
    puppyMilestoneNoticesEnabled: row.puppy_milestone_notices_enabled,
    providerName: row.provider_name,
    fromEmail: row.from_email,
    replyToEmail: row.reply_to_email,
    quietHours: row.quiet_hours ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function extractVariables(value: EmailTemplateRow["variables_json"]) {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  return noticeVariables;
}

function humanizeTemplateKey(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
