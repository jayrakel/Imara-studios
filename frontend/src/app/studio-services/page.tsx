import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Services — Music, Video & Vocal",
  description: "Explore all Imara Studios services: music recording, production, vocal training, video shooting, and video production in Nakuru.",
};

const services = [
  {
    id: "music-recording",
    emoji: "🎙️",
    title: "Music Recording",
    description: "State-of-the-art acoustically treated recording rooms with world-class gear. Capture every nuance of your performance.",
    packages: ["Hourly Tracking Rate", "Day-Rate Lockouts", "Dry Vocal Packages"],
    href: "/studio-services/music-recording",
  },
  {
    id: "music-production",
    emoji: "🎵",
    title: "Music Production",
    description: "From a raw concept to a polished, radio-ready master — our producers handle every stage of your sonic journey.",
    packages: ["Full Track Production", "Mixing & Mastering", "Custom Songwriting"],
    href: "/studio-services/music-production",
  },
  {
    id: "vocal-training",
    emoji: "🎤",
    title: "Vocal Training",
    description: "Develop your voice with personalised coaching from experienced vocal directors. Individual & group sessions available.",
    packages: ["Single Sessions", "4-Week Beginner Package", "Advanced Agility Block", "Group Coaching"],
    href: "/studio-services/vocal-training",
  },
  {
    id: "video-shooting",
    emoji: "🎬",
    title: "Video Shooting",
    description: "In-studio performance capture and on-location production with multi-camera setups and professional lighting rigs.",
    packages: ["In-Studio Performance", "On-Location Shoots", "Multi-Camera Live Events"],
    href: "/studio-services/video-shooting",
  },
  {
    id: "video-production",
    emoji: "🎞️",
    title: "Video Production",
    description: "Award-quality editing, VFX, colour grading, and social media cutdowns. The complete post-production experience.",
    packages: ["Basic Performance Edit", "Concept Music Video", "Social Media Cutdowns"],
    href: "/studio-services/video-production",
  },
];

export default function StudioServicesPage() {
  return (
    <>
      {/* Page Hero */}
      <section style={{ paddingTop: "10rem", paddingBottom: "5rem", background: "var(--charcoal-900)", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">Our Services</span>
          <h1 className="display-lg" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            Studio <span className="gradient-text">Services</span>
          </h1>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ maxWidth: 580, margin: "0 auto", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Five professional-grade services, one studio. Everything you need to create, refine, and launch your work.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {services.map((s, i) => (
            <div key={s.id} id={`service-section-${s.id}`} className="card"
              style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2rem", alignItems: "center", padding: "2.5rem" }}>
              <div style={{ fontSize: "3rem", lineHeight: 1 }}>{s.emoji}</div>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.5rem" }}>{s.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1rem" }}>{s.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.packages.map((p) => (
                    <span key={p} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-secondary)", background: "var(--charcoal-600)", padding: "0.25rem 0.75rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <Check size={12} color="var(--gold)" />{p}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={s.href} id={`service-overview-link-${s.id}`} className="btn btn-gold" style={{ flexShrink: 0 }}>
                View Pricing <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Book CTA */}
      <section style={{ background: "var(--charcoal-700)", padding: "4rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "1rem" }}>Not sure which service you need?</h2>
          <p className="text-secondary" style={{ marginBottom: "2rem" }}>Fill out one form and we&apos;ll recommend the right package for your project.</p>
          <Link href="/contact" id="services-contact-cta" className="btn btn-gold btn-lg">Let&apos;s Talk <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
