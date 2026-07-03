"use client";
import { useEffect, useState } from "react";
import { Inbox, Music4, Calendar, Image as ImageIcon, TrendingUp, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Stats = { inquiries: number; newInquiries: number; events: number; pendingPhotos: number };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("adminUser");
    if (u) setUser(JSON.parse(u));
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/api/inquiries?limit=1`, { headers }).then(r => r.json()).catch(() => ({ total: 0 })),
      fetch(`${API}/api/inquiries?status=NEW&limit=1`, { headers }).then(r => r.json()).catch(() => ({ total: 0 })),
      fetch(`${API}/api/events/all`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/gallery/pending`, { headers }).then(r => r.json()).catch(() => []),
    ]).then(([all, newInq, events, pending]) => {
      setStats({
        inquiries: all.total || 0,
        newInquiries: newInq.total || 0,
        events: Array.isArray(events) ? events.length : 0,
        pendingPhotos: Array.isArray(pending) ? pending.length : 0,
      });
    });
  }, []);

  const statCards = [
    { id: "stat-total-inquiries", icon: Inbox, label: "Total Inquiries", value: stats?.inquiries ?? "—", sub: `${stats?.newInquiries ?? 0} new`, color: "#60a5fa" },
    { id: "stat-new-inquiries", icon: TrendingUp, label: "New / Unread", value: stats?.newInquiries ?? "—", sub: "Requires action", color: "var(--gold)" },
    { id: "stat-events", icon: Calendar, label: "Upcoming Events", value: stats?.events ?? "—", sub: "In calendar", color: "#a78bfa" },
    { id: "stat-pending-photos", icon: ImageIcon, label: "Pending Photos", value: stats?.pendingPhotos ?? "—", sub: "Awaiting review", color: "#4ade80" },
  ];

  const quickLinks = [
    { id: "ql-inquiries", label: "📥 Review New Inquiries", href: "/admin/inquiries?status=NEW", desc: "Respond to client requests" },
    { id: "ql-choir", label: "🎼 Manage Choir Calendar", href: "/admin/choir", desc: "Add events & approve photos" },
    { id: "ql-content", label: "✏️ Update Pricing", href: "/admin/content?group=pricing", desc: "Edit live pricing tiers" },
    { id: "ql-auditions", label: "🎤 View Audition Apps", href: "/admin/choir#auditions", desc: "Review & shortlist applicants" },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Welcome */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.375rem" }}>
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-secondary" style={{ fontSize: "0.9375rem" }}>
          Here&apos;s a snapshot of what&apos;s happening at Imara Studios today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {statCards.map(({ id, icon: Icon, label, value, sub, color }) => (
          <div key={id} id={id} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500, marginTop: "0.25rem" }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {quickLinks.map(({ id, label, href, desc }) => (
            <a key={id} id={id} href={href} style={{ display: "block", padding: "1.25rem 1.5rem", background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>{label}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{desc}</div>
            </a>
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="card" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Clock size={16} color="var(--gold)" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 600, color: "var(--gold)" }}>System Status</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {[["API", "Operational", "#4ade80"], ["Database", "Connected", "#4ade80"], ["Email (Resend)", "Active", "#4ade80"], ["SMS (AT)", "Pending Setup", "#fbbf24"]].map(([name, status, color]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{name}:</span>
              <span style={{ fontSize: "0.8125rem", color, fontWeight: 600 }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
