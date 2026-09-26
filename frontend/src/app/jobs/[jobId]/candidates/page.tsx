"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { getStoredUser, isLoggedIn, logout } from "@/lib/auth";

interface Candidate {
  resume_id: number;
  candidate_name: string | null;
  candidate_email: string | null;

  match_score: number;

  matched_skills: string[];
  missing_skills: string[];

  matched_count: number;
  required_count: number;
}

interface CandidateRankingResponse {
  job_id: number;
  candidates: Candidate[];
}

interface Job {
  id: number;
  title: string;
  company: string;
}

export default function CandidatesPage() {
  const router = useRouter();
  const params = useParams();

  const jobId = Number(params.jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  useEffect(() => {
    const loadCandidates = async () => {
      if (!isLoggedIn()) {
        router.replace("/login");
        return;
      }

      const user = getStoredUser();

      if (!user || user.role !== "recruiter") {
        router.replace("/dashboard");
        return;
      }

      if (!jobId || Number.isNaN(jobId)) {
        setError("Invalid job ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [jobResponse, candidateResponse] = await Promise.all([
          api.get<Job>(`/jobs/${jobId}`),
          api.get<CandidateRankingResponse>(
            `/matching/jobs/${jobId}/candidates`,
          ),
        ]);

        setJob(jobResponse.data);
        setCandidates(candidateResponse.data.candidates);
      } catch (err: any) {
        console.error("Failed to load candidates:", err);

        if (err.response?.status === 401) {
          router.replace("/login");
          return;
        }

        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        if (err.response?.status === 404) {
          setError("Job not found or you do not have access to this job.");
          return;
        }

        setError(
          err.response?.data?.detail || "Unable to load matching candidates.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [jobId, router]);

  const getScoreClass = (score: number) => {
    if (score >= 80) {
      return "text-[#4edea3]";
    }

    if (score >= 60) {
      return "text-[#adc6ff]";
    }

    if (score >= 40) {
      return "text-[#ffb786]";
    }

    return "text-[#ffb4ab]";
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700;1,0..1&display=swap"
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
        <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-white tracking-tighter">
              RecruitAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
            >
              Dashboard
            </Link>

            <Link
              href="/jobs"
              className="text-[15px] text-[#adc6ff] font-medium"
            >
              Jobs
            </Link>

            <Link
              href="/candidates"
              className="text-[15px] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
            >
              Candidates
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              title="My Profile"
              aria-label="My Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#424754] bg-[#1a1c20] text-[#adc6ff] transition-all hover:border-[#adc6ff]/50 hover:bg-[#4d8eff]/10 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">
                account_circle
              </span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/10 bg-red-500/5 text-red-300 transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
            </button>
          </div>
        </nav>

        {/* Main */}
        <main className="pt-24 pb-16 px-8 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Back */}

            {/* Header */}
            {/* Header */}
            <section>
              <Link
                href="/jobs"
                title="Back to Jobs"
                aria-label="Back to Jobs"
                className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#424754] bg-[#1a1c20] text-[#c2c6d6] transition-all hover:border-[#adc6ff]/50 hover:bg-[#4d8eff]/10 hover:text-[#adc6ff] active:scale-95"
              >
                <span className="text-xl leading-none">←</span>
              </Link>

              <p className="text-[13px] text-[#adc6ff] uppercase tracking-widest font-medium">
                Recruiter Workspace
              </p>

              <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-white mt-3">
                Matching Candidates
              </h1>

              {job && (
                <div className="mt-3">
                  <p className="text-lg text-white font-medium">{job.title}</p>

                  <p className="text-sm text-[#8c909f] mt-1">{job.company}</p>
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <div className="glass-card rounded-xl p-5 border-[#ffb4ab]/30">
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
              <div className="glass-card rounded-xl p-16 text-center">
                <span className="material-symbols-outlined text-[#adc6ff] text-[48px] animate-spin">
                  progress_activity
                </span>

                <p className="text-[#c2c6d6] mt-4">
                  Finding matching candidates...
                </p>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                    groups
                  </span>

                  <p className="text-sm text-[#8c909f]">
                    {candidates.length}{" "}
                    {candidates.length === 1
                      ? "candidate found"
                      : "candidates found"}
                  </p>
                </div>

                {candidates.length === 0 ? (
                  <div className="glass-card rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#adc6ff] text-[32px]">
                        person_search
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-white mt-6">
                      No candidates found
                    </h2>

                    <p className="text-[#8c909f] text-sm mt-2">
                      There are currently no candidate resumes available for
                      matching.
                    </p>
                  </div>
                ) : (
                  <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {candidates.map((candidate, index) => (
                      <div
                        key={candidate.resume_id}
                        className="glass-card rounded-2xl p-6"
                      >
                        {/* Candidate header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                              <span className="text-lg font-semibold text-[#adc6ff]">
                                #{index + 1}
                              </span>
                            </div>

                            <div>
                              <h2 className="text-xl font-semibold text-white">
                                {candidate.candidate_name ||
                                  "Unknown Candidate"}
                              </h2>

                              <p className="text-[14px] text-[#8c909f] mt-1">
                                {candidate.candidate_email ||
                                  "No email available"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-wider text-[#646977]">
                              Match
                            </p>

                            <p
                              className={`text-2xl font-bold ${getScoreClass(
                                candidate.match_score,
                              )}`}
                            >
                              {candidate.match_score.toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        {/* Matched skills */}
                        <div className="mt-7">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#4edea3] text-[19px]">
                                check_circle
                              </span>

                              <h3 className="text-[13px] font-semibold text-[#c2c6d6] uppercase tracking-wider">
                                Matched Skills
                              </h3>
                            </div>

                            <span className="text-xs text-[#646977]">
                              {candidate.matched_count}/
                              {candidate.required_count}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {candidate.matched_skills.length > 0 ? (
                              candidate.matched_skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1 rounded-full text-[12px] font-medium border bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-[#646977]">
                                No matching skills
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Missing skills */}
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-[#ffb786] text-[19px]">
                              warning
                            </span>

                            <h3 className="text-[13px] font-semibold text-[#c2c6d6] uppercase tracking-wider">
                              Missing Skills
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {candidate.missing_skills.length > 0 ? (
                              candidate.missing_skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1 rounded-full text-[12px] font-medium border bg-[#ffb786]/10 text-[#ffb786] border-[#ffb786]/20"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-[#4edea3]">
                                All required skills matched
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-7 pt-5 border-t border-[#1e293b] flex items-center justify-between gap-4">
                          <p className="text-xs text-[#646977]">
                            Resume #{candidate.resume_id}
                          </p>

                          <Link
                            href={`/candidates/${candidate.resume_id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                          >
                            View Profile
                            <span className="text-xl leading-none">→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/90 backdrop-blur-lg border-t border-[#424754] rounded-t-[0.75rem]">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[11px] mt-1">Dashboard</span>
          </Link>

          <Link
            href="/jobs"
            className="flex flex-col items-center text-[#adc6ff]"
          >
            <span className="material-symbols-outlined">work</span>
            <span className="text-[11px] mt-1">Jobs</span>
          </Link>

          <Link
            href="/jobs/create"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-[11px] mt-1">Create</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-[11px] mt-1">Profile</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
