import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music4, Users, Calendar } from "lucide-react";

export default function ChoirTeaser() {
  return (
    <section id="choir-teaser" className="section" style={{ background: "var(--charcoal-700)", overflow: "hidden" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          {/* Image Side */}
          <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "4/3" }}>
            <Image src="/images/choir-hero.jpg" alt="The Imara Choir performing live" fill style={{ objectFit: "cover" }} sizes="(max-width:768px) 100vw, 50vw" />
            {/* Gold frame accent */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(201,168,76,0.15) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
            {/* Floating stat card */}
            <div style={{
              position: "absolute", bottom: "1.5rem", left: "1.5rem",
              background: "rgba(13,13,13,0.9)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(201,168,76,0.25)", borderRadius: "var(--radius-md)",
              padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div className="soundwave">
                <span/><span/><span/><span/><span/>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--gold)" }}>14</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Voice Ensemble</div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <span className="section-label">The Imara Choir</span>
            <h2 className="display-md" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              A Voice That <span className="gradient-text">Moves</span> the Room
            </h2>
            <div className="gold-divider" />
            <p className="text-secondary" style={{ fontSize: "1.0625rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              A 14-voice ensemble rooted in excellence and versatility. From intimate corporate settings to grand concert halls, the Imara Choir brings unparalleled presence and emotion to every performance.
            </p>

            {/* Feature pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                { icon: Music4, text: "Gospel, Classical, Afropop & Corporate repertoire" },
                { icon: Users, text: "Available for weddings, events & studio session vocals" },
                { icon: Calendar, text: "Bookable for private and public performances" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="var(--gold)" />
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", margin: 0, paddingTop: "0.5rem" }}>{text}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/choir" id="choir-teaser-learn-more" className="btn btn-gold">
                Meet the Choir <ArrowRight size={16} />
              </Link>
              <Link href="/choir#hire" id="choir-teaser-hire" className="btn btn-outline">
                Hire the Choir
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #choir-teaser .container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
