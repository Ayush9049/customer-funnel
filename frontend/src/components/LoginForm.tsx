import React, { useState } from "react";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function validate() {
    let ok = true;
    setEmailError(null);
    setPasswordError(null);
    setError(null);

    if (!email.trim()) {
      setEmailError("Email is required");
      ok = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      ok = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      ok = false;
    }

    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("Server error. Please try again later.");
        }
        setLoading(false);
        return;
      }

      const data = (await res.json()) as LoginResponse;
      const token = data.access_token;

      try {
        if (remember) localStorage.setItem("token", token);
        else sessionStorage.setItem("token", token);

        const me = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (me.ok) {
          const user = await me.json();
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        // ignore me fetch failure but proceed to dashboard
      }

      window.location.assign("/dashboard");
    } catch (err) {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="login form">
      <div>
        <h3 className="text-2xl font-semibold">Welcome Back</h3>
        <p className="mt-1 text-sm text-[#94a3b8]">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-[#111827] border border-[#1e293b] text-sm text-white p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-[#0f172a] border border-[#1e293b] px-3 py-2 text-white placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
        </div>
        {emailError && <p id="email-error" className="mt-1 text-sm text-[#ff7b7b]">{emailError}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-[#0f172a] border border-[#1e293b] px-3 py-2 text-white placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3l18 18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.58 10.58a3 3 0 104.24 4.24" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
        {passwordError && <p id="password-error" className="mt-1 text-sm text-[#ff7b7b]">{passwordError}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-[#94a3b8]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded bg-[#0f172a] border border-[#1e293b]"
          />
          Remember me
        </label>

        <a href="#" className="text-sm text-[#2563eb]">
          Forgot Password?
        </a>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#2563eb] px-4 py-2 text-white font-medium hover:brightness-95 disabled:opacity-60"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          Sign In
        </button>
      </div>
    </form>
  );
}
