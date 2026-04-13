"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = searchParams.get("username");
    if (u) setUsername(u);
  }, [searchParams]);

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(username);
  const usernameInvalid = username.length > 0 && !usernameValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usernameValid) {
      setError("Username must be 3-20 chars: lowercase letters, numbers, underscores only");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, display_name: displayName || username }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
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
        width: "100%", maxWidth: 440,
        background: "#1A1A2E",
        borderRadius: 16,
        border: "1px solid rgba(124,58,237,0.2)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        padding: "36px 32px",
        position: "relative",
        zIndex: 1,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#F1F5F9" }}>Claim your page</h1>
        <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28 }}>Your corner of the internet awaits. Free forever.</p>

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
          {/* Username with live preview */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Choose your username
            </label>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${usernameInvalid ? "rgba(239,68,68,0.5)" : usernameValid ? "rgba(34,197,94,0.5)" : "rgba(124,58,237,0.3)"}`,
              borderRadius: 8,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}>
              <span style={{
                padding: "12px 12px", color: "#94A3B8", fontSize: 13, whiteSpace: "nowrap",
                borderRight: "1px solid rgba(124,58,237,0.2)",
                background: "rgba(124,58,237,0.05)",
              }}>
                nostalgiaweb.co.uk/
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourname"
                maxLength={20}
                required
                autoFocus
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  padding: "12px 12px", fontSize: 14, color: "#F1F5F9",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              {username.length > 0 && (
                <span style={{ padding: "0 12px", fontSize: 16 }}>
                  {usernameValid ? "✅" : "❌"}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 5 }}>
              Letters, numbers, underscores — 3 to 20 characters
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your Name"
              maxLength={50}
              className="saas-input"
            />
          </div>

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
              placeholder="At least 6 characters"
              minLength={6}
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
            {loading ? "Creating your page..." : "Create my page →"}
          </button>
        </form>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 24, paddingTop: 20 }}>
          <p style={{ textAlign: "center", fontSize: 14, color: "#94A3B8" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: "#94A3B8" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>← Back to NostalgiaWeb</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
