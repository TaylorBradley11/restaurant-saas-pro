"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "shamuu2025";

type Order = { id: string; status: string; total: number; items: { name: string; price: number }[]; createdAt: string };

const COLS = [
  { key: "received",  label: "New",       color: "#b8966e" },
  { key: "preparing", label: "Preparing", color: "#4a90d9" },
  { key: "ready",     label: "Ready",     color: "#2d8a4e" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("shamuu-admin") === ADMIN_PASSWORD) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const res = await fetch("/api/admin/orders");
      setOrders(await res.json());
      setLastUpdate(new Date().toLocaleTimeString());
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [authed]);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("shamuu-admin", pw);
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const update = async (id: string, status: string) => {
    await fetch(`/api/order/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
  };

  const byStatus = (s: string) => orders.filter(o => o.status === s);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${pwError ? "#8b1a1a" : "rgba(255,255,255,0.1)"}`,
    color: "#faf8f4",
    padding: "14px 18px",
    fontSize: 14,
    fontFamily: "var(--sans)",
    outline: "none",
    borderRadius: 2,
    marginBottom: 12,
  };

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)" }}>
      <div style={{ width: 320, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "#d4b896", marginBottom: 8 }}>SHA MUU</div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 40 }}>Kitchen Access</div>
        <input
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          style={inputStyle}
        />
        {pwError && <div style={{ fontSize: 12, color: "#8b1a1a", marginBottom: 12, letterSpacing: "0.04em" }}>Incorrect password</div>}
        <button onClick={login} style={{ width: "100%", background: "#b8966e", color: "#0f0e0c", border: "none", padding: "14px 0", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", fontFamily: "var(--sans)", borderRadius: 2 }}>
          Enter Kitchen
        </button>
        <div style={{ marginTop: 24 }}>
          <Link href="/admin/menu" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            Menu Manager →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "#faf8f4", fontFamily: "var(--sans)" }}>

      <nav style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, letterSpacing: "0.08em", color: "#d4b896" }}>SHA MUU</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/admin/menu" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Menu Manager</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2d8a4e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              Kitchen Live {lastUpdate && `· ${lastUpdate}`}
            </span>
          </div>
        </div>
      </nav>

      <div style={{ padding: "40px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 300, marginBottom: 8 }}>Kitchen</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 40, letterSpacing: "0.06em" }}>
          {orders.filter(o => o.status !== "done").length} active orders · auto-refreshes every 3s
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.04)" }}>
          {COLS.map(col => (
            <div key={col.key} style={{ background: "var(--ink)" }}>
              <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{col.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{byStatus(col.key).length}</span>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 220 }}>
                {byStatus(col.key).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.12)", fontSize: 12 }}>No orders</div>
                ) : byStatus(col.key).map(order => (
                  <div key={order.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>#{order.id.slice(0, 6).toUpperCase()}</span>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 14, color: "#d4b896" }}>${order.total.toFixed(2)}</span>
                    </div>
                    {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                      <div key={i} style={{ fontFamily: "var(--serif)", fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 3 }}>{item.name}</div>
                    ))}
                    <div style={{ marginTop: 14 }}>
                      {col.key === "received" && (
                        <button onClick={() => update(order.id, "preparing")} style={{ width: "100%", background: "rgba(74,144,217,0.12)", color: "#4a90d9", border: "1px solid rgba(74,144,217,0.25)", padding: "8px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)" }}>
                          Start Preparing
                        </button>
                      )}
                      {col.key === "preparing" && (
                        <button onClick={() => update(order.id, "ready")} style={{ width: "100%", background: "rgba(45,138,78,0.12)", color: "#2d8a4e", border: "1px solid rgba(45,138,78,0.25)", padding: "8px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)" }}>
                          Mark Ready
                        </button>
                      )}
                      {col.key === "ready" && (
                        <button onClick={() => update(order.id, "done")} style={{ width: "100%", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.07)", padding: "8px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)" }}>
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
