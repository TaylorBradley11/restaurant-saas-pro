"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STEPS = [
  { key: "received",  label: "Order Received",  desc: "We have your order" },
  { key: "preparing", label: "Being Prepared",  desc: "The kitchen is working on it" },
  { key: "ready",     label: "Ready",            desc: "Your order is ready for pickup" },
];

export default function Track({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("received");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/order/${params.id}`);
      const data = await res.json();
      if (data) { setOrder(data); setStatus(data.status); }
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [params.id]);

  const currentStep = STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--sans)", display: "flex", flexDirection: "column" }}>

      <nav style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, letterSpacing: "0.08em", color: "var(--gold2)" }}>
          SHA MUU
        </Link>
        <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
          Order Tracking
        </span>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 52 }}>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 300, marginBottom: 10, letterSpacing: "-0.01em" }}>
              {status === "ready" ? "Ready for pickup!" : status === "preparing" ? "Being prepared" : "Order received"}
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
              Order #{params.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 48 }}>
            {STEPS.map((step, idx) => {
              const done = idx < currentStep;
              const active = idx === currentStep;
              return (
                <div key={step.key} style={{ display: "flex", gap: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 13, flexShrink: 0,
                      background: done ? "var(--gold)" : active ? "rgba(184,150,110,0.12)" : "rgba(255,255,255,0.04)",
                      border: active ? "1px solid var(--gold)" : done ? "none" : "1px solid rgba(255,255,255,0.07)",
                      color: done ? "var(--ink)" : active ? "var(--gold)" : "rgba(255,255,255,0.15)",
                      fontWeight: done ? 600 : 400
                    }}>
                      {done ? "✓" : idx + 1}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div style={{ width: 1, height: 36, background: done ? "var(--gold)" : "rgba(255,255,255,0.07)", margin: "6px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: idx < STEPS.length - 1 ? 12 : 0, paddingTop: 6 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: active ? "var(--paper)" : done ? "var(--gold2)" : "rgba(255,255,255,0.2)", marginBottom: 3 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: active ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)" }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          {order && Array.isArray(order.items) && (
            <div style={{ border: "1px solid rgba(255,255,255,0.07)", padding: "24px 28px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 18 }}>
                Your Order
              </div>
              {order.items.map((item: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                  <span style={{ fontFamily: "var(--serif)", color: "rgba(255,255,255,0.6)" }}>{item.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>${item.price?.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, color: "var(--gold2)" }}>
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 36, textAlign: "center" }}>
            <Link href="/menu" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
              ← Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
