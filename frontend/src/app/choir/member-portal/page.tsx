"use client";
import { useState } from "react";
import { Lock, Upload, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MemberPortalPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("bts");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: token, password }),
      });
      if (!res.ok) { toast.error("Invalid credentials"); return; }
      const data = await res.json();
      setAccessToken(data.accessToken);
      setLoggedIn(true);
      toast.success(`Welcome, ${data.user.name}!`);
    } catch {
      toast.error("Login failed");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a file"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("caption", caption);
      fd.append("category", category);
      const res = await fetch(`${API}/api/gallery/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setUploaded(true);
      toast.success("Photo uploaded! Pending admin approval.");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!loggedIn) return (
    <section style={{ paddingTop: "10rem", paddingBottom: "6rem", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Lock size={28} color="var(--gold)" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>Member <span className="gradient-text">Portal</span></h1>
          <p className="text-secondary" style={{ fontSize: "0.9375rem" }}>Log in with your choir member credentials to upload photos.</p>
        </div>
        <form onSubmit={handleLogin} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label className="form-label" htmlFor="portal-email">Email Address</label><input id="portal-email" type="email" className="input" placeholder="your@email.com" value={token} onChange={(e) => setToken(e.target.value)} required /></div>
          <div><label className="form-label" htmlFor="portal-password">Password</label><input id="portal-password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button id="portal-login-btn" type="submit" className="btn btn-gold" style={{ justifyContent: "center" }}>Sign In</button>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>Credentials are managed by the Choir Director. Contact them if you need access.</p>
        </form>
      </div>
    </section>
  );

  if (uploaded) return (
    <section style={{ paddingTop: "10rem", paddingBottom: "6rem", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <CheckCircle size={64} color="var(--gold)" style={{ margin: "0 auto 1.5rem" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "1rem" }}>Photo <span className="gradient-text">Uploaded!</span></h2>
        <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: "2rem" }}>Your photo is pending review by our admin team. Once approved, it will appear in the public gallery.</p>
        <button id="upload-another" onClick={() => { setUploaded(false); setFile(null); setCaption(""); }} className="btn btn-gold">Upload Another Photo</button>
      </div>
    </section>
  );

  return (
    <section style={{ paddingTop: "10rem", paddingBottom: "6rem" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.5rem" }}>Welcome to the <span className="gradient-text">Member Portal</span></h1>
        <p className="text-secondary" style={{ marginBottom: "3rem" }}>Upload your behind-the-scenes or performance photos for admin review and public gallery publication.</p>
        <form onSubmit={handleUpload} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="form-label">Photo Upload *</label>
            <label htmlFor="member-file" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "3rem 2rem", border: `2px dashed ${file ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.2s", background: file ? "rgba(201,168,76,0.05)" : "transparent" }}>
              <Upload size={32} color="var(--gold)" />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{file ? file.name : "Click to select a photo"}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>JPG, PNG, WebP — max 20MB</span>
              <input id="member-file" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div>
            <label className="form-label" htmlFor="member-category">Category</label>
            <select id="member-category" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="bts">Behind the Scenes</option>
              <option value="performance">Live Performance</option>
              <option value="rehearsal">Rehearsal</option>
              <option value="headshot">Headshot</option>
            </select>
          </div>
          <div><label className="form-label" htmlFor="member-caption">Caption (optional)</label><input id="member-caption" className="input" placeholder="Describe the photo..." value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
          <button id="member-upload-btn" type="submit" className="btn btn-gold" disabled={uploading || !file} style={{ justifyContent: "center", opacity: file ? 1 : 0.5 }}>
            {uploading ? "Uploading..." : "Upload Photo for Review"}
          </button>
        </form>
      </div>
    </section>
  );
}
