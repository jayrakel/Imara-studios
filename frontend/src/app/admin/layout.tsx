"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Inbox, FileText, Users, Music4, Settings,
  LogOut, ChevronRight, Menu, X, Shield, Image as ImageIcon, Music, User
} from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiry Inbox", icon: Inbox },
  { href: "/admin/content", label: "Content Manager", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/songs", label: "Song Library", icon: Music },
  { href: "/admin/choir", label: "Choir Manager", icon: Music4 },
  { href: "/admin/members", label: "Choir Members", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") { setChecking(false); return; }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // Verify the token is actually still valid, not just present
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminUser");
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    }).catch(() => {
      router.replace("/admin/login");
    });
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out");
    router.push("/");
  };

  // Don't render layout on login page
  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return null; // or a loading spinner if you want one

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--charcoal-900)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: "var(--charcoal-800)", borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40,

        transition: "transform 0.3s ease",
      }} className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <Shield size={20} color="var(--gold)" />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--gold)", letterSpacing: "0.08em" }}>IMARA ADMIN</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>DASHBOARD</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href} id={`admin-nav-${label.toLowerCase().replace(/ /g, '-')}`}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)", textDecoration: "none",
                  background: active ? "rgba(201,168,76,0.1)" : "transparent",
                  color: active ? "var(--gold)" : "var(--text-muted)",
                  fontWeight: active ? 600 : 400, fontSize: "0.9375rem",
                  transition: "all 0.15s", borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
                }}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: logout */}
        <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button id="admin-logout-btn" onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.75rem 1rem", background: "none", border: "none", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9375rem", transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {
        sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 39 }} />
        )
      }

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 260, display: "flex", flexDirection: "column" }} className="admin-main">
        {/* Top bar */}
        <header style={{ background: "var(--charcoal-800)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
          <button id="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "0.25rem", display: "none" }} className="admin-menu-btn">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>System operational</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>

      <style>{`
        .admin-sidebar { transform: translateX(0); }
@media (max-width: 1024px) {
  .admin-sidebar { transform: translateX(-100%) !important; }
  .admin-sidebar.open { transform: translateX(0) !important; }
  .admin-main { margin-left: 0 !important; }
  .admin-menu-btn { display: flex !important; }
}
      `}</style>
    </div >
  );
}
