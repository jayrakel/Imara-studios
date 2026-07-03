"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setLoaded(true);

    // Animated particle canvas (subtle sound wave / music visualiser feel)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let bars: { x: number; height: number; speed: number; targetHeight: number }[] = [];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.floor(canvas.width / 8);
      bars = Array.from({ length: count }, (_, i) => ({
        x: i * 8,
        height: Math.random() * 40 + 10,
        speed: Math.random() * 0.02 + 0.01,
        targetHeight: Math.random() * 60 + 10,
      }));
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bars.forEach((bar) => {
        bar.height += (bar.targetHeight - bar.height) * bar.speed;
        if (Math.abs(bar.height - bar.targetHeight) < 1) {
          bar.targetHeight = Math.random() * 80 + 10;
        }

        const gradient = ctx.createLinearGradient(0, canvas.height - bar.height, 0, canvas.height);
        gradient.addColorStop(0, "rgba(201,168,76,0.3)");
        gradient.addColorStop(1, "rgba(201,168,76,0.05)");

        ctx.fillStyle = gradient;
        ctx.fillRect(bar.x, canvas.height - bar.height, 4, bar.height);
      });

      animFrame = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <section id="hero" style={{
      position: "relative", height: "100vh", minHeight: 680,
      display: "flex", alignItems: "center", overflow: "hidden",
      paddingTop: 72, boxSizing: "border-box",
    }}>
      {/* Background Image */}
      < div style={{ position: "absolute", inset: 0, zIndex: 0 }
      }>
        <Image src="/images/studio-hero.jpg" alt="Imara Studios recording studio" fill priority style={{ objectFit: "cover" }}
          sizes="100vw" quality={90} />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.75) 100%)" }} />
      </div >

      {/* Sound wave canvas */}
      < canvas ref={canvasRef} style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "120px", zIndex: 1 }} />

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 700 }}>
          {/* Badge */}
          <div style={{
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            <span className="section-label">🎙️ Nakuru&apos;s Premier Studio</span>
          </div>

          {/* Headline */}
          <h1 className="display-xl" style={{
            marginTop: "1rem", marginBottom: "1.5rem",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.25s",
          }}>
            Where{" "}
            <span className="gradient-text">Sound</span>
            {" "}Meets{" "}
            <span className="gradient-text">Vision</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(1.0625rem, 2vw, 1.25rem)", color: "var(--text-secondary)",
            lineHeight: 1.7, maxWidth: 560, marginBottom: "2.5rem",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.4s",
          }}>
            Premium music recording, production, vocal coaching & video — all under one roof. Home of the celebrated <strong style={{ color: "var(--text-primary)" }}>Imara Choir</strong>.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "1rem", flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.55s",
          }}>
            <Link href="/studio-services" id="hero-explore-services" className="btn btn-gold btn-lg">
              Explore Studio Services
              <ArrowRight size={18} />
            </Link>
            <Link href="/choir" id="hero-meet-choir" className="btn btn-outline btn-lg">
              <Play size={18} />
              Meet Our Choir
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: "2.5rem", marginTop: "4rem", flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.7s",
          }}>
            {[
              { value: "500+", label: "Sessions Completed" },
              { value: "14", label: "Choir Members" },
              { value: "5", label: "Studio Services" },
            ].map(({ value, label }) => (
              <div key={label} style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "1rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--gold)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        opacity: loaded ? 0.6 : 0, transition: "opacity 0.7s ease 1s",
      }}>
        <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom, var(--gold), transparent)", animation: "pulse-gold 2s infinite" }} />
      </div>
    </section >
  );
}
