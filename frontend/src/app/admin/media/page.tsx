"use client";
import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type SiteImage = { id: string; key: string; label: string; url: string; filename: string; updatedAt: string };

export default function MediaLibraryPage() {
    const [images, setImages] = useState<SiteImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);
    const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/media/images`, { headers });
            if (!res.ok) throw new Error();
            setImages(await res.json());
        } catch {
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleFileSelect = async (key: string, file: File) => {
        if (file.size > 20 * 1024 * 1024) {
            toast.error("Image must be under 20MB");
            return;
        }
        setUploadingKey(key);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch(`${API}/api/media/images/${key}`, {
                method: "POST",
                headers,
                body: formData,
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setImages(prev => prev.map(img => img.key === key ? data.image : img));
            toast.success("Image updated");
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploadingKey(null);
        }
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Media Library</h1>
                <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    Replace the core images used across the public site. Changes go live immediately.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Loading...</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                    {images.map((img) => (
                        <div key={img.key} style={{
                            background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "var(--radius-md)", overflow: "hidden",
                        }}>
                            <div style={{ position: "relative", width: "100%", height: 160, background: "var(--charcoal-800)" }}>
                                <Image src={img.url} alt={img.label} fill style={{ objectFit: "cover" }} unoptimized />
                                {uploadingKey === img.key && (
                                    <div style={{
                                        position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                                        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "0.8125rem",
                                    }}>
                                        Uploading...
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: "1rem" }}>
                                <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>{img.label}</div>
                                <input
                                    ref={(el) => { fileInputs.current[img.key] = el; }}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileSelect(img.key, file);
                                        e.target.value = "";
                                    }}
                                />
                                <button
                                    id={`replace-${img.key}`}
                                    onClick={() => fileInputs.current[img.key]?.click()}
                                    disabled={uploadingKey === img.key}
                                    className="btn btn-outline btn-sm"
                                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                                >
                                    <Upload size={14} /> Replace Image
                                </button>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                            <ImageIcon size={32} style={{ marginBottom: "0.75rem", opacity: 0.5 }} />
                            <div>No managed images found.</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}