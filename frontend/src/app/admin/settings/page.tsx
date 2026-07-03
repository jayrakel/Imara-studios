"use client";
import { useState, useEffect } from "react";
import { RefreshCw, Shield } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Setting = { id: string; key: string; value: string; label?: string | null };

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    useEffect(() => {
        const u = typeof window !== "undefined" ? localStorage.getItem("adminUser") : null;
        if (u) {
            try { setIsSuperAdmin(JSON.parse(u).role === "SUPER_ADMIN"); } catch { }
        }
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/settings`, { headers });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setSettings(data);
        } catch {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const toggle = async (setting: Setting) => {
        if (!isSuperAdmin) {
            toast.error("Only a Super Admin can change settings");
            return;
        }
        const nextValue = setting.value === "true" ? "false" : "true";
        setSavingKey(setting.key);
        // Optimistic update
        setSettings(prev => prev.map(s => s.key === setting.key ? { ...s, value: nextValue } : s));
        try {
            const res = await fetch(`${API}/api/settings/${setting.key}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ value: nextValue, label: setting.label }),
            });
            if (!res.ok) throw new Error();
            toast.success(`${setting.label || setting.key} updated`);
        } catch {
            toast.error("Failed to update setting");
            // Revert on failure
            setSettings(prev => prev.map(s => s.key === setting.key ? { ...s, value: setting.value } : s));
        } finally {
            setSavingKey(null);
        }
    };

    return (
        <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Settings</h1>
                    <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        Site-wide toggles. {!isSuperAdmin && "Only a Super Admin can make changes."}
                    </p>
                </div>
                <button id="settings-refresh" onClick={load} className="btn btn-outline btn-sm" disabled={loading}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {!isSuperAdmin && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.875rem 1.25rem",
                    background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.8125rem", color: "var(--gold)",
                }}>
                    <Shield size={16} />
                    You're viewing in read-only mode — settings changes require Super Admin access.
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Loading...</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {settings.map((setting) => {
                        const on = setting.value === "true";
                        return (
                            <div key={setting.key} id={`setting-${setting.key.replace(/_/g, "-")}`}
                                style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "1.25rem 1.5rem", background: "var(--charcoal-700)",
                                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)",
                                }}>
                                <div>
                                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                                        {setting.label || setting.key}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{setting.key}</div>
                                </div>
                                <button
                                    id={`toggle-${setting.key.replace(/_/g, "-")}`}
                                    onClick={() => toggle(setting)}
                                    disabled={!isSuperAdmin || savingKey === setting.key}
                                    style={{
                                        width: 46, height: 26, borderRadius: 100, border: "none", position: "relative",
                                        background: on ? "var(--gold)" : "rgba(255,255,255,0.15)",
                                        cursor: isSuperAdmin ? "pointer" : "not-allowed",
                                        opacity: savingKey === setting.key ? 0.6 : 1,
                                        transition: "background 0.2s ease", flexShrink: 0,
                                    }}
                                    aria-label={`Toggle ${setting.label || setting.key}`}
                                >
                                    <span style={{
                                        position: "absolute", top: 3, left: on ? 23 : 3,
                                        width: 20, height: 20, borderRadius: "50%", background: "#0d0d0d",
                                        transition: "left 0.2s ease",
                                    }} />
                                </button>
                            </div>
                        );
                    })}
                    {settings.length === 0 && (
                        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No settings found.</div>
                    )}
                </div>
            )}
        </div>
    );
}