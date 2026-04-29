"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type MenuItem = { id: string; name: string; price: number; description?: string; emoji: string; category: string; available: boolean };
type CartItem = { name: string; price: number; emoji: string };

const CATEGORIES = ["Appetizers","Special Rolls","Deep Fried Sushi Rolls","Fusion Bowls","Nigiri","Regular Rolls","Bento Box","Fried Rice & Noodle","Noodle Soup & Salad","Salad & Sides","Rice Bowls","Beverages","Dessert"];

// Free Unsplash images for each category
const CAT_IMAGES: Record<string, string> = {
  "Appetizers": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80",
  "Special Rolls": "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=80",
  "Deep Fried Sushi Rolls": "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=1200&q=80",
  "Fusion Bowls": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
  "Nigiri": "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=1200&q=80",
  "Regular Rolls": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1200&q=80",
  "Bento Box": "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=1200&q=80",
  "Fried Rice & Noodle": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&q=80",
  "Noodle Soup & Salad": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80",
  "Salad & Sides": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  "Rice Bowls": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80",
  "Beverages": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "Dessert": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80",
};

const CAT_META: Record<string, { desc: string; accent: string }> = {
  "Appetizers":             { desc: "Start your journey", accent: "#c4965a" },
  "Special Rolls":          { desc: "Chef's signatures", accent: "#e05a5a" },
  "Deep Fried Sushi Rolls": { desc: "Golden & crispy", accent: "#d4a030" },
  "Fusion Bowls":           { desc: "East meets West", accent: "#5ab4c4" },
  "Nigiri":                 { desc: "Simply fish on rice", accent: "#c4965a" },
  "Regular Rolls":          { desc: "Classic favourites", accent: "#7ab85a" },
  "Bento Box":              { desc: "A complete meal", accent: "#a05ac4" },
  "Fried Rice & Noodle":    { desc: "Wok-tossed to order", accent: "#c4965a" },
  "Noodle Soup & Salad":    { desc: "Burmese soul food", accent: "#5a7ec4" },
  "Salad & Sides":          { desc: "Fresh accompaniments", accent: "#7ab85a" },
  "Rice Bowls":             { desc: "Burmese curry bowls", accent: "#c47a5a" },
  "Beverages":              { desc: "Drinks & bubble tea", accent: "#c45a9a" },
  "Dessert":                { desc: "Sweet endings", accent: "#d4a030" },
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
    const onMove = (e: MouseEvent) => { if (!isDragging.current) return; e.preventDefault(); el.scrollLeft = scrollLeftRef.current - (e.pageX - el.offsetLeft - startX.current); };
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
  const accent = CAT_META[activeCategory]?.accent || "#c4965a";
  const heroImage = CAT_IMAGES[activeCategory] || CAT_IMAGES["Appetizers"];

  return (
    <div style={{ minHeight: "100vh", background: "#080706", fontFamily: "var(--sans)", color: "#faf8f4" }}>

      {/* Sticky Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,7,6,0.96)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e0bc8a" }}>SHA MUU</Link>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Online Order</span>
          </div>
          <button onClick={() => setCartOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: cart.length > 0 ? accent : "rgba(255,255,255,0.05)", color: cart.length > 0 ? "#080706" : "rgba(255,255,255,0.35)", border: cart.length > 0 ? "none" : "1px solid rgba(255,255,255,0.08)", borderRadius: 32, padding: "10px 22px", fontSize: 12, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: cart.length > 0 ? 700 : 400, transition: "all 0.3s", boxShadow: cart.length > 0 ? `0 4px 20px ${accent}50` : "none" }}>
            <span>🛒</span>
            {cart.length > 0 ? <><span>{cart.length} item{cart.length > 1 ? "s" : ""}</span><span style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "2px 10px" }}>${total.toFixed(2)}</span></> : <span>Cart</span>}
          </button>
        </div>
      </nav>

      {/* Full-width hero banner — changes with category */}
      <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
        <img
          src={heroImage}
          alt={activeCategory}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "opacity 0.5s", filter: "brightness(0.45) saturate(0.9)" }}
        />
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,7,6,0.2) 0%, rgba(8,7,6,0.95) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}20 0%, transparent 60%)` }} />

        {/* Hero text */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 32px", maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 1, background: accent }} />
              <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: accent }}>Sha Muu · 23 N 900 W · Salt Lake City</span>
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#faf8f4", marginBottom: 16 }}>
              Fresh &amp; <em style={{ color: accent, fontStyle: "italic", transition: "color 0.4s" }}>Authentic</em>
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
              Sushi · Burmese Cuisine · Asian Fusion
            </p>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background: "#080706", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 64, zIndex: 90 }}>
        <div
          ref={tabsRef}
          style={{ display: "flex", gap: 8, overflowX: "scroll", cursor: "grab", userSelect: "none", padding: "16px 40px" }}
        >
          {availableCategories.map(cat => {
            const isActive = activeCategory === cat;
            const catAccent = CAT_META[cat]?.accent || "#c4965a";
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flexShrink: 0, background: isActive ? catAccent : "rgba(255,255,255,0.04)", color: isActive ? "#080706" : "rgba(255,255,255,0.4)", border: isActive ? "none" : "1px solid rgba(255,255,255,0.07)", borderRadius: 32, padding: "10px 20px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: isActive ? 700 : 400, whiteSpace: "nowrap", transition: "all 0.22s", boxShadow: isActive ? `0 4px 16px ${catAccent}50` : "none" }}>
                {cat}
              </button>
            );
          })}
          <div style={{ flexShrink: 0, width: 32 }} />
        </div>
      </div>

      {/* Category title + count */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300, color: "#faf8f4", letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 6 }}>
            {activeCategory}
          </h2>
          <p style={{ fontFamily: "var(--serif)", fontSize: 16, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            {CAT_META[activeCategory]?.desc}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>{currentItems.length} items</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ height: 1, background: `linear-gradient(to right, ${accent}60, transparent)` }} />
      </div>

      {/* Menu items grid */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px 160px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "120px 0" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "rgba(255,255,255,0.1)", fontStyle: "italic" }}>Loading...</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
            {currentItems.map((item, idx) => {
              const isHovered = hoveredItem === item.id;
              const isAdded = justAdded === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    background: isHovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: isAdded ? `1px solid ${accent}` : isHovered ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 20,
                    padding: "24px 26px",
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                    transition: "all 0.22s",
                    transform: isAdded ? "scale(1.015)" : "scale(1)",
                    boxShadow: isAdded ? `0 0 0 3px ${accent}25, 0 12px 40px rgba(0,0,0,0.4)` : isHovered ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
                    animation: `fadeUp 0.45s ${Math.min(idx * 0.035, 0.4)}s ease both`,
                  }}
                >
                  {/* Emoji box */}
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: isHovered ? `${accent}20` : "rgba(255,255,255,0.04)", border: `1px solid ${isHovered ? accent + "50" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, transition: "all 0.22s", transform: isHovered ? "scale(1.08) rotate(-4deg)" : "scale(1)" }}>
                    {item.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: isHovered ? "#fff" : "#faf8f4", marginBottom: 6, lineHeight: 1.2, transition: "color 0.2s" }}>
                      {item.name}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginBottom: 16, lineHeight: 1.65, letterSpacing: "0.01em" }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: item.description ? 0 : 16 }}>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: isHovered ? accent : "#c4965a", fontWeight: 300, transition: "color 0.2s" }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => add(item)}
                        style={{ background: isAdded ? accent : isHovered ? `${accent}22` : "rgba(255,255,255,0.05)", color: isAdded ? "#080706" : isHovered ? accent : "rgba(255,255,255,0.45)", border: `1px solid ${isAdded ? accent : isHovered ? accent + "60" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "10px 22px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 700, transition: "all 0.2s", minWidth: 100, boxShadow: isAdded ? `0 4px 16px ${accent}50` : "none" }}
                      >
                        {isAdded ? "✓ Added!" : "+ Add"}
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
        <div style={{ position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 150 }}>
          <button onClick={() => setCartOpen(true)} style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, color: "#080706", border: "none", borderRadius: 40, padding: "17px 40px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "var(--sans)", boxShadow: `0 16px 48px ${accent}60, 0 4px 16px rgba(0,0,0,0.5)`, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12, animation: "scaleIn 0.3s ease" }}>
            <span style={{ fontSize: 18 }}>🛒</span>
            <span>View Order</span>
            <span style={{ background: "rgba(0,0,0,0.18)", borderRadius: 14, padding: "3px 12px", fontSize: 12 }}>${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 420, background: "#0d0b08", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease" }}>
            <div style={{ padding: "32px 36px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, color: "#faf8f4", lineHeight: 1, marginBottom: 6 }}>Your Order</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>{cart.length} item{cart.length !== 1 ? "s" : ""} · Sha Muu</div>
                </div>
                <button onClick={() => setCartOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", width: 36, height: 36, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px 36px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.2 }}>🛒</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>Nothing added yet</div>
                </div>
              ) : cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "#faf8f4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: "#c4965a" }}>${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => remove(idx)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", width: 30, height: 30, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "24px 36px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Order Total</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 300, color: "#e0bc8a", lineHeight: 1 }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginBottom: 24, textAlign: "right" }}>+ tax at checkout</div>
                <button onClick={checkout} style={{ width: "100%", background: "linear-gradient(135deg, #c4965a 0%, #e0a060 100%)", color: "#080706", border: "none", borderRadius: 14, padding: "20px 0", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", boxShadow: "0 8px 32px rgba(196,150,90,0.4)", marginBottom: 12 }}>
                  Proceed to Checkout →
                </button>
                <button onClick={() => setCartOpen(false)} style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 0", fontSize: 11, cursor: "pointer", fontFamily: "var(--sans)", letterSpacing: "0.08em" }}>
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
