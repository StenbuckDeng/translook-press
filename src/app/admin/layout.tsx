import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <AdminSidebar user={session.user} />
      <main style={{
        flex: 1,
        overflow: "auto",
        background: "var(--bg)",
        padding: "32px",
      }}>
        {children}
      </main>
    </div>
  );
}
