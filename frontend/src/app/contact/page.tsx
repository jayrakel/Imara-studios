"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const services = [
  { value: "MUSIC_RECORDING", label: "Music Recording" },
  { value: "MUSIC_PRODUCTION", label: "Music Production" },
  { value: "VOCAL_TRAINING", label: "Vocal Training" },
  { value: "VIDEO_SHOOTING", label: "Video Shooting" },
  { value: "VIDEO_PRODUCTION", label: "Video Production" },
];

function ContactForm() {
  const params = useSearchParams();
  const initialType = params.get("type") === "choir" ? "CHOIR_BOOKING" : "STUDIO_SERVICES";
  const initialService = params.get("service")?.toUpperCase().replace(/-/g, "_") || "";

  const [tab, setTab] = useState<"STUDIO_SERVICES" | "CHOIR_BOOKING">(initialType as any);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "", clientCompany: "",
    serviceType: initialService, message: "",
    numTracks: "", estimatedRuntime: "", referenceLinks: "",
    eventDate: "", venueName: "", audienceSize: "", repertoireStyle: "",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        type: tab,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        clientCompany: form.clientCompany,
        message: form.message,
        serviceType: tab === "STUDIO_SERVICES" ? form.serviceType : undefined,
        numTracks: form.numTracks ? parseInt(form.numTracks) : undefined,
        estimatedRuntime: form.estimatedRuntime || undefined,
        referenceLinks: form.referenceLinks ? form.referenceLinks.split("\n").filter(Boolean) : [],
        eventDate: form.eventDate || undefined,
        venueName: form.venueName || undefined,
        audienceSize: form.audienceSize ? parseInt(form.audienceSize) : undefined,
        repertoireStyle: form.repertoireStyle || undefined,
      };
      const res = await fetch(`${API}/api/inquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <CheckCircle size={64} color="var(--gold)" style={{ margin: "0 auto 1.5rem" }} />
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "1rem" }}>Inquiry <span className="gradient-text">Received!</span></h2>
      <p className="text-secondary" style={{ lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2rem" }}>Thank you, {form.clientName}! We&apos;ve received your inquiry and sent a confirmation to {form.clientEmail}. Expect a personalised response within <strong style={{ color: "var(--text-primary)" }}>12–24 hours</strong>.</p>
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "2rem" }}>
        {[{ val: "STUDIO_SERVICES", lbl: "🎙️ Studio Services" }, { val: "CHOIR_BOOKING", lbl: "🎼 Choir Booking" }].map(({ val, lbl }) => (
          <button key={val} id={`contact-tab-${val.toLowerCase()}`} type="button" onClick={() => setTab(val as any)}
            style={{ flex: 1, padding: "0.875rem", border: "none", background: tab === val ? "rgba(201,168,76,0.1)" : "var(--charcoal-600)", color: tab === val ? "var(--gold)" : "var(--text-muted)", fontWeight: tab === val ? 600 : 400, cursor: "pointer", transition: "all 0.2s", fontSize: "0.9375rem" }}>
            {lbl}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Common Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label className="form-label" htmlFor="contact-name">Full Name *</label><input id="contact-name" className="input" placeholder="Your name" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} required /></div>
          <div><label className="form-label" htmlFor="contact-email">Email *</label><input id="contact-email" type="email" className="input" placeholder="your@email.com" value={form.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} required /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label className="form-label" htmlFor="contact-phone">Phone</label><input id="contact-phone" className="input" placeholder="+254..." value={form.clientPhone} onChange={(e) => set("clientPhone", e.target.value)} /></div>
          <div><label className="form-label" htmlFor="contact-company">Company / Organisation</label><input id="contact-company" className="input" placeholder="Optional" value={form.clientCompany} onChange={(e) => set("clientCompany", e.target.value)} /></div>
        </div>

        {/* Studio Services conditional fields */}
        {tab === "STUDIO_SERVICES" && (
          <>
            <div>
              <label className="form-label" htmlFor="contact-service">Service Required *</label>
              <select id="contact-service" className="select" value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} required>
                <option value="">Select a service...</option>
                {services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {form.serviceType === "MUSIC_RECORDING" && (
              <div><label className="form-label" htmlFor="contact-num-tracks">Number of Tracks</label><input id="contact-num-tracks" type="number" className="input" placeholder="How many tracks do you need to record?" value={form.numTracks} onChange={(e) => set("numTracks", e.target.value)} /></div>
            )}
            {form.serviceType === "VIDEO_PRODUCTION" && (
              <>
                <div><label className="form-label" htmlFor="contact-runtime">Estimated Run Time</label><input id="contact-runtime" className="input" placeholder="e.g., 3-minute music video" value={form.estimatedRuntime} onChange={(e) => set("estimatedRuntime", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="contact-refs">Reference Links</label><textarea id="contact-refs" className="textarea" placeholder="YouTube or social links of videos you love (one per line)" value={form.referenceLinks} onChange={(e) => set("referenceLinks", e.target.value)} style={{ minHeight: 80 }} /></div>
              </>
            )}
          </>
        )}

        {/* Choir Booking conditional fields */}
        {tab === "CHOIR_BOOKING" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label className="form-label" htmlFor="contact-event-date">Event Date *</label><input id="contact-event-date" type="date" className="input" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} required /></div>
              <div><label className="form-label" htmlFor="contact-audience">Expected Audience Size</label><input id="contact-audience" type="number" className="input" placeholder="e.g., 200" value={form.audienceSize} onChange={(e) => set("audienceSize", e.target.value)} /></div>
            </div>
            <div><label className="form-label" htmlFor="contact-venue">Venue Name</label><input id="contact-venue" className="input" placeholder="e.g., KICC Nakuru" value={form.venueName} onChange={(e) => set("venueName", e.target.value)} /></div>
            <div>
              <label className="form-label" htmlFor="contact-repertoire">Repertoire Style</label>
              <select id="contact-repertoire" className="select" value={form.repertoireStyle} onChange={(e) => set("repertoireStyle", e.target.value)}>
                <option value="">Select a style...</option>
                <option>Gospel / Sacred</option>
                <option>Classical</option>
                <option>Afropop / Contemporary</option>
                <option>Corporate / Cinematic</option>
                <option>Mixed / Custom</option>
              </select>
            </div>
          </>
        )}

        <div><label className="form-label" htmlFor="contact-message">Message *</label><textarea id="contact-message" className="textarea" placeholder="Tell us about your project, timeline, and any specific requirements..." value={form.message} onChange={(e) => set("message", e.target.value)} required style={{ minHeight: 120 }} /></div>

        <button id="contact-submit" type="submit" className="btn btn-gold btn-lg" disabled={loading} style={{ justifyContent: "center" }}>
          {loading ? "Sending..." : "Send Inquiry"} <ArrowRight size={18} />
        </button>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
          You&apos;ll receive an automatic confirmation email. We respond within 12–24 hours.
        </p>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", background: "var(--charcoal-900)", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className="display-lg" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
            Book Now / <span className="gradient-text">Contact Us</span>
          </h1>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ maxWidth: 520, margin: "0 auto", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Ready to start your project? Fill out the form below and our team will respond with a personalised quote within 12–24 hours.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", alignItems: "start" }}>
          {/* Form */}
          <div className="card" style={{ padding: "2.5rem" }}>
            <Suspense fallback={<div>Loading...</div>}>
              <ContactForm />
            </Suspense>
          </div>

          {/* Contact info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--gold)" }}>Direct Contact</h3>
              {[
                { icon: Phone, label: "+254 700 000 000", href: "tel:+254700000000" },
                { icon: Mail, label: "hello@imarastudios.com", href: "mailto:hello@imarastudios.com" },
                { icon: MapPin, label: "Nakuru, Kenya", href: null },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                  <Icon size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
                  {href ? <a href={href} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>{label}</a> : <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{label}</span>}
                </div>
              ))}
            </div>
            <div className="card" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--gold)", marginBottom: "0.75rem" }}>⏱️ Response SLA</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>We aim to respond to all inquiries within <strong style={{ color: "var(--text-primary)" }}>12 to 24 hours</strong> with a personalised quote tailored to your project.</p>
            </div>
            <div className="card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--gold)", marginBottom: "0.75rem" }}>Studio Hours</h3>
              {[["Monday – Friday", "8am – 10pm"], ["Saturday", "Closed"], ["Sunday", "By Appointment"]].map(([day, hrs]) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{day}</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{hrs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
