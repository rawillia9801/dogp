import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Bot,
  CalendarCheck,
  Check,
  ClipboardSignature,
  CreditCard,
  FileText,
  Globe2,
  Home,
  LayoutDashboard,
  MailCheck,
  MessageCircle,
  PawPrint,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WandSparkles,
} from "lucide-react";

const storySteps = [
  {
    eyebrow: "01",
    title: "Your website brings serious buyers in.",
    text: "Present your breeding program, available puppies, policies, application process, and buyer trust details with a polished first impression.",
    icon: Globe2,
  },
  {
    eyebrow: "02",
    title: "Applications become buyer records.",
    text: "Buyer details, puppy interest, approval status, notes, waitlist stage, and next steps stay connected from the beginning.",
    icon: Users,
  },
  {
    eyebrow: "03",
    title: "The buyer portal keeps families informed.",
    text: "Each buyer gets a private place to follow their puppy, review documents, track payments, receive updates, and prepare for go-home day.",
    icon: Home,
  },
  {
    eyebrow: "04",
    title: "Documents and payments stay together.",
    text: "Contracts, health guarantees, deposits, balances, payment plans, and signed records stay organized around the buyer and puppy.",
    icon: ClipboardSignature,
  },
  {
    eyebrow: "05",
    title: "Automation keeps follow-up moving.",
    text: "Send payment reminders, puppy updates, document notices, waitlist messages, and go-home instructions without doing everything manually.",
    icon: BellRing,
  },
  {
    eyebrow: "06",
    title: "Chi Chi helps guide the next step.",
    text: "Chi Chi helps prepare work for the breeder and gives buyers clearer guidance through documents, payments, updates, and portal steps.",
    icon: Bot,
  },
];

const coreFeatures = [
  {
    icon: LayoutDashboard,
    title: "Breeder Command Center",
    text: "A daily operations dashboard for dogs, litters, puppies, buyers, documents, payments, reminders, and next steps.",
  },
  {
    icon: PawPrint,
    title: "Dogs, Litters & Puppies",
    text: "Track breeding dogs, pairings, litters, whelping details, puppy profiles, availability, pricing, and go-home readiness.",
  },
  {
    icon: Users,
    title: "Buyer Management",
    text: "Manage applications, waitlists, buyer profiles, linked puppies, communication, placement stage, and follow-up tasks.",
  },
  {
    icon: CreditCard,
    title: "Payments & Payment Plans",
    text: "Track deposits, balances, due dates, credits, payment plans, reminders, and buyer payment history.",
  },
  {
    icon: FileText,
    title: "Smart Documents",
    text: "Professional breeder documents, agreements, health guarantees, deposits, payment forms, and placement paperwork.",
  },
  {
    icon: Home,
    title: "Buyer Portal",
    text: "A private place for each buyer to follow their puppy journey, payment status, signed documents, messages, and updates.",
  },
  {
    icon: Globe2,
    title: "Breeder Website Builder",
    text: "Polished breeder websites with puppy listings, applications, policies, buyer trust sections, and optional custom domains.",
  },
  {
    icon: MailCheck,
    title: "Breeder Automation Engine",
    text: "Branded email templates, payment reminders, puppy updates, document notices, waitlist messages, and triggered workflows.",
  },
];

const automationFeatures = [
  "Payment due in 3 days",
  "Contract ready to sign",
  "Puppy turns 6 weeks",
  "New weekly pupdate",
  "Waitlist follow-up",
  "Go-home reminder",
];

const pricing = [
  {
    name: "Starter",
    price: "$29",
    description: "For hobby breeders who want better organization without jumping into the full system yet.",
    features: [
      "Up to 10 dogs",
      "2 active litters",
      "Basic documents",
      "Basic buyer portal",
      "Limited email automation",
    ],
  },
  {
    name: "Professional",
    price: "$79",
    description: "For serious breeders who want the full daily-use breeder operating system.",
    features: [
      "Up to 50 dogs",
      "10 active litters",
      "Full document builder",
      "Buyer portal",
      "Payment tracking",
      "Automation emails",
      "Branding controls",
    ],
    highlighted: true,
  },
  {
    name: "Elite",
    price: "$149",
    description: "For advanced breeders and kennels that want everything connected and highly automated.",
    features: [
      "Unlimited dogs and litters",
      "Full AI document system",
      "Full automation engine",
      "Advanced analytics",
      "Website builder integration",
      "White-label branding",
      "Priority support",
    ],
  },
];

const entryPoints = [
  {
    icon: FileText,
    title: "Smart Documents",
    domain: "DogBreederDocs.Online",
    text: "Professional breeder documents, agreements, health guarantees, deposits, and payment forms built around real placement workflows.",
  },
  {
    icon: LayoutDashboard,
    title: "Breeder Operating System",
    domain: "MyDogPortal.Site",
    text: "A complete workspace for dogs, litters, puppies, buyers, payments, documents, transportation, reminders, and daily breeder operations.",
  },
  {
    icon: Globe2,
    title: "Breeder Websites",
    domain: "DogBreederWeb.Site",
    text: "Polished websites with puppy listings, application flows, policies, buyer trust sections, and optional custom domains.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F6EF] text-[#17251F]">
      <header className="sticky top-0 z-50 border-b border-[#E6DCCB] bg-[#F8F6EF]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <MyDogPortalLogo />
            <div>
              <p className="text-lg font-black leading-none tracking-tight text-[#20372D]">
                MyDogPortal
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B744C]">
                Breeder Operating System
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[#5D6A61] lg:flex">
            <a href="#story" className="transition hover:text-[#315744]">
              Journey
            </a>
            <a href="#features" className="transition hover:text-[#315744]">
              Features
            </a>
            <a href="#portal" className="transition hover:text-[#315744]">
              Buyer Portal
            </a>
            <a href="#automation" className="transition hover:text-[#315744]">
              Automation
            </a>
            <a href="#chichi" className="transition hover:text-[#315744]">
              Chi Chi
            </a>
            <a href="#pricing" className="transition hover:text-[#315744]">
              Pricing
            </a>
          </nav>

          <a
            href="#pricing"
            className="rounded-full bg-[#315744] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#315744]/15 transition hover:bg-[#264638]"
          >
            Start Building
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-[-14rem] top-12 h-[32rem] w-[32rem] rounded-full bg-[#C9D9C4]/55 blur-3xl" />
        <div className="absolute right-[-14rem] top-28 h-[36rem] w-[36rem] rounded-full bg-[#E7D5A8]/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DDD0BA] bg-white/75 px-4 py-2 text-sm font-black text-[#315744] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#C59B45]" />
              Websites, documents, portals, payments, automation, and Chi Chi
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-[#17251F] md:text-7xl">
              Run your breeding program like a real business.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#596860] md:text-xl">
              MyDogPortal gives dog breeders one polished system to manage their
              website, applications, buyers, puppies, documents, payments,
              automations, and buyer portal — with Chi Chi built in to help keep
              everything moving.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#315744] px-7 py-4 text-base font-black text-white shadow-xl shadow-[#315744]/20 transition hover:bg-[#264638]"
              >
                Build My Breeder System
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#story"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8CBB8] bg-white px-7 py-4 text-base font-black text-[#315744] shadow-sm transition hover:bg-[#F2EBDD]"
              >
                See the Journey
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-4">
              {["Website", "Portal", "Docs", "Automation"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#E4D9C8] bg-white/85 p-4 shadow-sm"
                >
                  <Check className="mb-2 h-5 w-5 text-[#315744]" />
                  <p className="text-sm font-black text-[#24342D]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroCommandCenter />
        </div>
      </section>

      <section id="story" className="border-y border-[#E6DCCB] bg-[#EFEADE] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
              The connected breeder journey
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
              From website visit to go-home day, everything stays connected.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#596860]">
              Your website, applications, buyer portal, documents, payments,
              puppy updates, and follow-up tools work together in one
              breeder-focused system.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {storySteps.map((step) => (
              <StoryCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
            One place for the work behind every litter
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
            A complete breeder business system.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#596860]">
            Keep dogs, litters, puppies, buyers, documents, payments, messages,
            and reminders organized without bouncing between separate tools.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="portal" className="bg-[#315744] py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#D9B76D]">
              Buyer Portal
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-6xl">
              A private portal for every buyer.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Give families a clear place to follow their puppy, review
              documents, track payments, receive updates, and prepare for
              go-home day.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <DarkBenefit
                icon={PawPrint}
                title="My Puppy"
                text="Puppy details, photos, milestones, updates, and go-home readiness."
              />
              <DarkBenefit
                icon={CreditCard}
                title="Payments"
                text="Deposits, balances, due dates, payment plans, and reminders."
              />
              <DarkBenefit
                icon={FileText}
                title="Documents"
                text="Contracts, health guarantees, signed forms, and buyer resources."
              />
              <DarkBenefit
                icon={Route}
                title="Transportation"
                text="Pickup windows, delivery details, mileage fees, and go-home instructions."
              />
            </div>
          </div>

          <BuyerPortalPreview />
        </div>
      </section>

      <section id="automation" className="relative overflow-hidden bg-[#F8F6EF] py-20">
        <div className="absolute left-[-10rem] top-16 h-96 w-96 rounded-full bg-[#E7D5A8]/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
              Breeder Automation Engine
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
              Follow-up that keeps moving.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#596860]">
              Send payment reminders, contract notices, waitlist follow-ups,
              puppy updates, go-home instructions, and triggered emails based on
              buyers, puppies, litters, documents, and payments.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {automationFeatures.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[#E3D8C5] bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F0E3] text-[#315744]">
                    <BellRing className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-black text-[#24342D]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <AutomationPreview />
        </div>
      </section>

      <section id="chichi" className="border-y border-[#E6DCCB] bg-[#EFEADE] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.95fr_1fr] lg:px-8">
          <ChiChiPreview />

          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
              Chi Chi Assistant
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
              Chi Chi helps keep the day moving.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#596860]">
              From document reminders to payment questions and puppy updates,
              Chi Chi helps breeders stay organized and gives buyers clearer
              next steps.
            </p>

            <div className="mt-8 grid gap-4">
              <LightBenefit
                icon={ClipboardSignature}
                title="Document help"
                text="Prepare buyer document packages, reminders, signing follow-up, and document status checks."
              />
              <LightBenefit
                icon={CreditCard}
                title="Payment clarity"
                text="Explain balances, upcoming payments, payment plan status, and overdue follow-up in buyer-friendly language."
              />
              <LightBenefit
                icon={CalendarCheck}
                title="Puppy journey guidance"
                text="Help buyers understand updates, pickup timing, go-home details, and next steps."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
            Flexible ways to start
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
            Start with the tools your program needs today.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#596860]">
            Use MyDogPortal as a complete breeder operating system, or begin
            with documents, websites, or buyer portal features and grow from there.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {entryPoints.map((entry) => (
            <EntryPointCard key={entry.title} {...entry} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#E6DCCB] bg-[#EFEADE] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
              Breeder Website Preview
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
              A polished breeder website connected to the rest of your business.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#596860]">
              Show available puppies, collect applications, explain your
              policies, and give buyers a professional first impression before
              they ever enter the portal.
            </p>
          </div>

          <WebsitePreview />
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#A67C2E]">
            Fair, honest pricing
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#17251F] md:text-6xl">
            Professional enough to matter. Affordable enough to start.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#596860]">
            Begin with a simple plan, then grow into the full operating system
            as your breeding program needs more structure.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#17251F] p-8 text-white shadow-2xl shadow-[#17251F]/20 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#D9B76D]">
                Built for modern breeder operations
              </p>
              <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.045em] md:text-6xl">
                Build a breeder experience that feels organized from the first click.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                From public website to buyer portal to signed documents and
                go-home preparation, MyDogPortal keeps the entire journey clear.
              </p>
            </div>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#315744] shadow-lg transition hover:bg-[#F2EBDD]"
            >
              Start Building
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E6DCCB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm text-[#596860] md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <MyDogPortalLogo small />
            <div>
              <p className="font-black text-[#315744]">MyDogPortal.Site</p>
              <p>DogBreederDocs.Online · DogBreederWeb.Site · Chi Chi Assistant</p>
            </div>
          </div>
          <p className="font-semibold">Breeder OS for modern dog breeding programs.</p>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 z-50 hidden items-center gap-3 rounded-full border border-[#D8CBB8] bg-white px-5 py-4 text-sm font-black text-[#315744] shadow-2xl shadow-[#315744]/20 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#315744] text-white">
          <Bot className="h-5 w-5" />
        </span>
        Ask Chi Chi
      </button>
    </main>
  );
}

function MyDogPortalLogo({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#315744] via-[#3E6B55] to-[#20372D] text-white shadow-lg shadow-[#315744]/20 ${
        small ? "h-10 w-10" : "h-12 w-12"
      }`}
      aria-label="MyDogPortal logo"
    >
      <PawPrint className={small ? "h-6 w-6" : "h-7 w-7"} />
      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D9B76D]">
        <Star className="h-2.5 w-2.5 fill-[#20372D] text-[#20372D]" />
      </span>
    </div>
  );
}

function HeroCommandCenter() {
  const taskItems = [
    "Deposit agreement ready",
    "Payment reminder due",
    "Puppy update scheduled",
    "Buyer portal invite pending",
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[3rem] bg-[#C9D9C4]/40 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#E3D8C5] bg-white p-4 shadow-2xl shadow-[#315744]/15">
        <div className="rounded-[1.5rem] bg-[#F8F6EF] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A67C2E]">
                Breeder Command Center
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#17251F]">
                Today’s Program
              </h3>
            </div>
            <div className="rounded-full bg-[#E7F0E3] px-3 py-1 text-xs font-black text-[#315744]">
              Live
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Active Dogs" value="14" />
            <MetricCard label="Litters" value="2" />
            <MetricCard label="Buyer Records" value="31" />
            <MetricCard label="Open Balances" value="$8,420" />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1fr]">
            <div className="rounded-3xl border border-[#E3D8C5] bg-white p-5 shadow-sm">
              <p className="mb-4 font-black text-[#17251F]">Work Needing Attention</p>
              {taskItems.map((item) => (
                <div
                  key={item}
                  className="mb-3 flex items-center gap-3 rounded-2xl bg-[#F4EFE4] p-3 text-sm font-bold text-[#45544C]"
                >
                  <BadgeCheck className="h-5 w-5 text-[#315744]" />
                  {item}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-[#E3D8C5] bg-[#315744] p-5 text-white shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black">Chi Chi</p>
                  <p className="text-xs text-white/65">Breeder assistant</p>
                </div>
              </div>
              <p className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/85">
                “Your buyer packet for Willow is almost ready. The deposit agreement
                is complete, the health guarantee is prepared, and one payment
                reminder is due tomorrow.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E3D8C5] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7B877E]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-[#17251F]">{value}</p>
    </div>
  );
}

function StoryCard({
  eyebrow,
  title,
  text,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  text: string;
  icon: typeof Globe2;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#DCCFBC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315744]/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#315744]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A67C2E]">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-black leading-7 text-[#17251F]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#596860]">{text}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof PawPrint;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#E3D8C5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315744]/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#315744]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black text-[#17251F]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#596860]">{text}</p>
    </div>
  );
}

function BuyerPortalPreview() {
  return (
    <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/10 backdrop-blur">
      <div className="rounded-[1.5rem] bg-[#F8F6EF] p-5 text-[#17251F]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A67C2E]">
              Buyer Portal
            </p>
            <h3 className="mt-1 text-2xl font-black">Welcome, Amanda</h3>
          </div>
          <div className="rounded-full bg-[#E7F0E3] px-3 py-1 text-xs font-black text-[#315744]">
            Puppy Reserved
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.85fr_1fr]">
          <div className="rounded-3xl border border-[#E3D8C5] bg-white p-5">
            <div className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E7F0E3] to-[#F2EBDD]">
              <PawPrint className="h-16 w-16 text-[#315744]/40" />
            </div>
            <p className="mt-4 text-xl font-black">Willow</p>
            <p className="text-sm text-[#596860]">Your reserved puppy</p>
          </div>

          <div className="grid gap-3">
            <PortalRow icon={CreditCard} title="Balance" text="$1,250 remaining" />
            <PortalRow icon={FileText} title="Documents" text="2 ready to sign" />
            <PortalRow icon={CalendarCheck} title="Go-home" text="Pickup window being prepared" />
            <PortalRow icon={MessageCircle} title="Updates" text="New weekly pupdate available" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalRow({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CreditCard;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E3D8C5] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F0E3] text-[#315744]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm text-[#596860]">{text}</p>
      </div>
    </div>
  );
}

function AutomationPreview() {
  const rows = [
    {
      title: "Payment Reminder",
      text: "Send 3 days before due date",
      status: "Scheduled",
    },
    {
      title: "Puppy Update",
      text: "Send every Friday at 10 AM",
      status: "Active",
    },
    {
      title: "Contract Notice",
      text: "Send when document is ready",
      status: "Ready",
    },
  ];

  return (
    <div className="rounded-[2rem] border border-[#E3D8C5] bg-white p-5 shadow-xl shadow-[#315744]/10">
      <div className="rounded-[1.5rem] bg-[#F8F6EF] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A67C2E]">
              Automation Engine
            </p>
            <h3 className="mt-1 text-2xl font-black text-[#17251F]">
              Follow-Up Workflows
            </h3>
          </div>
          <div className="rounded-full bg-[#E7F0E3] px-3 py-1 text-xs font-black text-[#315744]">
            6 Active
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.title}
              className="rounded-3xl border border-[#E3D8C5] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#315744]">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black text-[#17251F]">{row.title}</p>
                    <p className="mt-1 text-sm text-[#596860]">{row.text}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#F2EBDD] px-3 py-1 text-xs font-black text-[#8B744C]">
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl bg-[#315744] p-5 text-white">
          <div className="flex items-center gap-3">
            <WandSparkles className="h-5 w-5 text-[#D9B76D]" />
            <p className="font-black">Smart trigger suggestion</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/75">
            “Puppies turn 6 weeks old tomorrow. Prepare buyer update emails and
            attach the go-home preparation guide?”
          </p>
        </div>
      </div>
    </div>
  );
}

function ChiChiPreview() {
  return (
    <div className="rounded-[2rem] border border-[#DCCFBC] bg-white p-5 shadow-xl shadow-[#315744]/10">
      <div className="rounded-[1.5rem] bg-[#F8F6EF] p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315744] text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-black text-[#17251F]">Chi Chi</p>
            <p className="text-sm text-[#596860]">Breeder and buyer assistant</p>
          </div>
        </div>

        <ChatBubble sender="Chi Chi">
          Your buyer packet for Willow is almost ready. The deposit agreement is
          complete, the health guarantee is prepared, and one payment reminder is
          due tomorrow.
        </ChatBubble>

        <ChatBubble sender="Breeder">What still needs attention?</ChatBubble>

        <ChatBubble sender="Chi Chi">
          Two items: Amanda needs her portal invite, and the 6-week puppy update is
          ready to send.
        </ChatBubble>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["Prepare Docs", "Invite Buyer", "Send Pupdate"].map((action) => (
            <button
              key={action}
              className="rounded-2xl border border-[#D8CBB8] bg-white px-4 py-3 text-sm font-black text-[#315744]"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ sender, children }: { sender: string; children: ReactNode }) {
  const isChiChi = sender === "Chi Chi";

  return (
    <div className={`mb-4 flex ${isChiChi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[86%] rounded-3xl px-5 py-4 text-sm leading-6 ${
          isChiChi
            ? "bg-white text-[#46554D] shadow-sm"
            : "bg-[#315744] text-white"
        }`}
      >
        <p
          className={`mb-1 text-xs font-black ${
            isChiChi ? "text-[#315744]" : "text-white/70"
          }`}
        >
          {sender}
        </p>
        {children}
      </div>
    </div>
  );
}

function EntryPointCard({
  icon: Icon,
  title,
  domain,
  text,
}: {
  icon: typeof FileText;
  title: string;
  domain: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#E3D8C5] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315744]/10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#315744]">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-xl font-black text-[#17251F]">{title}</p>
      <p className="mt-2 text-sm font-black text-[#A67C2E]">{domain}</p>
      <p className="mt-4 text-sm leading-6 text-[#596860]">{text}</p>
    </div>
  );
}

function WebsitePreview() {
  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-[#DCCFBC] bg-white p-5 shadow-xl shadow-[#315744]/10">
      <div className="rounded-[1.5rem] bg-[#F8F6EF] p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-black text-[#17251F]">Evergreen Ridge Cavaliers</p>
            <p className="text-sm text-[#596860]">evergreenridge.dogbreederweb.site</p>
          </div>
          <button className="rounded-full bg-[#315744] px-5 py-3 text-sm font-black text-white">
            Apply for a Puppy
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-[#E3D8C5] bg-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#A67C2E]">
              Available Puppies
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {["Ruby", "Theo", "Willow"].map((name) => (
                <div
                  key={name}
                  className="overflow-hidden rounded-2xl border border-[#E3D8C5] bg-[#F8F6EF]"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#E7F0E3] to-[#F2EBDD]">
                    <PawPrint className="h-12 w-12 text-[#315744]/45" />
                  </div>
                  <div className="p-4">
                    <p className="font-black">{name}</p>
                    <p className="text-xs text-[#596860]">Available puppy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E3D8C5] bg-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#A67C2E]">
              Buyer Trust
            </p>
            <div className="mt-5 space-y-3">
              {[
                "Health guarantee included",
                "Application required",
                "Secure buyer portal",
                "Weekly puppy updates",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-[#F4EFE4] p-3 text-sm font-bold text-[#46554D]"
                >
                  <ShieldCheck className="h-5 w-5 text-[#315744]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkBenefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof PawPrint;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[#D9B76D]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
    </div>
  );
}

function LightBenefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ClipboardSignature;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-[#E3D8C5] bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F0E3] text-[#315744]">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-black text-[#17251F]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#596860]">{text}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-[2rem] border p-7 shadow-sm ${
        highlighted
          ? "border-[#315744] bg-[#315744] text-white shadow-2xl shadow-[#315744]/20"
          : "border-[#E3D8C5] bg-white text-[#17251F]"
      }`}
    >
      <p className={`text-lg font-black ${highlighted ? "text-white" : "text-[#315744]"}`}>
        {name}
      </p>
      <div className="mt-4 flex items-end gap-1">
        <span className="text-5xl font-black">{price}</span>
        <span
          className={`pb-2 text-sm font-bold ${
            highlighted ? "text-white/70" : "text-[#596860]"
          }`}
        >
          /mo
        </span>
      </div>
      <p
        className={`mt-4 min-h-20 text-sm leading-6 ${
          highlighted ? "text-white/75" : "text-[#596860]"
        }`}
      >
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <Check
              className={`h-5 w-5 ${
                highlighted ? "text-[#D9B76D]" : "text-[#315744]"
              }`}
            />
            <span className="text-sm font-bold">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-black transition ${
          highlighted
            ? "bg-white text-[#315744] hover:bg-[#F2EBDD]"
            : "bg-[#F2EBDD] text-[#315744] hover:bg-[#E7F0E3]"
        }`}
      >
        Choose {name}
      </button>
    </div>
  );
}