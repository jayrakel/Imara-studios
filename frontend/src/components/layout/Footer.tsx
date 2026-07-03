"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

const services = [
  { label: "Music Recording", href: "/studio-services/music-recording" },
  { label: "Music Production", href: "/studio-services/music-production" },
  { label: "Vocal Training", href: "/studio-services/vocal-training" },
  { label: "Video Shooting", href: "/studio-services/video-shooting" },
  { label: "Video Production", href: "/studio-services/video-production" },
];

const choirLinks = [
  { label: "About the Choir", href: "/choir" },
  { label: "Upcoming Events", href: "/choir#events" },
  { label: "Hire the Choir", href: "/choir#hire" },
  { label: "Auditions", href: "/choir/auditions" },
  { label: "Member Portal", href: "/choir/member-portal" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal-900)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Gold accent line */}
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)" }} />

      <div className="container" style={{ padding: "4rem clamp(1rem,4vw,2rem)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "1.25rem" }}>
              <Image src="/images/logo.png" alt="Imara Studios" width={40} height={40} style={{ borderRadius: 6 }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.12em", color: "var(--gold)" }}>
                IMARA<span style={{ color: "var(--text-primary)", fontWeight: 300, fontSize: "0.65rem", display: "block", letterSpacing: "0.3em" }}>STUDIOS</span>
              </span>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260, marginBottom: "1.5rem" }}>
              Where sound meets vision. Nakuru&apos;s premier music, media & choral studio.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { href: "https://instagram.com/imarastudios", icon: SiInstagram, label: "Instagram" },
                { href: "https://youtube.com/@imarastudios", icon: SiYoutube, label: "YouTube" },
                { href: "https://facebook.com/imarastudios", icon: SiFacebook, label: "Facebook" },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  id={`footer-social-${label.toLowerCase()}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>
              Studio Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} id={`footer-service-${s.label.toLowerCase().replace(/ /g, '-')}`}
                    style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Choir */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>
              The Choir
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {choirLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} id={`footer-choir-${l.label.toLowerCase().replace(/ /g, '-')}`}
                    style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem" }}>
              Get In Touch
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                { icon: Phone, text: "+254 700 000 000", href: "tel:+254700000000" },
                { icon: Mail, text: "hello@imarastudios.com", href: "mailto:hello@imarastudios.com" },
                { icon: MapPin, text: "Nakuru, Kenya", href: null },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <Icon size={16} color="var(--gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {href ? (
                    <a href={href} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>{text}</a>
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{text}</span>
                  )}
                </div>
              ))}
            </div>
            <Link href="/contact" id="footer-book-cta" className="btn btn-gold btn-sm" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
              Book a Session
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", margin: 0 }}>
            © {new Date().getFullYear()} Imara Studios. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Admin", href: "/admin" },
            ].map((l) => (
              <Link key={l.href} href={l.href} id={`footer-${l.label.toLowerCase().replace(/ /g, '-')}`}
                style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8125rem" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
