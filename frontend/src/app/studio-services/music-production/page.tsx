import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Production — Studio Services",
  description: "Full music production at Imara Studios: beat creation, arrangement, mixing, mastering, and custom songwriting in Nakuru.",
};

const tiers = [
  { id: "full-track", name: "Full Track Production", price: "25,000", unit: "per track", desc: "Beat + arrangement, fully produced track from concept to demo-ready.", features: ["Original beat creation", "Full arrangement (all instruments)", "Guide vocal included", "3 revisions", "MP3 + WAV delivery"], popular: false },
  { id: "mix-master", name: "Post-Production (Mix & Master)", price: "12,000", unit: "per stem pack", desc: "Submit your stems — we mix and master to international broadcast standard.", features: ["Stem import & organisation", "Professional mixing", "Mastering to streaming standards", "ISRC-ready files", "Unlimited revisions (3 weeks)"], popular: true },
  { id: "songwriting", name: "Custom Songwriting", price: "30,000", unit: "per song", desc: "Bespoke composition — we write your song from scratch based on your brief.", features: ["Full song concept & lyrics", "Melody composition", "Demo recording included", "Lyric sheet delivery", "Rights assigned to client"], popular: false },
];

export default function MusicProductionPage() {
  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)" }}>
        <div className="container">
          <Link href="/studio-services" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem", display: "inline-block" }}>← Studio Services</Link>
          <span className="section-label">🎵 Service</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>Music <span className="gradient-text">Production</span></h1>
          <div className="gold-divider" />
          <p className="text-secondary" style={{ maxWidth: 580, fontSize: "1.0625rem", lineHeight: 1.7 }}>From a raw idea to a polished master. Our producers blend technical excellence with creative artistry to deliver music that stands out.</p>
        </div>
      </section>
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", textAlign: "center", marginBottom: "3rem" }}>Pricing Tiers <span className="gradient-text">(KES)</span></h2>
          <div className="pricing-grid">
            {tiers.map((t) => (
              <div key={t.id} id={`pricing-${t.id}`} className={`pricing-card ${t.popular ? "featured" : ""}`}>
                {t.popular && <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--charcoal-800)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.375rem 1.25rem", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>Most Popular</div>}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: t.popular ? "1rem" : 0 }}>{t.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>{t.desc}</p>
                <div style={{ marginBottom: "1.5rem" }}><span className="pricing-currency">KES</span><span className="pricing-amount"> {t.price}</span><span className="pricing-period"> {t.unit}</span></div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {t.features.map((f) => <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}><Check size={15} color="var(--gold)" style={{ marginTop: 1, flexShrink: 0 }} />{f}</li>)}
                </ul>
                <Link href={`/contact?service=music-production&tier=${t.id}`} id={`book-${t.id}`} className={`btn ${t.popular ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>Book Now <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
