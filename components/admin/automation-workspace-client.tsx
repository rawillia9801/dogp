"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MailCheck,
  PauseCircle,
  PlayCircle,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Workflow,
  Zap,
} from "lucide-react";
import { evaluateWorkflowAutomation, emailDeliveryProvider, renderNoticeTemplate } from "@/lib/automation-engine";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import type { NoticeLog, NoticeRule, NoticeTemplate } from "@/types";
import {
  ActivityLine,
  BusinessSearch,
  GuidedPanel,
  MetricCell,
  compactDate,
} from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, toneForStatus } from "@/components/admin/workspace-ui";

type Feedback = {
  tone: "green" | "red" | "blue";
  text: string;
} | null;

export function AutomationWorkspaceClient({
  automation: initialAutomation,
  business,
  breeder,
}: {
  automation: AutomationWorkspaceData;
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [automation, setAutomation] = useState(initialAutomation);
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialAutomation.templates.find((template) => template.noticeType === "payment_reminder")?.id ??
      initialAutomation.templates[0]?.id ??
      "",
  );
  const [selectedRuleId, setSelectedRuleId] = useState(
    initialAutomation.rules.find((rule) => rule.triggerType === "payment_due")?.id ??
      initialAutomation.rules[0]?.id ??
      "",
  );
  const [ruleConditionText, setRuleConditionText] = useState<Record<string, string>>({});
  const [logBuyerFilter, setLogBuyerFilter] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [testBuyerId, setTestBuyerId] = useState(business.buyers[0]?.id ?? "");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const selectedTemplate = useMemo(
    () => automation.templates.find((template) => template.id === selectedTemplateId) ?? automation.templates[0] ?? null,
    [automation.templates, selectedTemplateId],
  );
  const selectedRule = useMemo(
    () => automation.rules.find((rule) => rule.id === selectedRuleId) ?? automation.rules[0] ?? null,
    [automation.rules, selectedRuleId],
  );
  const selectedRuleConditionJson = selectedRule
    ? ruleConditionText[selectedRule.id] ?? JSON.stringify(selectedRule.conditionJson ?? selectedRule.filters ?? {}, null, 2)
    : "{}";
  const evaluation = useMemo(
    () => evaluateWorkflowAutomation({ automation, business, breeder }),
    [automation, breeder, business],
  );
  const provider = useMemo(() => emailDeliveryProvider(automation), [automation]);
  const enabledTemplates = automation.templates.filter((template) => template.status === "enabled").length;

  const previewBuyer = business.buyers.find((buyer) => buyer.id === testBuyerId) ?? business.buyers[0] ?? null;
  const previewPuppy = previewBuyer
    ? breeder.puppies.find((puppy) => puppy.buyerId === previewBuyer.id) ?? breeder.puppies[0] ?? null
    : breeder.puppies[0] ?? null;
  const previewPlan = previewBuyer
    ? business.paymentPlans.find((plan) => plan.buyerId === previewBuyer.id) ?? null
    : null;
  const previewPaymentTotal = previewBuyer
    ? business.payments
        .filter((payment) => payment.buyerId === previewBuyer.id)
        .reduce((sum, payment) => sum + payment.amount, 0)
    : 0;
  const previewBalance = previewPlan ? Math.max(previewPlan.totalPrice - previewPaymentTotal, 0) : 0;
  const renderedPreview = selectedTemplate
    ? renderNoticeTemplate(
        {
          subject: selectedTemplate.subject,
          body: selectedTemplate.body,
        },
        {
          buyer_name: previewBuyer?.fullName ?? "Buyer record",
          puppy_name: previewPuppy?.callName ?? previewPuppy?.puppyName ?? "Selected puppy",
          due_date: previewPlan?.nextDueDate ?? "",
          delivery_date: business.transportation.find((item) => item.buyerId === previewBuyer?.id)?.date ?? "",
          balance: previewBalance,
          amount_due: previewPlan?.monthlyAmount ?? previewBalance,
          breeder_name: "MyDogPortal.site",
        },
      )
    : null;

  const filteredLogs = automation.logs.filter((log) => {
    const buyerName = business.buyers.find((buyer) => buyer.id === log.buyerId)?.fullName ?? "";
    const matchesBuyer = !logBuyerFilter || buyerName.toLowerCase().includes(logBuyerFilter.toLowerCase());
    const matchesStatus = logStatusFilter === "all" || log.deliveryStatus === logStatusFilter;
    return matchesBuyer && matchesStatus;
  });

  const updateSelectedRule = (updater: (rule: NoticeRule) => NoticeRule) => {
    if (!selectedRule) {
      return;
    }

    setAutomation((current) => ({
      ...current,
      rules: current.rules.map((rule) => (rule.id === selectedRule.id ? updater(rule) : rule)),
    }));
  };

  const updateSelectedTemplate = (updater: (template: NoticeTemplate) => NoticeTemplate) => {
    if (!selectedTemplate) {
      return;
    }

    setAutomation((current) => ({
      ...current,
      templates: current.templates.map((template) => (template.id === selectedTemplate.id ? updater(template) : template)),
    }));
  };

  const runEngine = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/automation/execute", { method: "POST" });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          result?: { queued: number; sent: number; failed: number };
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Automation run failed.");
        }

        setFeedback({
          tone: "green",
          text: `Automation run completed. ${payload.result?.queued ?? 0} queued, ${payload.result?.sent ?? 0} sent, ${payload.result?.failed ?? 0} failed.`,
        });
        router.refresh();
      } catch (error) {
        setFeedback({
          tone: "red",
          text: error instanceof Error ? error.message : "Automation run failed.",
        });
      }
    });
  };

  const saveTemplate = () => {
    if (!selectedTemplate) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/automation/templates/${selectedTemplate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: selectedTemplate.subject,
            body: selectedTemplate.body,
            variables: selectedTemplate.variables,
            isActive: selectedTemplate.isActive ?? selectedTemplate.status !== "disabled",
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Template update failed.");
        }

        setFeedback({ tone: "green", text: "Template saved." });
        router.refresh();
      } catch (error) {
        setFeedback({
          tone: "red",
          text: error instanceof Error ? error.message : "Template update failed.",
        });
      }
    });
  };

  const sendTemplateTest = () => {
    if (!selectedTemplate) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/automation/templates/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateKey: selectedTemplate.templateKey,
            buyerId: testBuyerId || null,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Test email failed.");
        }

        setFeedback({ tone: "green", text: "Test email sent." });
        router.refresh();
      } catch (error) {
        setFeedback({
          tone: "red",
          text: error instanceof Error ? error.message : "Test email failed.",
        });
      }
    });
  };

  const saveRule = () => {
    if (!selectedRule) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      try {
        const parsedConditions = parseConditionJson(selectedRuleConditionJson);
        const response = await fetch(`/api/admin/automation/rules/${selectedRule.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedRule.name,
            triggerType: selectedRule.triggerType,
            delayMinutes: Number(selectedRule.delayMinutes ?? selectedRule.timingOffset ?? 0),
            templateKey: selectedRule.templateKey ?? selectedRule.templateId,
            isActive: selectedRule.isActive ?? selectedRule.enabled ?? true,
            conditionJson: parsedConditions,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Rule update failed.");
        }

        updateSelectedRule((rule) => ({
          ...rule,
          conditionJson: parsedConditions,
          filters: parsedConditions,
        }));
        setRuleConditionText((current) => ({
          ...current,
          [selectedRule.id]: JSON.stringify(parsedConditions, null, 2),
        }));
        setFeedback({ tone: "green", text: "Rule saved." });
        router.refresh();
      } catch (error) {
        setFeedback({
          tone: "red",
          text: error instanceof Error ? error.message : "Rule update failed.",
        });
      }
    });
  };

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Automation command"
        title="Automation"
        description="Manage rule-based breeder notices, execute workflow runs, review delivery activity, and control message templates tied to buyer and program events."
        actions={
          <>
            <button
              type="button"
              onClick={runEngine}
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
            >
              <Zap className="size-4" />
              Run Engine
            </button>
            <button
              type="button"
              onClick={sendTemplateTest}
              disabled={isPending || !selectedTemplate}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100 disabled:opacity-60"
            >
              <Send className="size-4" />
              Send Test Email
            </button>
          </>
        }
      />

      {feedback ? (
        <div className="mt-5">
          <StatusPill tone={feedback.tone}>{feedback.text}</StatusPill>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <MetricCell label="Automation health" value={`${evaluation.healthScore}%`} detail="Rules, logs, and provider readiness" />
        <MetricCell label="Active rules" value={evaluation.activeRuleCount} detail="Organization workflow controls" />
        <MetricCell label="Enabled templates" value={enabledTemplates} detail={`${automation.templates.length} message templates`} />
        <MetricCell label="Scheduled queue" value={evaluation.queuedCount} detail="Queued and evaluated notices" />
      </div>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[340px_1fr_340px]">
        <Panel className="p-4" title="Automation Rules" eyebrow="Trigger list">
          <BusinessSearch label="Find rule" searchLabel="Search automation rules" />
          <div className="mt-4 space-y-2">
            {automation.rules.map((rule) => (
              <button
                key={rule.id}
                type="button"
                onClick={() => setSelectedRuleId(rule.id)}
                className="block w-full text-left"
              >
                <RuleRow rule={rule} selected={selectedRule?.id === rule.id} />
              </button>
            ))}
          </div>
        </Panel>

        <main className="space-y-5">
          <Panel className="p-5" title="Rule Configuration" eyebrow="Workflow engine">
            {selectedRule ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-stone-300">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Rule name</span>
                    <input
                      value={selectedRule.name}
                      onChange={(event) => updateSelectedRule((rule) => ({ ...rule, name: event.target.value }))}
                      className="form-input h-10"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-stone-300">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Trigger</span>
                    <select
                      value={selectedRule.triggerType}
                      onChange={(event) => updateSelectedRule((rule) => ({ ...rule, triggerType: event.target.value }))}
                      className="form-input h-10"
                    >
                      {triggerOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-stone-300">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Delay minutes</span>
                    <input
                      type="number"
                      value={Number(selectedRule.delayMinutes ?? selectedRule.timingOffset ?? 0)}
                      onChange={(event) =>
                        updateSelectedRule((rule) => ({
                          ...rule,
                          delayMinutes: Number(event.target.value || 0),
                          timingOffset: Number(event.target.value || 0),
                        }))
                      }
                      className="form-input h-10"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-stone-300">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Template</span>
                    <select
                      value={selectedRule.templateKey ?? selectedRule.templateId ?? ""}
                      onChange={(event) =>
                        updateSelectedRule((rule) => ({
                          ...rule,
                          templateKey: event.target.value || null,
                          templateId: event.target.value || null,
                        }))
                      }
                      className="form-input h-10"
                    >
                      <option value="">No template</option>
                      {automation.templates.map((template) => (
                        <option key={template.id} value={template.templateKey}>
                          {template.category}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block space-y-2 text-sm text-stone-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Conditions JSON</span>
                  <textarea
                    value={selectedRuleConditionJson}
                    onChange={(event) =>
                      setRuleConditionText((current) => ({
                        ...current,
                        [selectedRule.id]: event.target.value,
                      }))
                    }
                    rows={6}
                    className="form-input min-h-[140px] py-3 font-mono text-xs"
                  />
                </label>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-stone-300">
                    <input
                      type="checkbox"
                      checked={selectedRule.isActive ?? selectedRule.enabled ?? true}
                      onChange={(event) =>
                        updateSelectedRule((rule) => ({
                          ...rule,
                          enabled: event.target.checked,
                          isActive: event.target.checked,
                        }))
                      }
                      className="size-4 rounded border-white/[0.12] bg-transparent"
                    />
                    Rule enabled
                  </label>
                  <button
                    type="button"
                    onClick={saveRule}
                    disabled={isPending}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    Save Rule
                  </button>
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<Workflow className="size-4" />}
                title="Create the first workflow rule"
                body="Define the event, conditions, delivery delay, and template used when a breeder workflow needs to trigger automatically."
              />
            )}
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Panel className="p-5" title="Templates" eyebrow="Notice system">
              <div className="space-y-2">
                {automation.templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className="block w-full text-left"
                  >
                    <TemplateRow template={template} selected={selectedTemplate?.id === template.id} />
                  </button>
                ))}
              </div>
            </Panel>

            <Panel className="p-5" title="Delivery Readiness" eyebrow="Provider status">
              <div className="space-y-3">
                <FieldRow label="Provider" value={provider.providerName} />
                <FieldRow label="Status" value={provider.deliveryStatus} />
                <FieldRow label="Message ID" value={provider.messageIdField} />
                <FieldRow label="Failure field" value={provider.failureField} />
              </div>
              <div className="mt-4 rounded-md border border-gold/20 bg-gold/10 p-3 text-sm leading-6 text-gold-soft">
                Delivery is prepared for real email sending, logged responses, deduplication, and retry tracking.
              </div>
            </Panel>
          </div>

          <Panel className="p-5" title="Template Editor" eyebrow="Message content">
            {selectedTemplate ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Subject</span>
                    <input
                      value={selectedTemplate.subject}
                      onChange={(event) => updateSelectedTemplate((template) => ({ ...template, subject: event.target.value }))}
                      className="form-input h-10"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Body</span>
                    <textarea
                      value={selectedTemplate.body}
                      onChange={(event) => updateSelectedTemplate((template) => ({ ...template, body: event.target.value }))}
                      rows={5}
                      className="form-input min-h-[140px] py-3"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-stone-300">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Test recipient</span>
                    <select
                      value={testBuyerId}
                      onChange={(event) => setTestBuyerId(event.target.value)}
                      className="form-input h-10"
                    >
                      {business.buyers.map((buyer) => (
                        <option key={buyer.id} value={buyer.id}>
                          {buyer.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="inline-flex items-center gap-2 self-end pb-1 text-sm text-stone-300">
                    <input
                      type="checkbox"
                      checked={selectedTemplate.isActive ?? selectedTemplate.status !== "disabled"}
                      onChange={(event) =>
                        updateSelectedTemplate((template) => ({
                          ...template,
                          isActive: event.target.checked,
                          status: event.target.checked ? "enabled" : "disabled",
                        }))
                      }
                      className="size-4 rounded border-white/[0.12] bg-transparent"
                    />
                    Template enabled
                  </label>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Variables</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <StatusPill key={variable} tone="gold">{`{{${variable}}}`}</StatusPill>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-md border border-white/[0.08] bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Preview</p>
                  <p className="mt-3 font-semibold text-stone-100">{renderedPreview?.subject}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{renderedPreview?.body}</p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <StatusPill tone={(selectedTemplate.isActive ?? selectedTemplate.status !== "disabled") ? "green" : "neutral"}>
                    {(selectedTemplate.isActive ?? selectedTemplate.status !== "disabled") ? "enabled" : "disabled"}
                  </StatusPill>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={sendTemplateTest}
                      disabled={isPending}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100 disabled:opacity-60"
                    >
                      <Send className="size-4" />
                      Send Test Email
                    </button>
                    <button
                      type="button"
                      onClick={saveTemplate}
                      disabled={isPending}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
                    >
                      <Save className="size-4" />
                      Save Template
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<BellRing className="size-4" />}
                title="Add the first notice template"
                body="Write the subject and message body used for payment reminders, overdue notices, application follow-up, and delivery reminders."
              />
            )}
          </Panel>
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Notice Health" eyebrow="Operational state">
            <div className="space-y-3">
              <HealthLine icon={<ShieldCheck className="size-4" />} label="Delivery health" value={`${evaluation.healthScore}%`} tone="green" />
              <HealthLine icon={<CalendarClock className="size-4" />} label="Queued" value={String(evaluation.queuedCount)} tone="gold" />
              <HealthLine icon={<MailCheck className="size-4" />} label="Delivered" value={String(evaluation.deliveredCount)} tone="blue" />
              <HealthLine icon={<PauseCircle className="size-4" />} label="Failures" value={String(evaluation.failedCount)} tone={evaluation.failedCount > 0 ? "red" : "green"} />
            </div>
          </Panel>

          <Panel className="p-5" title="Next Notices" eyebrow="Evaluated queue">
            <div className="space-y-3">
              {evaluation.candidates.length > 0 ? (
                evaluation.candidates.slice(0, 4).map((candidate) => (
                  <ActivityLine
                    key={candidate.dedupeKey}
                    title={candidate.label}
                    detail={candidate.detail}
                    date={compactDate(candidate.scheduledAt)}
                    tone="gold"
                  />
                ))
              ) : (
                <GuidedPanel
                  icon={<Workflow className="size-4" />}
                  title="Workflow rules are synchronized"
                  body="New buyer events, due dates, reservations, and delivery milestones will schedule notices here."
                />
              )}
            </div>
          </Panel>

          <Panel className="p-5" title="Automation Settings" eyebrow="Organization controls">
            <div className="space-y-3">
              <SettingLine icon={<PlayCircle className="size-4" />} label="All notices" active={automation.settings?.noticesEnabled ?? true} />
              <SettingLine icon={<CheckCircle2 className="size-4" />} label="Payment notices" active={automation.settings?.paymentNoticesEnabled ?? true} />
              <SettingLine icon={<FileText className="size-4" />} label="Document notices" active={automation.settings?.documentNoticesEnabled ?? true} />
              <SettingLine icon={<Settings2 className="size-4" />} label="Transportation notices" active={automation.settings?.transportationNoticesEnabled ?? true} />
              <SettingLine icon={<ClipboardCheck className="size-4" />} label="Puppy milestones" active={automation.settings?.puppyMilestoneNoticesEnabled ?? true} />
            </div>
          </Panel>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel className="p-5" title="Notice Activity" eyebrow="Delivery log">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="space-y-2 text-sm text-stone-300">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Filter by buyer</span>
              <input
                value={logBuyerFilter}
                onChange={(event) => setLogBuyerFilter(event.target.value)}
                className="form-input h-10"
                placeholder="Search buyer record"
              />
            </label>
            <label className="space-y-2 text-sm text-stone-300">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Status</span>
              <select
                value={logStatusFilter}
                onChange={(event) => setLogStatusFilter(event.target.value)}
                className="form-input h-10"
              >
                {["all", "pending", "sent", "failed"].map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All statuses" : humanize(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[160px_1fr_180px_120px] gap-3 border-b border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                <span>Status</span>
                <span>Notice</span>
                <span>Buyer</span>
                <span>Scheduled</span>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => <LogRow key={log.id} log={log} buyerName={buyerNameForLog(log, business)} />)
                ) : (
                  <div className="p-4">
                    <GuidedPanel
                      icon={<Activity className="size-4" />}
                      title="Notice history will record here"
                      body="Queued, sent, and failed notices stay attached to buyer workflow so delivery history is always traceable."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5" title="Manual Control" eyebrow="Override and review">
          <div className="space-y-3">
            <HealthLine icon={<Zap className="size-4" />} label="Manual engine run" value="Available" tone="gold" />
            <HealthLine icon={<Send className="size-4" />} label="Template test send" value="Available" tone="blue" />
            <HealthLine icon={<PauseCircle className="size-4" />} label="Deduplication" value="Active" tone="green" />
            <HealthLine icon={<MailCheck className="size-4" />} label="Retry handling" value="Active" tone="green" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TemplateRow({ template, selected }: { template: NoticeTemplate; selected: boolean }) {
  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gold/20 bg-gold/10 text-gold">
          <BellRing className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-stone-100">{template.category}</p>
            <StatusPill tone={template.status === "enabled" ? "green" : "neutral"}>{template.status}</StatusPill>
          </div>
          <p className="mt-1 truncate text-xs text-stone-500">{humanize(template.noticeType)}</p>
        </div>
      </div>
    </div>
  );
}

function RuleRow({ rule, selected }: { rule: NoticeRule; selected: boolean }) {
  const label = rule.name || (typeof rule.filters.label === "string" ? rule.filters.label : humanize(rule.triggerType));

  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-stone-100">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">
            {humanize(rule.triggerType)} / {timing(rule)}
          </p>
        </div>
        <StatusPill tone={rule.enabled ? "green" : "neutral"}>{rule.enabled ? "enabled" : "disabled"}</StatusPill>
      </div>
    </div>
  );
}

function HealthLine({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "gold" | "green" | "blue" | "red";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <StatusPill tone={tone}>{value}</StatusPill>
    </div>
  );
}

function LogRow({ log, buyerName }: { log: NoticeLog; buyerName: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr_180px_120px] gap-3 px-4 py-3 text-sm">
      <StatusPill tone={toneForStatus(log.deliveryStatus)}>{log.deliveryStatus}</StatusPill>
      <span className="font-medium text-stone-100">{humanize(log.noticeType)}</span>
      <span className="text-stone-400">{buyerName}</span>
      <span className="text-stone-400">{compactDate(log.scheduledAt ?? log.createdAt)}</span>
    </div>
  );
}

function SettingLine({ icon, label, active }: { icon: ReactNode; label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <StatusPill tone={active ? "green" : "neutral"}>{active ? "active" : "paused"}</StatusPill>
    </div>
  );
}

function parseConditionJson(value: string) {
  if (!value.trim()) {
    return {};
  }

  return JSON.parse(value) as Record<string, unknown>;
}

function buyerNameForLog(log: NoticeLog, business: BusinessWorkspaceData) {
  return business.buyers.find((buyer) => buyer.id === log.buyerId)?.fullName ?? "Buyer record";
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function timing(rule: NoticeRule) {
  if (Number(rule.timingOffset) === 0) {
    return "same day";
  }

  const direction = Number(rule.timingOffset) < 0 ? "before" : "after";
  return `${Math.abs(Number(rule.timingOffset))} ${rule.timingUnit} ${direction}`;
}

const triggerOptions = [
  { value: "payment_due", label: "Payment due" },
  { value: "payment_overdue", label: "Payment overdue" },
  { value: "application_submitted", label: "Application submitted" },
  { value: "puppy_reserved", label: "Puppy reserved" },
  { value: "delivery_upcoming", label: "Delivery upcoming" },
];
