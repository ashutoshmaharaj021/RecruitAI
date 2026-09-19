"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

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

interface RankingResponse {
  job_id: number;
  candidates: Candidate[];
}

export default function CandidatesPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params.jobId as string;

  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "recruiter") {
      router.push("/dashboard");
      return;
    }

    fetchCandidates();
  }, [jobId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/matching/jobs/${jobId}/candidates`);

      setData(response.data);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError("You do not have permission to view these candidates.");
        return;
      }

      if (err.response?.status === 404) {
        setError("Job not found.");
        return;
      }

      setError(
        err.response?.data?.detail || "Failed to load candidate rankings.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading candidate rankings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white p-8">
        <button
          onClick={() => router.push("/jobs")}
          className="mb-6 text-sm text-gray-400 hover:text-white"
        >
          ← Back to Jobs
        </button>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f1420]">
        <div className="mx-auto max-w-7xl px-8 py-5">
          <button
            onClick={() => router.push("/jobs")}
            className="mb-4 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Jobs
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Candidate Rankings</h1>

              <p className="mt-1 text-sm text-gray-400">
                Candidates ranked by their resume match with this job.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-sm text-gray-400">Candidates</span>
              <span className="ml-2 font-semibold">
                {data?.candidates.length ?? 0}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-8 py-8">
        {data?.candidates.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#111827] p-10 text-center">
            <h2 className="text-lg font-medium">No candidates found</h2>

            <p className="mt-2 text-sm text-gray-400">
              There are currently no candidate resumes available for matching.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {data?.candidates.map((candidate, index) => (
              <div
                key={candidate.resume_id}
                className="rounded-xl border border-white/10 bg-[#111827] p-6 transition hover:border-white/20"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  {/* Candidate info */}
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      #{index + 1}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        {candidate.candidate_name || "Unnamed Candidate"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-400">
                        {candidate.candidate_email || "No email available"}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        Resume ID: {candidate.resume_id}
                      </p>

                      <button
                        onClick={() =>
                          router.push(`/candidates/${candidate.resume_id}`)
                        }
                        className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                      >
                        View Candidate
                      </button>
                    </div>
                  </div>

                  {/* Match score */}
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-bold">
                      {candidate.match_score}%
                    </div>

                    <p className="text-xs text-gray-400">Match Score</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${Math.min(candidate.match_score, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {/* Matched skills */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium">Matched Skills</h3>

                      <span className="text-xs text-gray-500">
                        {candidate.matched_count}/{candidate.required_count}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {candidate.matched_skills.length > 0 ? (
                        candidate.matched_skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400"
                          >
                            ✓ {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">
                          No matching skills
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-medium">Missing Skills</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {candidate.missing_skills.length > 0 ? (
                        candidate.missing_skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">
                          No missing skills
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
