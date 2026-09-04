"use client";

import { useState, useRef, useCallback } from "react";
// TODO: import axios from "axios";
// TODO: import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

interface AnalysisStep {
  threshold: number;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ANALYSIS_STEPS: AnalysisStep[] = [
  { threshold: 0,  label: "AI Analyzing..." },
  { threshold: 30, label: "Extracting Entities..." },
  { threshold: 60, label: "Mapping Career Trajectory..." },
  { threshold: 85, label: "Finalizing Confidence Score..." },
  { threshold: 100, label: "Analysis Complete" },
];

const INFO_CARDS = [
  {
    title: "Privacy First",
    body: "Data is encrypted at rest and in transit. Analysis results are private to your workspace.",
    link: null,
  },
  {
    title: "Batch Processing",
    body: "Need to upload 50+ resumes?",
    linkText: "Use our Bulk API",
    linkHref: "#",
    bodySuffix: " for enterprise-level throughput.",
  },
  {
    title: "Auto-Tagging",
    body: "Our AI automatically assigns seniority levels and skill clusters to every uploaded file.",
    link: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusLabel(progress: number): string {
  let label = ANALYSIS_STEPS[0].label;
  for (const step of ANALYSIS_STEPS) {
    if (progress >= step.threshold) label = step.label;
  }
  return label;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopNav() {
  return (
    <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#adc6ff] text-2xl">clinical_notes</span>
        <span className="text-2xl font-bold text-white tracking-tighter">RecruitAI</span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex gap-6">
        {[
          { label: "Dashboard", active: false },
          { label: "Resumes",   active: false },
          { label: "Uploads",   active: true  },
          { label: "Settings",  active: false },
        ].map(({ label, active }) => (
          <a
            key={label}
            href="#"
            className={`text-[15px] transition-colors duration-200 ${
              active
                ? "text-[#adc6ff] font-medium"
                : "text-[#c2c6d6] hover:text-[#adc6ff]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-[#282a2e] border border-[#424754] overflow-hidden cursor-pointer active:scale-95 transition-transform">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN6r_rvoEY8AvtnU5k2J335DT3Wsu-hGJpZYJ4z35OGd62ia982tpLmCdmAAT1hOLxmf8lUmlCLAhoD5ank72hHP1zc6NgE5Gx07QmgqmEmuzADC7LwBHuduhiCJTX8WMHlCx67oOT5jG7hPWqaqAWCYPnIgq4xFle8JEShTN3StrjgBw5M4tc86J_C9Wit6KN3Zo-tG_Qy_8941RymiftdPX1niMxsg5z4VVultrqP8-iWEXp74rt1lHWpVmaXUp8cYrDvlhYgwY"
          alt="User Profile"
          className="h-full w-full object-cover"
        />
      </div>
    </nav>
  );
}

function Sidebar() {
  const items = [
    { icon: "dashboard",    label: "Dashboard", active: false },
    { icon: "description",  label: "Resumes",   active: false },
    { icon: "cloud_upload", label: "Uploads",   active: true  },
    { icon: "settings",     label: "Settings",  active: false },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-1 w-[240px] fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0c0e12] border-r border-[#424754] px-4 pt-6 z-40">
      {items.map(({ icon, label, active }) => (
        <div
          key={label}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all active:opacity-80 ${
            active
              ? "bg-[#4d8eff]/10 text-[#adc6ff] font-medium"
              : "text-[#c2c6d6] hover:bg-[#333539]/50 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-[15px]">{label}</span>
        </div>
      ))}
    </aside>
  );
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────

interface DropZoneProps {
  uploadState: UploadState;
  progress: number;
  statusLabel: string;
  selectedFile: File | null;
  onFileDrop: (file: File) => void;
  onBrowseClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DropZone({
  uploadState,
  progress,
  statusLabel,
  selectedFile,
  onFileDrop,
  onBrowseClick,
  fileInputRef,
  onFileInputChange,
}: DropZoneProps) {
  const isUploading = uploadState === "uploading";
  const isDragging  = uploadState === "dragging";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileDrop(file);
  };

  return (
    <div className="relative group">
      {/* ── Idle / Dragging state ── */}
      <div
        className={`w-full min-h-[400px] glass-card rounded-[2rem] flex flex-col items-center justify-center p-16 transition-all duration-300 cursor-pointer ${
          isDragging
            ? "marching-ants border-0"
            : "border-2 border-dashed border-[#424754] hover:border-[#4d8eff]/60 group-hover:bg-[#1a1c20]/40"
        } ${isUploading ? "pointer-events-none opacity-40" : ""}`}
        onDragOver={handleDragOver}
        onDragEnter={(e) => { e.preventDefault(); }}
        onDragLeave={(e) => { e.preventDefault(); }}
        onDrop={handleDrop}
        onClick={!isUploading ? onBrowseClick : undefined}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#4d8eff]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[#adc6ff] text-5xl">cloud_upload</span>
          </div>
          <div className="text-center">
            <p className="text-[24px] font-medium text-white mb-2">
              {selectedFile ? selectedFile.name : "Drag & drop your file here"}
            </p>
            <p className="text-[15px] text-[#c2c6d6]">
              {selectedFile
                ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — ready to upload`
                : "Supports PDF, DOCX up to 25MB"}
            </p>
          </div>
          <button
            className="mt-4 px-10 py-4 bg-[#adc6ff] text-[#002e6a] text-[13px] font-medium rounded-full hover:shadow-[0_0_20px_rgba(77,142,255,0.2)] transition-all active:scale-95"
            onClick={(e) => { e.stopPropagation(); onBrowseClick(); }}
          >
            Browse Files
          </button>
        </div>

        {/* Hidden file input */}
        <label htmlFor="resume-upload-input" className="sr-only">
          Upload resume document
        </label>
        <input
          ref={fileInputRef}
          id="resume-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          title="Upload resume document"
          aria-label="Upload resume document"
          onChange={onFileInputChange}
        />
      </div>

      {/* ── Uploading / Analysis state ── */}
      {isUploading && (
        <div className="absolute inset-0 glass-card rounded-[2rem] flex flex-col items-center justify-center p-16 z-10">
          <div className="w-full max-w-md">
            {/* Header row */}
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="font-mono text-[14px] text-[#adc6ff] uppercase tracking-widest mb-1">
                  Neural Process Active
                </span>
                <h3 className="text-[24px] font-medium text-white transition-all">{statusLabel}</h3>
              </div>
              <span className="text-[24px] font-medium text-[#adc6ff] tabular-nums">{progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-[#333539] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#adc6ff] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Info tiles */}
            <div className="mt-16 grid grid-cols-2 gap-6">
              <div className="p-6 bg-[#1e2024] rounded-xl border border-[#424754]">
                <span className="material-symbols-outlined text-[#adc6ff] mb-2">psychology</span>
                <p className="text-[13px] font-medium text-[#c2c6d6]">Cognitive Mapping</p>
              </div>
              <div className="p-6 bg-[#1e2024] rounded-xl border border-[#424754]">
                <span className="material-symbols-outlined text-[#4edea3] mb-2">verified</span>
                <p className="text-[13px] font-medium text-[#c2c6d6]">Entity Extraction</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success state ── */}
      {uploadState === "success" && (
        <div className="absolute inset-0 glass-card rounded-[2rem] flex flex-col items-center justify-center p-16 z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#4edea3]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4edea3] text-5xl">check_circle</span>
            </div>
            <div>
              <h3 className="text-[24px] font-medium text-white">Analysis Complete</h3>
              <p className="text-[15px] text-[#c2c6d6] mt-2">
                Resume parsed successfully. Redirecting to results…
              </p>
            </div>
            {/* TODO: Replace with router.push(`/resumes/${parsedId}`) */}
          </div>
        </div>
      )}

      {/* ── Error state ── */}
      {uploadState === "error" && (
        <div className="absolute inset-0 glass-card rounded-[2rem] flex flex-col items-center justify-center p-16 z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ffb4ab]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ffb4ab] text-5xl">error</span>
            </div>
            <div>
              <h3 className="text-[24px] font-medium text-white">Upload Failed</h3>
              <p className="text-[15px] text-[#c2c6d6] mt-2">
                Something went wrong. Please check your file and try again.
              </p>
            </div>
            <button
              className="mt-2 px-8 py-3 bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 rounded-full text-[13px] font-medium hover:bg-[#ffb4ab]/20 transition-all active:scale-95"
              onClick={onBrowseClick}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({
  title,
  body,
  linkText,
  linkHref,
  bodySuffix,
}: {
  title: string;
  body: string;
  linkText?: string;
  linkHref?: string;
  bodySuffix?: string;
}) {
  return (
    <div className="p-6 glass-card rounded-xl">
      <h4 className="text-[13px] font-bold text-[#adc6ff] mb-4 uppercase tracking-wide">{title}</h4>
      <p className="text-[15px] text-[#c2c6d6]">
        {body}
        {linkText && linkHref && (
          <a href={linkHref} className="text-[#adc6ff] underline ml-1">
            {linkText}
          </a>
        )}
        {bodySuffix}
      </p>
    </div>
  );
}

function MobileBottomNav() {
  const items = [
    { icon: "home",           label: "Home",    active: false },
    { icon: "history",        label: "History", active: false },
    { icon: "add_circle",     label: "Upload",  active: true  },
    { icon: "account_circle", label: "Profile", active: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/90 backdrop-blur-lg border-t border-[#424754] rounded-t-[0.75rem] shadow-[0px_-8px_32px_rgba(0,0,0,0.8)]">
      {items.map(({ icon, label, active }) => (
        <a
          key={label}
          href="#"
          className={`flex flex-col items-center transition-all active:scale-90 ${
            active ? "text-[#adc6ff]" : "text-[#c2c6d6] hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-[13px] font-medium">{label}</span>
        </a>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-[#424754] py-16 w-full bg-[#111318]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
        <div className="mb-6 md:mb-0">
          <span className="text-[24px] font-medium text-white">RecruitAI</span>
          <p className="text-[15px] text-[#c2c6d6] mt-1">© 2024 RecruitAI. Precision Intelligence.</p>
        </div>
        <div className="flex gap-10">
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  // const router = useRouter(); // TODO: uncomment for redirect after parse

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress]       = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusLabel, setStatusLabel]   = useState(ANALYSIS_STEPS[0].label);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Simulated upload progress (replace body with real axios call) ──
  const startUpload = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadState("uploading");
    setProgress(0);
    setStatusLabel(ANALYSIS_STEPS[0].label);

    // TODO: Replace simulation below with actual API call:
    //
    // const formData = new FormData();
    // formData.append("file", file);
    // try {
    //   const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
    //     onUploadProgress: (evt) => {
    //       const pct = Math.round((evt.loaded * 100) / (evt.total ?? 1));
    //       setProgress(pct);
    //       setStatusLabel(getStatusLabel(pct));
    //     },
    //   });
    //   setUploadState("success");
    //   setTimeout(() => router.push(`/resumes/${response.data.id}`), 1500);
    // } catch {
    //   setUploadState("error");
    // }

    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(intervalRef.current!);
        setProgress(100);
        setStatusLabel("Analysis Complete");
        setUploadState("success");
        // TODO: router.push(`/resumes/${parsedId}`) after real API
        setTimeout(() => {
          setUploadState("idle");
          setProgress(0);
          setSelectedFile(null);
        }, 2000);
        return;
      }
      setProgress(current);
      setStatusLabel(getStatusLabel(current));
    }, 200);
  }, []);

  const handleFileDrop = useCallback(
    (file: File) => startUpload(file),
    [startUpload]
  );

  const handleBrowseClick = () => {
    if (uploadState === "uploading") return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startUpload(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:wght@400&display=swap');

        body { font-family: 'Geist', sans-serif; background-color: #050505; }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1E293B;
        }

        .marching-ants {
          background-image:
            linear-gradient(90deg, #4d8eff 50%, transparent 50%),
            linear-gradient(90deg, #4d8eff 50%, transparent 50%),
            linear-gradient(0deg,  #4d8eff 50%, transparent 50%),
            linear-gradient(0deg,  #4d8eff 50%, transparent 50%);
          background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
          background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
          background-position: left top, right bottom, left bottom, right top;
          animation: border-dance 1s infinite linear;
        }

        @keyframes border-dance {
          0%   { background-position: left top, right bottom, left bottom, right top; }
          100% { background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px; }
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="bg-[#111318] text-white min-h-screen selection:bg-[#adc6ff]/30">
        <TopNav />
        <Sidebar />

        <main className="md:pl-[240px] pt-16 min-h-screen flex flex-col">
          <section className="flex-grow px-8 py-10 max-w-5xl mx-auto w-full">
            {/* Page header */}
            <header className="mb-16 text-center md:text-left">
              <h1 className="text-[48px] font-semibold tracking-[-0.03em] leading-[1.1] text-white mb-1">
                Analyze Resume
              </h1>
              <p className="text-[18px] leading-relaxed text-[#c2c6d6] max-w-2xl">
                Deploy our neural engine to extract skills, experience, and cultural fit markers with
                99.4% precision.
              </p>
            </header>

            {/* Drop zone */}
            <DropZone
              uploadState={uploadState}
              progress={progress}
              statusLabel={statusLabel}
              selectedFile={selectedFile}
              onFileDrop={handleFileDrop}
              onBrowseClick={handleBrowseClick}
              fileInputRef={fileInputRef}
              onFileInputChange={handleFileInputChange}
            />

            {/* Info cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {INFO_CARDS.map((card) => (
                <InfoCard
                  key={card.title}
                  title={card.title}
                  body={card.body}
                  linkText={card.linkText}
                  linkHref={card.linkHref}
                  bodySuffix={card.bodySuffix}
                />
              ))}
            </div>
          </section>

          <Footer />
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}