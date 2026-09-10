"use client";

import Link from "next/link";

// ─── Top Navigation ──────────────────────────────────────────────────────────

function TopAppBar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 border-b border-[#252a35] bg-[#0b0e14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center group-hover:bg-[#4d8eff]/20 transition-colors">
            <span className="material-symbols-outlined text-[#adc6ff]">
              clinical_notes
            </span>
          </div>

          <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Recruit<span className="text-[#adc6ff]">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm text-[#a9afbf] hover:text-white transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/resumes"
            className="text-sm text-[#a9afbf] hover:text-white transition-colors"
          >
            Resumes
          </Link>

          <Link
            href="/upload"
            className="text-sm text-[#a9afbf] hover:text-white transition-colors"
          >
            Upload
          </Link>

          <span
            className="text-sm text-[#555d6d] cursor-not-allowed"
            title="Settings page coming soon"
          >
            Settings
          </span>
        </nav>

        {/* CTA */}
        <Link
          href="/upload"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#adc6ff] text-[#07172f] text-sm font-semibold hover:bg-white transition-colors"
        >
          Upload Resume

          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[850px] h-[650px] rounded-full bg-[#4d8eff]/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-[#4edea3]/5 blur-[130px]" />

        <div className="absolute inset-0 opacity-[0.035] bg-grid-pattern" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* ─── Left side ─── */}
          <div>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4edea3]/20 bg-[#4edea3]/5 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4edea3]" />
              </span>

              <span className="text-xs font-medium text-[#4edea3]">
                Resume Intelligence Platform
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-semibold tracking-[-0.05em] leading-[0.98] text-white">
              From resumes
              <span className="block mt-2">
                to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#4d8eff] to-[#4edea3]">
                  intelligence.
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-[#a9afbf]">
              RecruitAI transforms unstructured resumes into structured
              candidate information — extracting essential details and
              technical skills so they can be searched, managed, and analyzed.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <Link
                href="/upload"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#adc6ff] text-[#07172f] font-semibold hover:bg-white transition-all shadow-[0_0_30px_rgba(77,142,255,0.12)]"
              >
                Start Parsing

                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#343b49] bg-[#11151d]/70 text-white font-medium hover:bg-[#191e28] transition-colors"
              >
                View Dashboard

                <span className="material-symbols-outlined text-[20px]">
                  dashboard
                </span>
              </Link>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
              <Capability icon="picture_as_pdf" text="PDF parsing" />

              <Capability icon="person_search" text="Candidate extraction" />

              <Capability icon="database" text="PostgreSQL storage" />
            </div>
          </div>

          {/* ─── Right side ─── */}
          <ProcessingVisualization />
        </div>
      </div>
    </section>
  );
}

// ─── Capability ──────────────────────────────────────────────────────────────

function Capability({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#8e95a5]">
      <span className="material-symbols-outlined text-[17px] text-[#4edea3]">
        check_circle
      </span>

      {text}
    </div>
  );
}

// ─── Processing Visualization ────────────────────────────────────────────────

function ProcessingVisualization() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
      {/* Outer glow */}
      <div className="absolute inset-10 rounded-full bg-[#4d8eff]/10 blur-[100px]" />

      {/* Main visual container */}
      <div className="relative rounded-3xl border border-[#293140] bg-[#0d1118]/90 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-[#252a35] bg-[#11151d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              auto_awesome
            </span>

            <span className="text-xs font-medium text-[#c5cad6]">
              RecruitAI Engine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />

            <span className="text-[10px] uppercase tracking-wider text-[#737b8c]">
              Ready
            </span>
          </div>
        </div>

        {/* Visualization */}
        <div className="p-6 md:p-8">
          {/* Intro */}
          <div className="mb-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#737b8c]">
              Intelligent processing pipeline
            </p>

            <p className="text-sm text-[#c5cad6] mt-2">
              A structured workflow for turning resume documents into
              candidate data.
            </p>
          </div>

          {/* Pipeline */}
          <div className="space-y-3">
            <PipelineCard
              number="01"
              icon="description"
              title="Resume Document"
              description="Input document"
              status="INPUT"
              accent="blue"
            />

            <PipelineConnector />

            <PipelineCard
              number="02"
              icon="text_snippet"
              title="Text Extraction"
              description="Document content"
              status="EXTRACT"
              accent="green"
            />

            <PipelineConnector />

            <PipelineCard
              number="03"
              icon="psychology"
              title="Information Parsing"
              description="Candidate attributes"
              status="PARSE"
              accent="orange"
            />

            <PipelineConnector />

            <PipelineCard
              number="04"
              icon="database"
              title="Structured Storage"
              description="PostgreSQL database"
              status="STORE"
              accent="blue"
            />
          </div>

          {/* Bottom status */}
          <div className="mt-6 p-4 rounded-xl border border-[#252a35] bg-[#11151d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                  verified
                </span>

                <span className="text-xs text-[#c5cad6]">
                  Structured candidate data
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-wider text-[#4edea3]">
                Ready
              </span>
            </div>

            <div className="mt-3 h-1 rounded-full bg-[#202631] overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-[#4d8eff] to-[#4edea3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline Card ────────────────────────────────────────────────────────────

function PipelineCard({
  number,
  icon,
  title,
  description,
  status,
  accent,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
  status: string;
  accent: "blue" | "green" | "orange";
}) {
  const accentStyles = {
    blue: {
      icon: "text-[#adc6ff]",
      background: "bg-[#4d8eff]/10",
      border: "border-[#4d8eff]/20",
      status: "text-[#adc6ff]",
    },
    green: {
      icon: "text-[#4edea3]",
      background: "bg-[#4edea3]/10",
      border: "border-[#4edea3]/20",
      status: "text-[#4edea3]",
    },
    orange: {
      icon: "text-[#ffb786]",
      background: "bg-[#ffb786]/10",
      border: "border-[#ffb786]/20",
      status: "text-[#ffb786]",
    },
  };

  const style = accentStyles[accent];

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl border border-[#252a35] bg-[#11151d]/80 hover:border-[#3b4658] transition-all">
      {/* Number */}
      <span className="hidden sm:block text-[10px] font-mono text-[#555d6d] w-5">
        {number}
      </span>

      {/* Icon */}
      <div
        className={`w-10 h-10 shrink-0 rounded-xl ${style.background} border ${style.border} flex items-center justify-center`}
      >
        <span className={`material-symbols-outlined ${style.icon}`}>
          {icon}
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{title}</p>

        <p className="text-xs text-[#737b8c] mt-1">{description}</p>
      </div>

      {/* Status */}
      <span
        className={`hidden sm:block text-[9px] font-medium tracking-widest ${style.status}`}
      >
        {status}
      </span>
    </div>
  );
}

// ─── Pipeline Connector ──────────────────────────────────────────────────────

function PipelineConnector() {
  return (
    <div className="flex justify-center h-4">
      <div className="w-px h-full bg-gradient-to-b from-[#343b49] to-[#4d8eff]/40" />
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: "picture_as_pdf",
      title: "PDF Resume Parsing",
      description:
        "Extract text from uploaded PDF resumes and prepare the content for structured processing.",
    },
    {
      icon: "person_search",
      title: "Candidate Extraction",
      description:
        "Identify candidate names, email addresses, phone numbers, and relevant technical skills.",
    },
    {
      icon: "database",
      title: "Persistent Storage",
      description:
        "Store parsed candidate information in PostgreSQL so it can be retrieved and managed later.",
    },
  ];

  return (
    <section className="px-6 py-28 border-t border-[#252a35]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-[#4d8eff] font-medium">
            Core capabilities
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-3">
            Everything you need to organize resume data.
          </h2>

          <p className="text-[#8e95a5] mt-4 leading-relaxed">
            RecruitAI brings document extraction, candidate parsing, and
            database storage together in one streamlined workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-7 group hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#adc6ff]">
                    {feature.icon}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-[#4b5362]">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-medium text-white mt-6">
                {feature.title}
              </h3>

              <p className="text-sm text-[#8e95a5] leading-relaxed mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload",
      description:
        "Select a resume and send it to the RecruitAI processing pipeline.",
      icon: "cloud_upload",
    },
    {
      number: "02",
      title: "Extract",
      description:
        "Resume text is extracted from the uploaded PDF document.",
      icon: "text_snippet",
    },
    {
      number: "03",
      title: "Parse",
      description:
        "Candidate details and relevant technical skills are identified.",
      icon: "psychology",
    },
    {
      number: "04",
      title: "Store",
      description:
        "Structured candidate information is persisted in PostgreSQL.",
      icon: "database",
    },
  ];

  return (
    <section className="px-6 py-28 bg-[#0b0e14] border-y border-[#252a35]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#4edea3] font-medium">
            Workflow
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">
            From document to structured data.
          </h2>

          <p className="text-[#8e95a5] mt-4">
            A simple pipeline that turns an uploaded resume into manageable
            candidate information.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="glass-card rounded-2xl p-7 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-[#4d8eff]">
                    {step.number}
                  </span>

                  <span className="material-symbols-outlined text-[#adc6ff]">
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-xl font-medium text-white mt-8">
                  {step.title}
                </h3>

                <p className="text-sm text-[#8e95a5] leading-relaxed mt-3">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <span className="hidden md:block absolute top-1/2 -right-3 z-10 material-symbols-outlined text-[#424957]">
                  arrow_forward
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="px-6 py-28">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-[#303747] bg-[#10151e] p-10 md:p-16 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-[#4d8eff]/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#adc6ff] text-[28px]">
              clinical_notes
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mt-6">
            Start building your candidate database.
          </h2>

          <p className="max-w-xl mx-auto text-[#8e95a5] mt-5 leading-relaxed">
            Upload a resume and let RecruitAI transform the document into
            structured candidate information.
          </p>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-[#adc6ff] text-[#07172f] font-semibold hover:bg-white transition-colors"
          >
            Upload Resume

            <span className="material-symbols-outlined">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#252a35] bg-[#090c11]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff]">
              clinical_notes
            </span>

            <span className="text-lg font-semibold text-white">
              RecruitAI
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-[#737b8c] hover:text-white transition-colors"
            >
              Dashboard
            </Link>

            <Link
              href="/resumes"
              className="text-sm text-[#737b8c] hover:text-white transition-colors"
            >
              Resumes
            </Link>

            <Link
              href="/upload"
              className="text-sm text-[#737b8c] hover:text-white transition-colors"
            >
              Upload
            </Link>
          </div>

          <p className="text-xs text-[#737b8c]">
            © 2026 RecruitAI
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Mobile Bottom Navigation ────────────────────────────────────────────────

function BottomNavBar() {
  const items = [
    {
      icon: "home",
      label: "Home",
      href: "/",
      active: true,
    },
    {
      icon: "history",
      label: "History",
      href: "/resumes",
      active: false,
    },
    {
      icon: "add_circle",
      label: "Upload",
      href: "/upload",
      active: false,
    },
    {
      icon: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      active: false,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/95 backdrop-blur-lg border-t border-[#252a35]">
      {items.map(({ icon, label, href, active }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center gap-1 transition-all ${
            active
              ? "text-[#adc6ff]"
              : "text-[#737b8c] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">
            {icon}
          </span>

          <span className="text-[11px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        body {
          font-family: var(--font-geist-sans), sans-serif;
          background: #090c11;
        }

        .glass-card {
          background: rgba(14, 18, 25, 0.72);
          backdrop-filter: blur(20px);
          border: 1px solid #252a35;
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .glass-card:hover {
          border-color: rgba(77, 142, 255, 0.35);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(173, 198, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(173, 198, 255, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            transparent 80%
          );
        }

        .material-symbols-outlined {
          font-variation-settings:
            "FILL" 0,
            "wght" 400,
            "GRAD" 0,
            "opsz" 24;
        }
      `}</style>

      <div className="min-h-screen bg-[#090c11] text-white">
        <TopAppBar />

        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <CTASection />
        </main>

        <Footer />
        <BottomNavBar />
      </div>
    </>
  );
}