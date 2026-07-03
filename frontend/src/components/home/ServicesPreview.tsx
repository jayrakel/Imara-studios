"use client";

import Link from "next/link";
import { Mic, Music2, Video, Film, Headphones, ArrowRight } from "lucide-react";

const services = [
  {
    id: "music-recording",
    icon: Mic,
    title: "Music Recording",
    description: "Professional tracking in our acoustically treated studio with top-of-the-line gear. From single vocals to full band arrangements.",
    features: ["Hourly Tracking", "Day-Rate Lockouts", "Dry Vocal Packages"],
    href: "/studio-services/music-recording",
    accent: "#C9A84C",
  },
  {
    id: "music-production",
    icon: Music2,
    title: "Music Production",
    description: "Full beat creation, arrangement, mixing and mastering. From concept to radio-ready master in our production suite.",
    features: ["Beat + Arrangement", "Mix & Master", "Custom Songwriting"],
    href: "/studio-services/music-production",
    accent: "#C9A84C",
  },
  {
    id: "vocal-training",
    icon: Headphones,
    title: "Vocal Training",
    description: "Structured vocal coaching for beginners through advanced artists. Individual and group sessions available.",
    features: ["Single Sessions", "4-Week Packages", "Advanced Agility"],
    href: "/studio-services/vocal-training",
    accent: "#C9A84C",
  },
  {
    id: "video-shooting",
    icon: Video,
    title: "Video Shooting",
    description: "High-quality video capture from in-studio performance shoots to full on-location productions with multi-camera setups.",
    features: ["In-Studio Shoots", "On-Location", "Live Event Coverage"],
    href: "/studio-services/video-shooting",
    accent: "#C9A84C",
  },
  {
    id: "video-production",
    icon: Film,
    title: "Video Production",
    description: "Post-production editing, VFX, colour grading and social media cutdowns. From raw footage to polished final product.",
    features: ["Basic Edits", "Concept Music Videos", "Social Cutdowns"],
    href: "/studio-services/video-production",
    accent: "#C9A84C",
  },
];

export default function ServicesPreview() {
  return (
    <section id="services" className="section" style={{ background: "var(--charcoal-800)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-label">What We Do</span>
          <h2 className="display-md" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
            Five World-Class <span className="gradient-text">Services</span>
          </h2>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ maxWidth: 560, margin: "0 auto", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            From the first note to the final frame — we cover every creative dimension of your project.
          </p>
        </div>

        {/* Services grid */}
        <div className="services-grid">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                id={`service-card-${service.id}`}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={24} color="var(--gold)" />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1875rem", fontWeight: 700, marginBottom: "0.625rem", color: "var(--text-primary)" }}>
                    {service.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {service.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link */}
                <Link href={service.href} id={`service-learn-more-${service.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--gold)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, transition: "gap 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = "0.75rem")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = "0.375rem")}
                >
                  View Pricing <ArrowRight size={14} />
                </Link>
              </article>
            );
          })}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/studio-services" id="services-view-all" className="btn btn-outline btn-lg">
            Explore All Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
