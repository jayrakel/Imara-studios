"use client";
import { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const statusColors: Record<string, string> = {
  NEW: "badge-new", IN_DISCUSSION: "badge-discussion", QUOTED: "badge-quoted",
  BOOKED: "badge-booked", COMPLETED: "badge-completed", ARCHIVED: "badge-archived",
};

const statuses = ["NEW", "IN_DISCUSSION", "QUOTED", "BOOKED", "COMPLETED", "ARCHIVED"];

type Inquiry = { id: string; clientName: string; clientEmail: string; type: string; serviceType?: string; status: string; createdAt: string; message: string; quotedAmount?: number };

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50", ...(search && { search }), ...(statusFilter && { status: statusFilter }) });
      const res = await fetch(`${API}/api/inquiries?${params}`, { headers });
      const data = await res.json();
      setInquiries(data.data || []);
      setTotal(data.total || 0);
    } catch { toast.error("Failed to load inquiries"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const updateStatus = async (id: string, status: string, quotedAmount?: string) => {
    try {
      await fetch(`${API}/api/inquiries/${id}/status`, { method: "PATCH", headers, body: JSON.stringify({ status, quotedAmount }) });
      toast.success(`Status updated to ${status}`);
      load();
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch { toast.error("Failed to update status"); }
  };

  const sendReply = async () => {
    if (!selected || !replySubject || !replyBody) { toast.error("Subject and body required"); return; }
    setSending(true);
    try {
      await fetch(`${API}/api/inquiries/${selected.id}/reply`, { method: "POST", headers, body: JSON.stringify({ subject: replySubject, body: replyBody }) });
      toast.success("Reply sent!");
      setReplySubject(""); setReplyBody("");
      // Auto-progress to IN_DISCUSSION if still NEW
      if (selected.status === "NEW") updateStatus(selected.id, "IN_DISCUSSION");
    } catch { toast.error("Failed to send reply"); }
    finally { setSending(false); }
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Inquiry Inbox</h1>
          <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{total} total inquiries</p>
        </div>
        <button id="inbox-refresh" onClick={load} className="btn btn-outline btn-sm" disabled={loading}>
          <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }} />
          <input id="inbox-search" className="input" placeholder="Search by name, email..." style={{ paddingLeft: "2.5rem" }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select id="inbox-status-filter" className="select" style={{ width: "auto", minWidth: 160 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.2fr" : "1fr", gap: "1.5rem" }}>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "75vh", overflowY: "auto" }}>
          {inquiries.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No inquiries found.</div>
          )}
          {inquiries.map((inq) => (
            <div key={inq.id} id={`inquiry-item-${inq.id.slice(0, 8)}`}
              onClick={() => { setSelected(inq); setNewStatus(inq.status); }}
              style={{ padding: "1.25rem 1.5rem", background: selected?.id === inq.id ? "var(--charcoal-600)" : "var(--charcoal-700)", border: `1px solid ${selected?.id === inq.id ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{inq.clientName}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{inq.clientEmail}</div>
                </div>
                <span className={`badge ${statusColors[inq.status] || "badge-archived"}`}>{inq.status.replace("_", " ")}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--charcoal-500)", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>{inq.type.replace("_", " ")}</span>
                {inq.serviceType && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{inq.serviceType.replace("_", " ")}</span>}
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>{new Date(inq.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", maxHeight: "75vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700 }}>{selected.clientName}</h2>
                <a href={`mailto:${selected.clientEmail}`} style={{ color: "var(--gold)", fontSize: "0.875rem", textDecoration: "none" }}>{selected.clientEmail}</a>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.25rem" }}>×</button>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Message</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, background: "var(--charcoal-600)", padding: "1rem", borderRadius: "var(--radius-sm)", margin: 0 }}>{selected.message}</p>
            </div>

            {/* Status update */}
            <div>
              <label className="form-label">Update Status</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {statuses.map(s => (
                  <button key={s} id={`status-btn-${s.toLowerCase()}`} onClick={() => updateStatus(selected.id, s)}
                    style={{ padding: "0.375rem 0.875rem", border: `1px solid ${selected.status === s ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "100px", background: selected.status === s ? "rgba(201,168,76,0.15)" : "transparent", color: selected.status === s ? "var(--gold)" : "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", fontWeight: selected.status === s ? 600 : 400, transition: "all 0.15s" }}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Reply to Client</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div><label className="form-label" htmlFor="reply-subject">Subject</label><input id="reply-subject" className="input" placeholder="Re: Your Studio Inquiry" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} /></div>
                <div><label className="form-label" htmlFor="reply-body">Message</label><textarea id="reply-body" className="textarea" placeholder="Hi [Name], thank you for reaching out..." value={replyBody} onChange={(e) => setReplyBody(e.target.value)} style={{ minHeight: 140 }} /></div>
                <button id="inbox-send-reply" onClick={sendReply} className="btn btn-gold" disabled={sending}>
                  <Send size={16} /> {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
