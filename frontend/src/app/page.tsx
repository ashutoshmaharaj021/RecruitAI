"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedResume {
  [key: string]: unknown;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopAppBar() {
  return (
    <header className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] shadow-sm flex items-center justify-between px-8 h-16 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#adc6ff]">clinical_notes</span>
        <span className="text-2xl font-bold text-white tracking-tighter">RecruitAI</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-10">
        {["Dashboard", "Resumes", "Uploads", "Settings"].map((item, i) => (
          <a
            key={item}
            href="#"
            className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${
              i === 0
                ? "text-[#adc6ff]"
                : "text-[#c2c6d6] hover:text-[#adc6ff]"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzxGkMDzv2UBmB3CA3xNVWbBUpDC8iVr1iURPcwl5GAVRy5vwcGOj4-jwCztJzP2pEoBTdzzCP2rLRzD7EW4WDy8XeRMbXFq86b2zxfYuUFi_eC6TtZK21J2rg284asTyOEVH04-D9VB8v3R20MubZqJDQy3jojfOPOOKe8en-XHTLTrBrT5qMIp2j5MFrNzFLBGLYb3b4rKHKRq7AqzNcwxzxZI57o5QoMzFtRofuBPOrsTq4KJT4d4cVYEuG1SA0tZdWY4RN30E"
          alt="User profile"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}

function HeroSection({
  file,
  setFile,
  loading,
  result,
  onUpload,
}: {
  file: File | null;
  setFile: (f: File | null) => void;
  loading: boolean;
  result: ParsedResume | null;
  onUpload: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <section className="relative px-8 py-24 flex flex-col items-center text-center justify-center min-h-[795px]">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#adc6ff]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-card rounded-full border border-[#424754] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
          <span className="text-[13px] font-medium text-[#4edea3]">v2.0 Now Live</span>
        </div>

        {/* Headline */}
        <h1 className="text-[48px] leading-none font-semibold tracking-[-0.03em] mb-6 text-white">
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#4d8eff] to-[#4edea3]">
            Talent Acquisition.
          </span>
        </h1>

        <p className="text-[18px] leading-relaxed text-[#c2c6d6] max-w-2xl mx-auto mb-10">
          AI-powered resume parsing with precision intelligence. Discover top-tier candidates before
          your competition does, with zero bias and maximum speed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onUpload}
            disabled={loading || !file}
            className="glow-button px-10 py-4 bg-[#4d8eff] text-[#00285d] rounded-xl text-[24px] font-semibold active:scale-95 transition-all hover:brightness-110 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Parsing…" : "Get Started"}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="px-10 py-4 border border-[#424754] bg-transparent text-white rounded-xl text-[24px] font-semibold hover:bg-[#333539]/20 transition-all">
            View Demo
          </button>
        </div>

        {/* Upload result badge */}
        {result && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-[#4edea3]/30 text-[#4edea3] text-[13px]">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Resume parsed successfully!
          </div>
        )}
      </div>

      {/* Dashboard Preview */}
      <div className="mt-16 relative w-full max-w-6xl mx-auto glass-card rounded-xl overflow-hidden shadow-2xl border-t border-l border-white/10">
        <div className="h-10 bg-[#1e2024] flex items-center px-6 gap-1 border-b border-[#424754]">
          <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/20 border border-[#ffb4ab]/40" />
          <div className="w-3 h-3 rounded-full bg-[#ffb786]/20 border border-[#ffb786]/40" />
          <div className="w-3 h-3 rounded-full bg-[#4edea3]/20 border border-[#4edea3]/40" />
        </div>
        <div className="p-4 bg-[#0c0e12]">
          {/* Drag & Drop zone (interactive, inside preview) */}
          <div
            className={`marching-ants rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
              dragging ? "bg-[#1a1c20]/70" : "bg-[#1a1c20]/30 hover:bg-[#1a1c20]/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-[#8c909f] text-[48px]">cloud_upload</span>
            <div className="text-center">
              <p className="text-[24px] font-medium text-white">
                {file ? file.name : "Drag & Drop Resumes"}
              </p>
              <p className="text-[15px] text-[#c2c6d6]">
                {file ? `${(file.size / 1024).toFixed(1)} KB — ready to parse` : "Support for PDF, DOCX, and LinkedIn Profiles"}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Parsed result preview */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-[#1e2024] border border-[#424754] text-left overflow-auto max-h-64">
              <p className="text-[13px] font-medium text-[#4edea3] mb-2">Parsed Output</p>
              <pre className="text-[13px] text-[#c2c6d6] whitespace-pre-wrap break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const features = [
    {
      icon: "bolt",
      color: "text-[#adc6ff]",
      title: "Instant Ingestion",
      desc: "Process 10,000+ resumes in under 4 minutes with multi-threaded parsing.",
      span: "md:col-span-4",
    },
    {
      icon: "security",
      color: "text-[#4edea3]",
      title: "Bias Elimination",
      desc: "Anonymize candidate data automatically to ensure fair hiring practices.",
      span: "md:col-span-4",
    },
  ];

  return (
    <section className="px-8 py-24 max-w-7xl mx-auto">
      <h2 className="text-[32px] font-semibold tracking-[-0.02em] mb-16 text-center text-white">
        Engineered for Precision.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large feature card */}
        <div className="md:col-span-8 glass-card p-10 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[120px] text-white">psychology</span>
          </div>
          <h3 className="text-[24px] font-medium text-[#adc6ff] mb-4">Neural Skill Mapping</h3>
          <p className="text-[15px] text-[#c2c6d6] mb-6 max-w-md">
            Our proprietary LLM analyzes multi-dimensional skill sets, identifying hidden talent
            patterns that keyword-based parsers miss.
          </p>
          <div className="flex gap-3">
            <span className="px-4 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 text-[13px] font-medium">
              99.8% Accuracy
            </span>
            <span className="px-4 py-1 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 text-[13px] font-medium">
              Low Latency
            </span>
          </div>
        </div>

        {/* Smaller cards */}
        {features.map(({ icon, color, title, desc, span }) => (
          <div key={title} className={`${span} glass-card p-10 rounded-xl flex flex-col justify-between`}>
            <span className={`material-symbols-outlined ${color} text-[40px]`}>{icon}</span>
            <div>
              <h3 className="text-[24px] font-medium text-white mt-6">{title}</h3>
              <p className="text-[15px] text-[#c2c6d6]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "500k+", label: "Resumes Parsed" },
    { value: "85%", label: "Time Saved" },
    { value: "1.2ms", label: "Avg Response" },
    { value: "24/7", label: "Global Support" },
  ];

  return (
    <section className="bg-[#0c0e12] border-y border-[#424754] py-24">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-16">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-[48px] font-semibold tracking-[-0.03em] text-[#adc6ff]">{value}</p>
            <p className="text-[13px] font-medium text-[#c2c6d6] uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111318] border-t border-[#424754] w-full py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
        <div className="flex flex-col gap-4 mb-10 md:mb-0">
          <span className="text-[24px] font-bold text-white tracking-tighter">RecruitAI</span>
          <p className="text-[15px] text-[#c2c6d6]">© 2024 RecruitAI. Precision Intelligence.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {["Privacy", "Terms", "API Docs", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function BottomNavBar() {
  const items = [
    { icon: "home", label: "Home", active: true },
    { icon: "history", label: "History", active: false },
    { icon: "add_circle", label: "Upload", active: false },
    { icon: "account_circle", label: "Profile", active: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/90 backdrop-blur-lg border-t border-[#424754] rounded-t-[0.75rem] shadow-[0px_-8px_32px_rgba(0,0,0,0.8)]">
      {items.map(({ icon, label, active }) => (
        <div
          key={label}
          className={`flex flex-col items-center active:scale-90 transition-all cursor-pointer ${
            active ? "text-[#adc6ff]" : "text-[#c2c6d6] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-[13px] font-medium">{label}</span>
        </div>
      ))}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedResume | null>(null);

  // Parallax mesh gradient on mouse move
  useEffect(() => {
    const gradient = document.querySelector<HTMLElement>(".mesh-gradient");
    if (!gradient) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 10;
      const y = (e.clientY / window.innerHeight) * 10;
      gradient.style.backgroundPosition = `${x}% ${y}%`;
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post<ParsedResume>("http://127.0.0.1:8000/upload", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Google Material Symbols font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.cdnfonts.com/css/geist');

        body { font-family: 'Geist', sans-serif; background-color: #050505; }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1E293B;
        }

        .mesh-gradient {
          background-color: #111318;
          background-image:
            radial-gradient(at 0% 0%, rgba(77, 142, 255, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(78, 222, 163, 0.1) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(173, 198, 255, 0.05) 0px, transparent 50%);
        }

        .glow-button { box-shadow: 0px 0px 20px rgba(77, 142, 255, 0.15); }

        .marching-ants {
          background-image:
            linear-gradient(to right, #424754 50%, transparent 50%),
            linear-gradient(to right, #424754 50%, transparent 50%),
            linear-gradient(to bottom, #424754 50%, transparent 50%),
            linear-gradient(to bottom, #424754 50%, transparent 50%);
          background-position: left top, left bottom, left top, right top;
          background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
          background-size: 20px 1px, 20px 1px, 1px 20px, 1px 20px;
          animation: ants 20s infinite linear;
        }

        @keyframes ants {
          from { background-position: 0 0, 0 100%, 0 0, 100% 0; }
          to   { background-position: 100% 0, -100% 100%, 0 100%, 100% -100%; }
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="bg-[#111318] text-white min-h-screen selection:bg-[#4d8eff] selection:text-[#001a42]">
        <TopAppBar />

        <main className="pt-16 min-h-screen mesh-gradient overflow-x-hidden">
          <HeroSection
            file={file}
            setFile={setFile}
            loading={loading}
            result={result}
            onUpload={handleUpload}
          />
          <FeaturesGrid />
          <StatsSection />
        </main>

        <Footer />
        <BottomNavBar />
      </div>
    </>
  );
}