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
  Star,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "mydogportal.site",
};

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
    title: "Breeder Websites",
    text: "Launch a professional breeder website with puppies, applications, policies, and buyer trust sections.",
    accent: "#7A9A8A",
    badge: "Web",
  },
  {
    icon: Bot,
    title: "Chi Chi Assistant",
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
    quote: "Chi Chi actually caught two unsigned contracts I forgot about. It pays for itself the first time it saves you a deal.",
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#1F2933] overflow-x-hidden">

      {/* ── Global styles injected via a style tag ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,800;1,9..144,300;1,9..144,600&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        body { font-family: 'DM Sans', sans-serif; }

        .font-display { font-family: 'Fraunces', serif; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes badge-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite 2s; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }

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

        .pricing-card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .pricing-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(47, 79, 62, 0.12);
        }

        .stat-card {
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(198,169,107,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }

        .paw-bg {
          position: absolute;
          opacity: 0.035;
          pointer-events: none;
        }

        .divider-wave {
          width: 100%;
          overflow: hidden;
          line-height: 0;
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

        .badge-ai {
          animation: badge-bounce 3s ease-in-out infinite;
        }

        .testimonial-card {
          position: relative;
        }
        .testimonial-card::before {
          content: '\u201C';
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

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(198,169,107,0.12);
          border: 1px solid rgba(198,169,107,0.3);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #A07A35;
        }

        .glow-ring {
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          background: conic-gradient(from 0deg, #2F4F3E, #C6A96B, #2F4F3E);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          animation: pulse-ring 3s ease-in-out infinite;
        }

        .module-card:hover .glow-ring { opacity: 1; }
      `}</style>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-[#E5DED2] bg-[#F8F7F3]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
              <PawPrint className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#C6A96B] border-2 border-[#F8F7F3]" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight font-display">MyDogPortal</p>
              <p className="text-xs font-medium text-[#5B6B73]">Dog Breeder Web + Docs + Portal</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#5B6B73] md:flex">
            <a href="#features" className="hover:text-[#2F4F3E] transition-colors">Features</a>
            <a href="#chichi" className="hover:text-[#2F4F3E] transition-colors">Chi Chi</a>
            <a href="#pricing" className="hover:text-[#2F4F3E] transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-[#2F4F3E] transition-colors">Demo</a>
          </nav>

          <a
            href="#pricing"
            className="rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#253F32] hover:shadow-md"
          >
            Start Your Portal
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background organic blobs */}
        <div className="hero-blob absolute left-[-10%] top-[-5%] h-[500px] w-[500px] bg-[#A8BFA3]/20" style={{animationDelay: '0s'}} />
        <div className="hero-blob absolute right-[-5%] top-[30%] h-[350px] w-[350px] bg-[#C6A96B]/10" style={{animationDelay: '3s', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'}} />
        <div className="hero-blob absolute bottom-[-10%] left-[30%] h-[280px] w-[280px] bg-[#2F4F3E]/08" style={{animationDelay: '1.5s'}} />

        {/* Decorative paw prints */}
        <div className="paw-bg" style={{top: '15%', right: '8%', transform: 'rotate(20deg)'}}>
          <PawPrint className="h-32 w-32 text-[#2F4F3E]" />
        </div>
        <div className="paw-bg" style={{bottom: '20%', left: '5%', transform: 'rotate(-15deg)'}}>
          <PawPrint className="h-20 w-20 text-[#2F4F3E]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:py-28 relative z-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-white/80 px-4 py-2 text-sm font-bold text-[#2F4F3E] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#C6A96B]" />
              Built for real dog breeders, not generic businesses
            </div>

            <h1 className="font-display max-w-4xl text-5xl font-bold leading-[1.03] tracking-tight text-[#1F2933] md:text-7xl">
              Run your entire{" "}
              <em className="not-italic shimmer-text">breeding program</em>
              {" "}in one beautiful system.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5B6B73] md:text-xl">
              MyDogPortal helps breeders manage puppies, buyers, payments, contracts, websites, and buyer communication — with Chi Chi built in to guide the process.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#2F4F3E]/20 transition hover:bg-[#253F32] hover:shadow-xl hover:shadow-[#2F4F3E]/25 hover:-translate-y-0.5"
              >
                Build My Breeder Portal
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8CCB7] bg-white px-7 py-4 text-base font-bold text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6] hover:-translate-y-0.5"
              >
                View Demo
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                { label: "Portal", sub: "Buyer & Breeder" },
                { label: "Docs", sub: "Contracts & Forms" },
                { label: "Website", sub: "Domain Included" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#E5DED2] bg-white/80 p-4 shadow-sm card-hover">
                  <Check className="mb-2 h-5 w-5 text-[#2F4F3E]" />
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-[#5B6B73] mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Social proof mini strip */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["SM", "JR", "PL", "AK"].map((initials, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F8F7F3] text-xs font-bold text-white" style={{background: ['#2F4F3E','#5A7A6A','#7A9A8A','#C6A96B'][i]}}>
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-[#C6A96B] text-[#C6A96B]" />)}
                </div>
                <p className="text-xs text-[#5B6B73] font-medium">Trusted by 2,400+ breeders</p>
              </div>
            </div>
          </div>

          {/* Dashboard Demo */}
          <div id="demo" className="relative z-10 animate-float">
            {/* Glow behind dashboard */}
            <div className="absolute inset-0 rounded-[2rem] bg-[#2F4F3E]/08 blur-3xl transform scale-95 translate-y-4" />

            <div className="relative rounded-[2rem] border border-[#E5DED2] bg-white p-4 shadow-2xl shadow-[#2F4F3E]/15">
              {/* Browser chrome */}
              <div className="mb-3 flex items-center gap-2 px-1">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                <div className="ml-3 flex-1 rounded-full bg-[#F1EFE9] px-3 py-1 text-xs text-[#5B6B73] font-medium">
                  app.mydogportal.site/dashboard
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-[#2F4F3E]">Breeder Dashboard</p>
                    <p className="text-xs text-[#5B6B73]">Today&apos;s program overview</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28C840] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#28C840]" />
                    </span>
                    <div className="rounded-full bg-[#E9F0E7] px-3 py-1 text-xs font-bold text-[#2F4F3E]">Live</div>
                  </div>
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
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#C6A96B] border-2 border-white badge-ai" />
                    </div>
                    <div>
                      <p className="font-black text-sm">Chi Chi Assistant</p>
                      <p className="text-xs text-[#5B6B73]">Ready to help with buyers, payments, and documents.</p>
                    </div>
                    <div className="ml-auto rounded-full bg-[#E9F0E7] px-2 py-0.5 text-xs font-bold text-[#2F4F3E]">AI</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#F4EFE6] to-[#EDE8DE] p-4 text-sm leading-6 text-[#44535A] border border-[#E5DED2]/50">
                    &ldquo;Two buyers have unsigned deposit agreements. Would you like me to prepare reminders?&rdquo;
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-[#2F4F3E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#253F32] transition">Yes, prepare</button>
                    <button className="rounded-full border border-[#D8CCB7] bg-white px-3 py-1.5 text-xs font-bold text-[#5B6B73] hover:bg-[#F4EFE6] transition">Later</button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {[
                    { text: "Health Guarantee ready for Bella", color: "#E9F0E7", icon: "✓" },
                    { text: "Payment reminder due tomorrow", color: "#FEF3CD", icon: "!" },
                    { text: "New application received", color: "#E9F0E7", icon: "★" }
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-[#E5DED2] bg-white p-4 text-sm font-semibold text-[#44535A] hover:shadow-sm transition-shadow">
                      <BadgeCheck className="h-5 w-5 text-[#C6A96B] shrink-0" />
                      {item.text}
                      <ChevronRight className="ml-auto h-4 w-4 text-[#C6A96B]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-[#E5DED2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card rounded-2xl border border-[#E5DED2] bg-[#F8F7F3] p-5 text-center">
                <p className="font-display text-3xl font-bold text-[#2F4F3E] md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-[#5B6B73]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="section-label mx-auto mb-5">One system, flexible entry points</div>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Start with what you need.{" "}
            <span className="text-[#2F4F3E]">Grow when you&apos;re ready.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
            Some breeders only need documents. Some need the full operating system. Some want a website too. MyDogPortal keeps it all connected.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, i) => (
            <div key={module.title} className="module-card relative overflow-hidden rounded-[1.75rem] border border-[#E5DED2] bg-white p-6 shadow-sm card-hover">
              <div className="glow-ring rounded-[1.75rem]" />
              <span className="feature-number">{String(i + 1).padStart(2, '0')}</span>

              <div className="mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold" style={{background: `${module.accent}18`, color: module.accent}}>
                {module.badge}
              </div>

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm" style={{background: module.accent}}>
                <module.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5B6B73]">{module.text}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{color: module.accent}}>
                Learn more <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="bg-[#2F4F3E] py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 rotate-12"><PawPrint className="h-40 w-40 text-white" /></div>
          <div className="absolute bottom-10 right-10 -rotate-12"><PawPrint className="h-56 w-56 text-white" /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"><PawPrint className="h-72 w-72 text-white" /></div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1fr] relative z-10">
          <div>
            <div className="section-label mb-5" style={{background: 'rgba(198,169,107,0.2)', borderColor: 'rgba(198,169,107,0.4)', color: '#C6A96B'}}>Built for breeder work</div>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Everything a breeder needs to look organized, professional, and trustworthy.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/65">
              This is not a generic CRM with dog words added later. It is structured around real breeder workflows: puppies, buyers, deposits, contracts, updates, and go-home preparation.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "Fast Setup" },
                { icon: Lock, label: "Secure" },
                { icon: TrendingUp, label: "Scalable" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/05 p-4 text-center backdrop-blur-sm">
                  <item.icon className="h-5 w-5 text-[#C6A96B]" />
                  <span className="text-xs font-bold text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/08 p-4 backdrop-blur-sm transition hover:bg-white/12">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6A96B]/20">
                  <Check className="h-5 w-5 text-[#C6A96B]" />
                </div>
                <span className="font-bold text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHI CHI SECTION ── */}
      <section id="chichi" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#2F4F3E]/05 to-[#C6A96B]/05 blur-2xl" />

            <div className="relative rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
              <div className="rounded-[1.5rem] bg-[#F8F7F3] p-5">
                {/* Chi Chi header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-md">
                      <Bot className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#C6A96B] border-2 border-white" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold">Chi Chi</p>
                      <p className="text-sm text-[#5B6B73]">Your breeder assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#E9F0E7] px-3 py-1.5 text-xs font-bold text-[#2F4F3E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
                    Online
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

                {/* Typing indicator */}
                <div className="mb-4 flex justify-start">
                  <div className="flex items-center gap-1 rounded-3xl bg-white px-4 py-3 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#5B6B73] animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="h-2 w-2 rounded-full bg-[#5B6B73] animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="h-2 w-2 rounded-full bg-[#5B6B73] animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Prepare Docs", "Check Payments", "Send Update"].map((action) => (
                    <button key={action} className="rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-bold text-[#2F4F3E] transition hover:bg-[#F4EFE6] hover:border-[#2F4F3E]/30">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-label mb-5">Chi Chi included</div>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              A friendly assistant built into the breeder{" "}
              <span className="text-[#2F4F3E]">and buyer experience.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              Chi Chi helps make the system feel alive — not just a dashboard. It can guide breeders through daily work and help buyers understand their puppy journey.
            </p>

            <div className="mt-7 grid gap-4">
              <Benefit icon={MessageCircle} title="Buyer-friendly support" text="Help buyers understand documents, payments, updates, and next steps." />
              <Benefit icon={ShieldCheck} title="Operational guardrails" text="Keep breeder workflows consistent with clear reminders and structured actions." />
              <Benefit icon={HeartHandshake} title="Warmer experience" text="Make the portal feel personal, helpful, and less intimidating." />
            </div>
          </div>
        </div>
      </section>

      {/* ── WEBSITE PREVIEW ── */}
      <section className="bg-[#F1EFE9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Breeder website preview</div>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Give every breeder a polished public website.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5B6B73]">
              Breeders can use a subdomain like <span className="font-bold text-[#2F4F3E]">swvachihuahua.dogbreederweb.site</span> or connect their own custom domain.
            </p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-xl shadow-[#2F4F3E]/10">
            {/* Browser chrome */}
            <div className="mb-4 flex items-center gap-2 px-1">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              <div className="ml-3 flex-1 rounded-full bg-[#F1EFE9] px-3 py-1 text-xs text-[#5B6B73] font-medium">
                sunnyridgecavaliers.dogbreederweb.site
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[#F8F7F3] p-6">
              {/* Mini site header */}
              <div className="mb-6 flex items-center justify-between border-b border-[#E5DED2] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F4F3E] text-white">
                    <PawPrint className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-[#1F2933]">Sunny Ridge Cavaliers</p>
                    <p className="text-xs text-[#5B6B73]">Health-tested · AKC Registered · Est. 2016</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <nav className="hidden gap-5 text-sm font-semibold text-[#5B6B73] md:flex">
                    <span>Puppies</span>
                    <span>About</span>
                    <span>Gallery</span>
                  </nav>
                  <button className="rounded-full bg-[#2F4F3E] px-5 py-2.5 text-sm font-bold text-white shadow-sm">
                    Apply for a Puppy
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "Ruby", status: "Available", color: "#E9F0E7", textColor: "#2F4F3E", weight: "4.2 lbs", dob: "March 2024" },
                  { name: "Willow", status: "Reserved", color: "#FEF3CD", textColor: "#8B6914", weight: "5.1 lbs", dob: "March 2024" },
                  { name: "Theo", status: "Available", color: "#E9F0E7", textColor: "#2F4F3E", weight: "4.8 lbs", dob: "April 2024" }
                ].map((puppy) => (
                  <div key={puppy.name} className="overflow-hidden rounded-3xl border border-[#E5DED2] bg-white shadow-sm card-hover">
                    <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-[#E9F0E7] to-[#D4E5D0] overflow-hidden">
                      <PawPrint className="h-16 w-16 text-[#2F4F3E]/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      <div className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold" style={{background: puppy.color, color: puppy.textColor}}>
                        {puppy.status}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-display text-xl font-bold">{puppy.name}</p>
                      <p className="mt-0.5 text-sm text-[#5B6B73]">Cavalier King Charles Spaniel</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-[#F8F7F3] px-3 py-2">
                          <p className="text-xs text-[#5B6B73]">Weight</p>
                          <p className="text-sm font-bold">{puppy.weight}</p>
                        </div>
                        <div className="rounded-lg bg-[#F8F7F3] px-3 py-2">
                          <p className="text-xs text-[#5B6B73]">Born</p>
                          <p className="text-sm font-bold">{puppy.dob}</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-full bg-[#2F4F3E] px-3 py-2 text-center text-xs font-bold text-white">
                        View Details
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust bar */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-[#E5DED2] pt-5">
                {["Health Tested Parents", "AKC Registered", "Lifetime Support", "Buyer Portal Access"].map((trust) => (
                  <div key={trust} className="flex items-center gap-2 text-xs font-bold text-[#5B6B73]">
                    <Check className="h-3.5 w-3.5 text-[#2F4F3E]" /> {trust}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="section-label mx-auto mb-5">Breeder stories</div>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Breeders who switched never went back.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card rounded-[2rem] border border-[#E5DED2] bg-white p-7 shadow-sm card-hover">
              <div className="mb-5 flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-[#C6A96B] text-[#C6A96B]" />)}
              </div>
              <p className="text-[#44535A] leading-7 relative z-10">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F4F3E] text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-[#5B6B73]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-[#F1EFE9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-label mx-auto mb-5">Fair monthly pricing</div>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Start simple. Upgrade only when it makes sense.
            </h2>
            <p className="mt-4 text-[#5B6B73]">No contracts. Cancel anytime. All plans include onboarding support.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`pricing-card-hover relative rounded-[2rem] border p-7 ${
                  tier.highlighted
                    ? "border-transparent bg-[#2F4F3E] text-white shadow-xl shadow-[#2F4F3E]/25"
                    : "border-[#E5DED2] bg-white shadow-sm"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#C6A96B] px-4 py-1.5 text-xs font-bold text-white shadow-md whitespace-nowrap">
                    ★ Most Popular
                  </div>
                )}

                <p className={`font-display text-lg font-bold ${tier.highlighted ? "text-white" : "text-[#2F4F3E]"}`}>
                  {tier.name}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">{tier.price}</span>
                  <span className={`pb-2 text-sm font-bold ${tier.highlighted ? "text-white/75" : "text-[#5B6B73]"}`}>
                    /mo
                  </span>
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
                      <span className="text-sm font-bold">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-black transition ${
                    tier.highlighted
                      ? "bg-white text-[#2F4F3E] hover:bg-[#F4EFE6] shadow-lg"
                      : "bg-[#F4EFE6] text-[#2F4F3E] hover:bg-[#E9F0E7]"
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

      {/* ── CTA BANNER ── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#2F4F3E] p-8 text-white shadow-2xl shadow-[#2F4F3E]/25 md:p-12 grain-overlay">
          {/* Background paws */}
          <div className="absolute right-[-40px] top-[-40px] opacity-10 rotate-12">
            <PawPrint className="h-64 w-64 text-white" />
          </div>
          <div className="absolute left-[-20px] bottom-[-30px] opacity-05 -rotate-6">
            <PawPrint className="h-48 w-48 text-white" />
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6A96B]/40 bg-[#C6A96B]/15 px-4 py-2 text-sm font-bold text-[#C6A96B]">
                <Sparkles className="h-4 w-4" />
                Ready when you are
              </div>
              <h2 className="font-display max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                Build the breeder platform your customers can trust.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                Start with documents, launch the full Dog Breeder OS, or connect a website. It all grows from the same system.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-white/60">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#C6A96B]" /> 14-day free trial</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#C6A96B]" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#C6A96B]" /> Cancel anytime</span>
              </div>
            </div>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#2F4F3E] shadow-lg transition hover:bg-[#F4EFE6] hover:-translate-y-0.5"
            >
              Start Building
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#E5DED2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F4F3E] text-white">
                  <PawPrint className="h-5 w-5" />
                </div>
                <p className="font-display text-lg font-bold text-[#2F4F3E]">MyDogPortal.Site</p>
              </div>
              <p className="text-sm text-[#5B6B73] max-w-xs">The complete operating system for professional dog breeders.</p>
            </div>

            <div className="flex flex-wrap gap-10 text-sm">
              <div>
                <p className="font-bold text-[#1F2933] mb-3">Platform</p>
                <div className="space-y-2 text-[#5B6B73]">
                  <p>Breeder OS</p>
                  <p>Smart Documents</p>
                  <p>Breeder Websites</p>
                  <p>Chi Chi AI</p>
                </div>
              </div>
              <div>
                <p className="font-bold text-[#1F2933] mb-3">Company</p>
                <div className="space-y-2 text-[#5B6B73]">
                  <p>About</p>
                  <p>Blog</p>
                  <p>Support</p>
                  <p>Privacy</p>
                </div>
              </div>
              <div>
                <p className="font-bold text-[#1F2933] mb-3">Products</p>
                <div className="space-y-2 text-[#5B6B73]">
                  <p>DogBreederDocs.Online</p>
                  <p>DogBreederWeb.Site</p>
                  <p>Chi Chi Assistant</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[#E5DED2] pt-6">
            <p className="text-xs text-[#5B6B73]">© 2024 MyDogPortal.Site · All rights reserved</p>
            <p className="text-xs text-[#5B6B73]">Made for breeders, by breeders</p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CHI CHI BUTTON ── */}
      <div className="fixed bottom-5 right-5 z-50 hidden md:block">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#2F4F3E]/20 blur-lg animate-pulse" />
          <button className="relative flex items-center gap-3 rounded-full border border-[#D8CCB7] bg-white px-5 py-4 text-sm font-black text-[#2F4F3E] shadow-2xl shadow-[#2F4F3E]/20 hover:shadow-[#2F4F3E]/30 transition-all hover:-translate-y-0.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#2F4F3E] text-white">
              <Bot className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#C6A96B] border-2 border-white" />
            </span>
            Ask Chi Chi
          </button>
        </div>
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
  icon: typeof PawPrint;
  title: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs font-bold text-[#5B6B73]">{title}</p>
      {trend && <p className="mt-1 text-xs text-[#C6A96B] font-semibold">{trend}</p>}
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
            ? "bg-white text-[#44535A] shadow-sm border border-[#E5DED2]/60"
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
    <div className="flex gap-4 rounded-3xl border border-[#E5DED2] bg-white p-5 shadow-sm card-hover">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#5B6B73]">{text}</p>
      </div>
    </div>
  );
}