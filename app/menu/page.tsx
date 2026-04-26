"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type MenuItem = { id: string; name: string; price: number; description?: string; emoji: string; category: string; available: boolean };
type CartItem = { name: string; price: number; emoji: string };

const CATEGORIES = ["Appetizers","Special Rolls","Deep Fried Sushi Rolls","Fusion Bowls","Nigiri","Regular Rolls","Bento Box","Fried Rice & Noodle","Noodle Soup & Salad","Salad & Sides","Rice Bowls","Beverages","Dessert"];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Appetizers": "Start your meal right",
  "Special Rolls": "Chef's signature creations",
  "Deep Fried Sushi Rolls": "Golden, crispy perfection",
  "Fusion Bowls": "East meets West in a bowl",
  "Nigiri": "Simply fish on rice",
  "Regular Rolls": "Classic favourites",
  "Bento Box": "A complete meal",
  "Fried Rice & Noodle": "Wok-tossed to order",
  "Noodle Soup & Salad": "Burmese soul food",
  "Salad & Sides": "Fresh accompaniments",
  "Rice Bowls": "Burmese curry over rice",
  "Beverages": "Drinks & bubble tea",
  "Dessert": "Sweet endings",
};

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Appetizers");
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(data => {
      const available = data.filter((i: MenuItem) => i.available);
      setItems(available);
      const firstCat = CATEGORIES.find(c => available.some((i: MenuItem) => i.category === c));
      if (firstCat) setActiveCategory(firstCat);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => { isDragging.current = true; startX.current = e.pageX - el.offsetLeft; scrollLeftRef.current = el.scrollLeft; el.style.cursor = "grabbing"; };
    const onUp = () => { isDragging.current = false; if (tabsRef.current) tabsRef.current.style.cursor = "grab"; };
    const onMove = (e: MouseEvent) => { if (!isDragging.current) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeftRef.current - (x - startX.current); };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);

  const add = (item: MenuItem) => {
    setCart(c => [...c, { name: item.name, price: item.price, emoji: item.emoji }]);
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 700);
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
    <div style={{ minHeight: "100vh", background: "#0a0906", fontFamily: "var(--sans)", color: "#faf8f4", position: "relative" }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 400, background: "radial-gradient(ellipse at 50% -20%, rgba(196,150,90,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,9,6,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(196,150,90,0.12)", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 13, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold2)" }}>
            SHA MUU
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", display: "none" }}>
              Sushi & Burmese Fusion
            </span>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: cart.length > 0 ? "var(--gold)" : "rgba(255,255,255,0.06)",
                color: cart.length > 0 ? "#0a0906" : "rgba(255,255,255,0.4)",
                border: cart.length > 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24, padding: cart.length > 0 ? "10px 22px" : "10px 20px",
                fontSize: 12, letterSpacing: "0.06em", cursor: "pointer",
                fontFamily: "var(--sans)", fontWeight: cart.length > 0 ? 600 : 400,
                transition: "all 0.3s",
              }}
            >
              <span style={{ fontSize: 14 }}>🛒</span>
              {cart.length > 0 ? `${cart.length} item${cart.length > 1 ? "s" : ""} · $${total.toFixed(2)}` : "Cart"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div style={{ position: "relative", zIndex: 1, padding: "48px 40px 0", background: "linear-gradient(180deg, rgba(196,150,90,0.04) 0%, transparent 100%)" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12, opacity: 0.7 }}>
            ✦ Order Online · 23 N 900 W · Salt Lake City ✦
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", color: "#faf8f4" }}>
            Fresh. Authentic.<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Unforgettable.</em>
          </h1>
        </div>

        {/* Category tabs */}
        <div
          ref={tabsRef}
          style={{ display: "flex", overflowX: "scroll", cursor: "grab", userSelect: "none", gap: 4, paddingBottom: 0, marginLeft: -40, marginRight: -40, paddingLeft: 40 }}
        >
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                background: activeCategory === cat ? "var(--gold)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat ? "#0a0906" : "rgba(255,255,255,0.45)",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: "10px 20px",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontWeight: activeCategory === cat ? 600 : 400,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                marginBottom: 24,
              }}
            >
              {cat}
            </button>
          ))}
          <div style={{ flexShrink: 0, width: 40 }} />
        </div>
      </div>

      {/* Category header */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 40px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, color: "#faf8f4", letterSpacing: "-0.01em" }}>
            {activeCategory}
          </h2>
          <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
            {CATEGORY_DESCRIPTIONS[activeCategory]}
          </span>
        </div>
        <div style={{ width: 48, height: 1, background: "var(--gold)", marginTop: 12, opacity: 0.6 }} />
      </div>

      {/* Menu grid */}
      <div style={{ position: "relative", zIndex: 1, padding: "40px 40px 120px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>Loading menu...</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 2 }}>
            {currentItems.map((item, idx) => {
              const isHovered = hoveredItem === item.id;
              const isAdded = justAdded === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: isHovered ? "rgba(196,150,90,0.06)" : "rgba(255,255,255,0.02)",
                    border: isAdded ? "1px solid rgba(196,150,90,0.8)" : isHovered ? "1px solid rgba(196,150,90,0.25)" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "24px",
                    display: "flex",
                    gap: 18,
                    transition: "all 0.25s",
                    transform: isAdded ? "scale(1.02)" : "scale(1)",
                    cursor: "default",
                    animation: `fadeUp 0.5s ${idx * 0.03}s ease both`,
                  }}
                >
                  {/* Emoji */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 14,
                    background: isHovered ? "rgba(196,150,90,0.12)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(196,150,90,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, flexShrink: 0,
                    transition: "all 0.25s",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}>
                    {item.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: "#faf8f4", marginBottom: 4, lineHeight: 1.25, fontWeight: 400 }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14, lineHeight: 1.6 }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: item.description ? 0 : 14 }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 20, color: isHovered ? "var(--gold3)" : "var(--gold2)", fontWeight: 300, transition: "color 0.2s" }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => add(item)}
                        style={{
                          background: isAdded ? "var(--gold)" : isHovered ? "rgba(196,150,90,0.2)" : "rgba(196,150,90,0.08)",
                          color: isAdded ? "#0a0906" : "var(--gold2)",
                          border: `1px solid ${isAdded ? "var(--gold)" : "rgba(196,150,90,0.3)"}`,
                          borderRadius: 10,
                          padding: "9px 20px",
                          fontSize: 11,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          fontFamily: "var(--sans)",
                          fontWeight: 600,
                          transition: "all 0.2s",
                          minWidth: 90,
                        }}
                      >
                        {isAdded ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart */}
      {cart.length > 0 && !cartOpen && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 150, animation: "scaleIn 0.3s ease" }}>
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: "linear-gradient(135deg, var(--gold) 0%, #e0a060 100%)",
              color: "#0a0906",
              border: "none",
              borderRadius: 32,
              padding: "16px 36px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              boxShadow: "0 12px 40px rgba(196,150,90,0.5), 0 4px 12px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>🛒</span>
            <span>View Order</span>
            <span style={{ background: "rgba(0,0,0,0.15)", borderRadius: 12, padding: "2px 10px" }}>${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 400, background: "#100e0a", borderLeft: "1px solid rgba(196,150,90,0.15)", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease" }}>

            {/* Cart header */}
            <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 300, color: "#faf8f4" }}>Your Order</div>
                <button onClick={() => setCartOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.4)", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🛒</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Nothing added yet</div>
                </div>
              ) : cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(196,150,90,0.08)", border: "1px solid rgba(196,150,90,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "#faf8f4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "var(--gold2)", marginTop: 2 }}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => remove(idx)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", width: 28, height: 28, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>

            {/* Checkout */}
            {cart.length > 0 && (
              <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Total</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "var(--gold2)" }}>${total.toFixed(2)}</span>
                </div>
                <button onClick={checkout} style={{ width: "100%", background: "linear-gradient(135deg, var(--gold) 0%, #e0a060 100%)", color: "#0a0906", border: "none", borderRadius: 12, padding: "18px 0", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", boxShadow: "0 8px 24px rgba(196,150,90,0.3)" }}>
                  Proceed to Checkout →
                </button>
                <button onClick={() => setCartOpen(false)} style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.2)", border: "none", padding: "14px 0", fontSize: 11, cursor: "pointer", fontFamily: "var(--sans)", marginTop: 8, letterSpacing: "0.08em" }}>
                  Continue Ordering
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
