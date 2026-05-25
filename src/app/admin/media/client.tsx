"use client";
import { useState, useRef } from "react";
import type { Media } from "@/lib/schema";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaType(mimeType: string): Media["type"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}

export default function MediaClient({ files: initial }: { files: Media[] }) {
  const [files, setFiles] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setProgress(0);

    // Get presigned URL
    const presignRes = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    const { uploadUrl, key } = await presignRes.json();

    // Upload to R2
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    setProgress(50);

    // Save to DB
    const saveRes = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        key,
        size: file.size,
        mimeType: file.type,
        type: getMediaType(file.type),
      }),
    });
    const saved = await saveRes.json();
    setFiles(prev => [saved, ...prev]);
    setProgress(100);
    setUploading(false);
  }

  async function deleteFile(id: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Media</h1>
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>{files.length} files uploaded</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <button
            className="btn btn-primary"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? `Uploading ${progress}%...` : "↑ Upload File"}
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
        style={{
          border: "2px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          textAlign: "center",
          marginBottom: 24,
          color: "var(--text-3)",
          fontSize: 14,
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        Drag & drop files here or click to browse
      </div>

      <div className="card" style={{ padding: 0 }}>
        {files.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 32 }}>◫</span>
            <p>No files yet. Upload your first file.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {file.type === "image" && (
                        <img
                          src={file.url}
                          alt={file.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, background: "var(--bg-3)" }}
                          onError={e => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{file.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-draft" style={{ textTransform: "capitalize" }}>
                      {file.type}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-2)", fontSize: 13 }}>{formatSize(file.size)}</td>
                  <td style={{ color: "var(--text-3)", fontSize: 12 }}>
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{ fontSize: 12, padding: "4px 12px" }}
                      >
                        View
                      </a>
                      <button
                        className="btn"
                        style={{ fontSize: 12, padding: "4px 12px", color: "var(--danger)" }}
                        onClick={() => deleteFile(file.id)}
                      >
                        Delete
                      </button>
                    </div>
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
