import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-50">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  eyebrow,
  action,
  id,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("surface rounded-lg", className)}>
      {title || eyebrow || action ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="mt-1 font-semibold text-stone-50">{title}</h2> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "gold" | "green" | "blue" | "red" | "neutral";
}) {
  const tones = {
    gold: "border-gold/25 bg-gold/10 text-gold-soft",
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    blue: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    red: "border-red-400/20 bg-red-400/10 text-red-200",
    neutral: "border-white/[0.08] bg-white/[0.045] text-stone-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-[linear-gradient(135deg,rgba(215,173,103,0.13),rgba(255,255,255,0.025)_48%,rgba(14,22,29,0.78))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-2 rounded-full bg-gold shadow-[0_0_18px_rgba(215,173,103,0.75)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Guided action</p>
      </div>
      <p className="font-semibold text-stone-100">{title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">{body}</p>
    </div>
  );
}

export function FieldRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2.5 last:border-0">
      <span className="text-xs uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <span className="text-right text-sm text-stone-200">{value || "Record details"}</span>
    </div>
  );
}

export function RosterSearch({
  label,
  searchLabel,
}: {
  label: string;
  searchLabel: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <input aria-label={searchLabel} className="form-input h-10" />
    </div>
  );
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Set date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function money(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "Set amount";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function dogAge(dateOfBirth: string | null) {
  if (!dateOfBirth) {
    return "Age to confirm";
  }

  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();

  if (months < 12) {
    return `${Math.max(months, 0)} mo`;
  }

  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return remainder > 0 ? `${years} yr ${remainder} mo` : `${years} yr`;
}

export function toneForStatus(status: string) {
  const normalized = status.toLowerCase();

  if (["active", "available", "planned", "scheduled", "open", "approved", "new", "active plan", "sent", "under review", "draft"].includes(normalized)) {
    return "gold";
  }

  if (["confirmed", "whelped", "retained", "complete", "closed", "completed", "paid", "signed", "filed", "excellent match", "good match"].includes(normalized)) {
    return "green";
  }

  if (["review", "watch", "reserved", "matched", "bred", "applied", "inquiry"].includes(normalized)) {
    return "blue";
  }

  if (["urgent", "blocked", "declined", "denied", "overdue", "review required", "high"].includes(normalized)) {
    return "red";
  }

  return "neutral";
}

export function displayText(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "Record details";
}
