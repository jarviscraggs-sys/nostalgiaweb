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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#008080",
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)`,
        fontFamily: "Tahoma, Verdana, Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div className="xp-window">
          <div className="xp-titlebar">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>🔐</span>
              <span>Sign In to NostalgiaWeb</span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div className="xp-tb-btn xp-tb-btn-min">_</div>
              <div className="xp-tb-btn xp-tb-btn-max">□</div>
              <div className="xp-tb-btn xp-tb-btn-close">✕</div>
            </div>
          </div>

          <div style={{ padding: 20, background: "#D4D0C8" }}>
            {/* User icon area */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>👤</div>
              <p style={{ fontSize: 12, color: "#404040", marginTop: 4 }}>Enter your credentials</p>
            </div>

            {error && (
              <div style={{
                background: "#FFF0F0",
                border: "1px solid #FF4444",
                padding: "6px 10px",
                marginBottom: 12,
                fontSize: 11,
                color: "#CC0000",
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, marginBottom: 3, fontWeight: "bold" }}>
                  Email Address:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="xp-input"
                  style={{ width: "100%" }}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, marginBottom: 3, fontWeight: "bold" }}>
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="xp-input"
                  style={{ width: "100%" }}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                <button
                  type="submit"
                  className="xp-button"
                  disabled={loading}
                  style={{ padding: "4px 24px", fontWeight: "bold" }}
                >
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
                <button
                  type="button"
                  className="xp-button"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div style={{ borderTop: "1px solid #808080", paddingTop: 12, textAlign: "center", fontSize: 11 }}>
              <p style={{ color: "#555" }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" style={{ color: "#003E82", fontWeight: "bold" }}>
                  Register here →
                </Link>
              </p>
              <p style={{ color: "#888", marginTop: 6, fontSize: 10 }}>
                Demo: demo@nostalgiaweb.co.uk / demo123
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, textDecoration: "none" }}>
            ← Back to NostalgiaWeb
          </Link>
        </div>
      </div>
    </div>
  );
}
