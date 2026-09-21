"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

interface CandidateProfile {
  user_id: number;
  name: string;
  email: string;
  role: string;

  phone: string | null;
  date_of_birth: string | null;
  location: string | null;
  bio: string | null;

  college: string | null;
  course: string | null;
  branch: string | null;
  current_year: number | null;
  graduation_year: number | null;
  cgpa: number | null;

  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

interface ProfileForm {
  phone: string;
  date_of_birth: string;
  location: string;
  bio: string;

  college: string;
  course: string;
  branch: string;
  current_year: string;
  graduation_year: string;
  cgpa: string;

  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 21a8 8 0 0 0-16 0"
      />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3h9l4 4v14H6V3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3v5h5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 13h6M9 17h6"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 9 5-5 5 5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 20h14"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="3" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.1A1.7 1.7 0 0 0 7.6 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<CandidateProfile | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    phone: "",
    date_of_birth: "",
    location: "",
    bio: "",
    college: "",
    course: "",
    branch: "",
    current_year: "",
    graduation_year: "",
    cgpa: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "candidate") {
      router.push("/dashboard");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<CandidateProfile>("/profile");

      const data = response.data;

      setProfile(data);

      setForm({
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
        location: data.location || "",
        bio: data.bio || "",
        college: data.college || "",
        course: data.course || "",
        branch: data.branch || "",
        current_year:
          data.current_year?.toString() || "",
        graduation_year:
          data.graduation_year?.toString() || "",
        cgpa: data.cgpa?.toString() || "",
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || "",
        portfolio_url: data.portfolio_url || "",
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (err.response?.status === 403) {
        router.push("/dashboard");
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        phone: form.phone || null,
        date_of_birth: form.date_of_birth || null,
        location: form.location || null,
        bio: form.bio || null,

        college: form.college || null,
        course: form.course || null,
        branch: form.branch || null,

        current_year: form.current_year
          ? Number(form.current_year)
          : null,

        graduation_year: form.graduation_year
          ? Number(form.graduation_year)
          : null,

        cgpa: form.cgpa
          ? Number(form.cgpa)
          : null,

        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
        portfolio_url: form.portfolio_url || null,
      };

      const response =
        await api.put<CandidateProfile>(
          "/profile",
          payload
        );

      setProfile(response.data);

      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to update this profile."
        );
        return;
      }

      if (err.response?.status === 422) {
        setError(
          err.response?.data?.detail?.[0]?.msg ||
            "Please check the information you entered."
        );
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const initials = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {/* TOP NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 h-[64px] border-b border-white/10 bg-[#0f1117]">
        <div className="flex h-full items-center justify-between px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <span className="text-sm font-bold">
                R
              </span>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              RecruitAI
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/uploads")}
              className="rounded-xl bg-blue-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-100"
            >
              <span className="flex items-center gap-2">
                <UploadIcon />
                Quick Upload
              </span>
            </button>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => router.push("/profile")}
              title="My Profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-gray-200 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
            >
              <UserIcon />
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-[64px] w-[208px] border-r border-white/10 bg-[#0b0e13] px-3 py-5">
        <nav className="space-y-1">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <DashboardIcon />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/resumes")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <ResumeIcon />
            Resumes
          </button>

          <button
            onClick={() => router.push("/uploads")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <UploadIcon />
            Uploads
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <SettingsIcon />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-xs text-gray-500">
            Signed in as
          </p>

          <p className="mt-1 truncate text-sm text-gray-300">
            {profile.email}
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-[208px] pt-[64px]">
        <div className="mx-auto max-w-6xl px-8 py-8">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Manage your personal, educational and
              professional information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* PROFILE SUMMARY */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#11161f]">
              <div className="h-24 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent" />

              <div className="-mt-10 px-7 pb-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#11161f] bg-blue-500/15 text-2xl font-semibold text-blue-300">
                      {initials}
                    </div>

                    <div className="pb-1">
                      <h2 className="text-xl font-semibold">
                        {profile.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300">
                    Candidate
                  </div>
                </div>
              </div>
            </section>

            {/* PERSONAL */}
            <section className="rounded-2xl border border-white/10 bg-[#11161f] p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information about you.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Full Name
                  </label>

                  <input
                    value={profile.name}
                    disabled
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </label>

                  <input
                    value={profile.email}
                    disabled
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      handleChange(
                        "phone",
                        e.target.value
                      )
                    }
                    placeholder="Enter phone number"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      handleChange(
                        "date_of_birth",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </label>

                  <input
                    value={form.location}
                    onChange={(e) =>
                      handleChange(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="City, State, Country"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    About
                  </label>

                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      handleChange(
                        "bio",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Tell recruiters about yourself..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>
              </div>
            </section>

            {/* EDUCATION */}
            <section className="rounded-2xl border border-white/10 bg-[#11161f] p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Education
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your academic background.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    College / University
                  </label>

                  <input
                    value={form.college}
                    onChange={(e) =>
                      handleChange(
                        "college",
                        e.target.value
                      )
                    }
                    placeholder="Enter your college or university"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Course / Degree
                  </label>

                  <input
                    value={form.course}
                    onChange={(e) =>
                      handleChange(
                        "course",
                        e.target.value
                      )
                    }
                    placeholder="e.g. B.Tech"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Branch / Specialization
                  </label>

                  <input
                    value={form.branch}
                    onChange={(e) =>
                      handleChange(
                        "branch",
                        e.target.value
                      )
                    }
                    placeholder="e.g. CSE (AI & ML)"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Current Year
                  </label>

                  <select
                    value={form.current_year}
                    onChange={(e) =>
                      handleChange(
                        "current_year",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                  >
                    <option value="">
                      Select year
                    </option>
                    <option value="1">
                      1st Year
                    </option>
                    <option value="2">
                      2nd Year
                    </option>
                    <option value="3">
                      3rd Year
                    </option>
                    <option value="4">
                      4th Year
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Graduation Year
                  </label>

                  <input
                    type="number"
                    value={form.graduation_year}
                    onChange={(e) =>
                      handleChange(
                        "graduation_year",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 2028"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    CGPA
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={form.cgpa}
                    onChange={(e) =>
                      handleChange(
                        "cgpa",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 8.20"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>
              </div>
            </section>

            {/* LINKS */}
            <section className="rounded-2xl border border-white/10 bg-[#11161f] p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Professional Links
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add links to your professional presence.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    GitHub
                  </label>

                  <input
                    type="url"
                    value={form.github_url}
                    onChange={(e) =>
                      handleChange(
                        "github_url",
                        e.target.value
                      )
                    }
                    placeholder="https://github.com/username"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    LinkedIn
                  </label>

                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) =>
                      handleChange(
                        "linkedin_url",
                        e.target.value
                      )
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Portfolio
                  </label>

                  <input
                    type="url"
                    value={form.portfolio_url}
                    onChange={(e) =>
                      handleChange(
                        "portfolio_url",
                        e.target.value
                      )
                    }
                    placeholder="https://yourportfolio.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-blue-500/50"
                  />
                </div>
              </div>
            </section>

            {/* STATUS */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
                <p className="text-sm text-emerald-400">
                  {success}
                </p>
              </div>
            )}

            {/* SAVE */}
            <div className="flex justify-end pb-8">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}