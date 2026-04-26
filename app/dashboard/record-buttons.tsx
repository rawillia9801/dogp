"use client";

import { useFormStatus } from "react-dom";

export function SaveRecordButton({ idleText = "Save", pendingText = "Saving..." }: { idleText?: string; pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="rounded-full bg-[#2f5d3f] text-white px-7 py-3 font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}

export function DeleteRecordButton({ label = "Delete", confirmMessage = "Delete this record permanently?" }: { label?: string; confirmMessage?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className="w-full rounded-full bg-[#8b2e2e] text-white px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : label}
    </button>
  );
}
