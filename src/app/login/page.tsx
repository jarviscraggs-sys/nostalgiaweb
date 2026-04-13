"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/editor");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0F0F1A",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
      }} />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span style={{
          fontSize: 24, fontWeight: 800,
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          NostalgiaWeb
        </span>
      </Link>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#1A1A2E",
        borderRadius: 16,
        border: "1px solid rgba(124,58,237,0.2)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        padding: "36px 32px",
        position: "relative",
        zIndex: 1,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#F1F5F9" }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28 }}>Sign in to your NostalgiaWeb account</p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: 13,
            color: "#FCA5A5",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="saas-input"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="saas-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="saas-btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 24, paddingTop: 20 }}>
          <p style={{ textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>
              Register →
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: 20,
          background: "rgba(124,58,237,0.06)",
          border: "1px solid rgba(124,58,237,0.15)",
          borderRadius: 8,
          padding: "10px 14px",
        }}>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
            <span style={{ color: "#7C3AED", fontWeight: 600 }}>Demo: </span>
            demo@nostalgiaweb.co.uk / demo123
          </p>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: "#94A3B8" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>← Back to NostalgiaWeb</Link>
      </p>
    </div>
  );
}
