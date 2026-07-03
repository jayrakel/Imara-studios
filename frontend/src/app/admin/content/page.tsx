"use client";
import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Block = { key: string; value: string; label?: string; group?: string; type?: string };

const groups = ["All", "homepage", "pricing", "contact", "social"];

export default function ContentManagerPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [group, setGroup] = useState("pricing");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = async () => {
    setLoading(true);
    try {
      const url = group === "All" ? `${API}/api/content/admin` : `${API}/api/content/admin?group=${group}`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      setBlocks(data);
      const map: Record<string, string> = {};
      data.forEach((b: Block) => { map[b.key] = b.value; });
      setEdits(map);
    } catch { toast.error("Failed to load content"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [group]);

  const saveAll = async () => {
    setSaving(true);
    try {
      const blocksToSave = Object.entries(edits).map(([key, value]) => {
        const orig = blocks.find(b => b.key === key);
        return { key, value, type: orig?.type, label: orig?.label, group: orig?.group };
      });
      await fetch(`${API}/api/content/batch/update`, { method: "PUT", headers, body: JSON.stringify({ blocks: blocksToSave }) });
      toast.success("Content saved successfully!");
    } catch { toast.error("Failed to save changes"); }
    finally { setSaving(false); }
  };

  const hasChanges = blocks.some(b => edits[b.key] !== b.value);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>Content Manager</h1>
          <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Update pricing, text, and links without touching code.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button id="content-refresh" onClick={load} className="btn btn-outline btn-sm" disabled={loading}><RefreshCw size={14} /> Refresh</button>
          <button id="content-save-all" onClick={saveAll} className="btn btn-gold btn-sm" disabled={saving || !hasChanges} style={{ opacity: hasChanges ? 1 : 0.5 }}>
            <Save size={14} /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Group filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {groups.map(g => (
          <button key={g} id={`content-group-${g.toLowerCase()}`} onClick={() => setGroup(g)}
            style={{ padding: "0.5rem 1.25rem", border: `1px solid ${group === g ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "100px", background: group === g ? "rgba(201,168,76,0.1)" : "transparent", color: group === g ? "var(--gold)" : "var(--text-muted)", fontSize: "0.875rem", cursor: "pointer", fontWeight: group === g ? 600 : 400, textTransform: "capitalize" }}>
            {g}
          </button>
        ))}
      </div>

      {/* Content blocks */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {blocks.map((block) => (
            <div key={block.key} id={`content-block-${block.key.replace(/\./g, '-')}`}
              style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "center", padding: "1.25rem 1.5rem", background: "var(--charcoal-700)", border: `1px solid ${edits[block.key] !== block.value ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-md)" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{block.label || block.key}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{block.key}</div>
                {edits[block.key] !== block.value && <span style={{ fontSize: "0.7rem", color: "var(--gold)", marginTop: "0.25rem", display: "block" }}>● Modified</span>}
              </div>
              {block.type === "number" ? (
                <input id={`edit-${block.key.replace(/\./g, '-')}`} className="input" type="text" value={edits[block.key] || ""} onChange={(e) => setEdits(p => ({ ...p, [block.key]: e.target.value }))} />
              ) : (
                <textarea id={`edit-${block.key.replace(/\./g, '-')}`} className="textarea" value={edits[block.key] || ""} onChange={(e) => setEdits(p => ({ ...p, [block.key]: e.target.value }))} style={{ minHeight: 60 }} />
              )}
            </div>
          ))}
          {blocks.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No content blocks in this group.</div>}
        </div>
      )}
    </div>
  );
}
