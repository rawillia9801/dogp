import { revalidatePath } from "next/cache";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import {
  evaluateAutomationCandidates,
  renderNoticeTemplate,
  type ScheduledNoticeCandidate,
} from "@/lib/automation-engine";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { NoticeRule, NoticeTemplate } from "@/types";

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

type EngineSummary = {
  queued: number;
  sent: number;
  failed: number;
  runs: string[];
};

type RuleUpdateInput = {
  id: string;
  name: string;
  triggerType: string;
  conditionJson: Record<string, unknown>;
  delayMinutes: number;
  isActive: boolean;
  templateKey: string | null;
};

type TemplateUpdateInput = {
  id: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
};

export async function runAutomationEngine(organizationId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const [automation, business, breeder] = await Promise.all([
    getAutomationWorkspaceData(organizationId),
    getBusinessWorkspaceData(organizationId),
    getBreederWorkspaceData(organizationId),
  ]);
  const candidates = evaluateAutomationCandidates({ automation, business, breeder });
  const queuedRunIds = await queueCandidates(admin, organizationId, automation.rules, candidates);
  const pendingRuns = await loadPendingRuns(admin, organizationId);
  const sendResult = await dispatchRuns(admin, organizationId, automation.templates, business, breeder, pendingRuns);

  refreshAutomationViews();

  return {
    queued: queuedRunIds.length,
    sent: sendResult.sent,
    failed: sendResult.failed,
    runs: [...queuedRunIds, ...sendResult.runs],
  };
}

export async function updateAutomationRule(organizationId: string, input: RuleUpdateInput) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const payload = {
    name: input.name,
    trigger_type: input.triggerType,
    condition_json: input.conditionJson,
    action_type: "send_email",
    delay_minutes: input.delayMinutes,
    is_active: input.isActive,
    template_key: input.templateKey,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("automation_rules")
    .update(payload)
    .eq("organization_id", organizationId)
    .eq("id", input.id);

  if (error) {
    throw new Error(error.message);
  }

  refreshAutomationViews();
}

export async function updateEmailTemplate(organizationId: string, input: TemplateUpdateInput) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { error } = await admin
    .from("email_templates")
    .update({
      subject: input.subject,
      body: input.body,
      variables_json: input.variables,
      is_active: input.isActive,
      updated_at: new Date().toISOString(),
    })
    .or(`organization_id.eq.${organizationId},organization_id.is.null`)
    .eq("id", input.id);

  if (error) {
    throw new Error(error.message);
  }

  refreshAutomationViews();
}

export async function sendTestEmail(organizationId: string, templateKey: string, buyerId?: string | null) {
  return sendTemplateEmail({
    organizationId,
    templateKey,
    buyerId,
    test: true,
  });
}

export async function sendNoticeFromTemplate(organizationId: string, templateKey: string, buyerId?: string | null) {
  return sendTemplateEmail({
    organizationId,
    templateKey,
    buyerId,
    test: false,
  });
}

async function sendTemplateEmail({
  organizationId,
  templateKey,
  buyerId,
  test,
}: {
  organizationId: string;
  templateKey: string;
  buyerId?: string | null;
  test: boolean;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const [automation, business, breeder] = await Promise.all([
    getAutomationWorkspaceData(organizationId),
    getBusinessWorkspaceData(organizationId),
    getBreederWorkspaceData(organizationId),
  ]);
  const template = automation.templates.find((item) => item.templateKey === templateKey) ?? null;
  const buyer = (buyerId ? business.buyers.find((item) => item.id === buyerId) : null) ?? business.buyers[0] ?? null;
  const puppy = buyer ? breeder.puppies.find((item) => item.buyerId === buyer.id) ?? breeder.puppies[0] ?? null : breeder.puppies[0] ?? null;

  if (!template) {
    throw new Error("Template not found.");
  }

  if (!buyer?.email) {
    throw new Error("A buyer email address is required for test delivery.");
  }

  const paymentPlan = business.paymentPlans.find((item) => item.buyerId === buyer.id) ?? null;
  const paymentTotal = business.payments
    .filter((item) => item.buyerId === buyer.id)
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = paymentPlan ? Math.max(paymentPlan.totalPrice - paymentTotal, 0) : 0;
  const rendered = renderNoticeTemplate(template, {
    buyer_name: buyer.fullName,
    puppy_name: puppy?.callName ?? puppy?.puppyName ?? "your puppy",
    due_date: paymentPlan?.nextDueDate ?? "",
    delivery_date: business.transportation.find((item) => item.buyerId === buyer.id)?.date ?? "",
    balance,
    amount_due: paymentPlan?.monthlyAmount ?? balance,
    breeder_name: "MyDogPortal.site",
  });
  const sendResult = await sendEmail({
    to: buyer.email,
    subject: test ? `[Test] ${rendered.subject}` : rendered.subject,
    body: rendered.body,
    fromEmail: automation.settings?.fromEmail ?? process.env.RESEND_FROM_EMAIL ?? "notices@mydogportal.site",
    replyTo: automation.settings?.replyToEmail ?? undefined,
  });

  const { error } = await admin.from("email_logs").insert({
    organization_id: organizationId,
    buyer_id: buyer.id,
    template_key: template.templateKey,
    sent_at: new Date().toISOString(),
      status: sendResult.status,
      provider: sendResult.provider,
      metadata_json: {
        subject: rendered.subject,
        test,
        provider_message_id: sendResult.providerMessageId,
      },
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!test && template.noticeType.startsWith("payment_")) {
    await admin.from("buyer_payment_notice_logs").insert({
      organization_id: organizationId,
      buyer_id: buyer.id,
      notice_type: template.noticeType,
      sent_at: new Date().toISOString(),
      status: "sent",
      metadata_json: {
        template_key: template.templateKey,
        provider: sendResult.provider,
        provider_message_id: sendResult.providerMessageId,
        source: "chichi",
      },
    });
  }

  refreshAutomationViews();

  return sendResult;
}

async function queueCandidates(
  admin: AdminClient,
  organizationId: string,
  rules: NoticeRule[],
  candidates: ScheduledNoticeCandidate[],
) {
  const queuedIds: string[] = [];

  for (const candidate of candidates) {
    const rule = rules.find((item) => item.id === candidate.ruleId) ?? null;
    const maxRetries = rule?.retryLimit ?? 2;
    const payload = {
      organization_id: organizationId,
      rule_id: isUuid(candidate.ruleId) ? candidate.ruleId : null,
      buyer_id: candidate.buyerId,
      puppy_id: candidate.puppyId,
      template_key: candidate.templateKey,
      notice_type: candidate.noticeType,
      related_type: candidate.relatedType,
      related_id: candidate.relatedId,
      triggered_at: new Date().toISOString(),
      scheduled_at: candidate.scheduledAt,
      status: "pending",
      retry_count: 0,
      max_retries: maxRetries,
      provider: null,
      provider_message_id: null,
      dedupe_key: candidate.dedupeKey,
      metadata_json: {
        ...candidate.metadata,
        label: candidate.label,
        detail: candidate.detail,
        trigger_type: candidate.triggerType,
      },
    };

    const { data, error } = await admin
      .from("automation_runs")
      .upsert(payload, {
        onConflict: "organization_id,dedupe_key",
        ignoreDuplicates: true,
      })
      .select("id");

    if (error) {
      throw new Error(error.message);
    }

    if (data?.[0]?.id) {
      queuedIds.push(data[0].id);
      await admin.from("workflow_events").upsert(
        {
          organization_id: organizationId,
          event_key: candidate.dedupeKey,
          event_type: candidate.triggerType,
          related_type: candidate.relatedType,
          related_id: candidate.relatedId,
          status: "queued",
          payload: {
            buyer_id: candidate.buyerId,
            puppy_id: candidate.puppyId,
            template_key: candidate.templateKey,
            scheduled_at: candidate.scheduledAt,
          },
        },
        { onConflict: "organization_id,event_key", ignoreDuplicates: true },
      );
    }
  }

  return queuedIds;
}

async function loadPendingRuns(admin: AdminClient, organizationId: string) {
  const { data, error } = await admin
    .from("automation_runs")
    .select("*")
    .eq("organization_id", organizationId)
    .in("status", ["pending", "failed"])
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function dispatchRuns(
  admin: AdminClient,
  organizationId: string,
  templates: NoticeTemplate[],
  business: Awaited<ReturnType<typeof getBusinessWorkspaceData>>,
  breeder: Awaited<ReturnType<typeof getBreederWorkspaceData>>,
  runs: Array<Record<string, unknown>>,
): Promise<EngineSummary> {
  const templateMap = new Map(templates.map((template) => [template.templateKey, template]));
  let sent = 0;
  let failed = 0;
  const runIds: string[] = [];

  for (const run of runs) {
    const scheduledAt = typeof run.scheduled_at === "string" ? new Date(run.scheduled_at) : null;
    const retryCount = typeof run.retry_count === "number" ? run.retry_count : 0;
    const maxRetries = typeof run.max_retries === "number" ? run.max_retries : 2;

    if (scheduledAt && scheduledAt.getTime() > Date.now()) {
      continue;
    }

    if (retryCount > maxRetries) {
      continue;
    }

    const buyer = business.buyers.find((item) => item.id === run.buyer_id) ?? null;
    const puppy = breeder.puppies.find((item) => item.id === run.puppy_id) ?? null;
    const template = templateMap.get(String(run.template_key ?? "")) ?? null;
    const metadata = (run.metadata_json as Record<string, unknown> | null) ?? {};

    if (!template || !buyer?.email) {
      await markRunFailed(admin, run.id as string, retryCount, metadata, "Missing template or buyer email");
      failed += 1;
      runIds.push(run.id as string);
      continue;
    }

    const paymentPlan = business.paymentPlans.find((item) => item.buyerId === buyer.id) ?? null;
    const paymentTotal = business.payments
      .filter((item) => item.buyerId === buyer.id)
      .reduce((sum, item) => sum + item.amount, 0);
    const balance = paymentPlan ? Math.max(paymentPlan.totalPrice - paymentTotal, 0) : 0;
    const rendered = renderNoticeTemplate(template, {
      buyer_name: buyer.fullName,
      puppy_name: puppy?.callName ?? puppy?.puppyName ?? "your puppy",
      due_date: stringValue(metadata.due_date) ?? paymentPlan?.nextDueDate ?? "",
      delivery_date: stringValue(metadata.delivery_date) ?? "",
      balance,
      amount_due: numberValue(metadata.amount_due) ?? paymentPlan?.monthlyAmount ?? balance,
      breeder_name: "MyDogPortal.site",
    });

    try {
      const sendResult = await sendEmail({
        to: buyer.email,
        subject: rendered.subject,
        body: rendered.body,
        fromEmail: process.env.RESEND_FROM_EMAIL ?? "notices@mydogportal.site",
      });
      await admin.from("email_logs").insert({
        organization_id: organizationId,
        automation_run_id: run.id,
        buyer_id: buyer.id,
        template_key: template.templateKey,
        sent_at: new Date().toISOString(),
        status: sendResult.status,
        provider: sendResult.provider,
        metadata_json: {
          ...metadata,
          subject: rendered.subject,
          provider_message_id: sendResult.providerMessageId,
        },
      });
      await admin
        .from("automation_runs")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider: sendResult.provider,
          provider_message_id: sendResult.providerMessageId,
          metadata_json: {
            ...metadata,
            rendered_subject: rendered.subject,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", run.id);

      if (String(run.notice_type ?? "").startsWith("payment_")) {
        await admin.from("buyer_payment_notice_logs").insert({
          organization_id: organizationId,
          buyer_id: buyer.id,
          notice_type: run.notice_type,
          sent_at: new Date().toISOString(),
          status: "sent",
          metadata_json: {
            automation_run_id: run.id,
            template_key: template.templateKey,
            provider: sendResult.provider,
          },
        });
      }

      sent += 1;
      runIds.push(run.id as string);
    } catch (error) {
      await markRunFailed(
        admin,
        run.id as string,
        retryCount,
        metadata,
        error instanceof Error ? error.message : "Notice delivery failed",
      );
      failed += 1;
      runIds.push(run.id as string);
    }
  }

  return {
    queued: 0,
    sent,
    failed,
    runs: runIds,
  };
}

async function markRunFailed(
  admin: AdminClient,
  runId: string,
  retryCount: number,
  metadata: Record<string, unknown>,
  reason: string,
) {
  await admin
    .from("automation_runs")
    .update({
      status: "failed",
      retry_count: retryCount + 1,
      last_error: reason,
      updated_at: new Date().toISOString(),
      metadata_json: {
        ...metadata,
        failure_reason: reason,
      },
    })
    .eq("id", runId);
}

async function sendEmail({
  to,
  subject,
  body,
  fromEmail,
  replyTo,
}: {
  to: string;
  subject: string;
  body: string;
  fromEmail: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      text: body,
      reply_to: replyTo,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Email delivery failed.");
  }

  return {
    status: "sent",
    provider: "Resend",
    providerMessageId: payload.id ?? null,
  };
}

function refreshAutomationViews() {
  revalidatePath("/admin/automation");
  revalidatePath("/admin/buyers");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/documents");
  revalidatePath("/admin/transportation");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : null;
}

function isUuid(value: string | null | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}
