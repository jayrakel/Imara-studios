"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const vocalRanges = ["Soprano", "Mezzo-Soprano", "Alto", "Tenor", "Baritone", "Bass"];

type FormData = {
  name: string;
  email: string;
  phone: string;
  vocalRange: string;
  vocalPart: string;
  experienceYears: string;
  experienceNotes: string;
  mediaLinks: string;
  availability: string;
  motivation: string;
};

export default function AuditionsPage() {
  const [auditionsOpen, setAuditionsOpen] = useState<boolean | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "", vocalRange: "", vocalPart: "", experienceYears: "", experienceNotes: "", mediaLinks: "", availability: "", motivation: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/settings/auditions_open`)
      .then((r) => r.json())
      .then((d) => setAuditionsOpen(d.value === "true"))
      .catch(() => setAuditionsOpen(false));
  }, []);

  const set = (k: keyof FormData, v: string) => setFormData((p) => ({ ...p, [k]: v }));
  const stepValid = () => {
    if (step === 1) return formData.name && formData.email && formData.phone;
    if (step === 2) return formData.vocalRange;
    if (step === 3) return true;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("mediaFiles", f));
      const res = await fetch(`${API}/api/auditions`, { method: "POST", body: fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (auditionsOpen === null) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "8rem" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(201,168,76,0.3)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!auditionsOpen) return (
    <section style={{ paddingTop: "10rem", paddingBottom: "6rem", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
          <AlertCircle size={36} color="var(--gold)" />
        </div>
        <h1 className="display-md" style={{ marginBottom: "1rem" }}>Auditions <span className="gradient-text">Closed</span></h1>
        <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: "2rem" }}>We&apos;re not accepting new applications at the moment. Follow us on social media to be the first to know when auditions open again.</p>
        <Link href="/choir" id="auditions-back-to-choir" className="btn btn-outline"><ArrowLeft size={16} /> Back to Choir</Link>
      </div>
    </section>
  );

  if (submitted) return (
    <section style={{ paddingTop: "10rem", paddingBottom: "6rem", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <CheckCircle size={64} color="var(--gold)" style={{ margin: "0 auto 1.5rem" }} />
        <h1 className="display-md" style={{ marginBottom: "1rem" }}>Application <span className="gradient-text">Submitted!</span></h1>
        <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: "2rem" }}>Thank you, {formData.name}! We&apos;ve received your audition application. Our Choir Director will review it and be in touch within 5–7 business days.</p>
        <Link href="/choir" className="btn btn-gold">← Back to Choir Hub</Link>
      </div>
    </section>
  );

  const steps = ["Personal Info", "Vocal Profile", "Experience & Media", "Review"];

  return (
    <>
      <section style={{ paddingTop: "9rem", paddingBottom: "4rem", background: "var(--charcoal-900)", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">🎤 Auditions Open</span>
          <h1 className="display-md" style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>
            Join the <span className="gradient-text">Imara Chorale</span>
          </h1>
          <div className="gold-divider-center" />
          <p className="text-secondary" style={{ maxWidth: 480, margin: "0 auto" }}>
            We&apos;re looking for dedicated, passionate vocalists. Complete the 4-step application below.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--charcoal-800)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          {/* Step indicators */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "3rem" }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ width: "100%", height: 3, borderRadius: 3, background: i + 1 <= step ? "var(--gold)" : "var(--charcoal-400)", transition: "background 0.3s" }} />
                <span style={{ fontSize: "0.75rem", color: i + 1 === step ? "var(--gold)" : "var(--text-muted)", fontWeight: i + 1 === step ? 600 : 400, textAlign: "center" }}>{s}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "2.5rem" }}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>Personal Information</h2>
                <div><label className="form-label" htmlFor="aud-name">Full Name *</label><input id="aud-name" className="input" placeholder="Your full name" value={formData.name} onChange={(e) => set("name", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="aud-email">Email Address *</label><input id="aud-email" type="email" className="input" placeholder="your@email.com" value={formData.email} onChange={(e) => set("email", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="aud-phone">Phone Number *</label><input id="aud-phone" className="input" placeholder="+254..." value={formData.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              </div>
            )}

            {/* Step 2: Vocal Profile */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>Vocal Profile</h2>
                <div>
                  <label className="form-label">Vocal Range *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                    {vocalRanges.map((v) => (
                      <button key={v} id={`vocal-range-${v.toLowerCase()}`} type="button"
                        onClick={() => set("vocalRange", v)}
                        style={{ padding: "0.75rem", border: `2px solid ${formData.vocalRange === v ? "var(--gold)" : "rgba(255,255,255,0.08)"}`, borderRadius: "var(--radius-sm)", background: formData.vocalRange === v ? "rgba(201,168,76,0.1)" : "var(--charcoal-600)", color: formData.vocalRange === v ? "var(--gold)" : "var(--text-secondary)", cursor: "pointer", fontWeight: formData.vocalRange === v ? 600 : 400, transition: "all 0.2s", fontSize: "0.9rem" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="form-label" htmlFor="aud-vocal-part">Vocal Part / Section (optional)</label><input id="aud-vocal-part" className="input" placeholder="e.g., First Soprano, Bass II" value={formData.vocalPart} onChange={(e) => set("vocalPart", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="aud-availability">Rehearsal Availability</label><textarea id="aud-availability" className="textarea" placeholder="Which days/times are you available for weekly rehearsals?" value={formData.availability} onChange={(e) => set("availability", e.target.value)} style={{ minHeight: 80 }} /></div>
              </div>
            )}

            {/* Step 3: Experience & Media */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>Experience & Media</h2>
                <div><label className="form-label" htmlFor="aud-exp-years">Years of Vocal Experience</label><input id="aud-exp-years" type="number" className="input" placeholder="0" min={0} value={formData.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="aud-exp-notes">Tell us about your experience</label><textarea id="aud-exp-notes" className="textarea" placeholder="Previous choirs, training, performances..." value={formData.experienceNotes} onChange={(e) => set("experienceNotes", e.target.value)} /></div>
                <div><label className="form-label" htmlFor="aud-media-links">YouTube / SoundCloud Links</label><textarea id="aud-media-links" className="textarea" placeholder="One link per line — share videos or recordings of your singing" value={formData.mediaLinks} onChange={(e) => set("mediaLinks", e.target.value)} style={{ minHeight: 80 }} /></div>
                <div>
                  <label className="form-label">Upload Audio/Video Files (optional)</label>
                  <label htmlFor="aud-files" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "2rem", border: "2px dashed rgba(201,168,76,0.3)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "border-color 0.2s" }}>
                    <Upload size={28} color="var(--gold)" />
                    <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{files.length > 0 ? `${files.length} file(s) selected` : "Click to upload or drag & drop"}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>MP3, MP4, MOV up to 20MB</span>
                    <input id="aud-files" type="file" accept="audio/*,video/*" multiple style={{ display: "none" }} onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                  </label>
                </div>
                <div><label className="form-label" htmlFor="aud-motivation">Why do you want to join the Imara Chorale?</label><textarea id="aud-motivation" className="textarea" placeholder="Tell us your motivation..." value={formData.motivation} onChange={(e) => set("motivation", e.target.value)} /></div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "1.5rem" }}>Review Your Application</h2>
                {[
                  { label: "Name", value: formData.name },
                  { label: "Email", value: formData.email },
                  { label: "Phone", value: formData.phone },
                  { label: "Vocal Range", value: formData.vocalRange },
                  { label: "Experience", value: `${formData.experienceYears || "0"} years` },
                  { label: "Availability", value: formData.availability || "—" },
                  { label: "Files", value: files.length > 0 ? `${files.length} file(s)` : "None" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.875rem 0" }}>
                    <span style={{ width: 140, color: "var(--text-muted)", fontSize: "0.875rem", flexShrink: 0 }}>{label}</span>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.875rem" }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", gap: "1rem" }}>
              {step > 1 ? (
                <button id="aud-prev" onClick={() => setStep(s => s - 1)} className="btn btn-outline">
                  <ArrowLeft size={16} /> Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button id="aud-next" onClick={() => { if (stepValid()) setStep(s => s + 1); else toast.error("Please fill in all required fields."); }}
                  className="btn btn-gold" disabled={!stepValid()} style={{ opacity: stepValid() ? 1 : 0.5 }}>
                  Next Step <ArrowRight size={16} />
                </button>
              ) : (
                <button id="aud-submit" onClick={handleSubmit} className="btn btn-gold" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
