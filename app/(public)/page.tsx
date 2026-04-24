import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Check,
  ChevronRight,
  ClipboardSignature,
  CreditCard,
  FileText,
  Globe2,
  HeartHandshake,
  LayoutDashboard,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "mydogportal.site",
};

const modules = [
  {
    icon: LayoutDashboard,
    title: "Dog Breeder OS",
    text: "Manage dogs, litters, buyers, payments, documents, and daily breeder work from one calm dashboard.",
  },
  {
    icon: FileText,
    title: "Smart Documents",
    text: "Create breeder contracts, health guarantees, applications, deposits, and payment agreements.",
  },
  {
    icon: Globe2,
    title: "Breeder Websites",
    text: "Launch a professional breeder website with puppies, applications, policies, and buyer trust sections.",
  },
  {
    icon: Bot,
    title: "Chi Chi Assistant",
    text: "A friendly AI helper that guides breeders and buyers through documents, payments, puppy updates, and support.",
  },
];

const features = [
  "Puppy and litter tracking",
  "Buyer applications",
  "Payment plans and balances",
  "Document templates",
  "Buyer portal",
  "Website builder",
  "Transport coordination",
  "AI-powered Chi Chi helper",
];

const pricing = [
  {
    name: "Documents",
    price: "$29",
    description: "For breeders who only need contracts, forms, and professional buyer paperwork.",
    features: ["Smart document templates", "PDF export", "Buyer application forms", "Deposit agreements"],
  },
  {
    name: "Breeder OS",
    price: "$59",
    description: "For breeders who want one place to organize puppies, buyers, payments, and records.",
    features: ["Dog and litter records", "Buyer management", "Payment tracking", "Basic portal access"],
    highlighted: true,
  },
  {
    name: "Full System",
    price: "$99",
    description: "For breeders who want the complete portal, documents, website, payments, and Chi Chi.",
    features: ["Everything in Breeder OS", "Smart Documents", "Breeder website", "Chi Chi Assistant"],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      <header className="sticky top-0 z-40 border-b border-[#E5DED2] bg-[#F8F7F3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-sm">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">MyDogPortal</p>
              <p className="text-xs font-medium text-[#5B6B73]">Dog Breeder Web + Docs + Portal</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#5B6B73] md:flex">
            <a href="#features" className="hover:text-[#2F4F3E]">Features</a>
            <a href="#chichi" className="hover:text-[#2F4F3E]">Chi Chi</a>
            <a href="#pricing" className="hover:text-[#2F4F3E]">Pricing</a>
            <a href="#demo" className="hover:text-[#2F4F3E]">Demo</a>
          </nav>

          <a
            href="#pricing"
            className="rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#253F32]"
          >
            Start Your Portal
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-[#A8BFA3]/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:py-28">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-white/70 px-4 py-2 text-sm font-bold text-[#2F4F3E] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#C6A96B]" />
              Built for real dog breeders, not generic businesses
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-[#1F2933] md:text-7xl">
              Run your entire breeding program in one beautiful system.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6B73] md:text-xl">
              MyDogPortal helps breeders manage puppies, buyers, payments, contracts, websites, and buyer communication - with Chi Chi built in to guide the process.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#2F4F3E]/15 transition hover:bg-[#253F32]"
              >
                Build My Breeder Portal
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8CCB7] bg-white px-7 py-4 text-base font-bold text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6]"
              >
                View Demo
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {["Portal", "Docs", "Website"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#E5DED2] bg-white/80 p-4 shadow-sm">
                  <Check className="mb-2 h-5 w-5 text-[#2F4F3E]" />
                  <p className="text-sm font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="demo" className="relative z-10">
            <div className="rounded-[2rem] border border-[#E5DED2] bg-white p-4 shadow-2xl shadow-[#2F4F3E]/10">
              <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-[#2F4F3E]">Breeder Dashboard</p>
                    <p className="text-xs text-[#5B6B73]">Today&apos;s program overview</p>
                  </div>
                  <div className="rounded-full bg-[#E9F0E7] px-3 py-1 text-xs font-bold text-[#2F4F3E]">
                    Active
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DashboardCard icon={PawPrint} title="Available Puppies" value="6" />
                  <DashboardCard icon={Users} title="Active Buyers" value="14" />
                  <DashboardCard icon={CreditCard} title="Open Balances" value="$8,420" />
                  <DashboardCard icon={ClipboardSignature} title="Docs Pending" value="5" />
                </div>

                <div className="mt-4 rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black">Chi Chi Assistant</p>
                      <p className="text-xs text-[#5B6B73]">Ready to help with buyers, payments, and documents.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#F4EFE6] p-4 text-sm leading-6 text-[#44535A]">
                    &ldquo;Two buyers have unsigned deposit agreements. Would you like me to prepare reminders?&rdquo;
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {["Health Guarantee ready for Bella", "Payment reminder due tomorrow", "New application received"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#E5DED2] bg-white p-4 text-sm font-semibold text-[#44535A]">
                      <BadgeCheck className="h-5 w-5 text-[#C6A96B]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">One system, flexible entry points</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Start with what you need. Grow when you are ready.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            Some breeders only need documents. Some need the full operating system. Some want a website too. MyDogPortal keeps it all connected.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <div key={module.title} className="rounded-[1.75rem] border border-[#E5DED2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2F4F3E]/10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
                <module.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5B6B73]">{module.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F1EFE9] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Built for breeder work</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Everything a breeder needs to look organized, professional, and trustworthy.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              This is not a generic CRM with dog words added later. It is structured around real breeder workflows: puppies, buyers, deposits, contracts, updates, and go-home preparation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-[#E5DED2] bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E9F0E7]">
                  <Check className="h-5 w-5 text-[#2F4F3E]" />
                </div>
                <span className="font-bold text-[#2F3942]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chichi" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
            <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-black">Chi Chi</p>
                  <p className="text-sm text-[#5B6B73]">Your breeder assistant</p>
                </div>
              </div>

              <ChatBubble sender="Chi Chi">
                Hi! I can help prepare your buyer documents, explain payment balances, organize puppy updates, or guide a buyer through their portal.
              </ChatBubble>

              <ChatBubble sender="Breeder">
                Which buyers still need to sign their deposit agreement?
              </ChatBubble>

              <ChatBubble sender="Chi Chi">
                I found 3 unsigned deposit agreements. I can prepare reminders and attach the correct document package for each buyer.
              </ChatBubble>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Prepare Docs", "Check Payments", "Send Update"].map((action) => (
                  <button key={action} className="rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-bold text-[#2F4F3E]">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Chi Chi included</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              A friendly assistant built into the breeder and buyer experience.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              Chi Chi helps make the system feel alive - not just a dashboard. It can guide breeders through daily work and help buyers understand their puppy journey.
            </p>

            <div className="mt-7 grid gap-4">
              <Benefit icon={MessageCircle} title="Buyer-friendly support" text="Help buyers understand documents, payments, updates, and next steps." />
              <Benefit icon={ShieldCheck} title="Operational guardrails" text="Keep breeder workflows consistent with clear reminders and structured actions." />
              <Benefit icon={HeartHandshake} title="Warmer experience" text="Make the portal feel personal, helpful, and less intimidating." />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F1EFE9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Breeder website preview</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Give every breeder a polished public website.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              Breeders can use a subdomain like swvachihuahua.dogbreederweb.site or connect their own custom domain.
            </p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
            <div className="rounded-[1.5rem] bg-[#F8F7F3] p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-2xl font-black">Sunny Ridge Cavaliers</p>
                  <p className="text-sm text-[#5B6B73]">Professional breeder website powered by DogBreederWeb.Site</p>
                </div>
                <button className="rounded-full bg-[#2F4F3E] px-5 py-3 text-sm font-bold text-white">
                  Apply for a Puppy
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {["Ruby", "Willow", "Theo"].map((name) => (
                  <div key={name} className="overflow-hidden rounded-3xl border border-[#E5DED2] bg-white shadow-sm">
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#E9F0E7] to-[#F4EFE6]">
                      <PawPrint className="h-14 w-14 text-[#2F4F3E]/50" />
                    </div>
                    <div className="p-5">
                      <p className="text-lg font-black">{name}</p>
                      <p className="mt-1 text-sm text-[#5B6B73]">Available puppy listing</p>
                      <div className="mt-4 rounded-full bg-[#E9F0E7] px-3 py-1 text-center text-xs font-bold text-[#2F4F3E]">
                        View Details
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Fair monthly pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Start simple. Upgrade only when it makes sense.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-[2rem] border p-7 shadow-sm ${
                tier.highlighted
                  ? "border-[#2F4F3E] bg-[#2F4F3E] text-white shadow-xl shadow-[#2F4F3E]/20"
                  : "border-[#E5DED2] bg-white"
              }`}
            >
              <p className={`text-lg font-black ${tier.highlighted ? "text-white" : "text-[#2F4F3E]"}`}>
                {tier.name}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-black">{tier.price}</span>
                <span className={`pb-2 text-sm font-bold ${tier.highlighted ? "text-white/75" : "text-[#5B6B73]"}`}>
                  /mo
                </span>
              </div>
              <p className={`mt-4 min-h-20 text-sm leading-6 ${tier.highlighted ? "text-white/80" : "text-[#5B6B73]"}`}>
                {tier.description}
              </p>

              <div className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${tier.highlighted ? "text-[#C6A96B]" : "text-[#2F4F3E]"}`} />
                    <span className="text-sm font-bold">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-black transition ${
                  tier.highlighted
                    ? "bg-white text-[#2F4F3E] hover:bg-[#F4EFE6]"
                    : "bg-[#F4EFE6] text-[#2F4F3E] hover:bg-[#E9F0E7]"
                }`}
              >
                Choose {tier.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#2F4F3E] p-8 text-white shadow-2xl shadow-[#2F4F3E]/20 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Ready when you are</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                Build the breeder platform your customers can trust.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                Start with documents, launch the full Dog Breeder OS, or connect a website. It all grows from the same system.
              </p>
            </div>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#2F4F3E] shadow-lg transition hover:bg-[#F4EFE6]"
            >
              Start Building
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5DED2] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-sm text-[#5B6B73] md:flex-row">
          <p className="font-bold text-[#2F4F3E]">MyDogPortal.Site</p>
          <p>DogBreederDocs.Online · DogBreederWeb.Site · Chi Chi Assistant</p>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50 hidden md:block">
        <button className="flex items-center gap-3 rounded-full border border-[#D8CCB7] bg-white px-5 py-4 text-sm font-black text-[#2F4F3E] shadow-2xl shadow-[#2F4F3E]/15">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F4F3E] text-white">
            <Bot className="h-5 w-5" />
          </span>
          Ask Chi Chi
        </button>
      </div>
    </main>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof PawPrint;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#5B6B73]">{title}</p>
    </div>
  );
}

function ChatBubble({
  sender,
  children,
}: {
  sender: string;
  children: ReactNode;
}) {
  const isChiChi = sender === "Chi Chi";

  return (
    <div className={`mb-4 flex ${isChiChi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-6 ${
          isChiChi
            ? "bg-white text-[#44535A] shadow-sm"
            : "bg-[#2F4F3E] text-white"
        }`}
      >
        <p className={`mb-1 text-xs font-black ${isChiChi ? "text-[#2F4F3E]" : "text-white/75"}`}>
          {sender}
        </p>
        {children}
      </div>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageCircle;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#5B6B73]">{text}</p>
      </div>
    </div>
  );
}
