import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--sans)", display: "flex", flexDirection: "column" }}>

      <nav style={{ padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, letterSpacing: "0.08em", color: "var(--gold2)" }}>
          SHA MUU
        </div>
        <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
          Sushi & Burmese Asian Fusion
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 48px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(184,150,110,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(184,150,110,0.05)", pointerEvents: "none" }} />

        <div className="fade-up-1" style={{ fontFamily: "var(--serif)", fontSize: "clamp(72px, 12vw, 130px)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.02em", marginBottom: 36 }}>
          Sha<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Muu</em>
        </div>

        <div className="fade-up-2" style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
          Sushi & Burmese Asian Fusion
        </div>

        <div className="fade-up-3" style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", marginBottom: 52 }}>
          23 North 900 West · Salt Lake City, Utah
        </div>

        <div className="fade-up-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/menu" style={{
            display: "inline-block", background: "var(--gold)", color: "var(--ink)",
            padding: "15px 40px", fontSize: 12, letterSpacing: "0.14em",
            textTransform: "uppercase", fontWeight: 500, borderRadius: 2
          }}>
            Order Now
          </Link>
          <Link href="/admin" style={{
            display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.35)",
            padding: "15px 40px", fontSize: 12, letterSpacing: "0.14em",
            textTransform: "uppercase", fontWeight: 400, borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            Kitchen
          </Link>
        </div>

        <div className="fade-up-4" style={{ display: "flex", gap: 60, marginTop: 80, paddingTop: 60, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { value: "4.7★", label: "Rating" },
            { value: "$0", label: "Delivery fee" },
            { value: "5PM–12AM", label: "Hours" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "var(--gold2)", marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
        <span>© 2025 Sha Muu</span>
        <span>23 N 900 W, Salt Lake City, UT 84116</span>
      </div>
    </div>
  );
}
