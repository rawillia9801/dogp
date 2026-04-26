"use client";

import { useFormStatus } from "react-dom";

export function DogFormSubmitButton({ idleText, pendingText }: { idleText: string; pendingText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="rounded-full bg-[#2f5d3f] text-white px-8 py-4 font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
