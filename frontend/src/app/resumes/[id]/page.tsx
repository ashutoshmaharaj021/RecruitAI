"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function ResumeDetailPage() {
  const params = useParams();
  const id = params.id;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const response = await axios.get<Resume>(
          `http://127.0.0.1:8000/resumes/${id}`,
        );

        setResume(response.data);
      } catch (err) {
        console.error("Failed to fetch resume:", err);
        setError("Unable to load this resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const skills = resume ? getSkills(resume.skills) : [];

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
        {/* ───────────── Navigation ───────────── */}

        <nav className="fixed top-0 w-full bg-[#111318]/80 backdrop-blur-xl border-b border-[#424754] flex items-center justify-between px-8 h-16 z-50">
          <Link href="/" className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#adc6ff]">
              clinical_notes
            </span>

            <span className="text-2xl font-bold tracking-tighter">
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

            <span className="text-[15px] text-[#c2c6d6]">Settings</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#282a2e] border border-[#424754] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#c2c6d6]">
              account_circle
            </span>
          </div>
        </nav>

        {/* ───────────── Main ───────────── */}

        <main className="pt-24 pb-20 px-8">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}

            <Link
              href="/resumes"
              className="inline-flex items-center gap-2 text-[#c2c6d6] hover:text-white transition-colors mb-8"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
              Back to Resumes
            </Link>

            {/* Loading */}

            {loading && (
              <div className="glass-card rounded-xl p-16 text-center">
                <span className="material-symbols-outlined text-[#adc6ff] text-[48px] animate-spin">
                  progress_activity
                </span>

                <p className="text-[#c2c6d6] mt-4">Loading resume...</p>
              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="glass-card rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[48px]">
                  error
                </span>

                <h2 className="text-xl font-medium mt-4">Resume not found</h2>

                <p className="text-[#c2c6d6] mt-2">{error}</p>

                <Link
                  href="/resumes"
                  className="inline-flex mt-6 px-5 py-3 bg-[#4d8eff] text-white rounded-xl"
                >
                  Return to Resumes
                </Link>
              </div>
            )}

            {/* Resume */}

            {!loading && !error && resume && (
              <div className="space-y-6">
                {/* Header */}

                <section className="glass-card rounded-xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#4d8eff]/10 border border-[#adc6ff]/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#adc6ff] text-[32px]">
                          person
                        </span>
                      </div>

                      <div>
                        <p className="text-[12px] uppercase tracking-widest text-[#4edea3] font-medium">
                          Parsed Resume
                        </p>

                        <h1 className="text-[36px] font-semibold tracking-[-0.03em] mt-1">
                          {resume.name || "Unknown Candidate"}
                        </h1>

                        <p className="text-[14px] text-[#8c909f] mt-1">
                          Resume ID #{resume.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <a
                        href={`http://127.0.0.1:8000/resumes/${resume.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4d8eff] text-white text-[13px] font-medium hover:bg-[#5b98ff] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          picture_as_pdf
                        </span>
                        View Original PDF
                      </a>

                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 text-[13px] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                        Successfully Parsed
                      </span>
                    </div>
                  </div>
                </section>

                {/* Contact */}

                <section className="glass-card rounded-xl p-8">
                  <h2 className="text-[20px] font-medium mb-6">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-[#111318] border border-[#424754] rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-[#adc6ff]">
                          mail
                        </span>

                        <span className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                          Email
                        </span>
                      </div>

                      <p className="text-[15px] text-[#c2c6d6] break-all">
                        {resume.email || "No email detected"}
                      </p>
                    </div>

                    <div className="bg-[#111318] border border-[#424754] rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-[#adc6ff]">
                          phone
                        </span>

                        <span className="text-[12px] uppercase tracking-widest text-[#8c909f]">
                          Phone
                        </span>
                      </div>

                      <p className="text-[15px] text-[#c2c6d6]">
                        {resume.phone || "No phone detected"}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="mt-6 rounded-2xl border border-[#1e2a3a] bg-[#080c11] p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-white">
                      Parsing Summary
                    </h2>

                    <p className="mt-1 text-sm text-[#8d99aa]">
                      Information successfully extracted from this resume.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-[#1e2a3a] bg-[#0d131b] p-4">
                      <div className="flex items-center gap-2 text-[#4edea3]">
                        <span className="material-symbols-outlined text-[18px]">
                          person
                        </span>

                        <span className="text-xs font-medium">Name</span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-white">
                        {resume.name ? "Detected" : "Not detected"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#1e2a3a] bg-[#0d131b] p-4">
                      <div className="flex items-center gap-2 text-[#4edea3]">
                        <span className="material-symbols-outlined text-[18px]">
                          mail
                        </span>

                        <span className="text-xs font-medium">Email</span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-white">
                        {resume.email ? "Detected" : "Not detected"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#1e2a3a] bg-[#0d131b] p-4">
                      <div className="flex items-center gap-2 text-[#4edea3]">
                        <span className="material-symbols-outlined text-[18px]">
                          phone
                        </span>

                        <span className="text-xs font-medium">Phone</span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-white">
                        {resume.phone ? "Detected" : "Not detected"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#1e2a3a] bg-[#0d131b] p-4">
                      <div className="flex items-center gap-2 text-[#adc6ff]">
                        <span className="material-symbols-outlined text-[18px]">
                          psychology
                        </span>

                        <span className="text-xs font-medium">Skills</span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-white">
                        {getSkills(resume.skills).length} detected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}

                <section className="glass-card rounded-xl p-8">
                  <h2 className="text-[20px] font-medium mb-6">
                    Detected Skills
                  </h2>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="px-4 py-2 rounded-full bg-[#4d8eff]/10 text-[#adc6ff] border border-[#adc6ff]/20 text-[13px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#8c909f]">No skills detected.</p>
                  )}
                </section>

                {/* Raw Resume Text */}

                <section className="glass-card rounded-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[20px] font-medium">
                        Extracted Resume Content
                      </h2>

                      <p className="text-[13px] text-[#8c909f] mt-1">
                        Text extracted from the uploaded document.
                      </p>
                    </div>

                    <span className="material-symbols-outlined text-[#8c909f]">
                      article
                    </span>
                  </div>

                  <div className="bg-[#0c0e12] border border-[#424754] rounded-xl p-6 max-h-[600px] overflow-y-auto">
                    <pre className="text-[14px] leading-relaxed text-[#c2c6d6] whitespace-pre-wrap break-words font-sans">
                      {resume.raw_text || "No extracted text available."}
                    </pre>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}

        <footer className="border-t border-[#424754] bg-[#0c0e12] py-10">
          <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
