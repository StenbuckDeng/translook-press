"use client";
import { useState } from "react";
import type { Screen, Playlist } from "@/lib/schema";

export default function ScreensClient({
  screens: initial,
  playlists,
}: {
  screens: Screen[];
  playlists: Playlist[];
}) {
  const [screens, setScreens] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [loading, setLoading] = useState(false);

  async function createScreen(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/screens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, playlistId: playlistId || undefined }),
    });
    const screen = await res.json();
    setScreens(prev => [screen, ...prev]);
    setShowForm(false);
    setName(""); setDescription(""); setPlaylistId("");
    setLoading(false);
  }

  async function deleteScreen(id: string) {
    if (!confirm("Delete this screen?")) return;
    await fetch(`/api/screens/${id}`, { method: "DELETE" });
    setScreens(prev => prev.filter(s => s.id !== id));
  }

  async function publish(id: string, current: string) {
    const status = current === "published" ? "draft" : "published";
    const res = await fetch(`/api/screens/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setScreens(prev => prev.map(s => s.id === id ? updated : s));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Screens</h1>
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>{screens.length} screens configured</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Screen</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: 16 }}>Create Screen</h3>
          <form onSubmit={createScreen}>
            <div className="form-group">
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Lobby Display" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>Playlist</label>
              <select value={playlistId} onChange={e => setPlaylistId(e.target.value)}>
                <option value="">None</option>
                {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
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
        {screens.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 32 }}>⊡</span>
            <p>No screens yet. Create your first screen.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Pairing Code</th>
                <th>Playlist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => {
                const playlist = playlists.find(p => p.id === screen.playlistId);
                return (
                  <tr key={screen.id}>
                    <td>
                      <p style={{ fontWeight: 500 }}>{screen.name}</p>
                      {screen.description && <p style={{ fontSize: 12, color: "var(--text-3)" }}>{screen.description}</p>}
                    </td>
                    <td>
                      <span className={`badge badge-${screen.status}`}>{screen.status}</span>
                    </td>
                    <td>
                      <code style={{ fontFamily: "monospace", fontSize: 14, color: "var(--accent-2)", letterSpacing: 2 }}>
                        {screen.pairingCode}
                      </code>
                    </td>
                    <td style={{ color: "var(--text-2)", fontSize: 13 }}>
                      {playlist?.name || "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn"
                          style={{ fontSize: 12, padding: "4px 12px" }}
                          onClick={() => publish(screen.id, screen.status)}
                        >
                          {screen.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          className="btn"
                          style={{ fontSize: 12, padding: "4px 12px", color: "var(--danger)" }}
                          onClick={() => deleteScreen(screen.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
