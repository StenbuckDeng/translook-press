"use client";
import { useState } from "react";
import type { Playlist, Media } from "@/lib/schema";

export default function PlaylistsClient({
  playlists: initial,
  media,
}: {
  playlists: Playlist[];
  media: Media[];
}) {
  const [playlists, setPlaylists] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function createPlaylist(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const items = selectedMedia.map((mediaId, i) => ({
      mediaId,
      duration: 10,
      order: i,
    }));
    const res = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, items }),
    });
    const playlist = await res.json();
    setPlaylists(prev => [playlist, ...prev]);
    setShowForm(false);
    setName(""); setDescription(""); setSelectedMedia([]);
    setLoading(false);
  }

  async function deletePlaylist(id: string) {
    if (!confirm("Delete this playlist?")) return;
    await fetch(`/api/playlists/${id}`, { method: "DELETE" });
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }

  function toggleMedia(id: string) {
    setSelectedMedia(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Playlists</h1>
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>{playlists.length} playlists</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Playlist</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: 16 }}>Create Playlist</h3>
          <form onSubmit={createPlaylist}>
            <div className="form-group">
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Main Loop" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>Select Media ({selectedMedia.length} selected)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, maxHeight: 260, overflowY: "auto", padding: 2 }}>
                {media.map(m => (
                  <div
                    key={m.id}
                    onClick={() => toggleMedia(m.id)}
                    style={{
                      border: `2px solid ${selectedMedia.includes(m.id) ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 8,
                      padding: 8,
                      cursor: "pointer",
                      background: selectedMedia.includes(m.id) ? "rgba(124,106,245,0.1)" : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    {m.type === "image" ? (
                      <img src={m.url} alt={m.name} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 4, marginBottom: 6 }} />
                    ) : (
                      <div style={{ width: "100%", height: 80, background: "var(--bg-3)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, fontSize: 24 }}>
                        {m.type === "video" ? "▶" : m.type === "audio" ? "♪" : "📄"}
                      </div>
                    )}
                    <p style={{ fontSize: 11, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        {playlists.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 32 }}>☰</span>
            <p>No playlists yet. Create your first playlist.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Items</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map(playlist => (
                <tr key={playlist.id}>
                  <td>
                    <p style={{ fontWeight: 500 }}>{playlist.name}</p>
                    {playlist.description && <p style={{ fontSize: 12, color: "var(--text-3)" }}>{playlist.description}</p>}
                  </td>
                  <td style={{ color: "var(--text-2)" }}>{(playlist.items as any[]).length} items</td>
                  <td>
                    <span className={`badge ${playlist.isActive ? "badge-published" : "badge-draft"}`}>
                      {playlist.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-3)", fontSize: 12 }}>
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn"
                      style={{ fontSize: 12, padding: "4px 12px", color: "var(--danger)" }}
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
