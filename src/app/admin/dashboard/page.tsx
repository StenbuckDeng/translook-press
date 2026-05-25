import { db } from "@/lib/db";
import { screens, media, playlists } from "@/lib/schema";
import { sql } from "drizzle-orm";

async function getStats() {
  const [screenCount] = await db.select({ count: sql<number>`count(*)` }).from(screens);
  const [mediaCount] = await db.select({ count: sql<number>`count(*)` }).from(media);
  const [playlistCount] = await db.select({ count: sql<number>`count(*)` }).from(playlists);
  return {
    screens: Number(screenCount.count),
    media: Number(mediaCount.count),
    playlists: Number(playlistCount.count),
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    { label: "Screens", value: stats.screens, icon: "⊡", color: "var(--accent)" },
    { label: "Media Files", value: stats.media, icon: "◫", color: "var(--success)" },
    { label: "Playlists", value: stats.playlists, icon: "☰", color: "var(--warning)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Welcome back. Here's what's happening.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <div key={card.label} className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${card.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: card.color,
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: 28, fontWeight: 600, fontFamily: "'DM Serif Display', serif" }}>
                {card.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-2)" }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/admin/screens" className="btn btn-primary">+ New Screen</a>
          <a href="/admin/media" className="btn">↑ Upload Media</a>
          <a href="/admin/playlists" className="btn">+ New Playlist</a>
        </div>
      </div>
    </div>
  );
}
