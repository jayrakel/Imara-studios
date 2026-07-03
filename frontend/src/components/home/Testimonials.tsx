"use client";
import { useState } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { id: "t1", name: "David Mwangi", role: "Recording Artist", quote: "The sound quality is incredible. I've recorded in studios across East Africa and Imara tops them all. The engineers truly understand how to bring out the best in a vocal." },
  { id: "t2", name: "Amina Hassan", role: "Corporate Events Manager, KCB", quote: "We hired the Imara Choir for our annual gala and they received a standing ovation. Professional, punctual, and absolutely mesmerising. We're already planning our next booking." },
  { id: "t3", name: "Peter Kariuki", role: "Independent Producer", quote: "The production quality and turnaround time is unmatched. My singles have gained serious traction since I started working with Imara Studios." },
  { id: "t4", name: "Grace Wanjiru", role: "Vocal Student", quote: "My vocal range has improved dramatically in just 8 weeks of training here. The coaches are patient, skilled, and genuinely invested in your growth." },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section id="testimonials" className="section" style={{ background: "var(--charcoal-800)" }}>
      <div className="container" style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-label">Client Stories</span>
          <h2 className="display-md" style={{ marginTop: "0.5rem" }}>
            What They <span className="gradient-text">Say</span>
          </h2>
          <div className="gold-divider-center" />
        </div>

        {/* Testimonial card */}
        <div className="card" style={{ position: "relative", padding: "3rem", textAlign: "center" }}>
          <Quote size={40} color="var(--gold)" style={{ opacity: 0.3, position: "absolute", top: "2rem", left: "2rem" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
            {Array(5).fill(0).map((_, i) => <Star key={i} size={16} color="var(--gold)" fill="var(--gold)" />)}
          </div>
          <p key={t.id} style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.8, color: "var(--text-primary)", fontStyle: "italic", marginBottom: "2rem", transition: "all 0.3s" }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--gold)", marginBottom: "0.25rem" }}>{t.name}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{t.role}</div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", marginTop: "2rem" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              id={`testimonial-dot-${i}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 28 : 8, height: 8, borderRadius: 4,
                background: i === active ? "var(--gold)" : "var(--charcoal-400)",
                border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0,
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
