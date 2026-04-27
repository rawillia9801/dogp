import { revalidatePath } from "next/cache";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { evaluateAutomationCandidates, renderNoticeTemplate, type ScheduledNoticeCandidate } from "@/lib/automation-engine";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { NoticeRule, NoticeTemplate } from "@/types";

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

export async function runAutomationEngine(organizationId: string) {
  const admin = createSupabaseAdminClient(); if (!admin) throw new Error("Supabase admin client is not configured.");
  const [automation, business, breeder] = await Promise.all([getAutomationWorkspaceData(organizationId), getBusinessWorkspaceData(organizationId), getBreederWorkspaceData(organizationId)]);
  const candidates = evaluateAutomationCandidates({ automation, business, breeder });
  const queued = await queueCandidates(admin, organizationId, automation.rules, candidates);
  refreshAutomationViews();
  return { queued: queued.length, sent: 0, failed: 0, runs: queued };
}

export async function updateAutomationRule(organizationId: string, input: { id: string; name: string; triggerType: string; conditionJson: Record<string, unknown>; delayMinutes: number; isActive: boolean; templateKey: string | null; }) {
  const admin = createSupabaseAdminClient(); if (!admin) throw new Error("Supabase admin client is not configured.");
  const { data: template } = input.templateKey ? await admin.from("notice_templates").select("id").or(`organization_id.eq.${organizationId},organization_id.is.null`).eq("template_key", input.templateKey).maybeSingle() : { data: null };
  const ruleIdIsUuid = /^[0-9a-f-]{36}$/i.test(input.id);
  if (ruleIdIsUuid) {
    const { error } = await admin.from("notice_rules").update({ rule_key: input.name.toLowerCase().replace(/\s+/g, "-"), enabled: input.isActive, trigger_type: input.triggerType, timing_offset: input.delayMinutes, timing_unit: "minutes", template_id: template?.id ?? null, recipient_behavior: "buyer", filters: input.conditionJson, updated_at: new Date().toISOString() }).eq("organization_id", organizationId).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("notice_rules").upsert({ organization_id: organizationId, rule_key: input.id, enabled: input.isActive, trigger_type: input.triggerType, timing_offset: input.delayMinutes, timing_unit: "minutes", template_id: template?.id ?? null, recipient_behavior: "buyer", filters: input.conditionJson, updated_at: new Date().toISOString() }, { onConflict: "organization_id,rule_key" });
    if (error) throw new Error(error.message);
  }
  refreshAutomationViews();
}

export async function updateEmailTemplate(organizationId: string, input: { id: string; subject: string; body: string; variables: string[]; isActive: boolean; }) {
  const admin = createSupabaseAdminClient(); if (!admin) throw new Error("Supabase admin client is not configured.");
  const { data: existing } = await admin.from("notice_templates").select("*").or(`organization_id.eq.${organizationId},organization_id.is.null`).eq("id", input.id).maybeSingle();
  if (!existing) throw new Error("Template not found.");
  if (existing.organization_id === organizationId) {
    const { error } = await admin.from("notice_templates").update({ subject: input.subject, body: input.body, status: input.isActive ? "enabled" : "disabled", variables: input.variables, updated_at: new Date().toISOString() }).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("notice_templates").upsert({ organization_id: organizationId, template_key: existing.template_key, category: existing.category, notice_type: existing.notice_type, subject: input.subject, body: input.body, status: input.isActive ? "enabled" : "disabled", timing_rule: existing.timing_rule, recipient_rules: existing.recipient_rules, variables: input.variables, updated_at: new Date().toISOString() }, { onConflict: "organization_id,template_key" });
    if (error) throw new Error(error.message);
  }
  refreshAutomationViews();
}

export async function sendTestEmail(organizationId: string, templateKey: string, buyerId?: string | null) {
  const admin = createSupabaseAdminClient(); if (!admin) throw new Error("Supabase admin client is not configured.");
  const [automation, business, breeder] = await Promise.all([getAutomationWorkspaceData(organizationId), getBusinessWorkspaceData(organizationId), getBreederWorkspaceData(organizationId)]);
  const template = automation.templates.find((t) => t.templateKey === templateKey); const buyer = (buyerId ? business.buyers.find((b) => b.id === buyerId) : null) ?? business.buyers[0] ?? null; const puppy = buyer ? breeder.puppies.find((p) => p.buyerId === buyer.id) ?? null : null;
  if (!template || !buyer) throw new Error("Template or buyer missing.");
  const rendered = renderNoticeTemplate(template, { buyer_name: buyer.fullName, puppy_name: puppy?.callName ?? puppy?.puppyName ?? "your puppy", breeder_name: "MyDogPortal.site", amount_due: 0, balance: 0, due_date: "", delivery_date: "" });
  const { error } = await admin.from("notice_logs").insert({ organization_id: organizationId, notice_type: template.noticeType, buyer_id: buyer.id, puppy_id: puppy?.id ?? null, sent_at: new Date().toISOString(), delivery_status: "sent", provider: "Test Mode", provider_message_id: `test_${Date.now()}`, dedupe_key: `manual_test_${Date.now()}`, related_type: "manual_test", related_id: null, failure_reason: null });
  if (error) throw new Error(error.message);
  refreshAutomationViews();
  return { status: "sent", preview: rendered.subject };
}

async function queueCandidates(admin: AdminClient, organizationId: string, rules: NoticeRule[], candidates: ScheduledNoticeCandidate[]) {
  const queuedIds: string[] = [];
  for (const candidate of candidates) {
    const rule = rules.find((item) => item.id === candidate.ruleId) ?? null;
    const { data, error } = await admin.from("notice_logs").upsert({ organization_id: organizationId, notice_type: candidate.noticeType, template_id: null, rule_id: /^[0-9a-f-]{36}$/i.test(candidate.ruleId) ? candidate.ruleId : null, buyer_id: candidate.buyerId, puppy_id: candidate.puppyId, related_type: candidate.relatedType, related_id: candidate.relatedId, scheduled_at: candidate.scheduledAt, delivery_status: "scheduled", provider: null, provider_message_id: null, dedupe_key: candidate.dedupeKey, failure_reason: null, updated_at: new Date().toISOString() }, { onConflict: "organization_id,dedupe_key" }).select("id");
    if (error) throw new Error(error.message);
    if (data?.[0]?.id) queuedIds.push(data[0].id);
    await admin.from("workflow_events").upsert({ organization_id: organizationId, event_key: candidate.dedupeKey, event_type: candidate.triggerType, related_type: candidate.relatedType, related_id: candidate.relatedId, status: "queued", payload: { buyer_id: candidate.buyerId, puppy_id: candidate.puppyId, template_key: candidate.templateKey, rule: rule?.name ?? candidate.ruleName } }, { onConflict: "organization_id,event_key" });
  }
  return queuedIds;
}

function refreshAutomationViews() { revalidatePath("/admin/automation"); revalidatePath("/admin/buyers"); revalidatePath("/admin/payments"); revalidatePath("/admin/documents"); }
