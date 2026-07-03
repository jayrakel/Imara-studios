"use client";
import { useState } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Music2, Video, Mic } from "lucide-react";

const categories = [
  { id: "all", label: "All Work" },
  { id: "audio", label: "🎵 Audio" },
  { id: "video", label: "🎬 Video" },
  { id: "vocal", label: "🎤 Vocal" },
];

const portfolio = [
  { id: "p1", category: "audio", title: "Midnight Rain — Produced Track", client: "Solo Artist", image: "/images/studio-hero.jpg", type: "audio", year: "2025" },
  { id: "p2", category: "video", title: "Arise — Music Video", client: "Gospel Artist", image: "/images/choir-hero.jpg", type: "video", year: "2025" },
  { id: "p3", category: "vocal", title: "Corporate Vocal Session", client: "Safaricom", image: "/images/vocal-training.jpg", type: "vocal", year: "2026" },
  { id: "p4", category: "video", title: "Behind the Sound — Brand Film", client: "NTV Kenya", image: "/images/video-production.jpg", type: "video", year: "2026" },
  { id: "p5", category: "audio", title: "Full Album Mix & Master", client: "Indie Artist", image: "/images/studio-hero.jpg", type: "audio", year: "2024" },
  { id: "p6", category: "vocal", title: "Choir Recording — Advent Special", client: "Private Church", image: "/images/choir-hero.jpg", type: "vocal", year: "2025" },
];

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? portfolio : portfolio.filter((p) => p.category === active);

  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">Our Work</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
            Creative <span className="gradient-text">Portfolio</span>
          </h1>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ maxWidth: 520, margin: "0 auto", fontSize: "1.0625rem", lineHeight: 1.7 }}>A selection of audio, video, and vocal projects from our studio. Every piece tells a story — here are some of ours.</p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          {/* Filter tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", marginBottom: "3rem", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button key={cat.id} id={`portfolio-filter-${cat.id}`} onClick={() => setActive(cat.id)}
                style={{ padding: "0.625rem 1.5rem", border: `1px solid ${active === cat.id ? "var(--gold)" : "rgba(255,255,255,0.1)"}`, borderRadius: "100px", background: active === cat.id ? "rgba(201,168,76,0.1)" : "transparent", color: active === cat.id ? "var(--gold)" : "var(--text-muted)", cursor: "pointer", fontWeight: active === cat.id ? 600 : 400, transition: "all 0.2s", fontSize: "0.9rem" }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filtered.map((item) => (
              <article key={item.id} id={`portfolio-item-${item.id}`}
                style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", aspectRatio: "16/10", cursor: "pointer", group: "true" } as any}
              >
                <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover", transition: "transform 0.4s ease" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)", transition: "background 0.3s" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
                  <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{item.category} · {item.year}</span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, marginTop: "0.375rem", marginBottom: "0.25rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>Client: {item.client}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="text-secondary" style={{ textAlign: "center", marginTop: "3rem", fontSize: "0.9375rem" }}>
            More work coming soon. <a href="/contact" style={{ color: "var(--gold)", textDecoration: "none" }}>Reach out to discuss your project →</a>
          </p>
        </div>
      </section>
    </>
  );
}
