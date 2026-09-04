"use client";

import { useEffect, useState } from "react";
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


function getSkills(skills: string) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch resumes from FastAPI
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);

        const response = await axios.get<Resume[]>(
          "http://127.0.0.1:8000/resumes"
        );

        setResumes(response.data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        setError("Unable to load resumes. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

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

        {/* ───────────────── Top Navigation ───────────────── */}

        <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#adc6ff]">
              clinical_notes
            </span>

            <span className="text-2xl font-bold tracking-tighter">
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

            <span className="text-[15px] text-[#c2c6d6] cursor-pointer hover:text-[#adc6ff]">
              Settings
            </span>

          </div>

          {/* Profile */}
          <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#c2c6d6]">
              account_circle
            </span>
          </div>
        </nav>

        {/* ───────────────── Main Content ───────────────── */}

        <main className="pt-24 pb-20 px-8">

          <div className="max-w-7xl mx-auto">

            {/* Header */}

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

            {/* Resume Count */}

            {!loading && !error && (
              <div className="mb-6 text-[14px] text-[#8c909f]">
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* Loading */}

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

            {/* Error */}

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

            {/* Empty State */}

            {!loading && !error && resumes.length === 0 && (
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

            {/* Resume Cards */}

            {!loading && !error && resumes.length > 0 && (
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {resumes.map((resume) => {

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
                              {resume.name || "Unknown Candidate"}
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
                            {resume.email || "No email detected"}
                          </span>

                        </div>

                        <div className="flex items-center gap-3">

                          <span className="material-symbols-outlined text-[#8c909f] text-[20px]">
                            phone
                          </span>

                          <span className="text-[14px] text-[#c2c6d6]">
                            {resume.phone || "No phone detected"}
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

                      {/* Footer */}

                      <div className="mt-6 pt-5 border-t border-[#424754] flex items-center justify-between">

                        <span className="text-[12px] text-[#8c909f]">
                          Stored in PostgreSQL
                        </span>

                        <button
                          className="flex items-center gap-1 text-[13px] text-[#adc6ff] hover:text-white transition-colors"
                          onClick={() => {
                            alert(
                              `Resume #${resume.id}\\n\\n${resume.raw_text}`
                            );
                          }}
                        >
                          View Resume
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>

                      </div>

                    </div>
                  );
                })}

              </section>
            )}

          </div>

        </main>

        {/* Footer */}

        <footer className="border-t border-[#424754] bg-[#0c0e12] py-10">

          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">

            <span className="text-xl font-bold tracking-tighter">
              RecruitAI
            </span>

            <span className="text-[13px] text-[#8c909f]">
              Resume Intelligence Platform
            </span>

          </div>

        </footer>

      </div>
    </>
  );
}