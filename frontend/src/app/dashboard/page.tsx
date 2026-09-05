"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
}

interface Stat {
  label: string;
  value: string;
  sub: React.ReactNode;
}

const STATS: Stat[] = [
  {
    label: "Total Parsed",
    value: "1,284",
    sub: (
      <div className="flex items-center gap-1 text-[#4edea3]">
        <span className="material-symbols-outlined text-base">trending_up</span>
        <span className="text-[13px] font-medium">+12% from last month</span>
      </div>
    ),
  },
  {
    label: "Accuracy",
    value: "98.4%",
    sub: (
      <div className="w-full bg-[#333539] rounded-full h-1">
        <div
          className="bg-[#adc6ff] h-full rounded-full"
          style={{ width: "98.4%" }}
        />
      </div>
    ),
  },
  {
    label: "Pending",
    value: "14",
    sub: (
      <div className="flex items-center gap-1 text-[#ffb786]">
        <span className="material-symbols-outlined text-base">timer</span>
        <span className="text-[13px] font-medium">Average wait: 2m</span>
      </div>
    ),
  },
];

const CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Alexander Thorne",
    role: "Senior Full Stack Engineer",
    email: "a.thorne@vortex-tech.io",
    parsedAt: "Parsed 2m ago",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWASDD7SmLc27tGIUQ6j2kZBcgGQR90frLfVaoLoT2ni1__YYkNWfmg8RYdM75vTSdULbc_0eI39ZevXFG6wosHL5voEb7zGiI6IxjmPh67P1E41ZCGCnPO7IdS67mCkCDaB_5Qm6pGjSJUdNyG65KsNIaGpNp2Rf6PgPO75uFvYwo7nEOph4nwUDo31NkgMHgCgxTCESjCw-CQYtfRAT_1KqEQu_qhK3EHeN7R7KUyMoEd59xc10DBGW9jd1YcNmcaz7ePp3lTw4",
    statusColor: "secondary",
    skills: [
      { label: "React", variant: "primary" },
      { label: "Python", variant: "primary" },
      { label: "AWS", variant: "primary" },
    ],
    extraSkills: 4,
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "Lead Product Designer",
    email: "elena.rdz@design-core.com",
    parsedAt: "Parsed 15m ago",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOFERpzLWu0dOC3ZVNmV2LF6vb4JLfEi885gYdY-5QQrg7caHiCSwf40mhYmnA0FuRsdXTjQCk0YUPEE1o4CHSDajEDfJbiIsSqd1jxiCCNldvUgwS2xiEK9caJ1e9OnCtvgJI-efy2wtwr_9uGx1fe0LdYdY9D9F5alfRndIMn9f6W-l_80uGe2Qpa84muyZ3r6hkecl1y6c5kPiUuZJ2-cT--HcS2bAQ0KunwUP-UYr_4RRPsitr_noHFr73pBEWS8jpcf0VaEM",
    statusColor: "secondary",
    skills: [
      { label: "Figma", variant: "secondary" },
      { label: "Design Systems", variant: "secondary" },
      { label: "Prototyping", variant: "secondary" },
    ],
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Machine Learning Engineer",
    email: "m.chen@ai-labs.org",
    parsedAt: "Parsed 1h ago",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDv3u5KiV6AcOlih-i6ePNsxhsxZAIvr6zxfIghK_VPCHfma_jd7QEWrZKHultRpvmF4SV4_09p18ofq91cuFR0lqVGSeVzQrsGNs8z6G5sFwKSPZyG9JBc1L6z3NI_YtFXauNUMkYJa02OsoWtW5og6EI-m80rw1O7DG7-igJhaFdugnyCmnsfGwHC7bx7J3MbG04hcyvqhlEgDrxewLyQdiNQjYaImyu33TS1_8MO4FyJch8Cv2Dswt4eWS8B68QTsF0NecDpqsw",
    statusColor: "tertiary",
    skills: [
      { label: "PyTorch", variant: "tertiary" },
      { label: "Kubernetes", variant: "tertiary" },
      { label: "NLP", variant: "tertiary" },
    ],
  },
];

const SKILL_STYLES: Record<string, string> = {
  primary: "bg-[#4d8eff]/10 text-[#adc6ff] border border-[#adc6ff]/20",
  secondary: "bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20",
  tertiary: "bg-[#ffb786]/10 text-[#ffb786] border border-[#ffb786]/20",
};

const STATUS_DOT: Record<string, string> = {
  secondary: "bg-[#4edea3]",
  tertiary: "bg-[#ffb786]",
};

function getSkills(skills: string) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function TopNav() {
  return (
    <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[#adc6ff]">
          clinical_notes
        </span>
        <span className="text-2xl font-bold text-white tracking-tighter">
          RecruitAI
        </span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-10">
        {[
          { label: "Dashboard", active: true },
          { label: "Resumes", active: false },
          { label: "Uploads", active: false },
          { label: "Settings", active: false },
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

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-1 bg-[#adc6ff] text-[#002e6a] px-4 py-2 rounded-xl text-[13px] font-medium active:scale-95 transition-transform glow-button">
          <span className="material-symbols-outlined text-[18px]">
            cloud_upload
          </span>
          Quick Upload
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#424754]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj4sgkLtVeNsAhlNNCtZ4ic-6UoNmL6gs3sK0aiqmdCOiHhRAZiWsv1vrAi_IvMEAClFHLOqpcZCFo-e7fwmQVqPrDj-ufIzLfUtjL4pGdZT_F9f9eGRTMDJO6PmSIeO4m0bbUgl2Drfucj4mbjyFmm9ChNBGIDQUXgO1zKxx1Mu6KgJ9Rjkghjf3wOK5UQivnpi3hQbriJe_e20lI29zqBMemwO4lOuhmyO0mRjqoA7D1Mi2im08-GqodnHaGcm6Mzm3VxqVRLqY"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

function Sidebar() {
  const items = [
    { icon: "dashboard", label: "Dashboard", active: true },
    { icon: "description", label: "Resumes", active: false },
    { icon: "cloud_upload", label: "Uploads", active: false },
    { icon: "settings", label: "Settings", active: false },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-1 w-[240px] fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0c0e12] border-r border-[#424754] px-4 pt-6 z-40">
      {items.map(({ icon, label, active }) => (
        <div
          key={label}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all active:opacity-80 ${
            active
              ? "bg-[#4d8eff]/10 text-[#adc6ff]"
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

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="glass-card gradient-border p-6 flex flex-col justify-between rounded-xl">
      <div>
        <p className="text-[13px] font-medium text-[#c2c6d6] uppercase tracking-widest">
          {stat.label}
        </p>
        <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-white mt-1">
          {stat.value}
        </h2>
      </div>
      <div className="mt-4">{stat.sub}</div>
    </div>
  );
}

function SkillBadge({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[13px] font-medium ${SKILL_STYLES[variant] ?? SKILL_STYLES.primary}`}
    >
      {label}
    </span>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const skills = getSkills(candidate.skills);

  return (
    <div className="glass-card gradient-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group rounded-xl">
      {/* Avatar + Name */}
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#adc6ff]">
              person
            </span>
          </div>

          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4edea3] border-2 border-[#111318] rounded-full" />
        </div>

        <div>
          <h3 className="text-[24px] font-medium text-white group-hover:text-[#adc6ff] transition-colors leading-tight">
            {candidate.name || "Unknown Candidate"}
          </h3>

          <p className="text-[15px] text-[#c2c6d6]">Resume #{candidate.id}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill, index) => (
          <SkillBadge
            key={`${skill}-${index}`}
            label={skill}
            variant={
              index % 3 === 0
                ? "primary"
                : index % 3 === 1
                  ? "secondary"
                  : "tertiary"
            }
          />
        ))}

        {skills.length > 4 && (
          <span className="px-3 py-1 rounded-full bg-[#333539]/50 text-[#c2c6d6] text-[13px] font-medium">
            +{skills.length - 4} skills
          </span>
        )}
      </div>

      {/* Contact */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-[14px] font-mono text-[#c2c6d6]">
            {candidate.email || "No email"}
          </p>

          <p className="text-[13px] text-[#8c909f]">
            {candidate.phone || "No phone"}
          </p>
        </div>

        <button
          className="p-2 hover:bg-[#333539] rounded-xl transition-all"
          onClick={() => {
            window.location.href = "/resumes";
          }}
        >
          <span className="material-symbols-outlined text-[#8c909f]">
            open_in_new
          </span>
        </button>
      </div>
    </div>
  );
}

function DropZone() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFileName(f.name);
  };

  return (
    <div
      className={`w-full border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group ${
        dragging
          ? "border-[#adc6ff]/80 bg-[#1a1c20]/60"
          : "border-[#424754] hover:border-[#adc6ff]/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <span
        className={`material-symbols-outlined text-[48px] transition-colors ${
          dragging
            ? "text-[#adc6ff]"
            : "text-[#424754] group-hover:text-[#adc6ff]"
        }`}
      >
        upload_file
      </span>
      <div className="text-center">
        <h4 className="text-[24px] font-medium text-white">
          {fileName ? fileName : "Drop resumes here to parse"}
        </h4>
        <p className="text-[15px] text-[#c2c6d6]">
          Supports PDF, DOCX, and JSON (max 10MB each)
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.json"
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </div>
  );
}

function MobileBottomNav() {
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

function Footer() {
  return (
    <footer className="w-full py-16 border-t border-[#424754] bg-[#111318]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
        <span className="text-[24px] font-bold text-white tracking-tighter">
          RecruitAI
        </span>
        <div className="flex gap-10">
          {["Privacy", "Terms", "API Docs", "Contact"].map((l) => (
            <span
              key={l}
              className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors cursor-pointer"
            >
              {l}
            </span>
          ))}
        </div>
        <span className="text-[15px] text-[#c2c6d6]">
          © 2024 RecruitAI. Precision Intelligence.
        </span>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get<Candidate[]>(
          "http://127.0.0.1:8000/resumes",
        );

        setResumes(response.data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        setError("Unable to load resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const totalParsed = resumes.length;

  const STATS: Stat[] = [
    {
      label: "Total Parsed",
      value: totalParsed.toString(),
      sub: (
        <div className="flex items-center gap-1 text-[#4edea3]">
          <span className="material-symbols-outlined text-base">database</span>

          <span className="text-[13px] font-medium">Stored in PostgreSQL</span>
        </div>
      ),
    },
    {
      label: "Parser Status",
      value: "Active",
      sub: (
        <div className="flex items-center gap-1 text-[#4edea3]">
          <span className="material-symbols-outlined text-base">
            check_circle
          </span>

          <span className="text-[13px] font-medium">FastAPI connected</span>
        </div>
      ),
    },
    {
      label: "Database",
      value: "Online",
      sub: (
        <div className="flex items-center gap-1 text-[#4edea3]">
          <span className="material-symbols-outlined text-base">storage</span>

          <span className="text-[13px] font-medium">PostgreSQL</span>
        </div>
      ),
    },
  ];
  return (
    <>
      {/* Material Symbols font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        body { font-family: 'Geist', sans-serif; background-color: #050505; }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1E293B;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
          border-color: #4d8eff;
          box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.8);
        }
        .gradient-border {
          position: relative;
          border-radius: 0.5rem;
        }
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
          padding: 1px;
          background: linear-gradient(135deg, #424754 0%, transparent 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glow-button { box-shadow: 0 0 15px rgba(77, 142, 255, 0.15); }
        .glow-button:hover { box-shadow: 0 0 25px rgba(77, 142, 255, 0.3); }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="bg-[#111318] text-white min-h-screen">
        <TopNav />
        <Sidebar />

        <main className="md:ml-[240px] pt-24 pb-16 px-8 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </section>

            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-white">
                  Recent Parsed Resumes
                </h1>
                <p className="text-[15px] text-[#c2c6d6] mt-2">
                  Real-time intelligence extraction from active applications.
                </p>
              </div>
              {/* Mobile add button */}
              <button className="md:hidden flex items-center justify-center p-4 bg-[#4d8eff] text-[#00285d] rounded-full active:scale-90 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            {/* Candidate list */}
            <section className="space-y-4">
              {loading && (
                <div className="glass-card rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[48px] animate-spin">
                    progress_activity
                  </span>

                  <p className="text-[#c2c6d6] mt-4">
                    Loading parsed resumes...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="glass-card rounded-xl p-10 text-center">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[48px]">
                    error
                  </span>

                  <p className="text-[#c2c6d6] mt-4">{error}</p>
                </div>
              )}

              {!loading && !error && resumes.length === 0 && (
                <div className="glass-card rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-[#8c909f] text-[48px]">
                    description
                  </span>

                  <p className="text-[#c2c6d6] mt-4">
                    No resumes have been parsed yet.
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                resumes.map((resume) => (
                  <CandidateCard key={resume.id} candidate={resume} />
                ))}
            </section>

            {/* Drop zone */}
            <DropZone />
          </div>
        </main>
  
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
}
