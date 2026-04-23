import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ children, className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        variant === "primary" && "bg-gold text-[#15100a] shadow-gold hover:bg-gold-soft",
        variant === "secondary" && "border border-gold/25 bg-white/[0.04] text-stone-100 hover:bg-white/[0.08]",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
