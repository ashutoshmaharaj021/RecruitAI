"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { getStoredUser, isLoggedIn } from "@/lib/auth";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    const user = getStoredUser();

    if (!user || user.role !== "recruiter") {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!title.trim() || !company.trim() || !description.trim() || !requiredSkills.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/jobs", {
        title: title.trim(),
        company: company.trim(),
        description: description.trim(),
        required_skills: requiredSkills.trim(),
      });

      router.push("/jobs");
    } catch (err: any) {
      console.error("Failed to create job:", err);

      if (err.response?.status === 401) {
        router.replace("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError("You do not have permission to create a job.");
        return;
      }

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
        return;
      }

      setError("Unable to create the job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111318] text-white flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[#adc6ff] text-[42px] animate-spin">
            progress_activity
          </span>

          <p className="text-[#8c909f] mt-4">
            Loading recruiter workspace...
          </p>
        </div>
      </main>
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
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        body {
          font-family: 'Geist', sans-serif;
          background-color: #111318;
        }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1e293b;
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

          {/* Profile */}
          <div className="w-8 h-8 rounded-full bg-[#1a1c20] border border-[#424754] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              person
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-28 pb-16 px-6 md:px-8">
          <div className="max-w-3xl mx-auto">

            {/* Back */}
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[#8c909f] hover:text-[#adc6ff] text-sm transition-colors mb-8"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>

              Back to Jobs
            </Link>

            {/* Header */}
            <div className="mb-8">
              <p className="text-[13px] text-[#adc6ff] uppercase tracking-widest font-medium">
                Recruiter Workspace
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-3">
                Create a Job
              </h1>

              <p className="text-[15px] text-[#8c909f] mt-3 leading-6">
                Define the role and skills required to find the right
                candidates.
              </p>
            </div>

            {/* Form Card */}
            <div className="glass-card rounded-2xl p-6 md:p-8">

              <form onSubmit={handleSubmit} className="space-y-7">

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">
                        error
                      </span>

                      <p className="text-sm text-[#ffb4ab]">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Job Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#c2c6d6] mb-2"
                  >
                    Job Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Python Backend Developer"
                    maxLength={150}
                    required
                    className="w-full bg-[#0a0c10] border border-[#424754] rounded-xl px-4 py-3 text-sm text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff]/30 transition"
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-[#c2c6d6] mb-2"
                  >
                    Company
                  </label>

                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="e.g. TechNova Solutions"
                    maxLength={150}
                    required
                    className="w-full bg-[#0a0c10] border border-[#424754] rounded-xl px-4 py-3 text-sm text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff]/30 transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#c2c6d6] mb-2"
                  >
                    Job Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the role, responsibilities, experience requirements, and other important details..."
                    rows={7}
                    required
                    className="w-full bg-[#0a0c10] border border-[#424754] rounded-xl px-4 py-3 text-sm text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff]/30 transition resize-y"
                  />

                  <p className="text-xs text-[#646977] mt-2">
                    Provide enough detail for future candidate matching.
                  </p>
                </div>

                {/* Required Skills */}
                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-[#c2c6d6] mb-2"
                  >
                    Required Skills
                  </label>

                  <input
                    id="skills"
                    type="text"
                    value={requiredSkills}
                    onChange={(event) =>
                      setRequiredSkills(event.target.value)
                    }
                    placeholder="Python, FastAPI, PostgreSQL, SQL, Git"
                    required
                    className="w-full bg-[#0a0c10] border border-[#424754] rounded-xl px-4 py-3 text-sm text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff]/30 transition"
                  />

                  <p className="text-xs text-[#646977] mt-2">
                    Separate skills with commas.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#1e293b]" />

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">

                  <Link
                    href="/jobs"
                    className="w-full sm:w-auto text-center px-5 py-3 rounded-xl border border-[#424754] text-[#c2c6d6] text-sm font-medium hover:bg-[#1a1c20] transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#adc6ff] text-[#002e6a] px-5 py-3 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed glow-button"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">
                          progress_activity
                        </span>

                        Creating...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          add
                        </span>

                        Create Job
                      </>
                    )}
                  </button>

                </div>

              </form>
            </div>

            {/* Info */}
            <div className="mt-6 flex items-start gap-3 px-1">
              <span className="material-symbols-outlined text-[#4edea3] text-[19px]">
                auto_awesome
              </span>

              <p className="text-xs text-[#646977] leading-5">
                Your job description will be stored securely and can later
                be used by RecruitAI's candidate matching engine.
              </p>
            </div>

          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-3 px-4 bg-[#111318]/90 backdrop-blur-lg border-t border-[#424754]">
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">
              dashboard
            </span>

            <span className="text-[11px] mt-1">
              Dashboard
            </span>
          </Link>

          <Link
            href="/jobs"
            className="flex flex-col items-center text-[#c2c6d6]"
          >
            <span className="material-symbols-outlined">
              work
            </span>

            <span className="text-[11px] mt-1">
              Jobs
            </span>
          </Link>

          <Link
            href="/jobs/create"
            className="flex flex-col items-center text-[#adc6ff]"
          >
            <span className="material-symbols-outlined">
              add_circle
            </span>

            <span className="text-[11px] mt-1">
              Create
            </span>
          </Link>
        </nav>

      </div>
    </>
  );
}