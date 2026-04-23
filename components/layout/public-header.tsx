import Link from "next/link";
import { PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0b0f14]/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_30%_20%,rgba(241,201,121,0.24),rgba(215,173,103,0.1)_40%,rgba(10,16,22,0.94))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(215,173,103,0.12)]">
            <PawPrint className="size-6 fill-gold text-gold" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-none text-stone-50">mydogportal.site</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">
              Premium Breeder Operations
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
          <Link href="/features" className="transition hover:text-stone-50">Features</Link>
          <Link href="/pricing" className="transition hover:text-stone-50">Pricing</Link>
          <Link href="/sign-in" className="transition hover:text-stone-50">Sign In</Link>
        </nav>
        <ButtonLink href="/sign-up" className="hidden sm:inline-flex">Start Trial</ButtonLink>
      </div>
    </header>
  );
}
