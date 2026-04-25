"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
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
  Star,
  Zap,
  Lock,
  TrendingUp,
  Settings,
  UserCircle,
  Send,
  X,
  Minimize2,
  PlayCircle,
} from "lucide-react";

const ASSISTANT_NAME = "BreederBuddy AI";

const modules = [
  {
    icon: LayoutDashboard,
    title: "Dog Breeder OS",
    text: "Manage dogs, litters, buyers, payments, documents, and daily breeder work from one calm dashboard.",
    accent: "#2F4F3E",
    badge: "Core",
  },
  {
    icon: FileText,
    title: "Smart Documents",
    text: "Create breeder contracts, health guarantees, applications, deposits, and payment agreements.",
    accent: "#5A7A6A",
    badge: "Legal",
  },
  {
    icon: Globe2,
    title: "Breeder Website",
    text: "Present your program professionally with puppies, applications, policies, trust sections, and buyer-ready next steps.",
    accent: "#7A9A8A",
    badge: "Web",
  },
  {
    icon: Bot,
    title: ASSISTANT_NAME,
    text: "A friendly AI helper that guides breeders and buyers through documents, payments, puppy updates, and support.",
    accent: "#C6A96B",
    badge: "AI",
  },
];

const features = [
  "Puppy and litter tracking",
  "Buyer applications",
  "Payment plans and balances",
  "Document templates",
  "Buyer portal",
  "Website tools",
  "Transport coordination",
  `${ASSISTANT_NAME} support`,
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
    description: "For breeders who want the complete portal, documents, website, payments, and AI assistant.",
    features: ["Everything in Breeder OS", "Smart Documents", "Breeder website", `${ASSISTANT_NAME}`],
  },
];

const stats = [
  { value: "2,400+", label: "Active Breeders" },
  { value: "$12M+", label: "Payments Tracked" },
  { value: "48,000+", label: "Puppies Placed" },
  { value: "4.9★", label: "Avg. Rating" },
];

const testimonials = [
  {
    quote: "Before MyDogPortal I was juggling three spreadsheets, a notes app, and a folder of PDFs. Now everything lives in one system.",
    name: "Sarah M.",
    role: "Golden Retriever Breeder · Tennessee",
    initials: "SM",
  },
  {
    quote: `${ASSISTANT_NAME} caught two unsigned contracts I forgot about. It pays for itself the first time it saves you a deal.`,
    name: "James R.",
    role: "French Bulldog Breeder · Texas",
    initials: "JR",
  },
  {
    quote: "My buyer portal looks more professional than breeders charging three times what I charge. It builds so much trust.",
    name: "Priya L.",
    role: "Cavalier Breeder · California",
    initials: "PL",
  },
];

const previewPuppies = [
  {
    name: "Ruby",
    status: "Available",
    image: "https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=1000&q=85",
    breed: "Cavalier King Charles Spaniel",
    weight: "4.2 lbs",
    dob: "March 2024",
    color: "#E9F0E7",
    textColor: "#2F4F3E",
  },
  {
    name: "Willow",
    status: "Reserved",
    image: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?auto=format&fit=crop&w=1000&q=85",
    breed: "Cavalier King Charles Spaniel",
    weight: "5.1 lbs",
    dob: "March 2024",
    color: "#FEF3CD",
    textColor: "#8B6914",
  },
  {
    name: "Theo",
    status: "Available",
    image: "https://images.unsplash.com/photo-1593134257782-e89567b7718a?auto=format&fit=crop&w=1000&q=85",
    breed: "Cavalier King Charles Spaniel",
    weight: "4.8 lbs",
    dob: "April 2024",
    color: "#E9F0E7",
    textColor: "#2F4F3E",
  },
];

const initialMessages = [
  {
    role: "assistant",
    text: "Hi! I’m BreederBuddy AI. I can help with buyer documents, payment balances, puppy updates, website setup, and daily breeder workflow.",
  },
  {
    role: "assistant",
    text: "Try asking: “Which buyers still need documents?” or “Help me prepare a payment reminder.”",
  },
];

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  function sendMessage() {
    const clean = chatInput.trim();

    if (!clean) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: clean },
      {
        role: "assistant",
        text: "I can help with that. In the live system, this chat window should connect to your AI route so it can read the breeder workspace, buyer records, document status, payment balances, and portal activity.",
      },
    ]);

    setChatInput("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F7F3] text-[#1F2933]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300;1,9..144,600&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-4px) rotate(-0.5deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #2F4F3E 0%, #C6A96B 40%, #2F4F3E 60%, #2F4F3E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-hover {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 24px 48px rgba(47, 79, 62, 0.14);
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(198,169,107,0.12);
          border: 1px solid rgba(198,169,107,0.3);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #A07A35;
        }

        .feature-number {
          font-family: 'Fraunces', serif;
          font-size: 5rem;
          font-weight: 800;
          line-height: 1;
          color: rgba(47,79,62,0.07);
          position: absolute;
          top: -10px;
          right: 16px;
          pointer-events: none;
          user-select: none;
        }

        .testimonial-card::before {
          content: '\\201C';
          font-family: 'Fraunces', serif;
          font-size: 7rem;
          line-height: 1;
          color: rgba(198,169,107,0.18);
          position: absolute;
          top: -8px;
          left: 16px;
          pointer-events: none;
        }

        .hero-blob {
          position: absolute;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#E5DED2] bg-[#F8F7F3]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
              <PawPrint className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 rounded-full border-2 border-[#F8F7F3] bg-[#C6A96B] px-1.5 py-0.5 text-[9px] font-black text-white">
                OS
              </span>
            </div>
            <div>
              <p className="font-display text-xl font-black tracking-tight text-[#2F4F3E]">MyDogPortal</p>
              <p className="text-xs font-bold text-[#5B6B73]">Dog Breeder Web · Docs · Portal</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[#5B6B73] lg:flex">
            <a href="#features" className="transition hover:text-[#2F4F3E]">Features</a>
            <a href="#assistant" className="transition hover:text-[#2F4F3E]">{ASSISTANT_NAME}</a>
            <a href="#website" className="transition hover:text-[#2F4F3E]">Website</a>
            <a href="#pricing" className="transition hover:text-[#2F4F3E]">Pricing</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/settings"
              aria-label="Settings"
              className="hidden items-center gap-2 rounded-full border border-[#D8CCB7] bg-white px-3.5 py-2.5 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6] sm:inline-flex"
            >
              <Settings className="h-4 w-4" />
              Settings
            </a>

            <a
              href="/profile"
              aria-label="Profile"
              className="hidden items-center gap-2 rounded-full border border-[#D8CCB7] bg-white px-3.5 py-2.5 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6] sm:inline-flex"
            >
              <UserCircle className="h-4 w-4" />
              Profile
            </a>

            <a
              href="/login"
              className="rounded-full border border-[#D8CCB7] bg-white px-5 py-2.5 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6]"
            >
              Login
            </a>

            <a
              href="#pricing"
              className="rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#253F32] hover:shadow-md"
            >
              Start Your Trial
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="hero-blob absolute left-[-10%] top-[-5%] h-[500px] w-[500px] bg-[#A8BFA3]/20" />
        <div className="hero-blob absolute right-[-5%] top-[30%] h-[350px] w-[350px] bg-[#C6A96B]/10" />
        <div className="hero-blob absolute bottom-[-10%] left-[30%] h-[280px] w-[280px] bg-[#2F4F3E]/10" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-white/80 px-4 py-2 text-sm font-black text-[#2F4F3E] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#C6A96B]" />
              Built for real dog breeders, not generic businesses
            </div>

            <h1 className="font-display max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-[#1F2933] md:text-7xl">
              Run your entire <em className="not-italic shimmer-text">breeding program</em> in one beautiful system.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6B73] md:text-xl">
              MyDogPortal helps breeders manage puppies, buyers, payments, contracts, websites, and buyer communication — with {ASSISTANT_NAME} built in to guide the process.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-7 py-4 text-base font-black text-white shadow-lg shadow-[#2F4F3E]/20 transition hover:-translate-y-0.5 hover:bg-[#253F32]"
              >
                Start Your 14-Day Trial
                <ArrowRight className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8CCB7] bg-white px-7 py-4 text-base font-black text-[#2F4F3E] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F4EFE6]"
              >
                See How It Works
                <PlayCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                { label: "Portal", sub: "Buyer & Breeder" },
                { label: "Docs", sub: "Contracts & Forms" },
                { label: "Website", sub: "Customer Facing" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#E5DED2] bg-white/80 p-4 shadow-sm card-hover">
                  <Check className="mb-2 h-5 w-5 text-[#2F4F3E]" />
                  <p className="text-sm font-black">{item.label}</p>
                  <p className="mt-0.5 text-xs text-[#5B6B73]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="demo" className="relative z-10 animate-float">
            <div className="absolute inset-0 scale-95 rounded-[2rem] bg-[#2F4F3E]/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-[#E5DED2] bg-white p-4 shadow-2xl shadow-[#2F4F3E]/15">
              <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-black text-[#2F4F3E]">Breeder Dashboard</p>
                    <p className="text-xs text-[#5B6B73]">Today&apos;s program overview</p>
                  </div>
                  <div className="rounded-full bg-[#E9F0E7] px-3 py-1 text-xs font-black text-[#2F4F3E]">Live</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DashboardCard icon={PawPrint} title="Available Puppies" value="6" trend="+2 this week" />
                  <DashboardCard icon={Users} title="Active Buyers" value="14" trend="3 awaiting docs" />
                  <DashboardCard icon={CreditCard} title="Open Balances" value="$8,420" trend="2 due this week" />
                  <DashboardCard icon={ClipboardSignature} title="Docs Pending" value="5" trend="2 unsigned" />
                </div>

                <div className="mt-4 rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white">
                      <Bot className="h-5 w-5" />
                      <span className="absolute -right-1 -top-1 h-3 rounded-full border-2 border-white bg-[#C6A96B]" />
                    </div>
                    <div>
                      <p className="text-sm font-black">{ASSISTANT_NAME}</p>
                      <p className="text-xs text-[#5B6B73]">Ready to help with buyers, payments, and documents.</p>
                    </div>
                    <div className="ml-auto rounded-full bg-[#E9F0E7] px-2 py-0.5 text-xs font-black text-[#2F4F3E]">AI</div>
                  </div>

                  <div className="rounded-2xl border border-[#E5DED2]/50 bg-gradient-to-br from-[#F4EFE6] to-[#EDE8DE] p-4 text-sm leading-6 text-[#44535A]">
                    “Two buyers have unsigned deposit agreements. Would you like me to prepare reminders?”
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-[#2F4F3E] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[#253F32]">
                      Yes, prepare
                    </button>
                    <button className="rounded-full border border-[#D8CCB7] bg-white px-3 py-1.5 text-xs font-black text-[#5B6B73] transition hover:bg-[#F4EFE6]">
                      Later
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {["Health Guarantee ready for Bella", "Payment reminder due tomorrow", "New application received"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#E5DED2] bg-white p-4 text-sm font-bold text-[#44535A] transition hover:shadow-sm">
                      <BadgeCheck className="h-5 w-5 shrink-0 text-[#C6A96B]" />
                      {item}
                      <ChevronRight className="ml-auto h-4 w-4 text-[#C6A96B]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5DED2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#E5DED2] bg-[#F8F7F3] p-5 text-center">
                <p className="font-display text-3xl font-black text-[#2F4F3E] md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-[#5B6B73]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="section-label mx-auto mb-5">One system, flexible entry points</div>
          <h2 className="font-display mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Start with what you need. <span className="text-[#2F4F3E]">Grow when you&apos;re ready.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            Documents, portals, websites, buyers, payments, puppy updates, and daily breeder operations stay connected.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, i) => (
            <div key={module.title} className="relative overflow-hidden rounded-[1.75rem] border border-[#E5DED2] bg-white p-6 shadow-sm card-hover">
              <span className="feature-number">{String(i + 1).padStart(2, "0")}</span>

              <div className="mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-black" style={{ background: `${module.accent}18`, color: module.accent }}>
                {module.badge}
              </div>

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm" style={{ background: module.accent }}>
                <module.icon className="h-6 w-6" />
              </div>

              <h3 className="font-display text-lg font-black">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5B6B73]">{module.text}</p>

              <div className="mt-4 flex items-center gap-1 text-xs font-black" style={{ color: module.accent }}>
                Learn more <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#2F4F3E] py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-10 top-10 rotate-12">
            <PawPrint className="h-40 w-40 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 -rotate-12">
            <PawPrint className="h-56 w-56 text-white" />
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <div className="section-label mb-5" style={{ background: "rgba(198,169,107,0.2)", borderColor: "rgba(198,169,107,0.4)", color: "#C6A96B" }}>
              Built for breeder work
            </div>

            <h2 className="font-display mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Everything a breeder needs to look organized, professional, and trustworthy.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/70">
              This is structured around real breeder workflows: puppies, buyers, deposits, contracts, updates, and go-home preparation.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Fast Setup" },
                { icon: Lock, label: "Secure" },
                { icon: TrendingUp, label: "Scalable" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
                  <item.icon className="h-5 w-5 text-[#C6A96B]" />
                  <span className="text-xs font-black text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6A96B]/20">
                  <Check className="h-5 w-5 text-[#C6A96B]" />
                </div>
                <span className="font-black text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="assistant" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#2F4F3E]/10 to-[#C6A96B]/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
              <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
                      <Bot className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C6A96B]" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-black">{ASSISTANT_NAME}</p>
                      <p className="text-sm text-[#5B6B73]">Your dog breeder assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#E9F0E7] px-3 py-1.5 text-xs font-black text-[#2F4F3E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
                    Online
                  </div>
                </div>

                <ChatBubble sender={ASSISTANT_NAME}>
                  Hi! I can help prepare buyer documents, explain payment balances, organize puppy updates, or guide a buyer through their portal.
                </ChatBubble>

                <ChatBubble sender="Breeder">
                  Which buyers still need to sign their deposit agreement?
                </ChatBubble>

                <ChatBubble sender={ASSISTANT_NAME}>
                  I found 3 unsigned deposit agreements. I can prepare reminders and attach the correct document package for each buyer.
                </ChatBubble>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Prepare Docs", "Check Payments", "Send Update"].map((action) => (
                    <button key={action} className="rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-black text-[#2F4F3E] transition hover:border-[#2F4F3E]/30 hover:bg-[#F4EFE6]">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-label mb-5">{ASSISTANT_NAME} included</div>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight md:text-5xl">
              A friendly assistant built into the breeder <span className="text-[#2F4F3E]">and buyer experience.</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              {ASSISTANT_NAME} makes the system feel alive — not just like a dashboard. It can guide breeders through daily work and help buyers understand their puppy journey.
            </p>

            <div className="mt-7 grid gap-4">
              <Benefit icon={MessageCircle} title="Buyer-friendly support" text="Help buyers understand documents, payments, updates, and next steps." />
              <Benefit icon={ShieldCheck} title="Operational guardrails" text="Keep breeder workflows consistent with clear reminders and structured actions." />
              <Benefit icon={HeartHandshake} title="Warmer experience" text="Make the portal feel personal, helpful, and less intimidating." />
            </div>
          </div>
        </div>
      </section>

      <section id="website" className="bg-[#F1EFE9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Customer-facing website</div>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight md:text-5xl">
              A polished breeder website that feels professional from the first click.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              Present available puppies, application steps, breeder policies, buyer trust details, and portal access in one clean, organized experience.
            </p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
            <div className="rounded-[1.5rem] bg-[#F8F7F3] p-6">
              <div className="mb-6 flex items-center justify-between border-b border-[#E5DED2] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F4F3E] text-white">
                    <PawPrint className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-black text-[#1F2933]">Sunny Ridge Cavaliers</p>
                    <p className="text-xs text-[#5B6B73]">Health-tested · AKC Registered · Est. 2016</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <nav className="hidden gap-5 text-sm font-bold text-[#5B6B73] md:flex">
                    <span>Puppies</span>
                    <span>About</span>
                    <span>Gallery</span>
                  </nav>
                  <button className="rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-black text-white shadow-sm">
                    Apply for a Puppy
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {previewPuppies.map((puppy) => (
                  <div key={puppy.name} className="overflow-hidden rounded-3xl border border-[#E5DED2] bg-white shadow-sm card-hover">
                    <div className="relative h-44 overflow-hidden bg-[#E9F0E7]">
                      <img
                        src={puppy.image}
                        alt={`${puppy.name} the ${puppy.breed}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black shadow-sm" style={{ background: puppy.color, color: puppy.textColor }}>
                        {puppy.status}
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="font-display text-xl font-black">{puppy.name}</p>
                      <p className="mt-0.5 text-sm text-[#5B6B73]">{puppy.breed}</p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-[#F8F7F3] px-3 py-2">
                          <p className="text-xs text-[#5B6B73]">Weight</p>
                          <p className="text-sm font-black">{puppy.weight}</p>
                        </div>
                        <div className="rounded-lg bg-[#F8F7F3] px-3 py-2">
                          <p className="text-xs text-[#5B6B73]">Born</p>
                          <p className="text-sm font-black">{puppy.dob}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-full bg-[#2F4F3E] px-3 py-2 text-center text-xs font-black text-white">
                        View Details
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-[#E5DED2] pt-5">
                {["Health Tested Parents", "AKC Registered", "Lifetime Support", "Buyer Portal Access"].map((trust) => (
                  <div key={trust} className="flex items-center gap-2 text-xs font-black text-[#5B6B73]">
                    <Check className="h-3.5 w-3.5 text-[#2F4F3E]" /> {trust}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-label mx-auto mb-5">Breeder stories</div>
          <h2 className="font-display mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Breeders who switched never went back.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card relative rounded-[2rem] border border-[#E5DED2] bg-white p-7 shadow-sm card-hover">
              <div className="mb-5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C6A96B] text-[#C6A96B]" />
                ))}
              </div>

              <p className="relative z-10 leading-7 text-[#44535A]">“{t.quote}”</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F4F3E] text-xs font-black text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-black">{t.name}</p>
                  <p className="text-xs text-[#5B6B73]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-[#F1EFE9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Fair monthly pricing</div>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Start simple. Upgrade only when it makes sense.
            </h2>
            <p className="mt-4 text-[#5B6B73]">No contracts. Cancel anytime. All plans include onboarding support.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-[2rem] border p-7 transition hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-transparent bg-[#2F4F3E] text-white shadow-xl shadow-[#2F4F3E]/25"
                    : "border-[#E5DED2] bg-white shadow-sm"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C6A96B] px-4 py-1.5 text-xs font-black text-white shadow-md">
                    ★ Most Popular
                  </div>
                )}

                <p className={`font-display text-lg font-black ${tier.highlighted ? "text-white" : "text-[#2F4F3E]"}`}>{tier.name}</p>

                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-5xl font-black">{tier.price}</span>
                  <span className={`pb-2 text-sm font-black ${tier.highlighted ? "text-white/75" : "text-[#5B6B73]"}`}>/mo</span>
                </div>

                <p className={`mt-4 min-h-20 text-sm leading-6 ${tier.highlighted ? "text-white/80" : "text-[#5B6B73]"}`}>
                  {tier.description}
                </p>

                <div className={`my-6 h-px ${tier.highlighted ? "bg-white/15" : "bg-[#E5DED2]"}`} />

                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${tier.highlighted ? "bg-[#C6A96B]/30" : "bg-[#E9F0E7]"}`}>
                        <Check className={`h-3 w-3 ${tier.highlighted ? "text-[#C6A96B]" : "text-[#2F4F3E]"}`} />
                      </div>
                      <span className="text-sm font-black">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-black transition ${
                    tier.highlighted ? "bg-white text-[#2F4F3E] shadow-lg hover:bg-[#F4EFE6]" : "bg-[#F4EFE6] text-[#2F4F3E] hover:bg-[#E9F0E7]"
                  }`}
                >
                  Choose {tier.name}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-[#5B6B73]">
            All plans include a 14-day free trial · No credit card required to start
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#2F4F3E] p-8 text-white shadow-2xl shadow-[#2F4F3E]/25 md:p-12">
          <div className="absolute right-[-40px] top-[-40px] rotate-12 opacity-10">
            <PawPrint className="h-64 w-64 text-white" />
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6A96B]/40 bg-[#C6A96B]/15 px-4 py-2 text-sm font-black text-[#C6A96B]">
                <Sparkles className="h-4 w-4" />
                Ready when you are
              </div>

              <h2 className="font-display max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                Build the breeder platform your customers can trust.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                Start with documents, launch the full Dog Breeder OS, or connect a website. It all grows from the same system.
              </p>
            </div>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#2F4F3E] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#F4EFE6]"
            >
              Start Your Trial
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5DED2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F4F3E] text-white">
                  <PawPrint className="h-5 w-5" />
                </div>
                <p className="font-display text-lg font-black text-[#2F4F3E]">MyDogPortal.Site</p>
              </div>
              <p className="max-w-xs text-sm text-[#5B6B73]">The complete operating system for professional dog breeders.</p>
            </div>

            <div className="flex flex-wrap gap-10 text-sm">
              <FooterColumn title="Platform" items={["Breeder OS", "Smart Documents", "Breeder Websites", ASSISTANT_NAME]} />
              <FooterColumn title="Company" items={["About", "Blog", "Support", "Privacy"]} />
              <FooterColumn title="Products" items={["DogBreederDocs.Online", "DogBreederWeb.Site", ASSISTANT_NAME]} />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#E5DED2] pt-6">
            <p className="text-xs text-[#5B6B73]">© 2026 MyDogPortal.Site · All rights reserved</p>
            <p className="text-xs text-[#5B6B73]">Made for breeders, by breeders</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50">
        {chatOpen && (
          <div className="mb-4 w-[calc(100vw-2.5rem)] overflow-hidden rounded-[1.75rem] border border-[#D8CCB7] bg-white shadow-2xl shadow-[#2F4F3E]/25 sm:w-[410px]">
            <div className="flex items-center justify-between bg-[#2F4F3E] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#2F4F3E] bg-[#C6A96B]" />
                </div>
                <div>
                  <p className="font-display text-base font-black">{ASSISTANT_NAME}</p>
                  <p className="text-xs font-bold text-white/70">Dog Breeder Assistant AI</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[430px] space-y-3 overflow-y-auto bg-[#F8F7F3] p-4">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div key={`${message.role}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "bg-[#2F4F3E] text-white"
                          : "border border-[#E5DED2] bg-white text-[#44535A] shadow-sm"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#E5DED2] bg-white p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[#D8CCB7] bg-[#F8F7F3] px-3 py-2">
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder="Ask about documents, buyers, puppies..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1F2933] outline-none placeholder:text-[#7A8790]"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F4F3E] text-white transition hover:bg-[#253F32]"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 px-1 text-[11px] font-medium leading-4 text-[#7A8790]">
                Front-end chat is active. Connect this to your AI API route for real account-aware responses.
              </p>
            </div>
          </div>
        )}

        {!chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="relative flex items-center gap-3 rounded-full border border-[#D8CCB7] bg-white px-5 py-4 text-sm font-black text-[#2F4F3E] shadow-2xl shadow-[#2F4F3E]/20 transition-all hover:-translate-y-0.5 hover:shadow-[#2F4F3E]/30"
          >
            <span className="absolute inset-0 rounded-full bg-[#2F4F3E]/10 blur-lg" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#2F4F3E] text-white">
              <Bot className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#C6A96B]" />
            </span>
            <span className="relative">Ask {ASSISTANT_NAME}</span>
          </button>
        )}
      </div>
    </main>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  value,
  trend,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display text-2xl font-black">{value}</p>
      <p className="mt-0.5 text-xs font-black text-[#5B6B73]">{title}</p>
      {trend && <p className="mt-1 text-xs font-bold text-[#C6A96B]">{trend}</p>}
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
  const isAssistant = sender === ASSISTANT_NAME;

  return (
    <div className={`mb-4 flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-6 ${
          isAssistant
            ? "border border-[#E5DED2]/60 bg-white text-[#44535A] shadow-sm"
            : "bg-[#2F4F3E] text-white"
        }`}
      >
        <p className={`mb-1 text-xs font-black ${isAssistant ? "text-[#2F4F3E]" : "text-white/75"}`}>
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
    <div className="flex gap-4 rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm card-hover">
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

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-3 font-black text-[#1F2933]">{title}</p>
      <div className="space-y-2 text-[#5B6B73]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
