"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface CandidateProfile {
  resume_id: number;
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  skills: string[];
  filename: string | null;
}

export default function CandidateProfilePage() {
  const params = useParams<{ resumeId: string }>();
  const router = useRouter();

  const [candidate, setCandidate] =
    useState<CandidateProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("FULL PARAMS:", params);
    console.log("RESUME ID:", params?.resumeId);

    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "recruiter") {
      router.push("/dashboard");
      return;
    }

    fetchCandidate();
  }, [params?.resumeId]);

  const fetchCandidate = async () => {
    const resumeId = params?.resumeId;

    console.log("Fetching candidate...");
    console.log("resumeId =", resumeId);

    if (!resumeId) {
      setError("Candidate ID is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "API URL:",
        `/matching/candidates/${resumeId}`
      );

      const response = await api.get<CandidateProfile>(
        `/matching/candidates/${resumeId}`
      );

      console.log("Candidate response:", response.data);

      setCandidate(response.data);
    } catch (err: any) {
      console.error("Failed to fetch candidate:", err);

      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to view this candidate."
        );
        return;
      }

      if (err.response?.status === 404) {
        setError("Candidate not found.");
        return;
      }

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item: any) => item.msg || "Validation error")
            .join(", ")
        );
        return;
      }

      if (typeof detail === "string") {
        setError(detail);
        return;
      }

      setError("Failed to load candidate profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        <p className="text-gray-400">
          Loading candidate profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] p-8 text-white">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <header className="border-b border-white/10 bg-[#0f1420]">
        <div className="mx-auto max-w-6xl px-8 py-5">
          <button
            onClick={() => router.back()}
            className="mb-5 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Candidates
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold">
                {candidate.candidate_name
                  ? candidate.candidate_name
                      .charAt(0)
                      .toUpperCase()
                  : "C"}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Candidate Profile
                </p>

                <h1 className="mt-1 text-2xl font-semibold">
                  {candidate.candidate_name ||
                    "Unnamed Candidate"}
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  Resume ID #{candidate.resume_id}
                </p>
              </div>
            </div>

            {candidate.filename && (
              <a
                href={`http://127.0.0.1:8000/resumes/${candidate.resume_id}/file`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
              >
                View Original Resume
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-xl border border-white/10 bg-[#111827] p-6 md:col-span-1">
            <h2 className="text-lg font-semibold">
              Contact Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-gray-200">
                  {candidate.candidate_email ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-200">
                  {candidate.candidate_phone ||
                    "Not available"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111827] p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Skills
              </h2>

              <span className="text-sm text-gray-500">
                {candidate.skills.length} skills
              </span>
            </div>

            {candidate.skills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-gray-500">
                No skills were extracted from this resume.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111827] p-6 md:col-span-3">
            <h2 className="text-lg font-semibold">
              Resume Information
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Resume ID
                </p>

                <p className="mt-1 text-sm text-gray-200">
                  #{candidate.resume_id}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Original File
                </p>

                <p className="mt-1 break-all text-sm text-gray-200">
                  {candidate.filename ||
                    "File information unavailable"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}