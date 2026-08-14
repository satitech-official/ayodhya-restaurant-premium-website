"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { LogoLockup } from "@/components/Logo";
import { inputCls, labelCls } from "@/components/admin/AdminKit";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center text-terracotta">
          <LogoLockup dark />
        </div>
        <form
          onSubmit={submit}
          className="mt-8 rounded-[2rem] bg-cream p-8 shadow-premium"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso text-soft">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-charcoal">Admin Sign In</h1>
              <p className="text-xs text-walnut">Manage your restaurant's content.</p>
            </div>
          </div>

          <label htmlFor="admin-email" className={labelCls}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="admin@ayodhyarestaurant.in"
            autoComplete="username"
          />

          <label htmlFor="admin-password" className={`${labelCls} mt-4`}>
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-soft transition hover:bg-burnt disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-walnut/70">
            Admin access uses the account stored in your database. Configure <code className="text-terracotta">DATABASE_URL</code>, then run the seed script with your <code className="text-terracotta">ADMIN_EMAIL</code> and <code className="text-terracotta">ADMIN_PASSWORD</code>.
          </p>
        </form>
      </div>
    </div>
  );
}
