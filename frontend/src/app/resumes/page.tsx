"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Resume {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  raw_text: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSkills(skills: string) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

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
        // Settings is not implemented yet
        if (label === "Settings") {
          return (
            <div
              key={label}
              title="Settings page coming soon"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#8c909f] cursor-not-allowed"
            >
              <span className="material-symbols-outlined">
                {icon}
              </span>

              <span className="text-[15px]">
                {label}
              </span>
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
            <span className="material-symbols-outlined">
              {icon}
            </span>

            <span className="text-[15px]">
              {label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}

// ─── Top Navigation ──────────────────────────────────────────────────────────

function TopNav() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
      {/* Logo */}

      <Link href="/" className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[#adc6ff]">
          clinical_notes
        </span>

        <span className="text-2xl font-bold tracking-tighter text-white">
          RecruitAI
        </span>
      </Link>

      {/* Desktop Navigation */}

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

      {/* Quick Upload */}

      <div className="flex items-center gap-4">
        <Link
          href="/upload"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#adc6ff] text-[#002e6a] text-[13px] font-medium hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            cloud_upload
          </span>

          Quick Upload
        </Link>

        {/* Profile */}

        <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#c2c6d6]">
            account_circle
          </span>
        </div>
      </div>
    </nav>
  );
}

// ─── Mobile Bottom Navigation ────────────────────────────────────────────────

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
            <span className="material-symbols-outlined">
              {icon}
            </span>

            <span className="text-[11px] font-medium">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ─── Fetch resumes ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);

        const response = await axios.get<Resume[]>(
          "http://127.0.0.1:8000/resumes",
        );

        setResumes(response.data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);

        setError(
          "Unable to load resumes. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // ─── Get all unique skills ─────────────────────────────────────────────────

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();

    resumes.forEach((resume) => {
      getSkills(resume.skills).forEach((skill) => {
        skillSet.add(skill);
      });
    });

    return Array.from(skillSet).sort();
  }, [resumes]);

  // ─── Filter resumes ────────────────────────────────────────────────────────

  const filteredResumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resumes.filter((resume) => {
      const matchesSearch =
        !query ||
        resume.name.toLowerCase().includes(query) ||
        resume.email.toLowerCase().includes(query) ||
        resume.phone.toLowerCase().includes(query) ||
        resume.skills.toLowerCase().includes(query);

      const resumeSkills = getSkills(resume.skills);

      const matchesSkill =
        selectedSkill === "all" ||
        resumeSkills.some(
          (skill) =>
            skill.toLowerCase() === selectedSkill.toLowerCase(),
        );

      return matchesSearch && matchesSkill;
    });
  }, [resumes, searchQuery, selectedSkill]);

  // ─── Delete resume ─────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await axios.delete(
        `http://127.0.0.1:8000/resumes/${id}`,
      );

      // Remove from frontend immediately
      setResumes((currentResumes) =>
        currentResumes.filter(
          (resume) => resume.id !== id,
        ),
      );
    } catch (error) {
      console.error("Failed to delete resume:", error);

      alert(
        "Failed to delete resume. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

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
          border-color: #4d8eff;
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
        {/* Top Navigation */}

        <TopNav />

        {/* Sidebar */}

        <Sidebar />

        {/* Main Content */}

        <main className="md:ml-[240px] pt-24 pb-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">

            {/* ───────────── Header ───────────── */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[13px] uppercase tracking-widest text-[#4edea3] font-medium mb-3">
                  Resume Intelligence
                </p>

                <h1 className="text-[40px] font-semibold tracking-[-0.03em]">
                  Resume History
                </h1>

                <p className="text-[15px] text-[#c2c6d6] mt-3">
                  View all resumes parsed and stored in your database.
                </p>
              </div>

              <Link
                href="/upload"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#adc6ff] text-[#002e6a] rounded-xl text-[14px] font-medium hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  cloud_upload
                </span>

                Upload Resume
              </Link>
            </div>

            {/* ───────────── Search & Filter ───────────── */}

            {!loading &&
              !error &&
              filteredResumes.length > 0 && (
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">

                    {/* Search */}

                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f]">
                        search
                      </span>

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                        placeholder="Search by name, email, phone, or skill..."
                        className="w-full bg-[#0c0e12] border border-[#424754] rounded-xl py-3.5 pl-12 pr-12 text-[14px] text-white placeholder:text-[#6f7380] outline-none focus:border-[#4d8eff] transition-colors"
                      />

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            close
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Skill Filter */}

                    <div className="relative md:w-64">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] pointer-events-none">
                        filter_list
                      </span>

                      <select
                        value={selectedSkill}
                        onChange={(e) =>
                          setSelectedSkill(e.target.value)
                        }
                        className="w-full appearance-none bg-[#0c0e12] border border-[#424754] rounded-xl py-3.5 pl-12 pr-10 text-[14px] text-white outline-none focus:border-[#4d8eff] transition-colors cursor-pointer"
                      >
                        <option value="all">
                          All Skills
                        </option>

                        {allSkills.map((skill) => (
                          <option
                            key={skill}
                            value={skill}
                          >
                            {skill}
                          </option>
                        ))}
                      </select>

                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#8c909f] pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Result Count */}

                  <div className="text-[14px] text-[#8c909f]">
                    {filteredResumes.length} of{" "}
                    {resumes.length} resume
                    {resumes.length !== 1 ? "s" : ""} shown
                  </div>
                </div>
              )}

            {/* ───────────── No Search Results ───────────── */}

            {!loading &&
              !error &&
              resumes.length > 0 &&
              filteredResumes.length === 0 && (
                <div className="glass-card rounded-xl p-16 text-center">
                  <span className="material-symbols-outlined text-[#8c909f] text-[64px]">
                    search_off
                  </span>

                  <h2 className="text-2xl font-medium mt-4">
                    No matching resumes
                  </h2>

                  <p className="text-[#c2c6d6] mt-2">
                    Try a different search term or skill filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSkill("all");
                    }}
                    className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-[#4d8eff] text-white rounded-xl font-medium hover:brightness-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      restart_alt
                    </span>

                    Clear Filters
                  </button>
                </div>
              )}

            {/* ───────────── Loading ───────────── */}

            {loading && (
              <div className="glass-card rounded-xl p-16 text-center">
                <span className="material-symbols-outlined text-[#adc6ff] text-[48px] animate-spin">
                  progress_activity
                </span>

                <p className="text-[#c2c6d6] mt-4">
                  Loading parsed resumes...
                </p>
              </div>
            )}

            {/* ───────────── Error ───────────── */}

            {!loading && error && (
              <div className="glass-card rounded-xl p-10 text-center border-[#ffb4ab]/30">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[48px]">
                  error
                </span>

                <h2 className="text-xl font-medium mt-4">
                  Something went wrong
                </h2>

                <p className="text-[#c2c6d6] mt-2">
                  {error}
                </p>
              </div>
            )}

            {/* ───────────── Empty State ───────────── */}

            {!loading &&
              !error &&
              resumes.length === 0 && (
                <div className="glass-card rounded-xl p-16 text-center">
                  <span className="material-symbols-outlined text-[#8c909f] text-[64px]">
                    description
                  </span>

                  <h2 className="text-2xl font-medium mt-4">
                    No resumes yet
                  </h2>

                  <p className="text-[#c2c6d6] mt-2 mb-6">
                    Upload your first resume to see it here.
                  </p>

                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#4d8eff] text-white rounded-xl font-medium hover:brightness-110 transition-all"
                  >
                    Upload Resume
                  </Link>
                </div>
              )}

            {/* ───────────── Resume Cards ───────────── */}

            {!loading &&
              !error &&
              filteredResumes.length > 0 && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredResumes.map((resume) => {
                    const skills = getSkills(resume.skills);

                    return (
                      <div
                        key={resume.id}
                        className="glass-card rounded-xl p-6"
                      >
                        {/* Candidate Header */}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[#adc6ff]">
                                person
                              </span>
                            </div>

                            <div>
                              <h2 className="text-xl font-medium text-white">
                                {resume.name ||
                                  "Unknown Candidate"}
                              </h2>

                              <p className="text-[13px] text-[#8c909f] mt-1">
                                Resume ID #{resume.id}
                              </p>
                            </div>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 text-[12px] font-medium">
                            Parsed
                          </span>
                        </div>

                        {/* Contact Information */}

                        <div className="mt-6 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#8c909f] text-[20px]">
                              mail
                            </span>

                            <span className="text-[14px] text-[#c2c6d6] break-all">
                              {resume.email ||
                                "No email detected"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#8c909f] text-[20px]">
                              phone
                            </span>

                            <span className="text-[14px] text-[#c2c6d6]">
                              {resume.phone ||
                                "No phone detected"}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}

                        <div className="mt-6">
                          <p className="text-[12px] uppercase tracking-widest text-[#8c909f] mb-3">
                            Skills
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                              skills.map((skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="px-3 py-1 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] border border-[#adc6ff]/20 text-[12px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-[13px] text-[#8c909f]">
                                No skills detected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}

                        <div className="mt-6 pt-5 border-t border-[#424754] flex items-center justify-between">
                          <span className="text-[12px] text-[#8c909f]">
                            Stored in PostgreSQL
                          </span>

                          <div className="flex items-center gap-5">
                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(resume.id)
                              }
                              disabled={
                                deletingId === resume.id
                              }
                              className="flex items-center gap-1 text-[13px] text-[#ffb4ab] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span
                                className={`material-symbols-outlined text-[18px] ${
                                  deletingId === resume.id
                                    ? "animate-spin"
                                    : ""
                                }`}
                              >
                                {deletingId === resume.id
                                  ? "progress_activity"
                                  : "delete"}
                              </span>

                              {deletingId === resume.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                            {/* View Resume */}

                            <Link
                              href={`/resumes/${resume.id}`}
                              className="flex items-center gap-1 text-[13px] text-[#adc6ff] hover:text-white transition-colors"
                            >
                              View Resume

                              <span className="material-symbols-outlined text-[18px]">
                                arrow_forward
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

        {/* Mobile Navigation */}

        <MobileBottomNav />
      </div>
    </>
  );
}