import { LockKeyhole } from "lucide-react";
import type { PlanKey } from "@/lib/plans";
import type { FeatureKey } from "@/lib/upgrade";
import { UpgradePrompt } from "@/components/admin/upgrade-prompt";
import { Panel, WorkspaceHeader } from "@/components/admin/workspace-ui";

export function LockedWorkspace({
  eyebrow,
  title,
  description,
  currentPlan,
  featureKey,
  sourceArea,
  promptTitle,
  promptBody,
  suggestedPlan,
  primaryLabel,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  currentPlan: PlanKey;
  featureKey: FeatureKey;
  sourceArea: string;
  promptTitle: string;
  promptBody: string;
  suggestedPlan: PlanKey;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div>
      <WorkspaceHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6" title="Workspace access" eyebrow="Upgrade required">
          <div className="rounded-[24px] border border-white/[0.08] bg-[radial-gradient(circle_at_12%_10%,rgba(215,173,103,0.15),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
                <LockKeyhole className="size-5" />
              </span>
              <div>
                <p className="text-lg font-semibold text-stone-50">{promptTitle}</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">{promptBody}</p>
              </div>
            </div>
          </div>
        </Panel>

        <UpgradePrompt
          title={promptTitle}
          body={promptBody}
          currentPlan={currentPlan}
          suggestedPlan={suggestedPlan}
          primaryLabel={primaryLabel}
          secondaryLabel={secondaryLabel}
          sourceArea={sourceArea}
          featureKey={featureKey}
          compact
        />
      </div>
    </div>
  );
}
