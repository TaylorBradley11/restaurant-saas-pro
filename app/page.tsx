import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0906", color: "#faf8f4", fontFamily: "var(--sans)", overflow: "hidden", position: "relative" }}>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%", background: "radial-gradient(ellipse, rgba(196,150,90,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(139,26,26,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: "30%", height: "30%", background: "radial-gradient(ellipse, rgba(196,150,90,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* Grain texture overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.035, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Nav */}
        <nav className="fade-up-1" style={{ padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 13, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold2)" }}>
            SHA MUU
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2d8a4e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Open Now</span>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 48px 60px", textAlign: "center", position: "relative" }}>

          {/* Decorative circles */}
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(196,150,90,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", border: "1px solid rgba(196,150,90,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(196,150,90,0.06)", pointerEvents: "none" }} />

          {/* Tag */}
          <div className="fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(196,150,90,0.08)", border: "1px solid rgba(196,150,90,0.2)", borderRadius: 30, padding: "8px 20px", marginBottom: 48 }}>
            <span style={{ fontSize: 14 }}>🍣</span>
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold2)" }}>Sushi & Burmese Asian Fusion</span>
            <span style={{ fontSize: 14 }}>🍜</span>
          </div>

          {/* Main title */}
          <div className="fade-up-2" style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(80px, 14vw, 160px)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.03em", color: "#faf8f4" }}>
              Sha
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(80px, 14vw, 160px)", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-0.03em", fontStyle: "italic", color: "var(--gold)" }}>
              Muu
            </div>
          </div>

          <div className="fade-up-3" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 56 }}>
            23 North 900 West · Salt Lake City, Utah
          </div>

          {/* CTA buttons */}
          <div className="fade-up-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
            <Link href="/menu" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#0a0906", padding: "18px 44px", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, borderRadius: 3, transition: "all 0.2s" }}>
              <span>Order Now</span>
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
            <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "rgba(255,255,255,0.3)", padding: "18px 36px", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 400, borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
              Kitchen
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up-5" style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 48 }}>
            {[
              { value: "4.7", unit: "★", label: "Rating" },
              { value: "$0", unit: "", label: "Delivery" },
              { value: "5PM", unit: "–12AM", label: "Daily" },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", padding: "0 48px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "var(--gold2)", marginBottom: 6 }}>
                  {s.value}<span style={{ fontSize: 18, opacity: 0.7 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 48px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
          <span>© 2025 Sha Muu</span>
          <span>23 N 900 W · Salt Lake City, UT 84116</span>
        </div>
      </div>
    </div>
  );
}
