"use client";
import { useState, useEffect } from "react";
import { Music, Upload, Trash2, Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Song = { id: string; title: string; artist?: string; category: string; isPublic: boolean; url: string; coverArtUrl?: string; createdAt: string };

export default function AdminSongsPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const [form, setForm] = useState({ title: "", artist: "", category: "PERFORMANCE", isPublic: "false" });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    const loadSongs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/songs/members`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to load");
            setSongs(await res.json());
        } catch { toast.error("Could not load songs"); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadSongs(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile) { toast.error("Audio file required"); return; }
        setUploading(true);

        const fd = new FormData();
        fd.append("audio", audioFile);
        if (coverFile) fd.append("cover", coverFile);
        fd.append("title", form.title);
        fd.append("artist", form.artist);
        fd.append("category", form.category);
        fd.append("isPublic", form.isPublic);

        try {
            const res = await fetch(`${API}/api/songs`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
            if (!res.ok) throw new Error("Upload failed");
            toast.success("Song uploaded successfully!");
            setShowUpload(false);
            setAudioFile(null); setCoverFile(null); setForm({ title: "", artist: "", category: "PERFORMANCE", isPublic: "false" });
            loadSongs();
        } catch { toast.error("Failed to upload song"); }
        finally { setUploading(false); }
    };

    const togglePublic = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${API}/api/songs/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ isPublic: !currentStatus }) });
            if (!res.ok) throw new Error("Failed to update");
            toast.success(`Song is now ${!currentStatus ? "Public" : "Private"}`);
            loadSongs();
        } catch { toast.error("Failed to update status"); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the audio file permanently.")) return;
        try {
            await fetch(`${API}/api/songs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            toast.success("Song deleted");
            loadSongs();
        } catch { toast.error("Failed to delete"); }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Song Library</h1>
                    <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Upload tracks for members and the public portfolio.</p>
                </div>
                <button onClick={() => setShowUpload(!showUpload)} className="btn btn-gold btn-sm"><Upload size={16} /> Upload Song</button>
            </div>

            {showUpload && (
                <form onSubmit={handleUpload} className="card" style={{ marginBottom: "2rem", borderColor: "var(--gold)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label className="form-label">Audio File (MP3/WAV) *</label>
                            <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="input" required style={{ padding: "0.5rem" }} />
                        </div>
                        <div>
                            <label className="form-label">Cover Art (Optional)</label>
                            <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="input" style={{ padding: "0.5rem" }} />
                        </div>
                        <div><label className="form-label">Song Title *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                        <div><label className="form-label">Artist / Arranger</label><input className="input" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} placeholder="Imara Chorale" /></div>
                        <div>
                            <label className="form-label">Category</label>
                            <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="PERFORMANCE">Performance</option>
                                <option value="REHEARSAL">Rehearsal (Stems/Parts)</option>
                                <option value="ARCHIVE">Archive</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Visibility</label>
                            <select className="select" value={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.value })}>
                                <option value="false">Private (Members Only)</option>
                                <option value="true">Public (Portfolio Page)</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button type="button" onClick={() => setShowUpload(false)} className="btn btn-outline btn-sm">Cancel</button>
                        <button type="submit" disabled={uploading} className="btn btn-gold btn-sm">{uploading ? "Uploading to Cloudflare..." : "Upload Track"}</button>
                    </div>
                </form>
            )}

            {loading ? <div style={{ padding: "3rem", textAlign: "center" }}>Loading...</div> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {songs.map(song => (
                        <div key={song.id} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--charcoal-600)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {song.coverArtUrl ? <img src={song.coverArtUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Music size={20} color="var(--text-muted)" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{song.artist || "Imara Chorale"} • {song.category}</div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => togglePublic(song.id, song.isPublic)} title={song.isPublic ? "Make Private" : "Make Public"} style={{ background: "none", border: "none", cursor: "pointer", color: song.isPublic ? "#10b981" : "var(--text-muted)" }}>
                                    {song.isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                </button>
                                <button onClick={() => handleDelete(song.id)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}