"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/register?username=${encodeURIComponent(username.trim())}`);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#008080",
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)`,
        fontFamily: "Tahoma, Verdana, Arial, sans-serif",
        fontSize: 13,
        color: "#1a1a1a",
        overflowX: "hidden",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)`,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* Hero Window */}
        <div className="xp-window" style={{ marginBottom: 24 }}>
          <div className="xp-titlebar">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>🌐</span>
              <span>NostalgiaWeb — Welcome!</span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <div className="xp-tb-btn xp-tb-btn-min">_</div>
              <div className="xp-tb-btn xp-tb-btn-max">□</div>
              <div className="xp-tb-btn xp-tb-btn-close">✕</div>
            </div>
          </div>

          <div style={{ padding: "30px 24px", textAlign: "center", background: "#D4D0C8", position: "relative" }}>
            {/* Under Construction banner */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 12px, #1a1a1a 12px, #1a1a1a 24px)",
              padding: "8px 20px",
              border: "3px solid #1a1a1a",
              marginBottom: 20,
              borderRadius: 2,
            }}>
              <div style={{
                background: "#FFD700",
                padding: "4px 12px",
                fontFamily: "Comic Sans MS, cursive",
                fontSize: 16,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 2,
              }}>
                <span>🚧</span>
                <span style={{ letterSpacing: 1 }}>UNDER CONSTRUCTION</span>
                <span className="blink">|</span>
              </div>
            </div>

            <h1 style={{
              fontFamily: "Comic Sans MS, cursive",
              fontSize: "clamp(24px, 5vw, 40px)",
              color: "#003E82",
              textShadow: "2px 2px 0 rgba(0,120,215,0.2)",
              marginBottom: 16,
            }}>
              🌐 Build Your Homepage<br />Like It&apos;s 1999!
            </h1>

            <p style={{ color: "#333", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7, fontSize: 14 }}>
              Remember when the internet was <em>fun</em>? Make your own <strong>Windows XP-style</strong> personal
              homepage with draggable windows, guestbooks, hit counters &amp; more. No coding needed — just drag, drop, and vibe.
            </p>

            {/* Claim username form */}
            <form onSubmit={handleClaim} style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 480, margin: "0 auto 20px" }}>
              <div style={{ display: "flex", alignItems: "center", background: "white", border: "2px solid", borderColor: "#808080 white white #808080", padding: "0 8px", flex: 1, minWidth: 200 }}>
                <span style={{ color: "#808080", fontSize: 12 }}>nostalgiaweb.co.uk/</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="yourname"
                  maxLength={20}
                  style={{ border: "none", outline: "none", fontFamily: "Tahoma, sans-serif", fontSize: 13, background: "transparent", flex: 1, padding: "6px 4px" }}
                />
              </div>
              <button type="submit" className="xp-button" style={{ padding: "6px 16px", fontWeight: "bold" }}>
                Claim My Page! 🚀
              </button>
            </form>

            <p style={{ fontSize: 11, color: "#555" }}>
              Already have a page?{" "}
              <Link href="/login" style={{ color: "#003E82", fontWeight: "bold" }}>Sign in here</Link>
            </p>
          </div>

          <div style={{ background: "#D4D0C8", borderTop: "1px solid #808080", padding: "3px 8px", fontSize: 11, color: "#404040", display: "flex", justifyContent: "space-between" }}>
            <span>✅ Free Forever</span>
            <span>👁️ 1,337 pages created</span>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { icon: "🖥️", title: "Real XP Desktop", desc: "Your page looks like a genuine Windows XP desktop. Draggable windows, taskbar, the works." },
            { icon: "✍️", title: "Guestbook", desc: "Let visitors sign your guestbook. Remember when everyone did this? Now you can again!" },
            { icon: "🎵", title: "Now Playing", desc: "Show off what you're listening to. Because the internet needs to know about your music taste." },
            { icon: "🔗", title: "Links Page", desc: "Build your web ring. Share your favourite sites. Keep the old internet spirit alive." },
            { icon: "👁️", title: "Hit Counter", desc: "A real hit counter. Watch the numbers go up. Feel the dopamine." },
            { icon: "🎨", title: "Customise Everything", desc: "Choose your wallpaper, window colours, and arrange widgets anywhere on your desktop." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="xp-window">
              <div className="xp-titlebar">
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{icon}</span>
                  <span>{title}</span>
                </div>
              </div>
              <div style={{ padding: 14, background: "#D4D0C8" }}>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#333" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo link */}
        <div className="xp-window" style={{ marginBottom: 24 }}>
          <div className="xp-titlebar">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>👀</span>
              <span>See It In Action</span>
            </div>
          </div>
          <div style={{ padding: "16px 20px", background: "#D4D0C8", textAlign: "center" }}>
            <p style={{ marginBottom: 12, color: "#333", fontSize: 13 }}>
              Check out the demo page to see what your homepage will look like:
            </p>
            <Link href="/demo" className="xp-button" style={{ display: "inline-block", padding: "6px 20px", fontWeight: "bold", textDecoration: "none", color: "#1a1a1a" }}>
              🌐 View Demo Page
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
          <p>NostalgiaWeb &copy; 2024 — Made with ♥ and a lot of Comic Sans</p>
          <p style={{ marginTop: 4 }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.8)" }}>Login</Link>
            {" · "}
            <Link href="/register" style={{ color: "rgba(255,255,255,0.8)" }}>Register</Link>
            {" · "}
            <Link href="/demo" style={{ color: "rgba(255,255,255,0.8)" }}>Demo</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
