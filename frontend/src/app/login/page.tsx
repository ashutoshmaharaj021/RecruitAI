"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (error: any) {
      console.error("Login failed:", error);

      // Remove token if authentication failed
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      if (error.response?.status === 401) {
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
          <Link
            href="/"
            className="inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[#adc6ff] text-3xl">
              clinical_notes
            </span>

            <span className="text-3xl font-bold tracking-tighter">
              RecruitAI
            </span>
          </Link>

          <h1 className="text-3xl font-semibold mt-8">
            Welcome back
          </h1>

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

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-[#111318] border border-[#424754] text-white placeholder-[#646977] outline-none focus:border-[#adc6ff] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#ffb4ab]/30 bg-[#ffb4ab]/10 px-4 py-3">
                <p className="text-sm text-[#ffb4ab]">
                  {error}
                </p>
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

          {/* Register */}
          <div className="mt-8 pt-6 border-t border-[#424754] text-center">
            <p className="text-sm text-[#8c909f]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#adc6ff] hover:text-white transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

        </div>

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