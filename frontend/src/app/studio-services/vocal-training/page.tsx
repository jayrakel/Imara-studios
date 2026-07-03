import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocal Training — Studio Services",
  description: "Professional vocal coaching at Imara Studios Nakuru. Single sessions, 4-week beginner packages, advanced agility, and group coaching.",
};

const tiers = [
  { id: "single", name: "Single Session", price: "3,500", unit: "/ session (1hr)", desc: "A focused one-hour coaching session tailored to your specific goals.", features: ["1-hour one-on-one coaching", "Warm-up routine", "Targeted exercises", "Feedback & take-home plan"], popular: false },
  { id: "beginner-4week", name: "4-Week Beginner Package", price: "12,000", unit: "/ month", desc: "Structured 4-session program for new vocalists finding their voice.", features: ["4 × 1-hour sessions", "Breathing technique foundation", "Pitch control training", "Song application work", "Progress assessment"], popular: true },
  { id: "advanced", name: "Advanced Agility Block", price: "18,000", unit: "/ 6 sessions", desc: "Six sessions of intensive training for experienced singers pushing their limits.", features: ["6 × 1-hour sessions", "Runs, riffs & vocal melisma", "Mixed voice development", "Performance coaching", "Recording session option"], popular: false },
  { id: "group", name: "Group Coaching", price: "8,000", unit: "/ session (group)", desc: "One group session for 4–8 vocalists. Great for choirs and ensembles.", features: ["Up to 8 participants", "Harmony & blend work", "Part-specific coaching", "Group warm-up", "Sheet music guidance"], popular: false },
];

export default function VocalTrainingPage() {
  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/vocal-training.jpg" alt="Vocal training session" fill style={{ objectFit: "cover", opacity: 0.25 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,1) 40%, rgba(13,13,13,0.6) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/studio-services" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem", display: "inline-block" }}>← Studio Services</Link>
          <span className="section-label">🎤 Service</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>Vocal <span className="gradient-text">Training</span></h1>
          <div className="gold-divider" />
          <p className="text-secondary" style={{ maxWidth: 580, fontSize: "1.0625rem", lineHeight: 1.7 }}>Whether you&apos;re finding your voice for the first time or polishing an already powerful instrument — our coaches meet you exactly where you are.</p>
        </div>
      </section>
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", textAlign: "center", marginBottom: "3rem" }}>Coaching <span className="gradient-text">Packages</span> (KES)</h2>
          <div className="pricing-grid">
            {tiers.map((t) => (
              <div key={t.id} id={`pricing-${t.id}`} className={`pricing-card ${t.popular ? "featured" : ""}`}>
                {t.popular && <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--charcoal-800)", fontSize: "0.75rem", fontWeight: 700, padding: "0.375rem 1.25rem", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>Best Value</div>}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: t.popular ? "1rem" : 0 }}>{t.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>{t.desc}</p>
                <div style={{ marginBottom: "1.5rem" }}><span className="pricing-currency">KES</span><span className="pricing-amount"> {t.price}</span><span className="pricing-period"> {t.unit}</span></div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {t.features.map((f) => <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}><Check size={15} color="var(--gold)" style={{ marginTop: 1, flexShrink: 0 }} />{f}</li>)}
                </ul>
                <Link href={`/contact?service=vocal-training&tier=${t.id}`} id={`book-${t.id}`} className={`btn ${t.popular ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>Enrol Now <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
