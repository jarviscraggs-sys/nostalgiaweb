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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
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
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="xp-window">
          <div className="xp-titlebar">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>🌐</span>
              <span>Create Your NostalgiaWeb Page</span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div className="xp-tb-btn xp-tb-btn-min">_</div>
              <div className="xp-tb-btn xp-tb-btn-max">□</div>
              <div className="xp-tb-btn xp-tb-btn-close">✕</div>
            </div>
          </div>

          <div style={{ padding: 20, background: "#D4D0C8" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 40 }}>🎉</div>
              <p style={{ fontSize: 12, color: "#404040", marginTop: 4 }}>Claim your corner of the retro web!</p>
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
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, marginBottom: 3, fontWeight: "bold" }}>
                  Username (your page URL):
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  border: "2px solid",
                  borderColor: "#808080 white white #808080",
                }}>
                  <span style={{ padding: "3px 6px", color: "#808080", fontSize: 11, borderRight: "1px solid #ccc", whiteSpace: "nowrap" }}>
                    nostalgiaweb.co.uk/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    style={{ border: "none", outline: "none", fontFamily: "Tahoma, sans-serif", fontSize: 13, flex: 1, padding: "3px 6px" }}
                    placeholder="yourname"
                    maxLength={20}
                    required
                    autoFocus
                  />
                </div>
                <p style={{ fontSize: 10, color: "#888", margin: "2px 0 0" }}>Letters, numbers, underscores. 3-20 chars.</p>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, marginBottom: 3, fontWeight: "bold" }}>
                  Display Name:
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="xp-input"
                  style={{ width: "100%" }}
                  placeholder="Your Name"
                  maxLength={50}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
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
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  type="submit"
                  className="xp-button"
                  disabled={loading}
                  style={{ padding: "4px 20px", fontWeight: "bold" }}
                >
                  {loading ? "Creating..." : "Create My Page! 🚀"}
                </button>
              </div>
            </form>

            <div style={{ borderTop: "1px solid #808080", paddingTop: 10, textAlign: "center", fontSize: 11, marginTop: 12 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#003E82", fontWeight: "bold" }}>Sign in →</Link>
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

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
