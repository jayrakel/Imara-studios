"use client";
import { useState, useEffect } from "react";
import { Calendar, Image as ImageIcon, Mic2, Plus, Trash2, Check, X, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Tab = "events" | "gallery" | "auditions";

export default function ChoirManagerPage() {
  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState<any[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [auditions, setAuditions] = useState<any[]>([]);
  const [auditionsOpen, setAuditionsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", venue: "", eventDate: "", description: "", isPublic: true, isBlocked: false });

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = async () => {
    setLoading(true);
    try {
      const [evRes, photoRes, audRes, openRes] = await Promise.all([
        fetch(`${API}/api/events/all`, { headers }).then(r => r.json()),
        fetch(`${API}/api/gallery/pending`, { headers }).then(r => r.json()),
        fetch(`${API}/api/auditions`, { headers }).then(r => r.json()),
        fetch(`${API}/api/settings/auditions_open`).then(r => r.json()),
      ]);
      setEvents(Array.isArray(evRes) ? evRes : []);
      setPendingPhotos(Array.isArray(photoRes) ? photoRes : []);
      setAuditions(Array.isArray(audRes) ? audRes : []);
      setAuditionsOpen(openRes.value === "true");
    } catch { toast.error("Failed to load choir data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleAuditions = async () => {
    const newVal = !auditionsOpen;
    try {
      await fetch(`${API}/api/settings/auditions_open`, { method: "PUT", headers, body: JSON.stringify({ value: String(newVal), label: "Choir Auditions Open" }) });
      setAuditionsOpen(newVal);
      toast.success(`Auditions ${newVal ? "OPENED" : "CLOSED"} on public site`);
    } catch { toast.error("Failed to update auditions toggle"); }
  };

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.eventDate) { toast.error("Title and date required"); return; }
    try {
      await fetch(`${API}/api/events`, { method: "POST", headers, body: JSON.stringify(newEvent) });
      toast.success("Event created!"); setNewEvent({ title: "", venue: "", eventDate: "", description: "", isPublic: true, isBlocked: false }); load();
    } catch { toast.error("Failed to create event"); }
  };

  const deleteEvent = async (id: string) => {
    await fetch(`${API}/api/events/${id}`, { method: "DELETE", headers });
    toast.success("Event deleted"); load();
  };

  const approvePhoto = async (id: string) => {
    await fetch(`${API}/api/gallery/${id}/publish`, { method: "PATCH", headers });
    toast.success("Photo approved and published!"); load();
  };

  const rejectPhoto = async (id: string) => {
    await fetch(`${API}/api/gallery/${id}/reject`, { method: "PATCH", headers });
    toast.success("Photo rejected"); load();
  };

  const updateAuditionStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/auditions/${id}/status`, { method: "PATCH", headers, body: JSON.stringify({ status }) });
    toast.success(`Application ${status.toLowerCase()}`); load();
  };

  const tabs = [
    { id: "events" as Tab, label: "Calendar Events", icon: Calendar },
    { id: "gallery" as Tab, label: `Gallery (${pendingPhotos.length} pending)`, icon: ImageIcon },
    { id: "auditions" as Tab, label: `Auditions (${auditions.length})`, icon: Mic2 },
  ];

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Choir Manager</h1>
          <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Events, gallery moderation, and audition management</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Auditions toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 1rem", background: "var(--charcoal-700)", borderRadius: "var(--radius-md)", border: `1px solid ${auditionsOpen ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Auditions:</span>
            <button id="auditions-toggle-btn" onClick={toggleAuditions} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem", color: auditionsOpen ? "#4ade80" : "var(--text-muted)", fontWeight: 600, fontSize: "0.875rem" }}>
              {auditionsOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              {auditionsOpen ? "OPEN" : "CLOSED"}
            </button>
          </div>
          <button id="choir-refresh" onClick={load} className="btn btn-outline btn-sm" disabled={loading}>
            <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "2rem" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} id={`choir-tab-${id}`} onClick={() => setTab(id)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.875rem 0.5rem", border: "none", background: tab === id ? "rgba(201,168,76,0.1)" : "var(--charcoal-600)", color: tab === id ? "var(--gold)" : "var(--text-muted)", fontWeight: tab === id ? 600 : 400, cursor: "pointer", fontSize: "0.875rem", transition: "all 0.2s" }}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {/* Events Tab */}
      {tab === "events" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Add event form */}
          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "1.25rem" }}>Add New Event</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div><label className="form-label" htmlFor="ev-title">Title *</label><input id="ev-title" className="input" placeholder="Event title" value={newEvent.title} onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))} /></div>
              <div><label className="form-label" htmlFor="ev-date">Date *</label><input id="ev-date" type="datetime-local" className="input" value={newEvent.eventDate} onChange={(e) => setNewEvent(p => ({ ...p, eventDate: e.target.value }))} /></div>
              <div><label className="form-label" htmlFor="ev-venue">Venue</label><input id="ev-venue" className="input" placeholder="Venue name" value={newEvent.venue} onChange={(e) => setNewEvent(p => ({ ...p, venue: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <input type="checkbox" checked={newEvent.isPublic} onChange={(e) => setNewEvent(p => ({ ...p, isPublic: e.target.checked }))} /> Public
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <input type="checkbox" checked={newEvent.isBlocked} onChange={(e) => setNewEvent(p => ({ ...p, isBlocked: e.target.checked }))} /> Blocked/Private
                </label>
              </div>
            </div>
            <button id="add-event-btn" onClick={createEvent} className="btn btn-gold btn-sm"><Plus size={14} /> Add Event</button>
          </div>

          {/* Events list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {events.map((ev) => (
              <div key={ev.id} id={`event-item-${ev.id.slice(0, 8)}`}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{ev.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{new Date(ev.eventDate).toLocaleDateString()} · {ev.venue || "TBA"}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {ev.isBlocked && <span className="badge badge-archived">Blocked</span>}
                  {ev.isPublic && <span className="badge badge-booked">Public</span>}
                  <button id={`delete-event-${ev.id.slice(0, 8)}`} onClick={() => deleteEvent(ev.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.375rem" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {tab === "gallery" && (
        <div>
          {pendingPhotos.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>No pending photos. All caught up! ✓</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {pendingPhotos.map((photo) => (
              <div key={photo.id} id={`photo-pending-${photo.id.slice(0, 8)}`} style={{ background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <div style={{ aspectRatio: "16/9", background: "var(--charcoal-600)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                  <img src={`${API}${photo.url}`} alt={photo.altText || photo.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "1rem" }}>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>{photo.caption || "No caption"}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>By: {photo.uploader?.name || "Unknown"} · {photo.category}</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button id={`approve-photo-${photo.id.slice(0, 8)}`} onClick={() => approvePhoto(photo.id)} className="btn btn-gold btn-sm" style={{ flex: 1, justifyContent: "center" }}><Check size={14} /> Approve</button>
                    <button id={`reject-photo-${photo.id.slice(0, 8)}`} onClick={() => rejectPhoto(photo.id)} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: "center" }}><X size={14} /> Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auditions Tab */}
      {tab === "auditions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {auditions.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>No audition applications yet.</div>}
          {auditions.map((app) => (
            <div key={app.id} id={`audition-${app.id.slice(0, 8)}`}
              style={{ padding: "1.25rem 1.5rem", background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{app.name}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{app.email} · {app.vocalRange}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{app.experienceYears || 0} years exp · {new Date(app.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["SHORTLISTED", "ACCEPTED", "REJECTED"].map(s => (
                    <button key={s} id={`aud-status-${s.toLowerCase()}-${app.id.slice(0, 8)}`}
                      onClick={() => updateAuditionStatus(app.id, s)}
                      style={{ padding: "0.375rem 0.875rem", border: `1px solid ${app.status === s ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "100px", background: app.status === s ? "rgba(201,168,76,0.1)" : "transparent", color: app.status === s ? "var(--gold)" : "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", fontWeight: app.status === s ? 600 : 400 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {app.motivation && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.75rem", lineHeight: 1.6 }}>{app.motivation.slice(0, 200)}...</p>}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
