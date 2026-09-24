"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function CandidateProfilePage() {
  const router = useRouter();
  const params = useParams();

  const candidateId = params.candidate_id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
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

    const fetchCandidate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Candidate>(
          `/recruiter/candidates/${candidateId}`,
        );

        setCandidate(response.data);
      } catch (err: any) {
        console.error("Failed to fetch candidate:", err);

        if (err.response?.status === 401) {
          logout();
          router.replace("/login");
          return;
        }

        if (err.response?.status === 403) {
          router.replace("/dashboard");
          return;
        }

        if (err.response?.status === 404) {
          setError("Candidate not found.");
          return;
        }

        setError(
          err.response?.data?.detail ||
            "Unable to load candidate information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId, router]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleViewResume = async () => {
    try {
      const response = await api.get(
        `/recruiter/candidates/${candidateId}/resume`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (err: any) {
      console.error("Failed to open resume:", err);

      if (err.response?.status === 401) {
        logout();
        router.replace("/login");
        return;
      }

      alert(
        err.response?.data?.detail ||
          "Unable to open the candidate resume.",
      );
    }
  };

  const skills =
    candidate?.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) ?? [];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        body {
          font-family: 'Geist', sans-serif;
          background-color: #111318;
        }

        .glass-card {
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid #1e293b;
        }

        .glass-card:hover {
          border-color: #334155;
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
        {/* Navbar */}
        <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#424754] bg-[#111318]/80 px-8 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#adc6ff]">
              clinical_notes
            </span>

            <span className="text-2xl font-bold tracking-tighter">
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
            <Link
              href="/jobs/create"
              className="hidden items-center gap-1 rounded-xl bg-[#adc6ff] px-4 py-2 text-[13px] font-medium text-[#002e6a] transition-transform active:scale-95 md:flex glow-button"
            >
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
              Create Job
            </Link>

            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#424754] bg-[#1a1c20] transition hover:border-[#adc6ff]"
              title="Profile"
            >
              <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">
                person
              </span>
            </Link>

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
          <div className="mx-auto max-w-6xl">
            {/* Back */}
            <Link
              href="/candidates"
              className="mb-8 inline-flex items-center gap-2 text-[13px] text-[#8c909f] transition hover:text-[#adc6ff]"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Back to Candidates
            </Link>

            {/* Loading */}
            {loading && (
              <div className="glass-card rounded-2xl p-20 text-center">
                <span className="material-symbols-outlined animate-spin text-[48px] text-[#adc6ff]">
                  progress_activity
                </span>

                <p className="mt-4 text-[#c2c6d6]">
                  Loading candidate profile...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="glass-card rounded-2xl p-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10">
                  <span className="material-symbols-outlined text-[32px] text-[#ffb4ab]">
                    person_off
                  </span>
                </div>

                <h1 className="mt-6 text-xl font-semibold">
                  Candidate unavailable
                </h1>

                <p className="mt-2 text-sm text-[#8c909f]">
                  {error}
                </p>

                <Link
                  href="/candidates"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#adc6ff] px-5 py-2.5 text-sm font-semibold text-[#002e6a]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Back to Candidates
                </Link>
              </div>
            )}

            {/* Candidate */}
            {!loading && !error && candidate && (
              <div className="space-y-6">
                {/* Header Card */}
                <section className="glass-card rounded-2xl p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#adc6ff]/20 bg-[#4d8eff]/10">
                        <span className="material-symbols-outlined text-[42px] text-[#adc6ff]">
                          person
                        </span>
                      </div>

                      <div>
                        <p className="text-[12px] font-medium uppercase tracking-widest text-[#adc6ff]">
                          Candidate Profile
                        </p>

                        <h1 className="mt-2 text-[30px] font-semibold tracking-tight">
                          {candidate.name || "Unnamed Candidate"}
                        </h1>

                        <p className="mt-2 text-[14px] text-[#8c909f]">
                          Candidate ID #{candidate.id}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleViewResume}
                      disabled={!candidate.filename}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#adc6ff] px-5 py-3 text-[13px] font-semibold text-[#002e6a] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 glow-button"
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        description
                      </span>

                      View Resume
                    </button>
                  </div>
                </section>

                {/* Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Contact */}
                  <section className="glass-card rounded-2xl p-6 lg:col-span-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#adc6ff]">
                        contact_page
                      </span>

                      <h2 className="text-[16px] font-semibold">
                        Contact Information
                      </h2>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#646977]">
                          Email
                        </p>

                        <p className="mt-1 break-all text-[14px] text-[#c2c6d6]">
                          {candidate.email ||
                            "Email not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#646977]">
                          Phone
                        </p>

                        <p className="mt-1 text-[14px] text-[#c2c6d6]">
                          {candidate.phone ||
                            "Phone not available"}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Skills */}
                  <section className="glass-card rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#adc6ff]">
                        psychology
                      </span>

                      <h2 className="text-[16px] font-semibold">
                        Detected Skills
                      </h2>
                    </div>

                    {skills.length > 0 ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {skills.map((skill, index) => {
                          const variants = [
                            "bg-[#4d8eff]/10 text-[#adc6ff] border-[#adc6ff]/20",
                            "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20",
                            "bg-[#ffb786]/10 text-[#ffb786] border-[#ffb786]/20",
                          ];

                          return (
                            <span
                              key={`${skill}-${index}`}
                              className={`rounded-full border px-3 py-1.5 text-[12px] font-medium ${
                                variants[index % variants.length]
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-6 text-sm text-[#646977]">
                        No skills were detected from this resume.
                      </p>
                    )}
                  </section>
                </div>

                {/* Resume Card */}
                <section className="glass-card rounded-2xl p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#adc6ff]/20 bg-[#4d8eff]/10">
                        <span className="material-symbols-outlined text-[#adc6ff]">
                          picture_as_pdf
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#646977]">
                          Uploaded Resume
                        </p>

                        <h2 className="mt-1 text-[15px] font-semibold text-white">
                          {candidate.filename ||
                            "Resume not available"}
                        </h2>

                        <p className="mt-1 text-[13px] text-[#8c909f]">
                          Original resume uploaded by the candidate.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleViewResume}
                      disabled={!candidate.filename}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#424754] bg-[#1a1c20] px-5 py-2.5 text-[13px] font-medium text-[#c2c6d6] transition hover:border-[#adc6ff] hover:text-[#adc6ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        open_in_new
                      </span>

                      Open Resume
                    </button>
                  </div>
                </section>

                {/* Future Matching Area */}
                <section className="glass-card rounded-2xl border-dashed p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#4edea3]/20 bg-[#4edea3]/10">
                      <span className="material-symbols-outlined text-[#4edea3]">
                        auto_awesome
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[15px] font-semibold">
                        Candidate Matching
                      </h2>

                      <p className="mt-1 text-[13px] leading-6 text-[#8c909f]">
                        Job matching and candidate ranking will appear here
                        once the RecruitAI matching engine is implemented.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
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