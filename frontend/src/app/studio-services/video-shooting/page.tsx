import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import SiteImage from "@/components/common/SiteImage";

export const metadata: Metadata = {
  title: "Video Shooting — Studio Services",
  description: "Professional video shooting at Imara Studios Nakuru — in-studio performance capture, on-location shoots, and multi-camera live events.",
};

const tiers = [
  { id: "in-studio", name: "In-Studio Performance Capture", price: "20,000", unit: "/ session", desc: "Full-day in-studio video shoot with professional lighting and camera setup.", features: ["Up to 8 hours in-studio", "2-camera setup", "Professional lighting rig", "Director & DOP included", "Basic colour grade"], popular: false },
  { id: "half-day-location", name: "On-Location Half Day", price: "35,000", unit: "/ half-day", desc: "4-hour on-location shoot. Ideal for narrative singles or brand content.", features: ["4-hour location shoot", "2-camera setup", "Location scouting assistance", "Crew of 4", "Rushes delivered in 24hrs"], popular: true },
  { id: "full-day-location", name: "On-Location Full Day", price: "60,000", unit: "/ day", desc: "Full-day cinematic production with multi-location capabilities.", features: ["8-hour production day", "3-camera multi-setup", "Drone shots (subject to airspace)", "Full production crew", "Colour grade pre-delivery"], popular: false },
  { id: "live-event", name: "Multi-Camera Live Event", price: "POA", unit: "per event", desc: "Live event coverage with 3+ cameras for concerts, galas, and corporate events.", features: ["3+ camera live capture", "Dedicated event director", "Livestream integration available", "Highlight reel edit included", "Full raw footage delivery"], popular: false },
];

export default function VideoShootingPage() {
  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <SiteImage imageKey="video_production" fallbackSrc="/images/video-production.jpg" alt="Video production shoot" fill style={{ objectFit: "cover", opacity: 0.25 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,1) 40%, rgba(13,13,13,0.6) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/studio-services" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem", display: "inline-block" }}>← Studio Services</Link>
          <span className="section-label">🎬 Service</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>Video <span className="gradient-text">Shooting</span></h1>
          <div className="gold-divider" />
          <p className="text-secondary" style={{ maxWidth: 580, fontSize: "1.0625rem", lineHeight: 1.7 }}>From intimate in-studio performance capture to full multi-camera live productions — our crew brings cinematic quality to every frame.</p>
        </div>
      </section>
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", textAlign: "center", marginBottom: "3rem" }}>Shoot <span className="gradient-text">Packages</span> (KES)</h2>
          <div className="pricing-grid">
            {tiers.map((t) => (
              <div key={t.id} id={`pricing-${t.id}`} className={`pricing-card ${t.popular ? "featured" : ""}`}>
                {t.popular && <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "var(--charcoal-800)", fontSize: "0.75rem", fontWeight: 700, padding: "0.375rem 1.25rem", borderRadius: "0 0 8px 8px", textTransform: "uppercase" }}>Popular Choice</div>}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: t.popular ? "1rem" : 0 }}>{t.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>{t.desc}</p>
                <div style={{ marginBottom: "1.5rem" }}><span className="pricing-currency">{t.price !== "POA" ? "KES" : ""}</span><span className="pricing-amount"> {t.price}</span><span className="pricing-period"> {t.unit}</span></div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {t.features.map((f) => <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}><Check size={15} color="var(--gold)" style={{ marginTop: 1, flexShrink: 0 }} />{f}</li>)}
                </ul>
                <Link href={`/contact?service=video-shooting&tier=${t.id}`} id={`book-${t.id}`} className={`btn ${t.popular ? "btn-gold" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>Get a Quote <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
