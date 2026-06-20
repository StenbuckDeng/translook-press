"use client";
import { useState, useMemo } from "react";
import type { Screen, Media, Playlist } from "@/lib/schema";

type Props = { screens: Screen[]; media: Media[]; playlists: Playlist[] };

export default function ConsoleClient({ screens, media, playlists }: Props) {
  const stats = useMemo(() => {
    const online = screens.filter(s => isOnline(s.lastSeen)).length;
    return {
      total: screens.length,
      online,
      offline: screens.length - online,
      media: media.length,
      playlists: playlists.length,
    };
  }, [screens, media, playlists]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "36px 44px", maxWidth: 1320 }}>
        <Header />
        <StatRow stats={stats} />
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginTop: 28 }}>
          <ScreensPanel screens={screens} />
          <ActivityPanel media={media} playlists={playlists} />
        </div>
      </main>
    </div>
  );
}

function isOnline(lastSeen: Date | string | null) {
  if (!lastSeen) return false;
  const diff = Date.now() - new Date(lastSeen).getTime();
  return diff < 90_000; // seen within last 90s
}

function Sidebar() {
  const items = [
    { icon: "◳", label: "Console", href: "/console", active: true },
    { icon: "⊡", label: "Screens", href: "/admin/screens" },
    { icon: "▤", label: "Playlists", href: "/admin/playlists" },
    { icon: "◫", label: "Media", href: "/admin/media" },
    { icon: "⚙", label: "Settings", href: "/admin/settings" },
  ];
  return (
    <aside style={{
      width: 232, borderRight: "1px solid var(--border)", padding: "28px 18px",
      display: "flex", flexDirection: "column", gap: 4, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 10px", marginBottom: 32 }}>
        <svg width={24} height={24} viewBox="0 0 32 32" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--accent)" />
          <path d="M11 9.5L23 16L11 22.5V9.5Z" fill="white" />
        </svg>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17 }}>
          Translook <em style={{ fontStyle: "italic", color: "var(--accent-2)" }}>Press</em>
        </span>
      </div>
      {items.map(item => (
        <a key={item.label} href={item.href} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
          borderRadius: "var(--radius)", fontSize: 14, fontWeight: 500,
          color: item.active ? "var(--text)" : "var(--text-2)",
          background: item.active ? "var(--bg-3)" : "transparent",
        }}>
          <span style={{ fontSize: 16, width: 18, textAlign: "center", color: item.active ? "var(--accent-2)" : "var(--text-3)" }}>{item.icon}</span>
          {item.label}
        </a>
      ))}
      <div style={{ flex: 1 }} />
      <a href="/" style={{ fontSize: 13, color: "var(--text-3)", padding: "10px 12px" }}>← Back to site</a>
    </aside>
  );
}

function Header() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
      <div>
        <h1 style={{ fontSize: 30, marginBottom: 6 }}>{greeting}.</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>Here's the state of the room right now.</p>
      </div>
      <a href="/admin/screens" className="btn btn-primary">+ New screen</a>
    </div>
  );
}

function StatRow({ stats }: { stats: { total: number; online: number; offline: number; media: number; playlists: number } }) {
  const cards = [
    { label: "Screens online", value: stats.online, of: stats.total, color: "var(--success)" },
    { label: "Screens offline", value: stats.offline, of: stats.total, color: stats.offline > 0 ? "var(--danger)" : "var(--text-3)" },
    { label: "Media files", value: stats.media, color: "var(--accent-2)" },
    { label: "Playlists", value: stats.playlists, color: "var(--warning)" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
      {cards.map(c => (
        <div key={c.label} className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, color: c.color }}>{c.value}</span>
            {c.of !== undefined && <span style={{ fontSize: 14, color: "var(--text-3)" }}>/ {c.of}</span>}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-2)" }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function ScreensPanel({ screens }: { screens: Screen[] }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16 }}>Screens</h3>
        <a href="/admin/screens" style={{ fontSize: 13, color: "var(--accent-2)" }}>Manage all →</a>
      </div>
      {screens.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 28 }}>⊡</span>
          <p>No screens yet. Pair your first display to see it here.</p>
        </div>
      ) : (
        <div>
          {screens.slice(0, 7).map(s => {
            const online = isOnline(s.lastSeen);
            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 24px",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: online ? "var(--success)" : "var(--text-3)",
                  boxShadow: online ? "0 0 8px var(--success)" : "none",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                    {s.pairingCode ? `Code ${s.pairingCode}` : "Unpaired"} · {online ? "Online now" : s.lastSeen ? `Last seen ${timeAgo(s.lastSeen)}` : "Never connected"}
                  </div>
                </div>
                <span className={`badge badge-${s.status}`}>{s.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActivityPanel({ media, playlists }: { media: Media[]; playlists: Playlist[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>Recent media</h3>
        </div>
        {media.length === 0 ? (
          <div className="empty-state" style={{ padding: "32px 20px" }}>
            <p style={{ fontSize: 13 }}>Nothing uploaded yet.</p>
          </div>
        ) : (
          <div style={{ padding: "10px 14px" }}>
            {media.slice(0, 5).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px" }}>
                <span style={{ fontSize: 14, color: "var(--text-3)" }}>{m.type === "video" ? "▶" : "◫"}</span>
                <span style={{ fontSize: 13.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{formatSize(m.size)}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "10px 22px 16px" }}>
          <a href="/admin/media" style={{ fontSize: 13, color: "var(--accent-2)" }}>View library →</a>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>Playlists</h3>
        </div>
        {playlists.length === 0 ? (
          <div className="empty-state" style={{ padding: "32px 20px" }}>
            <p style={{ fontSize: 13 }}>No playlists built yet.</p>
          </div>
        ) : (
          <div style={{ padding: "10px 14px" }}>
            {playlists.slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px" }}>
                <span style={{ fontSize: 14, color: "var(--text-3)" }}>▤</span>
                <span style={{ fontSize: 13.5, flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{p.items?.length || 0} items</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "10px 22px 16px" }}>
          <a href="/admin/playlists" style={{ fontSize: 13, color: "var(--accent-2)" }}>Manage playlists →</a>
        </div>
      </div>
    </div>
  );
}

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
