import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  Check,
  ClipboardSignature,
  CreditCard,
  FileText,
  Globe2,
  HeartHandshake,
  LayoutDashboard,
  MessageCircle,
  PawPrint,
  ShieldCheck,
  Users,
} from "lucide-react";

export const modules: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
  badge: string;
}> = [
  {
    icon: LayoutDashboard,
    title: "Breeder Operating System",
    text: "Manage your dogs, litters, puppies, buyers, payments, documents, and daily work from one breeder-native workspace.",
    accent: "#2F4F3E",
    badge: "Core",
  },
  {
    icon: FileText,
    title: "Document Management",
    text: "Track contracts, health guarantees, applications, deposits, and buyer paperwork inside the buyer record.",
    accent: "#5A7A6A",
    badge: "Records",
  },
  {
    icon: Globe2,
    title: "Breeder Website Builder",
    text: "Create breeder website content and prepare public puppy, application, policy, and trust sections from the same system.",
    accent: "#7A9A8A",
    badge: "Web",
  },
  {
    icon: Bot,
    title: "Chi Chi Assistant",
    text: "Use built-in assistance for breeder documents, payment review, puppy updates, and buyer communication workflows.",
    accent: "#C6A96B",
    badge: "AI",
  },
];

export const featureChecklist = [
  "Dog, puppy, and litter tracking",
  "Buyer applications",
  "Payment plans and balances",
  "Document records",
  "Buyer portal",
  "Website builder workspace",
  "Transport coordination",
  "Chi Chi assistance",
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "$29",
    description: "For breeders who need the core operating system: dashboard, dogs, breeding program, litters, puppies, settings, and billing.",
    features: ["Dashboard", "Dog records", "Breeding program", "Litters and puppies"],
    href: "/sign-up?plan=starter",
  },
  {
    name: "Professional",
    price: "$59",
    description: "For active breeders who need buyer operations, applications, payments, documents, transportation, and automation.",
    features: ["Everything in Starter", "Buyers and applications", "Payments and documents", "Transportation and automation"],
    highlighted: true,
    href: "/sign-up?plan=pro",
  },
  {
    name: "Premium",
    price: "$99",
    description: "For breeders who want advanced AI-assisted workflows, document generation, website builder access, and higher capacity.",
    features: ["Everything in Professional", "AI document workspace", "Website builder", "Advanced Chi Chi tools"],
    href: "/sign-up?plan=elite",
  },
];

export function FeatureModulesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">One system, flexible entry points</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Start with the core operating system. Upgrade as your program grows.
        </h2>
        <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
          MyDogPortal is organized around the real breeder lifecycle: dogs, breedings, litters, puppies, buyers, payments, documents, transportation, and buyer portal work.
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
  );
}

export function FeaturesChecklistSection() {
  return (
    <section className="bg-[#F1EFE9] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Built for daily work</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Everything you need to look organized, professional, and trustworthy.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            This is not a generic CRM with dog words added later. It is structured around the work breeders manage every day: puppies, buyers, deposits, contracts, updates, and go-home preparation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featureChecklist.map((feature) => (
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
  );
}

export function ChiChiSection() {
  return (
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
                <p className="text-sm text-[#5B6B73]">Your program assistant</p>
              </div>
            </div>

            <ChatBubble sender="Chi Chi">
              Hi! I can help review buyer documents, explain payment balances, organize puppy updates, or guide a buyer through their portal.
            </ChatBubble>

            <ChatBubble sender="You">
              Which buyers still need to sign their deposit agreement?
            </ChatBubble>

            <ChatBubble sender="Chi Chi">
              I found 3 unsigned deposit agreements in the document workspace. I can help you prepare the right follow-up for each buyer.
            </ChatBubble>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Review Docs", "Check Payments", "Prepare Update"].map((action) => (
                <button key={action} className="rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-bold text-[#2F4F3E]">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Chi Chi assistant</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            A workflow assistant for breeder operations and buyer experience.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            Chi Chi supports the work already inside MyDogPortal: buyer records, documents, payments, puppy updates, and portal guidance.
          </p>

          <div className="mt-7 grid gap-4">
            <Benefit icon={MessageCircle} title="Buyer-friendly support" text="Help buyers understand documents, payments, updates, and next steps." />
            <Benefit icon={ShieldCheck} title="Operational guardrails" text="Keep your workflow consistent with clear reminders and structured actions." />
            <Benefit icon={HeartHandshake} title="Warmer experience" text="Make the portal feel personal, helpful, and less intimidating." />
          </div>
        </div>
      </div>
    </section>
  );
}

export function DemoSection() {
  return (
    <section className="bg-[#F1EFE9] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Website preview</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            See how your public website can look.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            Use the website builder workspace to prepare breeder site copy, puppy sections, policy content, and buyer application entry points.
          </p>
        </div>

        <div id="demo" className="mt-12 rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
          <div className="rounded-[1.5rem] bg-[#F8F7F3] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-2xl font-black">Sunny Ridge Cavaliers</p>
                <p className="text-sm text-[#5B6B73]">A breeder website preview powered by MyDogPortal</p>
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
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Fair monthly pricing</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Start simple. Upgrade only when it makes sense.
        </h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <a
            key={tier.name}
            href={tier.href}
            aria-label={`Choose ${tier.name}`}
            className={`group block rounded-[2rem] border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
              tier.highlighted
                ? "border-[#2F4F3E] bg-[#2F4F3E] text-white shadow-xl shadow-[#2F4F3E]/20 hover:shadow-[#2F4F3E]/30"
                : "border-[#E5DED2] bg-white hover:shadow-[#2F4F3E]/10"
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

            <span
              className={`mt-8 block w-full rounded-2xl px-5 py-4 text-center text-sm font-black transition ${
                tier.highlighted
                  ? "bg-white text-[#2F4F3E] group-hover:bg-[#F4EFE6]"
                  : "bg-[#F4EFE6] text-[#2F4F3E] group-hover:bg-[#E9F0E7]"
              }`}
            >
              Choose {tier.name}
            </span>
          </a>
        ))}
      </div>
    </section>
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
  icon: LucideIcon;
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

export function DemoCard() {
  return (
    <div id="demo" className="demo-float relative z-10">
      <div className="rounded-[2rem] border border-[#E5DED2] bg-white p-4 shadow-2xl shadow-[#2F4F3E]/10">
        <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-[#2F4F3E]">Program Dashboard</p>
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
              &ldquo;Two buyers have unsigned deposit agreements. Would you like help preparing reminders?&rdquo;
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
  );
}

function DashboardCard({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
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
