import type { ReactNode } from "react";
import { CheckCircle2, CircleDot, Search } from "lucide-react";
import type { Buyer } from "@/types";
import { StatusPill, toneForStatus } from "@/components/admin/workspace-ui";
import { cn } from "@/lib/utils";

export function BusinessSearch({
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
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
        <input aria-label={searchLabel} className="form-input h-10 pl-9" />
      </div>
    </div>
  );
}

export function BuyerDirectoryRow({
  buyer,
  selected,
  metric,
}: {
  buyer: Buyer;
  selected: boolean;
  metric?: ReactNode;
}) {
  return (
    <div className={cn("rounded-md border p-3", selected ? "border-gold/30 bg-gold/10" : "border-white/[0.06] bg-white/[0.025]")}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
          {buyer.fullName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-stone-100">{buyer.fullName}</p>
          <p className="truncate text-xs text-stone-500">{buyer.email}</p>
        </div>
        <StatusPill tone={toneForStatus(buyer.status)}>{buyer.status}</StatusPill>
      </div>
      {metric ? <div className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">{metric}</div> : null}
    </div>
  );
}

export function GuidedPanel({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-[linear-gradient(135deg,rgba(215,173,103,0.13),rgba(255,255,255,0.025)_48%,rgba(14,22,29,0.78))] p-5">
      <div className="mb-3 flex items-center gap-2 text-gold">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Guided action</p>
      </div>
      <p className="font-semibold text-stone-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-400">{body}</p>
    </div>
  );
}

export function MetricCell({ label, value, detail }: { label: string; value: ReactNode; detail?: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 p-4">
      <p className="text-2xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      {detail ? <p className="mt-2 text-sm text-stone-400">{detail}</p> : null}
    </div>
  );
}

export function ActivityLine({
  title,
  detail,
  date,
  tone = "gold",
  complete = false,
}: {
  title: string;
  detail: string;
  date: string;
  tone?: "gold" | "green" | "blue" | "red" | "neutral";
  complete?: boolean;
}) {
  return (
    <div className="relative py-3 pl-10">
      <span className="absolute left-0 top-3 flex size-8 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
        {complete ? <CheckCircle2 className="size-4" /> : <CircleDot className="size-4" />}
      </span>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-100">{title}</p>
          <p className="mt-1 text-sm leading-5 text-stone-500">{detail}</p>
        </div>
        <StatusPill tone={tone}>{date}</StatusPill>
      </div>
    </div>
  );
}

export function compactDate(value: string | null) {
  if (!value) {
    return "Schedule";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00`));
}

export function currency(value: number | null | undefined) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}
