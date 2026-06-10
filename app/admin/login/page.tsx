"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid username or password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell login-page">
      <div className="login-card">
        <div className="login-brand">Admin Panel</div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Enter your credentials to continue.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="field-input"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="field-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? <p className="login-error">{error}</p> : null}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
