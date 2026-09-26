"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Eye, EyeOff, FileText } from "lucide-react";

import api from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            },
          ) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [googleCredential, setGoogleCredential] = useState("");

  const handleGoogleCredential = useCallback(async (credential: string) => {
    try {
      setGoogleLoading(true);
      setError("");

      const response = await api.post("/auth/google", {
        credential,
      });

      localStorage.setItem("access_token", response.data.access_token);

      const meResponse = await api.get("/me");

      localStorage.setItem("user", JSON.stringify(meResponse.data));

      router.push("/dashboard");
    } catch (error: unknown) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === 400) {
        setGoogleCredential(credential);
        setShowRoleSelection(true);
        return;
      }

      const detail = axios.isAxiosError<{ detail?: string }>(error)
        ? error.response?.data?.detail
        : undefined;
      setError(detail || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  }, [router]);

  const handleGoogleRoleSelection = async (
    selectedRole: "candidate" | "recruiter",
  ) => {
    if (!googleCredential) {
      return;
    }

    try {
      setGoogleLoading(true);
      setError("");

      const response = await api.post("/auth/google", {
        credential: googleCredential,
        role: selectedRole,
      });

      localStorage.setItem("access_token", response.data.access_token);

      const meResponse = await api.get("/me");

      localStorage.setItem("user", JSON.stringify(meResponse.data));

      router.push("/dashboard");
    } catch (error: unknown) {
      const detail = axios.isAxiosError<{ detail?: string }>(error)
        ? error.response?.data?.detail
        : undefined;
      setError(detail || "Google authentication failed");
    } finally {
      setGoogleLoading(false);
      setShowRoleSelection(false);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        return;
      }

      const googleButton = document.getElementById("google-signin-button");

      if (!googleButton) {
        return;
      }

      googleButton.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

        callback: (response) => {
          handleGoogleCredential(response.credential);
        },
      });

      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        width: 400,
        text: "continue_with",
        shape: "rectangular",
      });
    };

    const timer = setTimeout(initializeGoogle, 500);

    return () => clearTimeout(timer);
  }, [handleGoogleCredential]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Step 1: Login and receive JWT
      const response = await api.post("/login", {
        email,
        password,
      });

      const { access_token } = response.data;

      // Step 2: Store JWT
      localStorage.setItem("access_token", access_token);

      // Step 3: Get authenticated user information
      const userResponse = await api.get("/me");

      const user = userResponse.data;

      // Step 4: Store user information
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Logged in user:", user);
      console.log("User role:", user.role);

      // Step 5: Go to dashboard
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);

      // Remove token if authentication failed
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111318] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <FileText aria-hidden="true" className="size-8 text-[#adc6ff]" />

            <span className="text-3xl font-bold tracking-tighter">
              RecruitAI
            </span>
          </Link>

          <h1 className="text-3xl font-semibold mt-8">Welcome back</h1>

          <p className="text-[#8c909f] mt-2">
            Sign in to access your RecruitAI workspace.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0a0c10] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#c2c6d6] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-[#424754] text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#c2c6d6] mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#111318] border border-[#424754] text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" size={22} />
                  ) : (
                    <Eye aria-hidden="true" size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3">
                <p className="text-sm text-[#ffb4ab]">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#adc6ff] text-[#002e6a] font-semibold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div id="google-signin-button" className="flex justify-center" />

          <div className="mt-6 border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {showRoleSelection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Choose your account type
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Choose how you want to use RecruitAI.
              </p>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleGoogleRoleSelection("candidate")}
                  disabled={googleLoading}
                  className="rounded-lg border px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">Candidate</div>

                  <div className="text-sm text-gray-500">
                    Find jobs and manage your resume.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleRoleSelection("recruiter")}
                  disabled={googleLoading}
                  className="rounded-lg border px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">Recruiter</div>

                  <div className="text-sm text-gray-500">
                    Create jobs and find candidates.
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[#8c909f] hover:text-white transition-colors"
          >
            ← Back to RecruitAI
          </Link>
        </div>
      </div>
    </main>
  );
}
