export default function TrustBar() {
  const clients = [
    "Safaricom", "Nation Media", "KCB Group", "Kenya Airways",
    "Equity Bank", "Jubilee Insurance", "NTV Kenya", "Tusker",
  ];

  return (
    <section style={{ background: "var(--charcoal-900)", padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", padding: "0 2rem", flexShrink: 0 }}>
          Trusted by
        </span>
        {/* Scrolling marquee */}
        <div style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
          <div style={{
            display: "flex", gap: "4rem", animation: "marquee 30s linear infinite",
          }}>
            {[...clients, ...clients].map((c, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem",
                letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase",
                flexShrink: 0, transition: "color 0.2s",
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
