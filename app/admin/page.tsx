"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = { id: string; status: string; total: number; items: { name: string; price: number }[]; createdAt: string };

const COLS = [
  { key: "received",  label: "New",       color: "#b8966e" },
  { key: "preparing", label: "Preparing", color: "#4a90d9" },
  { key: "ready",     label: "Ready",     color: "#2d8a4e" },
];

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/orders");
      setOrders(await res.json());
      setLastUpdate(new Date().toLocaleTimeString());
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const update = async (id: string, status: string) => {
    await fetch(`/api/order/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
  };

  const byStatus = (s: string) => orders.filter(o => o.status === s);

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--sans)" }}>

      <nav style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, letterSpacing: "0.08em", color: "var(--gold2)" }}>
          SHA MUU
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2d8a4e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            Kitchen Live {lastUpdate && `· ${lastUpdate}`}
          </span>
        </div>
      </nav>

      <div style={{ padding: "40px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 300, marginBottom: 8, letterSpacing: "-0.01em" }}>
          Kitchen
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 40, letterSpacing: "0.06em" }}>
          {orders.filter(o => o.status !== "done").length} active orders · auto-refreshes every 3s
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(255,255,255,0.04)" }}>
          {COLS.map(col => (
            <div key={col.key} style={{ background: "var(--ink)" }}>
              {/* Column header */}
              <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{col.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{byStatus(col.key).length}</span>
              </div>

              {/* Tickets */}
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 220 }}>
                {byStatus(col.key).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.12)", fontSize: 12, letterSpacing: "0.06em" }}>
                    No orders
                  </div>
                ) : byStatus(col.key).map(order => (
                  <div key={order.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", fontFamily: "var(--sans)" }}>
                        #{order.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--gold2)" }}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                      <div key={i} style={{ fontFamily: "var(--serif)", fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 3 }}>
                        {item.name}
                      </div>
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
