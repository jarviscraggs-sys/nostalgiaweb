"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Widget {
  id: number;
  site_id: number;
  type: string;
  title: string;
  content: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  minimized: number;
}

interface GuestbookEntry {
  id: number;
  author_name: string;
  author_url: string;
  message: string;
  created_at: string;
}

interface SiteData {
  site: {
    id: number;
    username: string;
    title: string;
    wallpaper: string;
    theme_color: string;
    bg_color: string;
  };
  widgets: Widget[];
  guestbook: GuestbookEntry[];
  visitCount: number;
}

const WALLPAPER_CLASSES: Record<string, string> = {
  bliss: "wallpaper-bliss",
  space: "wallpaper-space",
  dark: "wallpaper-dark",
  teal: "wallpaper-teal",
  classic: "wallpaper-classic",
};

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function GuestbookSignForm({ username, onSigned }: { username: string; onSigned: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/guestbook/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: name, author_url: url, message }),
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setUrl(""); setMessage("");
        setTimeout(onSigned, 800);
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") return <p style={{ color: "#006600", fontWeight: "bold", fontSize: 12 }}>✅ Signed! Thanks for visiting!</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <input className="xp-input" placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} required style={{ fontSize: 11 }} />
      <input className="xp-input" placeholder="Your Website (optional)" value={url} onChange={e => setUrl(e.target.value)} style={{ fontSize: 11 }} />
      <textarea
        className="xp-input"
        placeholder="Leave a message... *"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        rows={3}
        maxLength={500}
        style={{ fontSize: 11, resize: "vertical", fontFamily: "Tahoma, sans-serif" }}
      />
      <button type="submit" className="xp-button" disabled={status === "loading"} style={{ alignSelf: "flex-start" }}>
        {status === "loading" ? "Signing..." : "Sign Guestbook ✍️"}
      </button>
      {status === "err" && <p style={{ color: "red", fontSize: 10, margin: 0 }}>Error — try again</p>}
    </form>
  );
}

function WidgetContent({ widget, guestbook, username, onRefresh }: {
  widget: Widget;
  guestbook: GuestbookEntry[];
  username: string;
  onRefresh: () => void;
}) {
  const content = widget.content;

  switch (widget.type) {
    case "about":
      return (
        <div style={{ padding: "8px 12px", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", overflowY: "auto", height: "calc(100% - 8px)" }}>
          {(content.text as string) || ""}
        </div>
      );

    case "now_playing":
      return (
        <div style={{ padding: "10px 12px" }}>
          <div style={{ background: "#000", border: "2px inset #808080", padding: "8px 10px", marginBottom: 8, borderRadius: 2 }}>
            <div style={{ color: "#00FF00", fontFamily: "Courier New, monospace", fontSize: 11, lineHeight: 1.5 }}>
              <div>▶ {content.song as string || "Unknown Track"}</div>
              <div style={{ color: "#00CC00" }}>   {content.artist as string || "Unknown Artist"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="xp-button" style={{ fontSize: 14, padding: "2px 8px" }}>⏮</button>
            <button className="xp-button" style={{ fontSize: 14, padding: "2px 8px" }}>⏸</button>
            <button className="xp-button" style={{ fontSize: 14, padding: "2px 8px" }}>⏭</button>
          </div>
        </div>
      );

    case "links": {
      const links = (content.links as Array<{ title: string; url: string }>) || [];
      return (
        <div style={{ padding: "8px 12px", overflowY: "auto", height: "calc(100% - 8px)" }}>
          {links.length === 0 ? (
            <p style={{ fontSize: 11, color: "#808080", fontStyle: "italic" }}>No links yet</p>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {links.map((l, i) => (
                <li key={i} style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10 }}>🔗</span>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#0000CC", fontSize: 12, textDecoration: "underline" }}
                  >
                    {l.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case "photos": {
      const photos = (content.photos as Array<{ url: string; caption?: string }>) || [];
      return (
        <div style={{ padding: "8px 12px", overflowY: "auto", height: "calc(100% - 8px)" }}>
          {photos.length === 0 ? (
            <p style={{ fontSize: 11, color: "#808080", fontStyle: "italic" }}>No photos yet</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 6 }}>
              {photos.map((p, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption || ""} style={{ width: "100%", border: "2px solid #808080", display: "block" }} />
                  {p.caption && <p style={{ fontSize: 9, margin: "2px 0 0", color: "#333" }}>{p.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "guestbook":
      return (
        <div style={{ padding: "8px 12px", overflowY: "auto", height: "calc(100% - 8px)", display: "flex", flexDirection: "column", gap: 8 }}>
          {guestbook.slice(0, 5).map(entry => (
            <div key={entry.id} style={{ background: "white", border: "1px solid #808080", padding: "4px 8px", fontSize: 11 }}>
              <div style={{ fontWeight: "bold", color: "#003E82" }}>
                {entry.author_url ? (
                  <a href={entry.author_url} target="_blank" rel="noreferrer" style={{ color: "#003E82" }}>{entry.author_name}</a>
                ) : entry.author_name}
              </div>
              <div style={{ color: "#333", marginTop: 2 }}>{entry.message}</div>
              <div style={{ color: "#808080", fontSize: 10, marginTop: 2 }}>
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {guestbook.length === 0 && (
            <p style={{ fontSize: 11, color: "#808080", fontStyle: "italic", margin: 0 }}>No entries yet — be the first!</p>
          )}
          <div style={{ borderTop: "1px solid #808080", paddingTop: 8, marginTop: 4 }}>
            <p style={{ fontWeight: "bold", fontSize: 11, marginBottom: 6 }}>Sign the Guestbook:</p>
            <GuestbookSignForm username={username} onSigned={onRefresh} />
          </div>
        </div>
      );

    case "hit_counter":
      return (
        <div style={{ padding: 12, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#404040", marginBottom: 6 }}>You are visitor number:</p>
          <div style={{
            display: "inline-block",
            background: "#000",
            color: "#FF4400",
            fontFamily: "Courier New, monospace",
            fontSize: 24,
            fontWeight: "bold",
            padding: "4px 12px",
            border: "2px inset #808080",
            letterSpacing: 4,
          }}>
            {String(widget.content._visitCount ?? 0).padStart(7, "0")}
          </div>
        </div>
      );

    default:
      return <div style={{ padding: 12, fontSize: 11, color: "#808080" }}>Unknown widget type</div>;
  }
}

interface WinState {
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
}

export default function UserPage() {
  const params = useParams();
  const username = params.username as string;

  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [winStates, setWinStates] = useState<Record<number, WinState>>({});
  const [topZ, setTopZ] = useState(100);
  const [winZOrder, setWinZOrder] = useState<Record<number, number>>({});
  const desktopRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`/api/site/${username}`);
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Page not found");
        return;
      }
      const d: SiteData = await res.json();
      // inject visit count into hit_counter widget content
      d.widgets = d.widgets.map(w =>
        w.type === "hit_counter" ? { ...w, content: { ...w.content, _visitCount: d.visitCount } } : w
      );
      setData(d);

      // Init window states
      const states: Record<number, WinState> = {};
      const zorder: Record<number, number> = {};
      d.widgets.forEach((w, i) => {
        states[w.id] = { x: w.x, y: w.y, width: w.width, height: w.height, minimized: false, maximized: false };
        zorder[w.id] = i + 1;
      });
      setWinStates(states);
      setWinZOrder(zorder);
      setTopZ(d.widgets.length + 1);
    } catch {
      setError("Failed to load page");
    }
  }, [username]);

  useEffect(() => { loadData(); }, [loadData]);

  function bringToFront(id: number) {
    setTopZ(z => z + 1);
    setWinZOrder(prev => ({ ...prev, [id]: topZ + 1 }));
  }

  function toggleMinimize(id: number) {
    setWinStates(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: !prev[id].minimized },
    }));
  }

  function toggleMaximize(id: number) {
    setWinStates(prev => ({
      ...prev,
      [id]: { ...prev[id], maximized: !prev[id].maximized },
    }));
    bringToFront(id);
  }

  function startDrag(e: React.MouseEvent, id: number) {
    e.preventDefault();
    bringToFront(id);
    const state = winStates[id];
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: state.x,
      origY: state.y,
    };

    function onMove(me: MouseEvent) {
      if (!dragRef.current) return;
      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      setWinStates(prev => ({
        ...prev,
        [dragRef.current!.id]: {
          ...prev[dragRef.current!.id],
          x: dragRef.current!.origX + dx,
          y: dragRef.current!.origY + dy,
        },
      }));
    }

    function onUp() {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#008080", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tahoma, sans-serif" }}>
        <div className="xp-window" style={{ maxWidth: 400, width: "100%", margin: 16 }}>
          <div className="xp-titlebar">
            <span>⚠️ Page Not Found</span>
          </div>
          <div style={{ padding: 24, textAlign: "center", background: "#D4D0C8" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😢</div>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              <strong>{username}</strong> hasn&apos;t built their page yet, or it doesn&apos;t exist.
            </p>
            <Link href="/" className="xp-button" style={{ display: "inline-block", textDecoration: "none", color: "#1a1a1a" }}>
              ← Back to NostalgiaWeb
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#008080", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tahoma, sans-serif", color: "white" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
          <p>Loading page...</p>
        </div>
      </div>
    );
  }

  const { site, widgets, guestbook } = data;
  const wallpaperClass = WALLPAPER_CLASSES[site.wallpaper] || "wallpaper-teal";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Tahoma, Verdana, Arial, sans-serif",
        fontSize: 11,
      }}
    >
      {/* Desktop area */}
      <div
        ref={desktopRef}
        className={wallpaperClass}
        style={{ flex: 1, position: "relative", overflow: "hidden" }}
      >
        {/* NostalgiaWeb badge — subtle, bottom-right */}
        <Link
          href="/"
          style={{
            position: "absolute", bottom: 50, right: 12, zIndex: 50,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(15,15,26,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: 99,
            padding: "5px 12px 5px 8px",
            textDecoration: "none",
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            color: "#CBD5E1",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: 13 }}>🌐</span>
          <span style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NostalgiaWeb</span>
        </Link>

        {/* Windows */}
        {widgets.map(widget => {
          const ws = winStates[widget.id];
          if (!ws) return null;

          let style: React.CSSProperties = {
            position: "absolute",
            left: ws.x,
            top: ws.y,
            width: ws.width,
            height: ws.height,
            zIndex: winZOrder[widget.id] || 1,
            display: ws.minimized ? "none" : "flex",
            flexDirection: "column",
          };

          if (ws.maximized) {
            style = {
              ...style,
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            };
          }

          return (
            <div
              key={widget.id}
              className="xp-window"
              style={style}
              onMouseDown={() => bringToFront(widget.id)}
            >
              {/* Title bar */}
              <div
                className="xp-titlebar"
                onMouseDown={e => !ws.maximized && startDrag(e, widget.id)}
                onDoubleClick={() => toggleMaximize(widget.id)}
                style={{ flexShrink: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, overflow: "hidden" }}>
                  <span style={{ fontSize: 12 }}>{getWidgetIcon(widget.type)}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {widget.title}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  <button
                    className="xp-tb-btn xp-tb-btn-min"
                    onClick={e => { e.stopPropagation(); toggleMinimize(widget.id); }}
                    title="Minimise"
                  >
                    _
                  </button>
                  <button
                    className="xp-tb-btn xp-tb-btn-max"
                    onClick={e => { e.stopPropagation(); toggleMaximize(widget.id); }}
                    title={ws.maximized ? "Restore" : "Maximise"}
                  >
                    {ws.maximized ? "❐" : "□"}
                  </button>
                  <button
                    className="xp-tb-btn xp-tb-btn-close"
                    onClick={e => { e.stopPropagation(); toggleMinimize(widget.id); }}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, background: "#D4D0C8", overflow: "hidden", position: "relative" }}>
                <WidgetContent
                  widget={widget}
                  guestbook={guestbook}
                  username={username}
                  onRefresh={loadData}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Taskbar */}
      <div className="xp-taskbar">
        <button className="xp-start-btn">
          <span style={{ fontSize: 16 }}>⊞</span>
          start
        </button>

        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)", margin: "0 2px" }} />

        {/* Window buttons */}
        <div style={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
          {widgets.map(widget => {
            const ws = winStates[widget.id];
            if (!ws) return null;
            return (
              <button
                key={widget.id}
                className={`xp-taskbar-btn${!ws.minimized ? " active" : ""}`}
                onClick={() => {
                  if (ws.minimized) {
                    setWinStates(prev => ({ ...prev, [widget.id]: { ...prev[widget.id], minimized: false } }));
                    bringToFront(widget.id);
                  } else {
                    toggleMinimize(widget.id);
                  }
                }}
              >
                <span>{getWidgetIcon(widget.type)}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{widget.title}</span>
              </button>
            );
          })}
        </div>

        {/* System tray */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 4 }}>
          <div className="xp-clock">
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
}

function getWidgetIcon(type: string): string {
  const icons: Record<string, string> = {
    about: "👤",
    photos: "🖼️",
    guestbook: "✍️",
    now_playing: "🎵",
    links: "🔗",
    hit_counter: "👁️",
  };
  return icons[type] || "📄";
}
