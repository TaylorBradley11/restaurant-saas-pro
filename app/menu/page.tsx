"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type MenuItem = { id: string; name: string; price: number; description?: string; emoji: string; category: string; available: boolean };
type CartItem = { name: string; price: number; emoji: string };

const CATEGORIES = ["Appetizers", "Sushi Rolls", "Bowls", "Burmese & Asian", "Curry", "Drinks"];

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then(r => r.json())
      .then(data => {
        const available = data.filter((i: MenuItem) => i.available);
        setItems(available);
        if (available.length > 0) {
          const firstCat = CATEGORIES.find(c => available.some((i: MenuItem) => i.category === c));
          if (firstCat) setActiveCategory(firstCat);
        }
        setLoading(false);
      });
  }, []);

  const add = (item: MenuItem) => setCart(c => [...c, { name: item.name, price: item.price, emoji: item.emoji }]);
  const remove = (index: number) => setCart(c => c.filter((_, i) => i !== index));
  const total = cart.reduce((s, i) => s + i.price, 0);

  const checkout = async () => {
    const res = await fetch("/api/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart })
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const availableCategories = CATEGORIES.filter(c => items.some(i => i.category === c));
  const currentItems = items.filter(i => i.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--sans)" }}>

      <nav style={{ background: "var(--ink)", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, letterSpacing: "0.08em", color: "var(--gold2)" }}>SHA MUU</Link>
        <span style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Sushi & Burmese Asian Fusion</span>
      </nav>

      <div style={{ background: "var(--ink)", borderBottom: "1px solid rgba(255,255,255,0.07)", overflowX: "auto", whiteSpace: "nowrap", padding: "0 40px", display: "flex" }}>
        {availableCategories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: "none", border: "none", padding: "14px 18px", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
            color: activeCategory === cat ? "var(--gold2)" : "rgba(255,255,255,0.3)",
            borderBottom: activeCategory === cat ? "2px solid var(--gold)" : "2px solid transparent",
            fontFamily: "var(--sans)", whiteSpace: "nowrap", transition: "color 0.2s"
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ flex: 1, padding: "40px" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "var(--ink)", marginBottom: 6 }}>{activeCategory}</h1>
          <p style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 32, letterSpacing: "0.06em" }}>{currentItems.length} items</p>

          {loading ? (
            <div style={{ color: "var(--ink3)", fontSize: 13, letterSpacing: "0.06em" }}>Loading menu...</div>
          ) : currentItems.length === 0 ? (
            <div style={{ color: "var(--ink3)", fontSize: 13 }}>No items in this category yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "var(--paper3)" }}>
              {currentItems.map((item) => (
                <div key={item.id} style={{ background: "var(--paper)", padding: "22px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 30, flexShrink: 0, marginTop: 2 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 12, lineHeight: 1.5 }}>{item.description}</div>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: item.description ? 0 : 12 }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink2)" }}>${item.price.toFixed(2)}</span>
                      <button onClick={() => add(item)} style={{ background: "var(--ink)", color: "var(--paper)", border: "none", padding: "8px 18px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)" }}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 320, borderLeft: "1px solid var(--paper3)", background: "var(--paper)", padding: "40px 28px", position: "sticky", top: "97px", height: "calc(100vh - 97px)", overflowY: "auto", alignSelf: "flex-start" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, color: "var(--ink)", marginBottom: 28 }}>
            Your Order <span style={{ fontSize: 14, color: "var(--ink3)", fontFamily: "var(--sans)", fontWeight: 300 }}>({cart.length})</span>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--ink3)" }}>
              <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.3 }}>◯</div>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Nothing added yet</div>
            </div>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid var(--paper3)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink3)" }}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => remove(idx)} style={{ background: "none", border: "none", color: "var(--ink3)", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: "0 4px" }}>×</button>
                </div>
              ))}
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--paper3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink3)" }}>Total</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "var(--ink)" }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={checkout} style={{ width: "100%", background: "var(--gold)", color: "var(--ink)", border: "none", padding: "16px 0", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", fontFamily: "var(--sans)" }}>
                  Checkout →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
