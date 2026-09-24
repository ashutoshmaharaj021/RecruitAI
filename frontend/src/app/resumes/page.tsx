"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { getStoredUser, logout } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Resume {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  raw_text: string;
  filename?: string;
}

interface CandidateProfile {
  user_id: number;
  name: string;
  email: string;
  role: string;

  phone: string | null;
  date_of_birth: string | null;
  location: string | null;
  bio: string | null;

  college: string | null;
  course: string | null;
  branch: string | null;
  current_year: number | null;
  graduation_year: number | null;
  cgpa: number | null;

  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSkills(skills: string) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function calculateProfileCompletion(profile: CandidateProfile | null) {
  if (!profile) return 0;

  const fields = [
    profile.phone,
    profile.date_of_birth,
    profile.location,
    profile.bio,
    profile.college,
    profile.course,
    profile.branch,
    profile.current_year,
    profile.graduation_year,
    profile.cgpa,
    profile.github_url,
    profile.linkedin_url,
    profile.portfolio_url,
  ];

  const completed = fields.filter(
    (field) => field !== null && field !== undefined && field !== ""
  ).length;

  return Math.round((completed / fields.length) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function Icon({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar() {
  const items = [
    {
      icon: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      active: false,
    },
    {
      icon: "description",
      label: "Resumes",
      href: "/resumes",
      active: true,
    },
    {
      icon: "cloud_upload",
      label: "Uploads",
      href: "/upload",
      active: false,
    },
    {
      icon: "settings",
      label: "Settings",
      href: "#",
      active: false,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-1 w-[240px] fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0c0e12] border-r border-[#424754] px-4 pt-6 z-40">
      {items.map(({ icon, label, href, active }) => {
        if (label === "Settings") {
          return (
            <div
              key={label}
              title="Settings page coming soon"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#8c909f] cursor-not-allowed"
            >
              <Icon>{icon}</Icon>

              <span className="text-[15px]">{label}</span>
            </div>
          );
        }

        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
              active
                ? "bg-[#4d8eff]/10 text-[#adc6ff]"
                : "text-[#c2c6d6] hover:bg-[#333539]/50 hover:text-white"
            }`}
          >
            <Icon>{icon}</Icon>

            <span className="text-[15px]">{label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top Navigation
// ─────────────────────────────────────────────────────────────────────────────

function TopNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111318]/90 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
      <Link href="/" className="flex items-center gap-1">
        <Icon className="text-[#adc6ff]">clinical_notes</Icon>

        <span className="text-2xl font-bold tracking-tighter text-white">
          RecruitAI
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link
          href="/dashboard"
          className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
        >
          Dashboard
        </Link>

        <Link
          href="/resumes"
          className="text-[15px] text-[#adc6ff] font-medium"
        >
          Resumes
        </Link>

        <Link
          href="/upload"
          className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
        >
          Uploads
        </Link>

        <span
          className="text-[15px] text-[#8c909f] cursor-not-allowed"
          title="Settings page coming soon"
        >
          Settings
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/upload"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#adc6ff] text-[#002e6a] text-[13px] font-medium hover:brightness-110 transition-all"
        >
          <Icon className="text-[18px]">cloud_upload</Icon>
          Quick Upload
        </Link>

        <Link
          href="/profile"
          title="My Profile"
          className="w-9 h-9 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center text-[#c2c6d6] hover:text-white hover:border-[#adc6ff]/40 transition-all"
        >
          <Icon className="text-[20px]">account_circle</Icon>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          title="Logout"
          className="w-9 h-9 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center text-[#c2c6d6] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/40 transition-all"
        >
          <Icon className="text-[20px]">logout</Icon>
        </button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Bottom Navigation
// ─────────────────────────────────────────────────────────────────────────────

function MobileBottomNav() {
  const items = [
    {
      icon: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: "description",
      label: "Resumes",
      href: "/resumes",
    },
    {
      icon: "cloud_upload",
      label: "Upload",
      href: "/upload",
    },
    {
      icon: "person",
      label: "Profile",
      href: "/profile",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/95 backdrop-blur-lg border-t border-[#424754]">
      {items.map(({ icon, label, href }) => {
        const active = label === "Resumes";

        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center gap-1 transition-all ${
              active
                ? "text-[#adc6ff]"
                : "text-[#c2c6d6] hover:text-white"
            }`}
          >
            <Icon>{icon}</Icon>

            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ResumesPage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // Authentication + data loading
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "candidate") {
      router.replace("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Resume[]>("/resumes");

        setResumes(response.data);
      } catch (err: any) {
        console.error("Failed to fetch resumes:", err);

        if (err.response?.status === 401) {
          router.replace("/login");
          return;
        }

        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        setError(
          err.response?.data?.detail ||
            "Unable to load your resumes. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }

      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await api.get<CandidateProfile>("/profile");

        setProfile(response.data);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);

        if (err.response?.status === 401) {
          router.replace("/login");
          return;
        }

        setProfileError("Profile information could not be loaded.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // ───────────────────────────────────────────────────────────────────────────
  // Skills
  // ───────────────────────────────────────────────────────────────────────────

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();

    resumes.forEach((resume) => {
      getSkills(resume.skills).forEach((skill) => {
        skillSet.add(skill);
      });
    });

    return Array.from(skillSet).sort();
  }, [resumes]);

  // ───────────────────────────────────────────────────────────────────────────
  // Filter resumes
  // ───────────────────────────────────────────────────────────────────────────

  const filteredResumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resumes.filter((resume) => {
      const matchesSearch =
        !query ||
        (resume.name || "").toLowerCase().includes(query) ||
        (resume.email || "").toLowerCase().includes(query) ||
        (resume.phone || "").toLowerCase().includes(query) ||
        (resume.skills || "").toLowerCase().includes(query) ||
        (resume.filename || "").toLowerCase().includes(query);

      const resumeSkills = getSkills(resume.skills);

      const matchesSkill =
        selectedSkill === "all" ||
        resumeSkills.some(
          (skill) =>
            skill.toLowerCase() === selectedSkill.toLowerCase()
        );

      return matchesSearch && matchesSkill;
    });
  }, [resumes, searchQuery, selectedSkill]);

  // ───────────────────────────────────────────────────────────────────────────
  // Delete
  // ───────────────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      // IMPORTANT:
      // Use the authenticated API client so the JWT is sent.
      await api.delete(`/resumes/${id}`);

      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume.id !== id)
      );
    } catch (error: any) {
      console.error("Failed to delete resume:", error);

      if (error.response?.status === 401) {
        router.replace("/login");
        return;
      }

      if (error.response?.status === 404) {
        alert("Resume not found or you do not have access to it.");
        return;
      }

      alert(
        error.response?.data?.detail ||
          "Failed to delete resume. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Logout
  // ───────────────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Profile completion
  // ───────────────────────────────────────────────────────────────────────────

  const profileCompletion = calculateProfileCompletion(profile);

  // ───────────────────────────────────────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111318] text-white flex items-center justify-center">
        <div className="text-center">
          <Icon className="text-[#adc6ff] text-[48px] animate-spin">
            progress_activity
          </Icon>

          <p className="text-[#c2c6d6] mt-4">
            Loading your resume workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');

        body {
          font-family: 'Geist', sans-serif;
          background-color: #050505;
        }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1E293B;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          border-color: rgba(77, 142, 255, 0.45);
          box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.6);
        }

        .material-symbols-outlined {
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
        }
      `}</style>

      <div className="min-h-screen bg-[#111318] text-white">
        <TopNav onLogout={handleLogout} />

        <Sidebar />

        <main className="md:ml-[240px] pt-24 pb-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Header */}
            {/* ──────────────────────────────────────────────────────────────── */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[13px] uppercase tracking-widest text-[#4edea3] font-medium mb-3">
                  Resume Intelligence
                </p>

                <h1 className="text-[40px] font-semibold tracking-[-0.03em]">
                  My Resume
                </h1>

                <p className="text-[15px] text-[#c2c6d6] mt-3 max-w-2xl">
                  Manage your resume, review parsed information, and keep your
                  candidate profile ready for opportunities.
                </p>
              </div>

              <Link
                href="/upload"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-[14px] font-medium hover:brightness-110 transition-all"
              >
                <Icon className="text-[20px]">cloud_upload</Icon>
                Upload New Resume
              </Link>
            </div>

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Main Resume + Profile Completion */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {!error && (
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

                {/* Resume Card */}
                <div className="xl:col-span-2 glass-card rounded-2xl p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                        <Icon className="text-[#adc6ff] text-[28px]">
                          description
                        </Icon>
                      </div>

                      <div>
                        <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                          Current Resume
                        </p>

                        <h2 className="text-xl font-semibold mt-1">
                          {resumes.length > 0
                            ? resumes[0].filename || "Uploaded Resume"
                            : "No resume uploaded"}
                        </h2>

                        {resumes.length > 0 && (
                          <p className="text-[13px] text-[#8c909f] mt-1">
                            Resume ID #{resumes[0].id}
                          </p>
                        )}
                      </div>
                    </div>

                    {resumes.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 text-[12px] font-medium">
                        Parsed
                      </span>
                    )}
                  </div>

                  {resumes.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
                        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                          <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                            Name
                          </p>

                          <p className="text-sm text-white mt-2 truncate">
                            {resumes[0].name || "Not detected"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                          <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                            Email
                          </p>

                          <p className="text-sm text-white mt-2 truncate">
                            {resumes[0].email || "Not detected"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                          <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                            Skills
                          </p>

                          <p className="text-sm text-white mt-2">
                            {getSkills(resumes[0].skills).length} detected
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-7">
                        <Link
                          href={`/resumes/${resumes[0].id}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4d8eff] text-white text-[13px] font-medium hover:brightness-110 transition-all"
                        >
                          <Icon className="text-[18px]">visibility</Icon>
                          View Resume
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(resumes[0].id)}
                          disabled={deletingId === resumes[0].id}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/5 text-[#ffb4ab] text-[13px] font-medium hover:bg-[#ffb4ab]/10 transition-all disabled:opacity-50"
                        >
                          <Icon className="text-[18px]">
                            {deletingId === resumes[0].id
                              ? "progress_activity"
                              : "delete"}
                          </Icon>

                          {deletingId === resumes[0].id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-7 rounded-xl border border-dashed border-[#424754] bg-white/[0.02] p-7">
                      <div className="flex items-start gap-4">
                        <Icon className="text-[#8c909f] text-[30px]">
                          upload_file
                        </Icon>

                        <div>
                          <h3 className="font-medium">
                            Your resume is waiting here
                          </h3>

                          <p className="text-sm text-[#8c909f] mt-1">
                            Upload a PDF resume and RecruitAI will parse its
                            information and skills.
                          </p>

                          <Link
                            href="/upload"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-[#4d8eff] text-white text-[13px] font-medium hover:brightness-110"
                          >
                            <Icon className="text-[18px]">
                              cloud_upload
                            </Icon>
                            Upload Resume
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="glass-card rounded-2xl p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                        Candidate Profile
                      </p>

                      <h2 className="text-xl font-semibold mt-2">
                        Profile Completion
                      </h2>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                      <Icon className="text-[#adc6ff]">
                        person
                      </Icon>
                    </div>
                  </div>

                  {profileLoading ? (
                    <div className="mt-8">
                      <Icon className="text-[#adc6ff] animate-spin">
                        progress_activity
                      </Icon>
                    </div>
                  ) : profileError ? (
                    <p className="text-sm text-[#8c909f] mt-7">
                      {profileError}
                    </p>
                  ) : (
                    <>
                      <div className="flex items-end justify-between mt-8">
                        <span className="text-4xl font-semibold">
                          {profileCompletion}%
                        </span>

                        <span className="text-xs text-[#8c909f] pb-1">
                          completed
                        </span>
                      </div>

                      <div className="mt-4 h-2 rounded-full bg-[#282a2e] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4d8eff] transition-all"
                          style={{
                            width: `${profileCompletion}%`,
                          }}
                        />
                      </div>

                      <p className="text-[13px] text-[#8c909f] mt-4 leading-relaxed">
                        Complete your profile so recruiters can understand
                        your background beyond your resume.
                      </p>

                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 mt-6 text-[13px] text-[#adc6ff] hover:text-white transition-colors"
                      >
                        Complete Profile
                        <Icon className="text-[17px]">
                          arrow_forward
                        </Icon>
                      </Link>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Error */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {error && (
              <div className="glass-card rounded-2xl p-10 text-center border-[#ffb4ab]/30 mb-6">
                <Icon className="text-[#ffb4ab] text-[48px]">
                  error
                </Icon>

                <h2 className="text-xl font-medium mt-4">
                  Something went wrong
                </h2>

                <p className="text-[#c2c6d6] mt-2">
                  {error}
                </p>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-[#4d8eff] text-white rounded-xl font-medium hover:brightness-110 transition-all"
                >
                  Back to Dashboard
                </Link>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Detected Skills */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {!error && resumes.length > 0 && (
              <section className="glass-card rounded-2xl p-7 mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                      Resume Intelligence
                    </p>

                    <h2 className="text-xl font-semibold mt-2">
                      Detected Skills
                    </h2>

                    <p className="text-sm text-[#8c909f] mt-1">
                      Skills extracted from your uploaded resume.
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/20 flex items-center justify-center">
                    <Icon className="text-[#4edea3]">
                      psychology
                    </Icon>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {getSkills(resumes[0].skills).length > 0 ? (
                    getSkills(resumes[0].skills).map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-3 py-1.5 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] border border-[#adc6ff]/20 text-[12px] font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#8c909f]">
                      No skills were detected in this resume.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Resume Summary + Education */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {!error && (
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Resume Summary */}
                <div className="glass-card rounded-2xl p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                        Parsed Information
                      </p>

                      <h2 className="text-xl font-semibold mt-2">
                        Resume Summary
                      </h2>
                    </div>

                    <Icon className="text-[#adc6ff]">
                      summarize
                    </Icon>
                  </div>

                  {resumes.length > 0 ? (
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between gap-5">
                        <span className="text-sm text-[#8c909f]">
                          Name
                        </span>

                        <span className="text-sm text-white text-right">
                          {resumes[0].name || "Not detected"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-5">
                        <span className="text-sm text-[#8c909f]">
                          Email
                        </span>

                        <span className="text-sm text-white text-right break-all">
                          {resumes[0].email || "Not detected"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-5">
                        <span className="text-sm text-[#8c909f]">
                          Phone
                        </span>

                        <span className="text-sm text-white text-right">
                          {resumes[0].phone || "Not detected"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-5">
                        <span className="text-sm text-[#8c909f]">
                          Skills detected
                        </span>

                        <span className="text-sm text-white text-right">
                          {getSkills(resumes[0].skills).length}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-[#424754]">
                        <p className="text-[12px] text-[#8c909f]">
                          Extracted resume text
                        </p>

                        <p className="text-sm text-[#c2c6d6] mt-2 line-clamp-4 leading-relaxed">
                          {resumes[0].raw_text ||
                            "No extracted text available."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8c909f] mt-6">
                      Upload a resume to see parsed information here.
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="glass-card rounded-2xl p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                        Candidate Profile
                      </p>

                      <h2 className="text-xl font-semibold mt-2">
                        Education
                      </h2>
                    </div>

                    <Icon className="text-[#adc6ff]">
                      school
                    </Icon>
                  </div>

                  {profileLoading ? (
                    <div className="mt-6">
                      <Icon className="text-[#adc6ff] animate-spin">
                        progress_activity
                      </Icon>
                    </div>
                  ) : profile ? (
                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                          College / University
                        </p>

                        <p className="text-sm text-white mt-1">
                          {profile.college || "Not added"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                          Course
                        </p>

                        <p className="text-sm text-white mt-1">
                          {profile.course || "Not added"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                          Branch
                        </p>

                        <p className="text-sm text-white mt-1">
                          {profile.branch || "Not added"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                            Current Year
                          </p>

                          <p className="text-sm text-white mt-1">
                            {profile.current_year
                              ? `Year ${profile.current_year}`
                              : "Not added"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                            Graduation
                          </p>

                          <p className="text-sm text-white mt-1">
                            {profile.graduation_year || "Not added"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-[#8c909f]">
                          CGPA
                        </p>

                        <p className="text-sm text-white mt-1">
                          {profile.cgpa !== null
                            ? profile.cgpa
                            : "Not added"}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 mt-2 text-[13px] text-[#adc6ff] hover:text-white transition-colors"
                      >
                        Edit Education
                        <Icon className="text-[17px]">
                          arrow_forward
                        </Icon>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8c909f] mt-6">
                      Complete your profile to add your education.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Multiple Resumes */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {!error && resumes.length > 1 && (
              <section className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                      Resume Library
                    </p>

                    <h2 className="text-2xl font-semibold mt-2">
                      Your Resumes
                    </h2>
                  </div>

                  <span className="text-sm text-[#8c909f]">
                    {filteredResumes.length} of {resumes.length} shown
                  </span>
                </div>

                {/* Search + filter */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f]">
                        search
                      </Icon>

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                        placeholder="Search your resumes..."
                        className="w-full bg-[#0c0e12] border border-[#424754] rounded-xl py-3.5 pl-12 pr-12 text-[14px] text-white placeholder:text-[#6f7380] outline-none focus:border-[#4d8eff] transition-colors"
                      />

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-white"
                        >
                          <Icon className="text-[20px]">
                            close
                          </Icon>
                        </button>
                      )}
                    </div>

                    <div className="relative md:w-64">
                      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] pointer-events-none">
                        filter_list
                      </Icon>

                      <select
                        value={selectedSkill}
                        onChange={(e) =>
                          setSelectedSkill(e.target.value)
                        }
                        className="w-full appearance-none bg-[#0c0e12] border border-[#424754] rounded-xl py-3.5 pl-12 pr-10 text-[14px] text-white outline-none focus:border-[#4d8eff] transition-colors cursor-pointer"
                      >
                        <option value="all">All Skills</option>

                        {allSkills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>

                      <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c909f] pointer-events-none">
                        expand_more
                      </Icon>
                    </div>
                  </div>
                </div>

                {filteredResumes.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <Icon className="text-[#8c909f] text-[48px]">
                      search_off
                    </Icon>

                    <h3 className="text-xl font-medium mt-4">
                      No matching resumes
                    </h3>

                    <p className="text-[#8c909f] mt-2">
                      Try another search term or skill.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSkill("all");
                      }}
                      className="mt-5 px-5 py-2.5 rounded-xl bg-[#4d8eff] text-white text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filteredResumes.map((resume) => {
                      const skills = getSkills(resume.skills);

                      return (
                        <div
                          key={resume.id}
                          className="glass-card rounded-2xl p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                                <Icon className="text-[#adc6ff]">
                                  description
                                </Icon>
                              </div>

                              <div>
                                <h3 className="font-medium">
                                  {resume.filename ||
                                    `Resume #${resume.id}`}
                                </h3>

                                <p className="text-xs text-[#8c909f] mt-1">
                                  Resume ID #{resume.id}
                                </p>
                              </div>
                            </div>

                            <span className="text-xs text-[#4edea3]">
                              Parsed
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {skills.slice(0, 8).map((skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="px-2.5 py-1 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] border border-[#adc6ff]/20 text-[11px]"
                              >
                                {skill}
                              </span>
                            ))}

                            {skills.length > 8 && (
                              <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#8c909f] text-[11px]">
                                +{skills.length - 8} more
                              </span>
                            )}
                          </div>

                          <div className="mt-6 pt-5 border-t border-[#424754] flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleDelete(resume.id)}
                              disabled={deletingId === resume.id}
                              className="flex items-center gap-1 text-[13px] text-[#ffb4ab] hover:text-white disabled:opacity-50"
                            >
                              <Icon className="text-[18px]">
                                {deletingId === resume.id
                                  ? "progress_activity"
                                  : "delete"}
                              </Icon>

                              {deletingId === resume.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                            <Link
                              href={`/resumes/${resume.id}`}
                              className="flex items-center gap-1 text-[13px] text-[#adc6ff] hover:text-white"
                            >
                              View Resume

                              <Icon className="text-[18px]">
                                arrow_forward
                              </Icon>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* Future Features */}
            {/* ──────────────────────────────────────────────────────────────── */}

            {!error && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4d8eff]/10 flex items-center justify-center">
                      <Icon className="text-[#adc6ff]">
                        work
                      </Icon>
                    </div>

                    <div>
                      <h3 className="font-medium">
                        Job Matches
                      </h3>

                      <p className="text-xs text-[#8c909f] mt-1">
                        Resume-to-job matching will appear here.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-dashed border-[#424754] p-4">
                    <p className="text-sm text-[#8c909f]">
                      Matching is coming in the next stage.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4edea3]/10 flex items-center justify-center">
                      <Icon className="text-[#4edea3]">
                        analytics
                      </Icon>
                    </div>

                    <div>
                      <h3 className="font-medium">
                        Resume Insights
                      </h3>

                      <p className="text-xs text-[#8c909f] mt-1">
                        Advanced resume analysis will appear here.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-dashed border-[#424754] p-4">
                    <p className="text-sm text-[#8c909f]">
                      ATS and resume insights will be added later.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="md:ml-[240px] border-t border-[#424754] bg-[#0c0e12] py-10">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-bold tracking-tighter">
              RecruitAI
            </span>

            <span className="text-[13px] text-[#8c909f]">
              Resume Intelligence Platform
            </span>
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
}