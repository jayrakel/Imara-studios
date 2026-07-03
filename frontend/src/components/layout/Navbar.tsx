"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteImage from "@/components/common/SiteImage";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const services = [
  { label: "Music Recording", href: "/studio-services/music-recording" },
  { label: "Music Production", href: "/studio-services/music-production" },
  { label: "Vocal Training", href: "/studio-services/vocal-training" },
  { label: "Video Shooting", href: "/studio-services/video-shooting" },
  { label: "Video Production", href: "/studio-services/video-production" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Studio Services", href: "/studio-services", hasDropdown: true },
  { label: "The Choir", href: "/choir" },
  { label: "Portfolio", href: "/portfolio" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        id="main-navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled
            ? "rgba(13, 13, 13, 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "none",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          {/* Logo */}
          <Link href="/" id="nav-logo" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <SiteImage imageKey="logo" fallbackSrc="/images/logo.png"
              alt="Imara Studios"
              width={60}
              height={60}
              quality={100}
              style={{ borderRadius: 8 }}
              priority
            />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", letterSpacing: "0.1em", color: "var(--gold)" }}>
              IMARA<span style={{ color: "var(--text-primary)", fontWeight: 300, fontSize: "0.75rem", display: "block", letterSpacing: "0.25em", lineHeight: 1 }}>STUDIOS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} style={{ position: "relative" }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}>
                  <button
                    id="nav-services-dropdown"
                    style={{
                      display: "flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.5rem 0.875rem", background: "none", border: "none",
                      color: isActive(link.href) ? "var(--gold)" : "var(--text-secondary)",
                      fontFamily: "var(--font-body)", fontSize: "0.9375rem",
                      cursor: "pointer", transition: "color 0.2s", fontWeight: 500,
                    }}
                  >
                    {link.label}
                    <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "none" }} />
                  </button>
                  {servicesOpen && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0,
                      background: "var(--charcoal-700)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "var(--radius-md)", padding: "0.5rem", minWidth: 220,
                      boxShadow: "var(--shadow-card)", zIndex: 100,
                    }}>
                      {services.map((s) => (
                        <Link key={s.href} href={s.href} id={`nav-service-${s.label.toLowerCase().replace(/ /g, '-')}`}
                          style={{
                            display: "block", padding: "0.625rem 1rem",
                            color: pathname === s.href ? "var(--gold)" : "var(--text-secondary)",
                            textDecoration: "none", fontSize: "0.9rem", borderRadius: "var(--radius-sm)",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--charcoal-600)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = pathname === s.href ? "var(--gold)" : "var(--text-secondary)"; }}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} id={`nav-${link.label.toLowerCase().replace(/ /g, '-')}`}
                  style={{
                    padding: "0.5rem 0.875rem", textDecoration: "none", fontWeight: 500, fontSize: "0.9375rem",
                    color: isActive(link.href) ? "var(--gold)" : "var(--text-secondary)",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/contact" id="nav-book-now" className="btn btn-gold btn-sm" style={{ display: "none" }}>
              Book Now
            </Link>
            <Link href="/contact" id="nav-book-now-desktop" className="btn btn-gold btn-sm">
              Book Now
            </Link>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "0.5rem", display: "none" }}
              aria-label="Toggle mobile menu"
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: "var(--charcoal-800)", borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem",
          }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                style={{
                  padding: "0.875rem 1rem", textDecoration: "none", fontSize: "1rem", fontWeight: 500,
                  color: isActive(link.href) ? "var(--gold)" : "var(--text-primary)",
                  borderRadius: "var(--radius-sm)", display: "block",
                }}>
                {link.label}
              </Link>
            ))}
            {services.map((s) => (
              <Link key={s.href} href={s.href}
                style={{
                  padding: "0.625rem 1.5rem", textDecoration: "none", fontSize: "0.9rem",
                  color: "var(--text-muted)", borderRadius: "var(--radius-sm)", display: "block",
                }}>
                ↳ {s.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-gold" style={{ marginTop: "1rem", textAlign: "center" }}>
              Book Now
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #nav-book-now-desktop { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (max-width: 768px) {
          #nav-book-now { display: flex !important; }
        }
      `}</style>
    </>
  );
}
