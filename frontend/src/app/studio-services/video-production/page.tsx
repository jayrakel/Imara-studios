import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Production — Studio Services",
  description: "Professional video post-production at Imara Studios Nakuru — editing, VFX, colour grading, and social media cutdowns.",
};

const tiers = [
  { id: "basic-edit", name: "Basic Performance Edit", price: "15,000", unit: "per video", desc: "Clean assembly edit of your performance footage with basic colour and audio sync.", features: ["Up to 5 minutes finished length", "Colour correction", "Audio sync & cleanup", "2 revision rounds", "MP4 (1080p) delivery"], popular: false },
  { id: "concept-mv", name: "Concept Music Video", price: "80,000", unit: "per video", desc: "Full creative post-production with VFX, motion graphics, and professional colour grade.", features: ["Full narrative/concept video", "VFX & motion graphics", "Professional colour grade (LUTs)", "Custom titles & end card", "4K delivery + social versions", "Unlimited revisions (4 weeks)"], popular: true },
  { id: "social-cutdowns", name: "Social Media Cutdowns", price: "8,000", unit: "per pack", desc: "Platform-optimised short-form content: Reels (9:16), TikTok, and YouTube Shorts.", features: ["Up to 5 short clips", "Captions / subtitles", "Platform-specific aspect ratios", "Audio optimised for mobile", "Delivered within 48 hours"], popular: false },
];

export default function VideoProductionPage() {
  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)" }}>
        <div className="container">
          <Link href="/studio-services" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem", display: "inline-block" }}>← Studio Services</Link>
          <span className="section-label">🎞️ Service</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>Video <span className="gradient-text">Production</span></h1>
          <div className="gold-divider" />
          <p className="text-secondary" style={{ maxWidth: 580, fontSize: "1.0625rem", lineHeight: 1.7 }}>Award-quality post-production that transforms raw footage into compelling visual stories. Editing, VFX, colour grading, and social-ready formats.</p>
        </div>
      </section>
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", textAlign: "center", marginBottom: "1rem" }}>Post-Production <span className="gradient-text">Packages</span> (KES)</h2>
          <p className="text-secondary" style={{ textAlign: "center", marginBottom: "3rem", fontSize: "0.9375rem" }}>Packages assume footage has already been shot. Combine with our Video Shooting packages for end-to-end service.</p>
          <div className="pricing-grid">
            {tiers.map((t) => (
              <div key={t.id} id={`pricing-${t.id}`} className={`pricing-card ${t.popular ? "featured" : ""}`}>
                {t.popular && <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--charcoal-800)", fontSize: "0.75rem", fontWeight: 700, padding: "0.375rem 1.25rem", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>Flagship</div>}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: t.popular ? "1rem" : 0 }}>{t.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>{t.desc}</p>
                <div style={{ marginBottom: "1.5rem" }}><span className="pricing-currency">KES</span><span className="pricing-amount"> {t.price}</span><span className="pricing-period"> {t.unit}</span></div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {t.features.map((f) => <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}><Check size={15} color="var(--gold)" style={{ marginTop: 1, flexShrink: 0 }} />{f}</li>)}
                </ul>
                <Link href={`/contact?service=video-production&tier=${t.id}`} id={`book-${t.id}`} className={`btn ${t.popular ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>Start Project <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
