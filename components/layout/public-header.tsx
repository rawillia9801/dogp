import Link from "next/link";
import { Bot, PawPrint } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E5DED2] bg-[#F8F7F3]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
            <PawPrint className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#F8F7F3] bg-[#C6A96B]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight text-[#1F2933]">MyDogPortal</p>
            <p className="truncate text-xs font-medium text-[#5B6B73]">Dog Breeder Web + Docs + Portal</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#5B6B73] md:flex">
          <Link href="/features" className="transition-colors hover:text-[#2F4F3E]">Features</Link>
          <Link href="/features#assistant" className="inline-flex items-center gap-1.5 transition-colors hover:text-[#2F4F3E]"><Bot className="h-4 w-4" />Breeder Buddy AI</Link>
          <Link href="/pricing" className="transition-colors hover:text-[#2F4F3E]">Pricing</Link>
          <Link href="/features#demo" className="transition-colors hover:text-[#2F4F3E]">Demo</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full border border-[#D8CCB7] bg-white px-5 py-2.5 text-sm font-bold text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6]">Sign In</Link>
          <Link href="/sign-up" className="hidden items-center justify-center rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#253F32] sm:inline-flex">Start your Trial</Link>
        </div>
      </div>
    </header>
  );
}
