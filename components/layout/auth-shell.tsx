import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, PawPrint, Sparkles } from "lucide-react";

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
    <main className="auth-page relative min-h-screen overflow-hidden bg-[#F8F7F3] px-5 py-10 text-[#1F2933]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300;1,9..144,600&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .auth-page {
          font-family: 'DM Sans', sans-serif;
        }

        .auth-page .font-display {
          font-family: 'Fraunces', serif;
        }

        .auth-page .form-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #D8CCB7;
          background: rgba(255, 255, 255, 0.88);
          padding: 0.85rem 1rem;
          color: #1F2933;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.7), 0 10px 28px rgba(47, 79, 62, 0.04);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .auth-page .form-input::placeholder {
          color: #9A8F80;
        }

        .auth-page .form-input:focus {
          border-color: #2F4F3E;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(47, 79, 62, 0.1), 0 12px 30px rgba(47, 79, 62, 0.08);
        }

        .auth-page select.form-input {
          font-weight: 800;
        }

        .auth-page label > span {
          color: #7A6A55;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .auth-page button[type='submit'] {
          min-height: 3.25rem;
          border-radius: 1rem;
          background: #2F4F3E;
          color: white;
          font-weight: 900;
          box-shadow: 0 14px 34px rgba(47, 79, 62, 0.18);
        }

        .auth-page button[type='submit']:hover {
          background: #253F32;
        }

        .auth-page .text-gold-soft {
          color: #2F4F3E;
          font-weight: 900;
        }
      `}</style>

      <div className="pointer-events-none absolute left-[-10%] top-[-12%] h-[28rem] w-[28rem] rounded-full bg-[#A8BFA3]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[#C6A96B]/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[28%] h-[22rem] w-[22rem] rounded-full bg-[#2F4F3E]/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
          <section className="hidden lg:block">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-white/80 px-4 py-2 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to MyDogPortal
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-white/80 px-4 py-2 text-sm font-black text-[#2F4F3E] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#C6A96B]" />
              Built for real dog breeders
            </div>

            <h1 className="font-display mt-6 max-w-xl text-5xl font-black leading-[1.03] tracking-tight text-[#1F2933]">
              Welcome to your calm, organized breeder workspace.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#5B6B73]">
              Manage puppies, buyers, payments, documents, reminders, and your public breeder experience from one polished system.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
              {[
                { label: "Portal", sub: "Buyer ready" },
                { label: "Docs", sub: "Contracts" },
                { label: "Payments", sub: "Balances" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#E5DED2] bg-white/85 p-4 shadow-sm">
                  <PawPrint className="mb-2 h-5 w-5 text-[#2F4F3E]" />
                  <p className="text-sm font-black text-[#1F2933]">{item.label}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#5B6B73]">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-[2rem] border border-[#E5DED2] bg-white/92 p-6 shadow-2xl shadow-[#2F4F3E]/10 backdrop-blur-xl md:p-7">
            <Link href="/" className="mb-7 flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
                <PawPrint className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#C6A96B]" />
              </div>
              <div>
                <p className="truncate text-lg font-black tracking-tight text-[#1F2933]">MyDogPortal</p>
                <p className="mt-0.5 text-xs font-bold text-[#5B6B73]">{subtitle}</p>
              </div>
            </Link>

            <h1 className="font-display mb-5 text-4xl font-black tracking-tight text-[#1F2933]">{title}</h1>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
