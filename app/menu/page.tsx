"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type MenuItem = { id: string; name: string; price: number; description?: string; emoji: string; category: string; available: boolean };
type CartItem = { name: string; price: number; emoji: string };

const CATEGORIES = ["Appetizers","Special Rolls","Deep Fried Sushi Rolls","Fusion Bowls","Nigiri","Regular Rolls","Bento Box","Fried Rice & Noodle","Noodle Soup & Salad","Salad & Sides","Rice Bowls","Beverages","Dessert"];

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(data => {
      const available = data.filter((i: MenuItem) => i.available);
      setItems(available);
      const firstCat = CATEGORIES.find(c => available.some((i: MenuItem) => i.category === c));
      if (firstCat) setActiveCategory(firstCat);
      setLoading(false);
    });
  }, []);

  // Mouse drag scroll for tabs
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => { isDragging.current = true; startX.current = e.pageX - el.offsetLeft; scrollLeft.current = el.scrollLeft; el.style.cursor = "grabbing"; };
    const onUp = () => { isDragging.current = false; el.style.cursor = "grab"; };
    const onMove = (e: MouseEvent) => { if (!isDragging.current) return; e.preventDefault(); el.scrollLeft = scrollLeft.current - (e.pageX - el.offsetLeft - startX.current); };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);

  const add = (item: MenuItem) => {
    setCart(c => [...c, { name: item.name, price: item.price, emoji: item.emoji }]);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 600);
  };

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
    <div style={{ minHeight: "100vh", background: "#0f0e0c", fontFamily: "var(--sans)", color: "#faf8f4" }}>

      {/* Nav */}
      <nav style={{ background: "rgba(15,14,12,0.97)", backdropFilter: "blur(12px)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(184,150,110,0.15)" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 300, letterSpacing: "0.08em", color: "#d4b896" }}>SHA MUU</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Sushi & Burmese Asian Fusion</span>
          <button onClick={() => setCartOpen(true)} style={{ background: cart.length > 0 ? "#b8966e" : "rgba(255,255,255,0.07)", color: cart.length > 0 ? "#0f0e0c" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 20, padding: "8px 18px", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 500, transition: "all 0.2s" }}>
            🛒 {cart.length > 0 ? `${cart.length} item${cart.length > 1 ? "s" : ""} · $${total.toFixed(2)}` : "Cart"}
          </button>
        </div>
      </nav>

      {/* Header + tabs */}
      <div style={{ background: "linear-gradient(135deg, #1a1510 0%, #0f0e0c 100%)", paddingTop: 24 }}>
        <div style={{ padding: "0 32px", marginBottom: 20 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 13, fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8966e", marginBottom: 4 }}>Order Online</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>23 North 900 West · Salt Lake City · Free delivery</p>
        </div>

        {/* Tabs — ref-based scroll, no CSS overflow tricks */}
        <div
          ref={tabsRef}
          style={{ display: "flex", overflowX: "scroll", borderBottom: "1px solid rgba(184,150,110,0.12)", cursor: "grab", userSelect: "none", paddingLeft: 32 }}
        >
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ flexShrink: 0, background: "none", border: "none", borderBottom: activeCategory === cat ? "2px solid #b8966e" : "2px solid transparent", padding: "12px 20px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", color: activeCategory === cat ? "#d4b896" : "rgba(255,255,255,0.3)", fontFamily: "var(--sans)", whiteSpace: "nowrap", transition: "color 0.15s", marginBottom: -1 }}
            >
              {cat}
            </button>
          ))}
          <div style={{ flexShrink: 0, width: 32 }} />
        </div>
      </div>

      {/* Items */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 300, color: "#faf8f4", marginBottom: 4 }}>{activeCategory}</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", marginBottom: 32 }}>{currentItems.length} items available</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>Loading menu...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {currentItems.map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: justAdded === item.id ? "1px solid rgba(184,150,110,0.7)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", display: "flex", gap: 16, alignItems: "flex-start", transition: "border 0.2s, transform 0.15s", transform: justAdded === item.id ? "scale(1.02)" : "scale(1)" }}>
                <div style={{ width: 58, height: 58, borderRadius: 12, background: "rgba(184,150,110,0.08)", border: "1px solid rgba(184,150,110,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#faf8f4", marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 10, lineHeight: 1.5 }}>{item.description}</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 17, color: "#d4b896" }}>${item.price.toFixed(2)}</span>
                    <button onClick={() => add(item)} style={{ background: justAdded === item.id ? "#d4b896" : "rgba(184,150,110,0.12)", color: justAdded === item.id ? "#0f0e0c" : "#b8966e", border: "1px solid rgba(184,150,110,0.3)", borderRadius: 8, padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 500, transition: "all 0.15s" }}>
                      {justAdded === item.id ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating cart */}
      {cart.length > 0 && !cartOpen && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 150 }}>
          <button onClick={() => setCartOpen(true)} style={{ background: "#b8966e", color: "#0f0e0c", border: "none", borderRadius: 30, padding: "14px 32px", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "var(--sans)", boxShadow: "0 8px 32px rgba(184,150,110,0.5)", whiteSpace: "nowrap" }}>
            🛒 View Order · ${total.toFixed(2)}
          </button>
        </div>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 380, background: "#141210", borderLeft: "1px solid rgba(184,150,110,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 300, color: "#faf8f4" }}>Your Order</div>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 26, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
                  <div style={{ fontSize: 13, letterSpacing: "0.08em" }}>Nothing added yet</div>
                </div>
              ) : cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(184,150,110,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: "#faf8f4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#b8966e", marginTop: 2 }}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => remove(idx)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 22, cursor: "pointer", flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Total</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "#d4b896" }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={checkout} style={{ width: "100%", background: "#b8966e", color: "#0f0e0c", border: "none", borderRadius: 10, padding: "16px 0", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)" }}>
                  Checkout →
                </button>
                <button onClick={() => setCartOpen(false)} style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.2)", border: "none", padding: "12px 0", fontSize: 11, cursor: "pointer", fontFamily: "var(--sans)", marginTop: 8 }}>
                  Continue ordering
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
