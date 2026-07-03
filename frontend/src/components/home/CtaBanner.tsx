import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaBanner() {
  return (
    <section id="cta-banner" style={{
      padding: "5rem 0",
      background: "linear-gradient(135deg, var(--charcoal-700) 0%, var(--charcoal-800) 100%)",
      borderTop: "1px solid rgba(255,255,255,0.04)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background accent */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">Ready to Create?</span>
        <h2 className="display-md" style={{ marginTop: "1rem", marginBottom: "1.25rem" }}>
          Let&apos;s Bring Your <span className="gradient-text">Vision to Life</span>
        </h2>
        <p className="text-secondary" style={{ maxWidth: 520, margin: "0 auto 2.5rem", fontSize: "1.0625rem", lineHeight: 1.7 }}>
          Whether it&apos;s a chart-topping single, a cinematic music video, or a performance that stops time — we&apos;re here for it.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" id="cta-book-session" className="btn btn-gold btn-lg">
            Book a Session <ArrowRight size={18} />
          </Link>
          <a href="tel:+254700000000" id="cta-call-now" className="btn btn-outline btn-lg">
            <Phone size={18} /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
