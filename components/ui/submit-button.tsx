"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-10 w-full items-center justify-center rounded-md bg-gold px-4 text-sm font-semibold text-[#15100a] transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Working..." : children}
    </button>
  );
}
