"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { getStoredUser, logout } from "@/lib/auth";

interface Candidate {
  id: number;
  user_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string | null;
  filename: string | null;
}

export default function CandidatesPage() {
  const router = useRouter();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "recruiter") {
      router.replace("/dashboard");
      return;
    }

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Candidate[]>(
          "/recruiter/candidates",
        );

        setCandidates(response.data);
      } catch (err: any) {
        console.error("Failed to fetch candidates:", err);

        if (err.response?.status === 401) {
          logout();
          router.replace("/login");
          return;
        }

        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        setError(
          err.response?.data?.detail ||
            "Unable to load the candidate pool.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [router]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() || "";
      const email = candidate.email?.toLowerCase() || "";
      const phone = candidate.phone?.toLowerCase() || "";
      const skills = candidate.skills?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        skills.includes(query)
      );
    });
  }, [candidates, search]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <>
      {/* Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        body {
          font-family: 'Geist', sans-serif;
          background-color: #050505;
        }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          border-color: #4d8eff;
          box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.5);
        }

        .glow-button {
          box-shadow: 0 0 15px rgba(77, 142, 255, 0.15);
        }

        .glow-button:hover {
          box-shadow: 0 0 25px rgba(77, 142, 255, 0.3);
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
        <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#424754] bg-[#111318]/80 px-8 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-2xl">
              clinical_notes
            </span>

            <span className="text-2xl font-bold tracking-tighter text-white">
              RecruitAI
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/dashboard"
              className="text-[15px] text-[#c2c6d6] transition-colors hover:text-[#adc6ff]"
            >
              Dashboard
            </Link>

            <Link
              href="/jobs"
              className="text-[15px] text-[#c2c6d6] transition-colors hover:text-[#adc6ff]"
            >
              Jobs
            </Link>

            <Link
              href="/candidates"
              className="text-[15px] font-medium text-[#adc6ff]"
            >
              Candidates
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Create Job */}
            <Link
              href="/jobs/create"
              className="hidden items-center gap-1 rounded-xl bg-[#adc6ff] px-4 py-2 text-[13px] font-medium text-[#002e6a] transition-transform active:scale-95 md:flex glow-button"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>

              Create Job
            </Link>

            {/* Profile */}
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#424754] bg-[#1a1c20] transition hover:border-[#adc6ff]"
              title="Profile"
            >
              <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">
                person
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ffb4ab]/20 bg-[#1a1c20] transition hover:border-[#ffb4ab] hover:bg-[#ffb4ab]/10"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[19px] text-[#ffb4ab]">
                logout
              </span>
            </button>
          </div>
        </nav>

        {/* Main */}
        <main className="min-h-screen px-8 pb-16 pt-24">
          <div className="mx-auto max-w-7xl space-y-10">
            {/* Page Header */}
            <section>
              <p className="text-[13px] font-medium uppercase tracking-widest text-[#adc6ff]">
                Recruiter Workspace
              </p>

              <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-white">
                Candidate Pool
              </h1>

              <p className="mt-2 max-w-2xl text-[15px] text-[#c2c6d6]">
                Browse, search, and review candidates available in your
                recruitment workspace.
              </p>
            </section>

            {/* Search + Summary */}
            <section className="glass-card rounded-2xl p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">
                      groups
                    </span>

                    <h2 className="text-[16px] font-semibold text-white">
                      Available Candidates
                    </h2>
                  </div>

                  <p className="mt-1 text-[13px] text-[#8c909f]">
                    Search across candidate names, emails, phone numbers, and
                    detected skills.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#adc6ff]/20 bg-[#4d8eff]/10 px-2 text-[#adc6ff]">
                    {filteredCandidates.length}
                  </span>

                  <span className="text-[#8c909f]">
                    {filteredCandidates.length === 1
                      ? "candidate"
                      : "candidates"}
                  </span>
                </div>
              </div>

              {/* Search */}
              <div className="relative mt-6">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#646977]">
                  search
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, phone, or skill..."
                  className="w-full rounded-xl border border-[#424754] bg-[#0c0e12] py-3.5 pl-12 pr-4 text-[14px] text-white outline-none transition placeholder:text-[#646977] focus:border-[#4d8eff]"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#646977] transition hover:bg-white/5 hover:text-white"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                )}
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="glass-card rounded-xl border-[#ffb4ab]/30 p-5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ffb4ab]">
                    error
                  </span>

                  <p className="text-sm text-[#ffb4ab]">{error}</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="glass-card rounded-2xl p-16 text-center">
                <span className="material-symbols-outlined animate-spin text-[48px] text-[#adc6ff]">
                  progress_activity
                </span>

                <p className="mt-4 text-[#c2c6d6]">
                  Loading candidate pool...
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredCandidates.length === 0 && (
                <div className="glass-card rounded-2xl p-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#adc6ff]/20 bg-[#4d8eff]/10">
                    <span className="material-symbols-outlined text-[32px] text-[#adc6ff]">
                      person_search
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-white">
                    {search
                      ? "No matching candidates"
                      : "No candidates available"}
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm text-[#8c909f]">
                    {search
                      ? "Try searching with a different name, email, phone number, or skill."
                      : "Candidate resumes will appear here once they are uploaded and parsed."}
                  </p>
                </div>
              )}

            {/* Candidate Cards */}
            {!loading &&
              !error &&
              filteredCandidates.length > 0 && (
                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-[18px] font-semibold text-white">
                        Candidates
                      </h2>

                      <p className="mt-1 text-[13px] text-[#646977]">
                        Candidate information extracted from uploaded resumes.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {filteredCandidates.map((candidate) => {
                      const skills =
                        candidate.skills
                          ?.split(",")
                          .map((skill) => skill.trim())
                          .filter(Boolean) ?? [];

                      return (
                        <div
                          key={candidate.id}
                          className="glass-card flex flex-col rounded-2xl p-6"
                        >
                          {/* Candidate Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#adc6ff]/20 bg-[#4d8eff]/10">
                                <span className="material-symbols-outlined text-[#adc6ff]">
                                  person
                                </span>
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-[18px] font-semibold text-white">
                                  {candidate.name ||
                                    "Unnamed Candidate"}
                                </h3>

                                <p className="mt-1 truncate text-[13px] text-[#8c909f]">
                                  {candidate.email ||
                                    "Email not available"}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 text-xs font-mono text-[#646977]">
                              #{candidate.id}
                            </span>
                          </div>

                          {/* Contact */}
                          <div className="mt-6">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-[#8c909f]">
                                phone
                              </span>

                              <span className="text-[13px] text-[#c2c6d6]">
                                {candidate.phone ||
                                  "Phone not available"}
                              </span>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mt-7">
                            <div className="mb-3 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[19px] text-[#8c909f]">
                                psychology
                              </span>

                              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#c2c6d6]">
                                Detected Skills
                              </h4>
                            </div>

                            {skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {skills
                                  .slice(0, 7)
                                  .map((skill, index) => {
                                    const variants = [
                                      "bg-[#4d8eff]/10 text-[#adc6ff] border-[#adc6ff]/20",
                                      "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20",
                                      "bg-[#ffb786]/10 text-[#ffb786] border-[#ffb786]/20",
                                    ];

                                    return (
                                      <span
                                        key={`${candidate.id}-${skill}-${index}`}
                                        className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
                                          variants[
                                            index % variants.length
                                          ]
                                        }`}
                                      >
                                        {skill}
                                      </span>
                                    );
                                  })}

                                {skills.length > 7 && (
                                  <span className="rounded-full border border-[#424754] bg-[#0c0e12] px-3 py-1 text-[12px] font-medium text-[#8c909f]">
                                    +{skills.length - 7} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-[13px] text-[#646977]">
                                No skills detected
                              </p>
                            )}
                          </div>

                          {/* Resume */}
                          <div className="mt-7 border-t border-[#1e293b] pt-5">
                            <div className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[18px] text-[#646977]">
                                description
                              </span>

                              <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-wider text-[#646977]">
                                  Resume
                                </p>

                                <p className="mt-1 truncate text-[13px] text-[#c2c6d6]">
                                  {candidate.filename ||
                                    "Resume not available"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="mt-6 flex items-center justify-end">
                            <Link
                              href={`/candidates/${candidate.id}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#adc6ff] px-4 py-2.5 text-[13px] font-semibold text-[#002e6a] transition-transform active:scale-95 glow-button"
                            >
                              View Profile

                              <span className="material-symbols-outlined text-[18px]">
                                arrow_forward
                              </span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#424754] bg-[#111318]/90 px-4 py-3 backdrop-blur-lg md:hidden">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">
              dashboard
            </span>

            <span className="mt-1 text-[11px]">Dashboard</span>
          </Link>

          <Link
            href="/jobs"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">
              work
            </span>

            <span className="mt-1 text-[11px]">Jobs</span>
          </Link>

          <Link
            href="/candidates"
            className="flex flex-col items-center text-[#adc6ff]"
          >
            <span className="material-symbols-outlined">
              groups
            </span>

            <span className="mt-1 text-[11px]">Candidates</span>
          </Link>
        </nav>
      </div>
    </>
  );
}