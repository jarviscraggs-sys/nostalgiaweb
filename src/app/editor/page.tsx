"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Widget {
  id: number;
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

interface Site {
  id: number;
  username: string;
  title: string;
  wallpaper: string;
  theme_color: string;
  bg_color: string;
}

const WALLPAPERS = [
  { id: "bliss", label: "Bliss (XP Classic)" },
  { id: "space", label: "Space" },
  { id: "dark", label: "Dark Blue" },
  { id: "teal", label: "Classic Teal" },
  { id: "classic", label: "XP Blue" },
];

const WALLPAPER_CLASSES: Record<string, string> = {
  bliss: "wallpaper-bliss",
  space: "wallpaper-space",
  dark: "wallpaper-dark",
  teal: "wallpaper-teal",
  classic: "wallpaper-classic",
};

const WIDGET_TYPES = [
  { type: "about", label: "About Me", icon: "👤", desc: "Bio/text widget" },
  { type: "now_playing", label: "Now Playing", icon: "🎵", desc: "Music widget" },
  { type: "links", label: "Links", icon: "🔗", desc: "Favourite links" },
  { type: "photos", label: "Photos", icon: "🖼️", desc: "Photo grid" },
  { type: "guestbook", label: "Guestbook", icon: "✍️", desc: "Visitor messages" },
  { type: "hit_counter", label: "Hit Counter", icon: "👁️", desc: "Visit counter" },
];

function getWidgetIcon(type: string): string {
  const icons: Record<string, string> = { about: "👤", photos: "🖼️", guestbook: "✍️", now_playing: "🎵", links: "🔗", hit_counter: "👁️" };
  return icons[type] || "📄";
}

function WidgetPreview({ widget }: { widget: Widget }) {
  const c = widget.content;
  switch (widget.type) {
    case "about":
      return <div style={{ padding: "6px 10px", fontSize: 11, lineHeight: 1.6, overflowY: "auto", height: "calc(100% - 4px)", whiteSpace: "pre-wrap" }}>{(c.text as string) || ""}</div>;
    case "now_playing":
      return (
        <div style={{ padding: 10 }}>
          <div style={{ background: "#000", color: "#00FF00", fontFamily: "Courier New", fontSize: 10, padding: "6px 8px", lineHeight: 1.5 }}>
            <div>▶ {(c.song as string) || "No track"}</div>
            <div style={{ color: "#00CC00" }}>   {(c.artist as string) || "Unknown"}</div>
          </div>
        </div>
      );
    case "links": {
      const links = (c.links as Array<{ title: string; url: string }>) || [];
      return (
        <div style={{ padding: "6px 10px", fontSize: 11 }}>
          {links.slice(0, 4).map((l, i) => (
            <div key={i} style={{ marginBottom: 3 }}>🔗 <span style={{ color: "#0000CC", textDecoration: "underline" }}>{l.title}</span></div>
          ))}
          {links.length === 0 && <span style={{ color: "#808080", fontStyle: "italic" }}>No links yet</span>}
        </div>
      );
    }
    case "guestbook":
      return <div style={{ padding: "6px 10px", fontSize: 11, color: "#808080", fontStyle: "italic" }}>Guestbook widget — visitors can sign here</div>;
    case "hit_counter":
      return (
        <div style={{ padding: 10, textAlign: "center" }}>
          <div style={{ background: "#000", color: "#FF4400", fontFamily: "Courier New", fontSize: 20, padding: "4px 10px", display: "inline-block", letterSpacing: 3 }}>0000000</div>
        </div>
      );
    case "photos":
      return <div style={{ padding: "6px 10px", fontSize: 11, color: "#808080", fontStyle: "italic" }}>Photos widget</div>;
    default:
      return <div style={{ padding: 10, fontSize: 11, color: "#808080" }}>{widget.type}</div>;
  }
}

type ContentEditor = {
  about: { text: string };
  now_playing: { song: string; artist: string };
  links: { links: Array<{ title: string; url: string }> };
  photos: { photos: Array<{ url: string; caption: string }> };
};

function EditPanel({
  widget,
  onSave,
  onDelete,
  onClose,
}: {
  widget: Widget;
  onSave: (id: number, updates: Partial<Widget & { content: Record<string, unknown> }>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(widget.title);
  const [content, setContent] = useState<ContentEditor>({
    about: { text: (widget.content.text as string) || "" },
    now_playing: {
      song: (widget.content.song as string) || "",
      artist: (widget.content.artist as string) || "",
    },
    links: { links: (widget.content.links as Array<{ title: string; url: string }>) || [] },
    photos: { photos: (widget.content.photos as Array<{ url: string; caption: string }>) || [] },
  });
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [newPhoto, setNewPhoto] = useState({ url: "", caption: "" });

  async function handleSave() {
    setSaving(true);
    let contentPayload: Record<string, unknown> = {};
    switch (widget.type) {
      case "about": contentPayload = { text: content.about.text }; break;
      case "now_playing": contentPayload = { song: content.now_playing.song, artist: content.now_playing.artist }; break;
      case "links": contentPayload = { links: content.links.links }; break;
      case "photos": contentPayload = { photos: content.photos.photos }; break;
      default: contentPayload = widget.content;
    }
    await onSave(widget.id, { title, content: contentPayload });
    setSaving(false);
  }

  function addLink() {
    if (!newLink.title || !newLink.url) return;
    setContent(prev => ({
      ...prev,
      links: { links: [...prev.links.links, { ...newLink }] },
    }));
    setNewLink({ title: "", url: "" });
  }

  function removeLink(i: number) {
    setContent(prev => ({
      ...prev,
      links: { links: prev.links.links.filter((_, j) => j !== i) },
    }));
  }

  function addPhoto() {
    if (!newPhoto.url) return;
    setContent(prev => ({
      ...prev,
      photos: { photos: [...prev.photos.photos, { ...newPhoto }] },
    }));
    setNewPhoto({ url: "", caption: "" });
  }

  function removePhoto(i: number) {
    setContent(prev => ({
      ...prev,
      photos: { photos: prev.photos.photos.filter((_, j) => j !== i) },
    }));
  }

  return (
    <div className="xp-window" style={{ width: 300, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
      <div className="xp-titlebar">
        <span>✏️ Edit Widget</span>
        <button className="xp-tb-btn xp-tb-btn-close" onClick={onClose}>✕</button>
      </div>
      <div style={{ padding: 12, background: "#D4D0C8", overflowY: "auto", flex: 1 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 3 }}>Window Title:</label>
          <input className="xp-input" value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%" }} />
        </div>

        {widget.type === "about" && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 3 }}>Bio Text:</label>
            <textarea
              className="xp-input"
              value={content.about.text}
              onChange={e => setContent(p => ({ ...p, about: { text: e.target.value } }))}
              rows={6}
              style={{ width: "100%", resize: "vertical", fontFamily: "Tahoma, sans-serif", fontSize: 11 }}
            />
          </div>
        )}

        {widget.type === "now_playing" && (
          <>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 3 }}>Song:</label>
              <input className="xp-input" value={content.now_playing.song} onChange={e => setContent(p => ({ ...p, now_playing: { ...p.now_playing, song: e.target.value } }))} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 3 }}>Artist:</label>
              <input className="xp-input" value={content.now_playing.artist} onChange={e => setContent(p => ({ ...p, now_playing: { ...p.now_playing, artist: e.target.value } }))} style={{ width: "100%" }} />
            </div>
          </>
        )}

        {widget.type === "links" && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 6 }}>Links:</label>
            {content.links.links.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🔗 {l.title}</span>
                <button className="xp-button" style={{ fontSize: 10, padding: "1px 6px", color: "red" }} onClick={() => removeLink(i)}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6, paddingTop: 6, borderTop: "1px solid #808080" }}>
              <input className="xp-input" placeholder="Link title" value={newLink.title} onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))} style={{ fontSize: 11 }} />
              <input className="xp-input" placeholder="https://..." value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} style={{ fontSize: 11 }} />
              <button className="xp-button" onClick={addLink} style={{ alignSelf: "flex-start", fontSize: 11 }}>+ Add Link</button>
            </div>
          </div>
        )}

        {widget.type === "photos" && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: "bold", display: "block", marginBottom: 6 }}>Photos:</label>
            {content.photos.photos.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🖼️ {p.caption || p.url.slice(0, 20)}</span>
                <button className="xp-button" style={{ fontSize: 10, padding: "1px 6px", color: "red" }} onClick={() => removePhoto(i)}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6, paddingTop: 6, borderTop: "1px solid #808080" }}>
              <input className="xp-input" placeholder="Image URL" value={newPhoto.url} onChange={e => setNewPhoto(p => ({ ...p, url: e.target.value }))} style={{ fontSize: 11 }} />
              <input className="xp-input" placeholder="Caption (optional)" value={newPhoto.caption} onChange={e => setNewPhoto(p => ({ ...p, caption: e.target.value }))} style={{ fontSize: 11 }} />
              <button className="xp-button" onClick={addPhoto} style={{ alignSelf: "flex-start", fontSize: 11 }}>+ Add Photo</button>
            </div>
          </div>
        )}

        {(widget.type === "guestbook" || widget.type === "hit_counter") && (
          <p style={{ fontSize: 11, color: "#808080", fontStyle: "italic" }}>This widget has no editable content.</p>
        )}

        <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 8, borderTop: "1px solid #808080" }}>
          <button className="xp-button" onClick={handleSave} disabled={saving} style={{ flex: 1, fontWeight: "bold" }}>
            {saving ? "Saving..." : "💾 Save"}
          </button>
          <button className="xp-button" onClick={() => onDelete(widget.id)} style={{ color: "red" }}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [winStates, setWinStates] = useState<Record<number, { x: number; y: number; width: number; height: number; minimized: boolean }>>({});
  const [topZ, setTopZ] = useState(10);
  const [winZOrder, setWinZOrder] = useState<Record<number, number>>({});
  const dragRef = useRef<{ id: number; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const loadData = useCallback(async () => {
    const res = await fetch("/api/site");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (res.ok) {
      const d = await res.json();
      setSite(d.site);
      setWidgets(d.widgets);
      const states: Record<number, { x: number; y: number; width: number; height: number; minimized: boolean }> = {};
      const zorder: Record<number, number> = {};
      d.widgets.forEach((w: Widget, i: number) => {
        states[w.id] = { x: w.x, y: w.y, width: w.width, height: w.height, minimized: false };
        zorder[w.id] = i + 1;
      });
      setWinStates(states);
      setWinZOrder(zorder);
      setTopZ(d.widgets.length + 10);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  function bringToFront(id: number) {
    setTopZ(z => z + 1);
    setWinZOrder(prev => ({ ...prev, [id]: topZ + 1 }));
  }

  function startDrag(e: React.MouseEvent, id: number) {
    e.preventDefault();
    bringToFront(id);
    const state = winStates[id];
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, origX: state.x, origY: state.y };

    function onMove(me: MouseEvent) {
      if (!dragRef.current) return;
      setWinStates(prev => ({
        ...prev,
        [dragRef.current!.id]: {
          ...prev[dragRef.current!.id],
          x: Math.max(0, dragRef.current!.origX + me.clientX - dragRef.current!.startX),
          y: Math.max(0, dragRef.current!.origY + me.clientY - dragRef.current!.startY),
        },
      }));
    }

    function onUp() {
      if (!dragRef.current) return;
      const id = dragRef.current.id;
      const state = winStates[id];
      // Save position to server
      fetch(`/api/widgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: state.x, y: state.y }),
      });
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  async function addWidget(type: string) {
    setShowAddWidget(false);
    const offsetCount = widgets.length;
    const res = await fetch("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, x: 40 + offsetCount * 20, y: 40 + offsetCount * 20 }),
    });
    if (res.ok) {
      const w = await res.json();
      setWidgets(prev => [...prev, w]);
      setWinStates(prev => ({
        ...prev,
        [w.id]: { x: w.x, y: w.y, width: w.width, height: w.height, minimized: false },
      }));
      setTopZ(z => z + 1);
      setWinZOrder(prev => ({ ...prev, [w.id]: topZ + 1 }));
      setEditingWidget(w);
    }
  }

  async function saveWidgetEdits(id: number, updates: Partial<Widget & { content: Record<string, unknown> }>) {
    const res = await fetch(`/api/widgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setWidgets(prev => prev.map(w => w.id === id ? updated : w));
      setEditingWidget(updated);
    }
  }

  async function deleteWidget(id: number) {
    await fetch(`/api/widgets/${id}`, { method: "DELETE" });
    setWidgets(prev => prev.filter(w => w.id !== id));
    setWinStates(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditingWidget(null);
  }

  async function saveSiteSettings() {
    if (!site) return;
    setSaving(true);
    await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: site.title,
        wallpaper: site.wallpaper,
        theme_color: site.theme_color,
        bg_color: site.bg_color,
        midi_url: "",
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#008080", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Tahoma, sans-serif", color: "white" }}>
        <p>Loading editor...</p>
      </div>
    );
  }

  if (!site) return null;

  const wallpaperClass = WALLPAPER_CLASSES[site.wallpaper] || "wallpaper-teal";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "Tahoma, Verdana, Arial, sans-serif", fontSize: 11 }}>
      {/* Editor toolbar */}
      <div style={{
        background: "linear-gradient(to bottom, #ECE9D8, #D4D0C8)",
        borderBottom: "2px solid #808080",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}>
        <span style={{ fontWeight: "bold", fontSize: 13, color: "#003E82" }}>🌐 NostalgiaWeb Editor</span>

        <div style={{ width: 1, height: 20, background: "#808080" }} />

        <button className="xp-button" onClick={() => setShowAddWidget(true)} style={{ fontWeight: "bold" }}>
          + Add Widget
        </button>

        <button className="xp-button" onClick={saveSiteSettings} disabled={saving} style={{ fontWeight: "bold" }}>
          {saved ? "✅ Saved!" : saving ? "Saving..." : "💾 Save Settings"}
        </button>

        <div style={{ width: 1, height: 20, background: "#808080" }} />

        {/* Site title */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 11 }}>Title:</label>
          <input
            className="xp-input"
            value={site.title}
            onChange={e => setSite(s => s ? { ...s, title: e.target.value } : s)}
            style={{ width: 180 }}
          />
        </div>

        {/* Wallpaper */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 11 }}>Wallpaper:</label>
          <select
            className="xp-select"
            value={site.wallpaper}
            onChange={e => setSite(s => s ? { ...s, wallpaper: e.target.value } : s)}
          >
            {WALLPAPERS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        <Link
          href={`/${site.username}`}
          target="_blank"
          className="xp-button"
          style={{ textDecoration: "none", color: "#1a1a1a" }}
        >
          👁️ View My Page
        </Link>

        <button className="xp-button" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Desktop canvas */}
      <div className={wallpaperClass} style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: "calc(100vh - 80px)" }}>

        {/* Add Widget Modal */}
        {showAddWidget && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}>
            <div className="xp-window" style={{ width: 380 }}>
              <div className="xp-titlebar">
                <span>📦 Add a Widget</span>
                <button className="xp-tb-btn xp-tb-btn-close" onClick={() => setShowAddWidget(false)}>✕</button>
              </div>
              <div style={{ padding: 16, background: "#D4D0C8" }}>
                <p style={{ marginBottom: 12, fontSize: 12 }}>Choose a widget type to add to your page:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {WIDGET_TYPES.map(wt => (
                    <button
                      key={wt.type}
                      className="xp-button"
                      onClick={() => addWidget(wt.type)}
                      style={{ padding: "8px 10px", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <span style={{ fontSize: 20 }}>{wt.icon}</span>
                      <span style={{ fontWeight: "bold", fontSize: 11 }}>{wt.label}</span>
                      <span style={{ fontSize: 10, color: "#808080" }}>{wt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit panel */}
        {editingWidget && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 9000 }}>
            <EditPanel
              widget={editingWidget}
              onSave={saveWidgetEdits}
              onDelete={deleteWidget}
              onClose={() => setEditingWidget(null)}
            />
          </div>
        )}

        {/* Widgets */}
        {widgets.map(widget => {
          const ws = winStates[widget.id];
          if (!ws) return null;

          return (
            <div
              key={widget.id}
              className="xp-window"
              style={{
                position: "absolute",
                left: ws.x,
                top: ws.y,
                width: ws.width,
                height: ws.height,
                zIndex: winZOrder[widget.id] || 1,
                display: "flex",
                flexDirection: "column",
                cursor: "default",
              }}
              onMouseDown={() => bringToFront(widget.id)}
            >
              <div
                className="xp-titlebar"
                onMouseDown={e => startDrag(e, widget.id)}
                style={{ flexShrink: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, overflow: "hidden" }}>
                  <span>{getWidgetIcon(widget.type)}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{widget.title}</span>
                </div>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  <button
                    className="xp-tb-btn"
                    style={{ background: "linear-gradient(180deg,#5BBA3C,#3D8A28)", color: "white", fontSize: 10 }}
                    onClick={e => { e.stopPropagation(); setEditingWidget(widget); }}
                    title="Edit widget"
                  >
                    ✏️
                  </button>
                  <button
                    className="xp-tb-btn xp-tb-btn-close"
                    onClick={e => { e.stopPropagation(); deleteWidget(widget.id); }}
                    title="Delete widget"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, background: "#D4D0C8", overflow: "hidden" }}>
                <WidgetPreview widget={widget} />
              </div>
            </div>
          );
        })}

        {widgets.length === 0 && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "rgba(255,255,255,0.8)",
            textShadow: "1px 1px 2px black",
          }}>
            <div style={{ fontSize: 48 }}>📦</div>
            <p style={{ fontSize: 16, marginTop: 8, fontWeight: "bold" }}>Your desktop is empty!</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Click <strong>+ Add Widget</strong> in the toolbar to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
