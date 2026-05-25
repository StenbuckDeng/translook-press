import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>Manage your account and platform settings</p>
      </div>

      <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Account</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label>Name</label>
              <input defaultValue={session?.user?.name || ""} readOnly />
            </div>
            <div>
              <label>Email</label>
              <input defaultValue={session?.user?.email || ""} readOnly />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Platform</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Database", value: "Neon PostgreSQL", status: "connected" },
              { label: "Cache", value: "Upstash Redis", status: "connected" },
              { label: "Storage", value: "Cloudflare R2", status: "connected" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>{item.value}</p>
                </div>
                <span className="badge badge-published">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
