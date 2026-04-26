"use client";

import { useFormStatus } from "react-dom";

export function DeleteDogButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Delete this dog record permanently?")) {
          event.preventDefault();
        }
      }}
      className="w-full rounded-full bg-[#8b2e2e] text-white px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
