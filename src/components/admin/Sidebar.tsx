"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/admin/dashboard", icon: "▦", label: "Dashboard" },
  { href: "/admin/screens", icon: "⊡", label: "Screens" },
  { href: "/admin/media", icon: "◫", label: "Media" },
  { href: "/admin/playlists", icon: "☰", label: "Playlists" },
  { href: "/admin/settings", icon: "◎", label: "Settings" },
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220,
      background: "var(--bg-2)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        marginBottom: 28,
      }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}>✦</div>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17 }}>
          Translook
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: active ? "var(--text)" : "var(--text-2)",
              background: active ? "var(--bg-3)" : "transparent",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => !active && (e.currentTarget.style.color = "var(--text-2)")}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{
        borderTop: "1px solid var(--border)",
        paddingTop: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        <div style={{ padding: "4px 12px" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
            {user?.name || user?.email}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>{user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--text-2)",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}
        >
          ↪ Sign out
        </button>
      </div>
    </aside>
  );
}
