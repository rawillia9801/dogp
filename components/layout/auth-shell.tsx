import Link from "next/link";
import type { ReactNode } from "react";
import { PawPrint } from "lucide-react";
import { Surface } from "@/components/ui/surface";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-app px-5 py-10 text-stone-100">
      <Surface className="w-full max-w-md p-6">
        <Link href="/" className="mb-7 flex items-center gap-3">
          <PawPrint className="size-8 fill-gold text-gold" />
          <div>
            <p className="text-lg font-semibold leading-none text-stone-50">mydogportal.site</p>
            <p className="mt-1 text-xs text-stone-400">{subtitle}</p>
          </div>
        </Link>
        <h1 className="mb-5 text-2xl font-semibold text-stone-50">{title}</h1>
        {children}
      </Surface>
    </main>
  );
}
