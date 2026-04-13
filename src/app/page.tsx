"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  function handleGetStarted(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/register?username=${encodeURIComponent(username.trim())}`);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F0F1A", color: "#F1F5F9", fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 64,
        background: "rgba(15,15,26,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(124,58,237,0.15)",
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          NostalgiaWeb
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#pricing" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14 }}>Pricing</a>
          <Link href="/login" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14 }}>Sign in</Link>
          <Link href="/register" className="saas-btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
            Get started →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 99, padding: "6px 16px", fontSize: 13, color: "#9F67FF",
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7C3AED", display: "inline-block" }} />
          Join 2,400+ people building their corner of the web
        </div>

        <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
          Your corner of the internet.{" "}
          <span style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Finally yours again.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px,2.5vw,20px)", color: "#94A3B8", lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>
          Build a personal page that actually looks like <em style={{ color: "#F1F5F9", fontStyle: "normal", fontWeight: 600 }}>you</em> — not another blank template.
          Drag, drop, customise. No code needed.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <Link href="/register" className="saas-btn-primary">
            Claim your free page →
          </Link>
          <Link href="/demo" className="saas-btn-ghost">
            See an example
          </Link>
        </div>

        {/* Browser mockup */}
        <div style={{
          maxWidth: 720, margin: "0 auto",
          background: "#1A1A2E",
          borderRadius: 14,
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)",
          overflow: "hidden",
        }}>
          {/* Browser chrome */}
          <div style={{
            background: "#12122A", padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F56","#FFBD2E","#27C93F"].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 6,
              padding: "4px 12px", fontSize: 12, color: "#94A3B8",
            }}>
              nostalgiaweb.co.uk/yourname
            </div>
          </div>
          {/* XP Desktop preview */}
          <div style={{
            background: "linear-gradient(to bottom, #4aa8f0 0%, #5bbcf8 40%, #87ceeb 60%, #b0ddf8 70%, #6cb552 70%, #3a8c2a 85%, #2a6c1a 100%)",
            height: 320, position: "relative", overflow: "hidden",
          }}>
            {/* Mini XP windows */}
            <div style={{
              position: "absolute", top: 20, left: 30, width: 200, background: "#D4D0C8",
              border: "2px solid", borderColor: "white #808080 #808080 white",
              borderRadius: "6px 6px 0 0", boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
              fontFamily: "Tahoma, sans-serif", fontSize: 10,
            }}>
              <div style={{ background: "linear-gradient(to right,#0A246A,#3A6EA5)", color: "white", padding: "3px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
                <span>👤 About Me</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {["#d4a020","#30a030","#c02020"].map((c,i) => (
                    <div key={i} style={{ width: 12, height: 10, borderRadius: 2, background: c }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: 8, lineHeight: 1.6, color: "#333" }}>
                Hey! I&apos;m Alex 👋<br />
                Into retro games, lo-fi beats, and 90s web nostalgia. Welcome to my corner of the internet!
              </div>
            </div>

            <div style={{
              position: "absolute", top: 12, right: 20, width: 175, background: "#D4D0C8",
              border: "2px solid", borderColor: "white #808080 #808080 white",
              borderRadius: "6px 6px 0 0", boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
              fontFamily: "Tahoma, sans-serif", fontSize: 10,
            }}>
              <div style={{ background: "linear-gradient(to right,#0A246A,#3A6EA5)", color: "white", padding: "3px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
                <span>🎵 Now Playing</span>
                <div style={{ display: "flex", gap: 2 }}>
                  {["#d4a020","#30a030","#c02020"].map((c,i) => (
                    <div key={i} style={{ width: 12, height: 10, borderRadius: 2, background: c }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ background: "#000", color: "#00FF00", fontFamily: "Courier New", fontSize: 9, padding: 5, lineHeight: 1.6 }}>
                  ▶ Daylight<br/>
                  &nbsp;&nbsp;&nbsp;David Kushner
                </div>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: 44, left: 20, right: 20, height: 30,
              background: "linear-gradient(to bottom,#245EDC,#1941A5)",
              borderTop: "2px solid #4B75D9",
              display: "flex", alignItems: "center", padding: "0 6px", gap: 6,
              fontFamily: "Tahoma, sans-serif", fontSize: 10,
            }}>
              <div style={{ background: "linear-gradient(to bottom,#58A229,#3A7A17)", color: "white", borderRadius: 8, padding: "2px 8px", fontWeight: "bold", fontStyle: "italic", fontSize: 11 }}>⊞ start</div>
              <div style={{ background: "rgba(0,0,0,0.2)", color: "white", borderRadius: 2, padding: "1px 8px" }}>👤 About Me</div>
              <div style={{ background: "rgba(0,0,0,0.2)", color: "white", borderRadius: 2, padding: "1px 8px" }}>🎵 Now Playing</div>
              <div style={{ flex: 1 }} />
              <div style={{ color: "white", fontSize: 9, background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 2 }}>12:34</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, letterSpacing: 2, color: "#7C3AED", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>How it works</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginBottom: 56, letterSpacing: -0.5 }}>Up and running in minutes</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {[
            { step: "01", icon: "🏷️", title: "Pick your username", desc: "Claim nostalgiaweb.co.uk/yourname — it's yours forever, for free." },
            { step: "02", icon: "🧩", title: "Drag & drop widgets", desc: "Add an About Me, Guestbook, Now Playing, photo gallery, and more. Arrange them anywhere." },
            { step: "03", icon: "🔗", title: "Share your link", desc: "Send it to anyone. They can visit your XP desktop, sign your guestbook, and see who you are." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{
              background: "#1A1A2E", borderRadius: 12,
              border: "1px solid rgba(124,58,237,0.15)",
              padding: 28,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 12, letterSpacing: 1 }}>{step}</div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WIDGET SHOWCASE ───────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, letterSpacing: 2, color: "#06B6D4", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Widgets</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>Everything you need to express yourself</h2>
        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 16, marginBottom: 52 }}>Each widget is a mini XP window — the nostalgia lives inside your page, not all over ours.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20 }}>
          {[
            { icon: "👤", type: "About Me", preview: <div style={{ padding: "6px 10px", fontSize: 11, color: "#333", lineHeight: 1.6 }}>Hi! I&apos;m a huge fan of retro tech and late-night coding sessions ✨</div> },
            { icon: "✍️", type: "Guestbook", preview: <div style={{ padding: "6px 10px" }}><div style={{ background: "white", border: "1px solid #ccc", padding: "4px 6px", fontSize: 10, marginBottom: 4 }}><b style={{ color: "#003E82" }}>CoolDude99</b><div style={{ color: "#333" }}>Amazing page!!! 🔥</div></div><div style={{ background: "white", border: "1px solid #ccc", padding: "4px 6px", fontSize: 10 }}><b style={{ color: "#003E82" }}>webgurl</b><div style={{ color: "#333" }}>Signed ✍️</div></div></div> },
            { icon: "🎵", type: "Now Playing", preview: <div style={{ padding: 8 }}><div style={{ background: "#000", color: "#00FF00", fontFamily: "Courier New", fontSize: 9, padding: 6, lineHeight: 1.6 }}>▶ Blinding Lights<br/>&nbsp;&nbsp;&nbsp;The Weeknd</div></div> },
            { icon: "🔗", type: "Links", preview: <div style={{ padding: "6px 10px", fontSize: 10, lineHeight: 1.8, color: "#0000CC" }}><div>🔗 <u>My Spotify</u></div><div>🔗 <u>GitHub</u></div><div>🔗 <u>Last.fm</u></div></div> },
            { icon: "👁️", type: "Hit Counter", preview: <div style={{ textAlign: "center", padding: 8 }}><div style={{ background: "#000", color: "#FF4400", fontFamily: "Courier New", fontSize: 18, padding: "3px 10px", display: "inline-block", letterSpacing: 3 }}>0013337</div></div> },
          ].map(({ icon, type, preview }) => (
            <div key={type} style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", padding: 1, borderRadius: 10, boxShadow: "0 4px 20px rgba(124,58,237,0.2)" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 9, overflow: "hidden" }}>
                {/* Mini XP title bar */}
                <div style={{ background: "linear-gradient(to right,#0A246A,#3A6EA5)", color: "white", padding: "3px 8px", display: "flex", alignItems: "center", gap: 5, fontFamily: "Tahoma", fontSize: 10, fontWeight: "bold" }}>
                  <span>{icon}</span><span>{type}</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                    {["#d4a020","#30a030","#c02020"].map((c,i) => (
                      <div key={i} style={{ width: 10, height: 9, borderRadius: 2, background: c }} />
                    ))}
                  </div>
                </div>
                <div style={{ background: "#D4D0C8", minHeight: 60, fontFamily: "Tahoma", fontSize: 11 }}>
                  {preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, letterSpacing: 2, color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", marginBottom: 12 }}>Pricing</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>Start free, upgrade when you&apos;re ready</h2>
        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 16, marginBottom: 52 }}>No credit card required. Free forever.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {/* Free */}
          <div style={{ background: "#1A1A2E", borderRadius: 16, border: "1px solid rgba(124,58,237,0.15)", padding: 28 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🆓</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Free</h3>
            <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 20 }}>Your page, forever free</p>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>£0</div>
            <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 24 }}>/ month</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["1 personal page","nostalgiaweb.co.uk/username","All widgets included","Guestbook & hit counter"].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: "#CBD5E1" }}>
                  <span style={{ color: "#06B6D4", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="saas-btn-ghost" style={{ width: "100%", justifyContent: "center", display: "flex" }}>Get started free</Link>
          </div>

          {/* Pro — highlighted */}
          <div style={{
            background: "#1A1A2E", borderRadius: 16,
            border: "2px solid #7C3AED",
            boxShadow: "0 0 40px rgba(124,58,237,0.25)",
            padding: 28, position: "relative",
          }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#7C3AED,#9F67FF)", borderRadius: 99, padding: "4px 16px", fontSize: 12, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>
              Most popular
            </div>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Pro</h3>
            <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 20 }}>For those who want more</p>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>£5</div>
            <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 24 }}>/ month</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Custom domain support","Unlimited pages","All themes","No NostalgiaWeb badge","Priority widgets"].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: "#CBD5E1" }}>
                  <span style={{ color: "#7C3AED", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="saas-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>Get Pro →</Link>
          </div>

          {/* Retro+ */}
          <div style={{ background: "#1A1A2E", borderRadius: 16, border: "1px solid rgba(245,158,11,0.2)", padding: 28 }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>🎮</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Retro+</h3>
            <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 20 }}>The full retro experience</p>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>£12</div>
            <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 24 }}>/ month</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Everything in Pro","CSS editor","Music uploads","Priority support","Early access to features"].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: "#CBD5E1" }}>
                  <span style={{ color: "#F59E0B", flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="saas-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>Coming soon</button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          background: "#1A1A2E",
          borderRadius: 20,
          border: "1px solid rgba(124,58,237,0.3)",
          padding: "52px 40px",
          boxShadow: "0 0 60px rgba(124,58,237,0.1)",
        }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>
            Ready to claim your<br />
            <span style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              space on the web?
            </span>
          </h2>
          <p style={{ color: "#94A3B8", marginBottom: 32, fontSize: 15 }}>
            No credit card required. Free forever.
          </p>

          <form onSubmit={handleGetStarted} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="saas-input"
            />
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, overflow: "hidden" }}>
              <span style={{ padding: "12px 14px", color: "#94A3B8", fontSize: 14, whiteSpace: "nowrap", borderRight: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.05)" }}>
                nostalgiaweb.co.uk/
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourname"
                maxLength={20}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "12px 14px", fontSize: 14, color: "#F1F5F9", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <button type="submit" className="saas-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}>
              Get started free →
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 13, color: "#94A3B8" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(124,58,237,0.1)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>
          NostalgiaWeb
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
          {[["About","#"],["Pricing","#pricing"],["Login","/login"],["Register","/register"]].map(([label, href]) => (
            <a key={label} href={href} style={{ color: "#94A3B8", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>{label}</a>
          ))}
        </div>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>Made with 💜 in the UK</p>
      </footer>
    </div>
  );
}
