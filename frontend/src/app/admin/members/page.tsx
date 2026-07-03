"use client";
import { useState, useEffect } from "react";
import { Users, UserPlus, KeyRound, Trash2, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Member = { id: string; name: string; email: string; role: string; vocalPart?: string; isActive: boolean; tempPassword?: boolean };

export default function AdminMembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ name: "", email: "", password: "", role: "CHOIR_MEMBER", vocalPart: "" });

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const loadMembers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/members`, { headers });
            if (!res.ok) throw new Error("Failed to load members");
            setMembers(await res.json());
        } catch { toast.error("Could not load members"); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadMembers(); }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/api/auth/members`, { method: "POST", headers, body: JSON.stringify(form) });
            if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
            toast.success("Member added! Welcome email sent.");
            setShowAdd(false);
            setForm({ name: "", email: "", password: "", role: "CHOIR_MEMBER", vocalPart: "" });
            loadMembers();
        } catch (err: any) { toast.error(err.message || "Failed to add member"); }
        finally { setSubmitting(false); }
    };

    const handleResetPassword = async (id: string, name: string) => {
        const newPassword = prompt(`Enter new temporary password for ${name} (min 8 chars):`);
        if (!newPassword || newPassword.length < 8) { toast.error("Password too short or cancelled"); return; }
        try {
            const res = await fetch(`${API}/api/auth/members/${id}/reset-password`, { method: "POST", headers, body: JSON.stringify({ newPassword }) });
            if (!res.ok) throw new Error("Failed to reset");
            toast.success("Password reset & emailed to user!");
            loadMembers();
        } catch { toast.error("Failed to reset password"); }
    };

    const handleDeactivate = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this member? They will no longer be able to log in.")) return;
        try {
            const res = await fetch(`${API}/api/auth/members/${id}`, { method: "DELETE", headers });
            if (!res.ok) throw new Error("Failed to deactivate");
            toast.success("Member deactivated");
            loadMembers();
        } catch { toast.error("Failed to deactivate member"); }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Member Directory</h1>
                    <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Manage choir accounts, roles, and access.</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="btn btn-gold btn-sm"><UserPlus size={16} /> Add Member</button>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} className="card" style={{ marginBottom: "2rem", borderColor: "var(--gold)" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--gold)", fontWeight: 600 }}>Create New Member</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                        <div><label className="form-label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label className="form-label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                        <div><label className="form-label">Temp Password</label><input className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars" required minLength={8} /></div>
                        <div>
                            <label className="form-label">Role</label>
                            <select className="select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="CHOIR_MEMBER">Choir Member</option>
                                <option value="CHOIR_DIRECTOR">Choir Director</option>
                                <option value="STUDIO_ENGINEER">Studio Engineer</option>
                            </select>
                        </div>
                        <div><label className="form-label">Vocal Part</label><input className="input" value={form.vocalPart} onChange={e => setForm({ ...form, vocalPart: e.target.value })} placeholder="e.g. Soprano" /></div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button type="button" onClick={() => setShowAdd(false)} className="btn btn-outline btn-sm">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn btn-gold btn-sm">{submitting ? "Saving..." : "Save & Send Invite"}</button>
                    </div>
                </form>
            )}

            {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div> : (
                <div style={{ background: "var(--charcoal-800)", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                        <thead>
                            <tr style={{ background: "var(--charcoal-900)", color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <th style={{ padding: "1rem" }}>Name</th>
                                <th style={{ padding: "1rem" }}>Role & Part</th>
                                <th style={{ padding: "1rem" }}>Status</th>
                                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                    <td style={{ padding: "1rem" }}>
                                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{m.name}</div>
                                        <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>{m.email}</div>
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        <div>{m.role.replace(/_/g, " ")}</div>
                                        {m.vocalPart && <div style={{ color: "var(--gold)", fontSize: "0.75rem" }}>{m.vocalPart}</div>}
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        {m.isActive
                                            ? <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#10b981", fontSize: "0.75rem" }}><CheckCircle2 size={14} /> Active</span>
                                            : <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#ef4444", fontSize: "0.75rem" }}><XCircle size={14} /> Inactive</span>}
                                        {m.tempPassword && <div style={{ color: "#fbbf24", fontSize: "0.7rem", marginTop: 4 }}>Needs Password Change</div>}
                                    </td>
                                    <td style={{ padding: "1rem", textAlign: "right" }}>
                                        <button onClick={() => handleResetPassword(m.id, m.name)} title="Reset Password" style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginRight: "1rem" }}><KeyRound size={16} /></button>
                                        {m.isActive && <button onClick={() => handleDeactivate(m.id)} title="Deactivate" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><Trash2 size={16} /></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}