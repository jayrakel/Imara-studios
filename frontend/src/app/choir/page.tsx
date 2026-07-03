import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Music4, Mic2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Imara Choir — Performances, Events & Bookings",
  description: "Meet the Imara Choir — a 14-voice professional ensemble available for weddings, corporate events, and studio session vocals in Nakuru.",
};

const gallery = [
  { src: "/images/choir-hero.jpg", alt: "Imara Choir performing at a gala", span: 2 },
  { src: "/images/vocal-training.jpg", alt: "Choir rehearsal session", span: 1 },
  { src: "/images/studio-hero.jpg", alt: "Choir recording in studio", span: 1 },
];

const packages = [
  { id: "wedding", emoji: "💍", title: "Wedding Package", price: "50,000", desc: "Elevate your special day with live choral accompaniment — processional, ceremonial, and reception sets.", features: ["Processional & recessional", "2 ceremony songs", "1 reception performance set", "Full sound system included"] },
  { id: "corporate", emoji: "🏢", title: "Corporate Event", price: "70,000", desc: "From galas to product launches — the Imara Choir adds prestige and emotion to any corporate function.", features: ["45-minute performance set", "Custom repertoire selection", "Professional attire", "PA & sound engineer"] },
  { id: "studio-session", emoji: "🎙️", title: "Studio Session Vocals", price: "45,000", desc: "Hire the Choir to provide background or lead vocals on your recording project.", features: ["3-hour studio session", "SATB full arrangement", "Harmony coaching included", "Session files delivered"] },
];

const events = [
  { date: "Sep 06, 2026", title: "Imara Studios Open Day", venue: "Imara Studios, Nakuru", isPublic: true },
  { date: "Dec 20, 2026", title: "Christmas Concert", venue: "Alliance Française, Nakuru", isPublic: true },
  { date: "Aug 15, 2026", title: "Private Gala — TBA", venue: "TBA", isPublic: false, isBlocked: true },
];

export default function ChoirPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/images/choir-hero.jpg" alt="The Imara Chorale" fill style={{ objectFit: "cover", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.95) 40%, rgba(8,8,8,0.6) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <span className="section-label">The Imara Chorale</span>
            <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
              14 Voices. <span className="gradient-text">One Sound.</span>
            </h1>
            <div className="gold-divider" />
            <p className="text-secondary" style={{ fontSize: "1.0625rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              A premier 14-voice ensemble rooted in versatility and technical excellence. The Imara Chorale moves effortlessly through the rich spectrum of traditional and contemporary gospel music with undeniable mastery.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#hire" id="choir-hire-cta" className="btn btn-gold btn-lg">Send an Invitation <ArrowRight size={18} /></a>
              <Link href="/choir/auditions" id="choir-auditions-link" className="btn btn-outline btn-lg"><Mic2 size={18} /> Auditions</Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[{ val: "14", lbl: "Voice Ensemble" }, { val: "3+", lbl: "Repertoire Styles" }, { val: "50+", lbl: "Performances" }, { val: "5★", lbl: "Client Rating" }].map(({ val, lbl }) => (
              <div key={lbl} className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--gold)" }}>{val}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){#choir-hero-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Gallery</span>
            <h2 className="display-md" style={{ marginTop: "0.5rem" }}>Moments on <span className="gradient-text">Stage</span></h2>
            <div className="gold-divider-center" />
          </div>
          <div className="gallery-masonry">
            {gallery.map((img, i) => (
              <div key={i} className="gallery-item">
                <Image src={img.src} alt={img.alt} width={800} height={600} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Calendar */}
      <section id="events" className="section" style={{ background: "var(--charcoal-700)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Itinerary</span>
            <h2 className="display-md" style={{ marginTop: "0.5rem" }}>Upcoming <span className="gradient-text">Events</span></h2>
            <div className="gold-divider-center" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 720, margin: "0 auto" }}>
            {events.map((ev) => (
              <div key={ev.title} style={{
                display: "flex", gap: "1.5rem", alignItems: "center",
                background: "var(--charcoal-600)", borderRadius: "var(--radius-md)",
                padding: "1.5rem 2rem", border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${ev.isBlocked ? "rgba(255,255,255,0.15)" : "var(--gold)"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 10, background: "rgba(201,168,76,0.1)", flexShrink: 0 }}>
                  <Calendar size={22} color="var(--gold)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem", color: ev.isBlocked ? "var(--text-muted)" : "var(--text-primary)" }}>{ev.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{ev.date} · {ev.venue}</div>
                </div>
                {ev.isBlocked ? (
                  <span className="badge badge-archived">Blocked</span>
                ) : (
                  <span className="badge badge-booked">Public</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hire the Choir */}
      <section id="hire" className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Performance Packages</span>
            <h2 className="display-md" style={{ marginTop: "0.5rem" }}>Invite the <span className="gradient-text">Choir</span></h2>
            <div className="gold-divider-center" />
            <p className="text-secondary" style={{ maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>The Imara Choir is available for a wide range of events. All packages are customisable to your vision.</p>
          </div>
          <div className="pricing-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} id={`choir-package-${pkg.id}`} className="card" style={{ position: "relative" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{pkg.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{pkg.title}</h3>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--gold)" }}>KES {pkg.price}</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{pkg.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "var(--gold)" }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/contact?type=choir&package=${pkg.id}`} id={`book-choir-${pkg.id}`} className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
                  Book This Package <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Portal Promo */}
      <section style={{ background: "var(--charcoal-700)", padding: "3rem 0", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="container">
          <Users size={32} color="var(--gold)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>Are you an Imara Choir member?</h3>
          <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>Upload performance photos and manage your profile through our secure member portal.</p>
          <Link href="/choir/member-portal" id="choir-member-portal-link" className="btn btn-outline">Access Member Portal</Link>
        </div>
      </section>
    </>
  );
}
