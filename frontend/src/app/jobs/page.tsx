"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { getStoredUser, isLoggedIn } from "@/lib/auth";

interface Job {
  id: number;
  recruiter_id: number;
  title: string;
  company: string;
  description: string;
  required_skills: string;
  created_at: string;
}

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      if (!isLoggedIn()) {
        router.replace("/login");
        return;
      }

      const user = getStoredUser();

      if (!user || user.role !== "recruiter") {
        router.replace("/dashboard");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get<Job[]>("/jobs");

        setJobs(response.data);
      } catch (err: any) {
        console.error("Failed to load jobs:", err);

        if (err.response?.status === 401) {
          router.replace("/login");
          return;
        }

        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        setError(
          err.response?.data?.detail || "Unable to load your job descriptions.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [router]);

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job description?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(jobId);
      setError("");

      await api.delete(`/jobs/${jobId}`);

      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
    } catch (err: any) {
      console.error("Failed to delete job:", err);

      if (err.response?.status === 401) {
        router.replace("/login");
        return;
      }

      setError(
        err.response?.data?.detail || "Unable to delete the job description.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
        <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#adc6ff]">
              clinical_notes
            </span>

            <span className="text-2xl font-bold text-white tracking-tighter">
              RecruitAI
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-10">
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/jobs/create"
              className="hidden md:flex items-center gap-1 bg-[#adc6ff] text-[#002e6a] px-4 py-2 rounded-xl text-[13px] font-medium active:scale-95 transition-transform glow-button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Job
            </Link>

            <div className="w-8 h-8 rounded-full bg-[#1a1c20] border border-[#424754] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
                person
              </span>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="pt-24 pb-16 px-8 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <p className="text-[13px] text-[#adc6ff] uppercase tracking-widest font-medium">
                    Recruiter Workspace
                  </p>

                  <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-white mt-3">
                    Job Descriptions
                  </h1>

                  <p className="text-[15px] text-[#c2c6d6] mt-2">
                    Create and manage the roles you are hiring for.
                  </p>
                </div>

                <Link
                  href="/jobs/create"
                  className="inline-flex items-center justify-center gap-2 bg-[#adc6ff] text-[#002e6a] px-5 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-transform glow-button"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    add
                  </span>
                  Create Job
                </Link>
              </div>
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
                  Loading job descriptions...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && !error && (
              <div className="glass-card rounded-2xl p-16 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[32px]">
                    work_outline
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-white mt-6">
                  No job descriptions yet
                </h2>

                <p className="text-[#8c909f] text-sm mt-2 max-w-md mx-auto">
                  Create your first job description to start building your
                  recruitment pipeline.
                </p>

                <Link
                  href="/jobs/create"
                  className="inline-flex items-center gap-2 mt-6 bg-[#adc6ff] text-[#002e6a] px-5 py-3 rounded-xl text-sm font-semibold glow-button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  Create Your First Job
                </Link>
              </div>
            )}

            {/* Job Count */}
            {!loading && jobs.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  work
                </span>

                <p className="text-sm text-[#8c909f]">
                  {jobs.length}{" "}
                  {jobs.length === 1
                    ? "active job description"
                    : "active job descriptions"}
                </p>
              </div>
            )}

            {/* Job Cards */}
            {!loading && jobs.length > 0 && (
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {jobs.map((job) => {
                  const skills = job.required_skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean);

                  return (
                    <div
                      key={job.id}
                      className="glass-card rounded-2xl p-6 flex flex-col"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#adc6ff]">
                              work
                            </span>
                          </div>

                          <div>
                            <h2 className="text-xl font-semibold text-white">
                              {job.title}
                            </h2>

                            <p className="text-[14px] text-[#c2c6d6] mt-1">
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-mono text-[#646977]">
                          #{job.id}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mt-7">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-[#8c909f] text-[19px]">
                            description
                          </span>

                          <h3 className="text-[13px] font-semibold text-[#c2c6d6] uppercase tracking-wider">
                            Job Description
                          </h3>
                        </div>

                        <p className="text-[14px] text-[#8c909f] leading-6 whitespace-pre-line">
                          {job.description}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="mt-7">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-[#8c909f] text-[19px]">
                            psychology
                          </span>

                          <h3 className="text-[13px] font-semibold text-[#c2c6d6] uppercase tracking-wider">
                            Required Skills
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => {
                            const variants = [
                              "bg-[#4d8eff]/10 text-[#adc6ff] border-[#adc6ff]/20",
                              "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20",
                              "bg-[#ffb786]/10 text-[#ffb786] border-[#ffb786]/20",
                            ];

                            return (
                              <span
                                key={`${skill}-${index}`}
                                className={`px-3 py-1 rounded-full text-[12px] font-medium border ${
                                  variants[index % variants.length]
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-7 pt-5 border-t border-[#1e293b] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#646977] text-[17px]">
                            schedule
                          </span>

                          <p className="text-[12px] text-[#646977]">
                            Created {formatDate(job.created_at)}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            router.push(`/jobs/${job.id}/candidates`)
                          }
                          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          Find Candidates
                        </button>

                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            delete
                          </span>

                          {deletingId === job.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
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
        </nav>
      </div>
    </>
  );
}
