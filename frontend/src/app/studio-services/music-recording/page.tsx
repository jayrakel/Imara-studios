import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music Recording — Studio Services",
  description: "Professional music recording at Imara Studios Nakuru. Hourly tracking, day-rate lockouts, and dry vocal recording packages.",
};

const tiers = [
  {
    id: "hourly",
    name: "Hourly Tracking",
    price: "5,000",
    unit: "/ hour",
    description: "Perfect for artists who need flexible time in the studio.",
    features: [
      "Acoustically treated live room",
      "Professional engineer included",
      "All outboard gear access",
      "Headphone mix for performers",
      "Basic rough mix included",
    ],
    popular: false,
  },
  {
    id: "day-rate",
    name: "Day-Rate Lockout",
    price: "35,000",
    unit: "/ day",
    description: "Exclusive studio access for 10 hours. Best value for full project days.",
    features: [
      "10-hour exclusive studio access",
      "Senior engineer assigned",
      "Unlimited takes & comping",
      "Full gear & plugin library",
      "End-of-day rough mix",
      "Session files on USB",
    ],
    popular: true,
  },
  {
    id: "vocal-package",
    name: "Dry Vocal Package",
    price: "15,000",
    unit: "per package",
    description: "Focused 3-hour session dedicated to capturing pristine vocal recordings.",
    features: [
      "3-hour focused session",
      "Industry-grade microphone selection",
      "Vocal comping included",
      "Tuning & timing cleanup",
      "Delivered as stems (WAV)",
    ],
    popular: false,
  },
];

export default function MusicRecordingPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/studio-hero.jpg" alt="Recording studio" fill style={{ objectFit: "cover", opacity: 0.2 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,1) 40%, rgba(13,13,13,0.7) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/studio-services" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Studio Services
          </Link>
          <span className="section-label">🎙️ Service</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
            Music <span className="gradient-text">Recording</span>
          </h1>
          <div className="gold-divider" />
          <p className="text-secondary" style={{ maxWidth: 580, fontSize: "1.0625rem", lineHeight: 1.7 }}>
            State-of-the-art acoustically treated rooms, world-class outboard gear, and experienced engineers who know how to capture the magic in your performance.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", textAlign: "center", marginBottom: "0.5rem" }}>Pricing Tiers</h2>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ textAlign: "center", marginBottom: "3rem" }}>All prices in KES (Kenyan Shillings). Prices subject to change — confirm at booking.</p>

          <div className="pricing-grid">
            {tiers.map((tier) => (
              <div key={tier.id} id={`pricing-${tier.id}`} className={`pricing-card ${tier.popular ? "featured" : ""}`}>
                {tier.popular && (
                  <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--charcoal-800)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.375rem 1.25rem", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: tier.popular ? "1rem" : 0 }}>{tier.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>{tier.description}</p>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="pricing-currency">KES</span>
                  <span className="pricing-amount"> {tier.price}</span>
                  <span className="pricing-period">{tier.unit}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      <Check size={15} color="var(--gold)" style={{ marginTop: 1, flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/contact?service=music-recording&tier=${tier.id}`} id={`book-${tier.id}`}
                  className={`btn ${tier.popular ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>
                  Book This Package <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="section" style={{ background: "var(--charcoal-700)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "2rem", textAlign: "center" }}>What to Expect</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "01", title: "Pre-Session Consultation", desc: "We discuss your vision, reference tracks, and technical requirements before the session day." },
              { step: "02", title: "Professional Setup", desc: "Our engineer configures the ideal signal chain and mic placement for your specific instrument or vocal style." },
              { step: "03", title: "Capture & Refine", desc: "Multiple takes, expert direction, and real-time monitoring to get the perfect performance on tape." },
              { step: "04", title: "Delivery", desc: "Receive your session files in high-resolution WAV format, organised and labelled professionally." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ padding: "1.5rem", background: "var(--charcoal-600)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "rgba(201,168,76,0.3)", lineHeight: 1, marginBottom: "0.75rem" }}>{step}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
