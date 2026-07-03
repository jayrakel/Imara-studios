"use client";
import { useState, useEffect, useRef } from "react";
import { Music4, Play, Pause, Download, LogOut, Upload, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Song = {
  id: string;
  title: string;
  artist?: string;
  category: string;
  url: string;
  coverArtUrl?: string;
  durationSecs?: number;
  isPublic?: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  vocalRange?: string;
  vocalPart?: string;
  tempPassword?: boolean;
};

const categoryColors: Record<string, string> = {
  REHEARSAL: "#fbbf24",
  PERFORMANCE: "var(--gold)",
  ARCHIVE: "#a78bfa",
};

function formatDuration(secs?: number) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MemberPortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Photo upload state
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [photoCategory, setPhotoCategory] = useState("bts");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState<"songs" | "photos">("songs");

  // ─── AUDIO INITIALIZATION & CLEANUP ─────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }

    // Cleanup: Stop audio instantly if the component unmounts (e.g. user leaves page)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { toast.error("Invalid credentials"); return; }
      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      setLoggedIn(true);
      toast.success(`Welcome, ${data.user.name}! 🎶`);

      // Prompt password change if temp
      if (data.user.tempPassword) {
        setTimeout(() => toast("⚠️ Please change your temporary password!", { duration: 6000 }), 1000);
        setShowChangePassword(true);
      }
    } catch {
      toast.error("Login failed");
    }
  };

  const handleLogout = () => {
    // 1. Aggressively kill the audio stream
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Stops background buffering
    }

    // 2. Reset all UI states
    setLoggedIn(false);
    setUser(null);
    setAccessToken("");
    setSongs([]);
    setCurrentSong(null);
    setPlaying(false);
  };

  const loadSongs = async (token: string) => {
    setLoadingSongs(true);
    try {
      const res = await fetch(`${API}/api/songs/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load songs");
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load song library");
    } finally {
      setLoadingSongs(false);
    }
  };

  useEffect(() => {
    if (loggedIn && accessToken) loadSongs(accessToken);
  }, [loggedIn, accessToken]);

  const playSong = (song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    // SCENARIO A: User clicked the song that is currently loaded
    if (currentSong?.id === song.id) {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play();
        setPlaying(true);
      }
      return;
    }

    // SCENARIO B: User clicked a NEW song
    // Force the old song to stop immediately before loading the new one
    audio.pause();
    audio.src = song.url;
    audio.play();

    setCurrentSong(song);
    setPlaying(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a file"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("caption", caption);
      fd.append("category", photoCategory);
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    setChangingPass(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ currentPassword: oldPass, newPassword: newPass }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success("Password changed! Please log in again.");
      handleLogout();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  const filteredSongs = filterCategory === "ALL" ? songs : songs.filter(s => s.category === filterCategory);
  const categories = ["ALL", ...Array.from(new Set(songs.map(s => s.category)))];

  // ─── LOGIN FORM ─────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <section style={{
      minHeight: "100vh",
      background: "var(--charcoal-900)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "20%",
            background: "var(--charcoal-900)",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.1rem",
            overflow: "hidden"
          }}>
            <Image
              src="/images/logo.png"
              alt="Imara Studios"
              width={48}
              height={48}
              quality={100}
              style={{ borderRadius: "8px" }}
            />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Member <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-secondary" style={{ color: "var(--text-muted)", fontSize: "0.575rem" }}>
            Log in with your choir member credentials
          </p>
        </div>
        <form onSubmit={handleLogin} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label className="form-label" htmlFor="portal-email">Email Address</label><input id="portal-email" type="email" className="input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><label className="form-label" htmlFor="portal-password">Password</label><input id="portal-password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button id="portal-login-btn" type="submit" className="btn btn-gold" style={{ justifyContent: "center" }}>Sign In</button>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.5125rem" }}>
            Credentials are managed by the Choir Director.<br />Contact them if you need access.
          </p>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Are you a client or artist? <Link href="/contact" style={{ color: "var(--gold)", textDecoration: "none" }}>Go to Contact →</Link>
        </p>
      </div>
    </section>
  );

  // ─── MEMBER DASHBOARD ───────────────────────────────────────────────────────
  return (
    <section style={{ paddingTop: "8rem", paddingBottom: "4rem", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--charcoal-900)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Image
                src="/images/logo.png"
                alt="Imara Studios"
                width={36}
                height={36}
                quality={100}
                style={{ borderRadius: "6px" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>{user?.name}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                {user?.vocalPart || user?.vocalRange || "Choir Member"} · {user?.role?.replace(/_/g, " ")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={() => setShowChangePassword(!showChangePassword)} className="btn btn-outline btn-sm">
              {user?.tempPassword ? "⚠️ Change Password" : "Change Password"}
            </button>
            <button id="portal-logout-btn" onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: "var(--text-muted)" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Change Password Panel */}
        {showChangePassword && (
          <div className="card" style={{ marginBottom: "2rem", borderColor: "rgba(201,168,76,0.3)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--gold)" }}>
              {user?.tempPassword ? "⚠️ Set Your Permanent Password" : "Change Password"}
            </h3>
            <form onSubmit={handleChangePassword} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">Current Password</label>
                <input className="input" type="password" placeholder="Current password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">New Password</label>
                <input className="input" type="password" placeholder="Min 8 characters" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-gold btn-sm" disabled={changingPass}>
                {changingPass ? "Saving..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "2rem" }}>
          {[{ id: "songs" as const, label: "🎵 Song Library", count: songs.length }, { id: "photos" as const, label: "📷 Upload Photo", count: 0 }].map(({ id, label, count }) => (
            <button key={id} id={`portal-tab-${id}`} onClick={() => setActiveTab(id)}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.875rem", border: "none", background: activeTab === id ? "rgba(201,168,76,0.1)" : "var(--charcoal-600)", color: activeTab === id ? "var(--gold)" : "var(--text-muted)", fontWeight: activeTab === id ? 600 : 400, cursor: "pointer", fontSize: "0.9375rem", transition: "all 0.2s" }}>
              {label}
              {id === "songs" && <span style={{ fontSize: "0.75rem", background: "rgba(201,168,76,0.2)", padding: "0.125rem 0.5rem", borderRadius: "100px", color: "var(--gold)" }}>{count}</span>}
            </button>
          ))}
        </div>

        {/* Song Library */}
        {activeTab === "songs" && (
          <div>
            {/* Category filter */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)}
                  style={{ padding: "0.4rem 1rem", border: `1px solid ${filterCategory === cat ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "100px", background: filterCategory === cat ? "rgba(201,168,76,0.1)" : "transparent", color: filterCategory === cat ? "var(--gold)" : "var(--text-muted)", fontSize: "0.8125rem", cursor: "pointer", fontWeight: filterCategory === cat ? 600 : 400 }}>
                  {cat === "ALL" ? "All Songs" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {loadingSongs ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Loading songs...</div>
            ) : filteredSongs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                <Music4 size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <p>No songs available yet. The Choir Director will upload songs here.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filteredSongs.map((song) => {
                  const isCurrentlyPlaying = currentSong?.id === song.id && playing;
                  return (
                    <div key={song.id} id={`song-${song.id.slice(0, 8)}`}
                      style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", background: currentSong?.id === song.id ? "rgba(201,168,76,0.08)" : "var(--charcoal-700)", border: `1px solid ${currentSong?.id === song.id ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-md)", transition: "all 0.2s", cursor: "pointer" }}
                      onClick={() => playSong(song)}
                    >
                      {/* Play/Pause button */}
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: isCurrentlyPlaying ? "var(--gold)" : "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        {isCurrentlyPlaying
                          ? <Pause size={16} color={isCurrentlyPlaying ? "var(--charcoal-900)" : "var(--gold)"} />
                          : <Play size={16} color="var(--gold)" style={{ marginLeft: 2 }} />}
                      </div>

                      {/* Cover art */}
                      {song.coverArtUrl && (
                        <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                          <img src={song.coverArtUrl} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: currentSong?.id === song.id ? "var(--gold)" : "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{song.artist || "Imara Choir"}</div>
                      </div>

                      {/* Category badge */}
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", background: `${categoryColors[song.category]}15`, color: categoryColors[song.category] || "var(--gold)", border: `1px solid ${categoryColors[song.category]}30`, flexShrink: 0 }}>
                        {song.category}
                      </span>

                      {/* Duration */}
                      {song.durationSecs && (
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", flexShrink: 0 }}>{formatDuration(song.durationSecs)}</span>
                      )}

                      {/* Download */}
                      <a href={song.url} download target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        id={`download-song-${song.id.slice(0, 8)}`}
                        title="Download"
                        style={{ padding: "0.375rem", color: "var(--text-muted)", transition: "color 0.2s", flexShrink: 0, textDecoration: "none", display: "flex" }}>
                        <Download size={16} />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Now Playing Bar */}
            {currentSong && (
              <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,13,13,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(201,168,76,0.2)", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem", zIndex: 50 }}>
                <button onClick={() => playSong(currentSong)} style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gold)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {playing ? <Pause size={18} color="#000" /> : <Play size={18} color="#000" style={{ marginLeft: 2 }} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--gold)" }}>{currentSong.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{currentSong.artist || "Imara Choir"} · {currentSong.category}</div>
                </div>
                <div className="soundwave" style={{ display: playing ? "flex" : "none" }}>
                  <span /><span /><span /><span /><span />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo Upload */}
        {activeTab === "photos" && (
          <div style={{ maxWidth: 560 }}>
            {uploaded ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <CheckCircle size={64} color="var(--gold)" style={{ margin: "0 auto 1.5rem" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1rem" }}>Photo <span className="gradient-text">Uploaded!</span></h2>
                <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: "2rem" }}>Your photo is pending review. Once approved, it will appear in the public gallery.</p>
                <button id="upload-another" onClick={() => { setUploaded(false); setFile(null); setCaption(""); }} className="btn btn-gold">Upload Another Photo</button>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600 }}>Upload a Performance Photo</h3>
                <div>
                  <label className="form-label">Photo *</label>
                  <label htmlFor="member-file" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "3rem 2rem", border: `2px dashed ${file ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.2s", background: file ? "rgba(201,168,76,0.05)" : "transparent" }}>
                    <Upload size={32} color="var(--gold)" />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{file ? file.name : "Click to select a photo"}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>JPG, PNG, WebP — max 20MB</span>
                    <input id="member-file" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div>
                  <label className="form-label" htmlFor="member-category">Category</label>
                  <select id="member-category" className="select" value={photoCategory} onChange={(e) => setPhotoCategory(e.target.value)}>
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
            )}
          </div>
        )}
      </div>

      {/* Extra padding for now-playing bar */}
      {currentSong && <div style={{ height: 80 }} />}
    </section>
  );
}