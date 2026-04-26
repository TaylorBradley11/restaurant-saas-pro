"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "shamuu2025";

const CATEGORIES = ["Appetizers", "Sushi Rolls", "Bowls", "Burmese & Asian", "Curry", "Drinks"];
const EMOJIS = ["🍣","🍤","🥟","🌯","🍜","🍝","🍛","🍲","🥣","🥩","🥗","🍗","🫘","🍵","🧋","🥭","🥤","💧","🌈","🍱","🍽️"];

type MenuItem = {
  id: string; name: string; description?: string; price: number;
  category: string; emoji: string; available: boolean;
};

type Form = {
  name: string; description: string; price: string;
  category: string; emoji: string; available: boolean;
};

const EMPTY_FORM: Form = { name: "", description: "", price: "", category: "Appetizers", emoji: "🍽️", available: true };

const BTN = (extra: React.CSSProperties = {}) => ({
  border: "none", cursor: "pointer", fontFamily: "var(--sans)",
  fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const,
  padding: "9px 18px", ...extra
});

export default function MenuManager() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (sessionStorage.getItem("shamuu-admin") === ADMIN_PASSWORD) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/menu").then(r => r.json()).then(data => { setItems(data); setLoading(false); });
  }, [authed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("shamuu-admin", pw);
      setAuthed(true);
    } else {
      setPwError(true);
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description || "", price: String(item.price), category: item.category, emoji: item.emoji, available: item.available });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const save = async () => {
    if (!form.name || !form.price || !form.category) return;
    setSaving(true);
    if (editId) {
      const res = await fetch(`/api/menu/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setItems(items.map(i => i.id === editId ? updated : i));
      showToast("Item updated");
      setEditId(null);
    } else {
      const res = await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const created = await res.json();
      setItems([...items, created]);
      showToast("Item added");
    }
    setForm(EMPTY_FORM);
    setSaving(false);
  };

  const toggleAvailable = async (item: MenuItem) => {
    const res = await fetch(`/api/menu/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ available: !item.available }) });
    const updated = await res.json();
    setItems(items.map(i => i.id === item.id ? updated : i));
    showToast(updated.available ? "Item enabled" : "Item hidden from menu");
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    setDeleteConfirm(null);
    showToast("Item deleted");
  };

  const filtered = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#faf8f4", padding: "11px 14px", fontSize: 13, fontFamily: "var(--sans)",
    outline: "none", borderRadius: 2
  };

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 320, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "#d4b896", marginBottom: 8 }}>SHA MUU</div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 40 }}>Menu Manager</div>
        <input type="password" placeholder="Enter password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
          style={{ ...inputStyle, marginBottom: 12, border: `1px solid ${pwError ? "#8b1a1a" : "rgba(255,255,255,0.1)"}` }} />
        {pwError && <div style={{ fontSize: 12, color: "#8b1a1a", marginBottom: 12 }}>Incorrect password</div>}
        <button onClick={login} style={{ ...BTN({ width: "100%", background: "#b8966e", color: "#0f0e0c", padding: "14px 0", fontWeight: 500 }) }}>Enter</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--sans)" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#2d8a4e", color: "#fff", padding: "12px 20px", fontSize: 13, zIndex: 100, borderRadius: 2, letterSpacing: "0.04em" }}>
          {toast}
        </div>
      )}

      {/* Nav */}
      <nav style={{ padding: "18px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "var(--ink)", zIndex: 40 }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 300, letterSpacing: "0.08em", color: "#d4b896" }}>SHA MUU</Link>
        <div style={{ display: "flex", gap: 24, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <Link href="/admin" style={{ color: "rgba(255,255,255,0.35)" }}>Kitchen</Link>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Menu Manager</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 300, marginBottom: 4 }}>Menu Manager</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 40, letterSpacing: "0.06em" }}>{items.length} items · changes go live instantly</p>

        {/* Form */}
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", padding: "28px 32px", marginBottom: 40 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
            {editId ? "✎ Editing item" : "+ Add new item"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 }}>Name *</label>
              <input style={inputStyle} placeholder="e.g. Dragon Roll" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 }}>Price *</label>
              <input style={inputStyle} placeholder="e.g. 15.95" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 }}>Description</label>
            <input style={inputStyle} placeholder="e.g. Avocado, shrimp, eel sauce" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 }}>Category *</label>
              <select style={{ ...inputStyle }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 }}>Emoji</label>
              <select style={{ ...inputStyle }} value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })}>
                {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={save} disabled={saving} style={BTN({ background: "#b8966e", color: "#0f0e0c", fontWeight: 500, padding: "11px 28px", opacity: saving ? 0.6 : 1 })}>
              {saving ? "Saving..." : editId ? "Save Changes" : "Add Item"}
            </button>
            {editId && (
              <button onClick={cancelEdit} style={BTN({ background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "11px 20px" })}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 32, overflowX: "auto" }}>
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: "none", border: "none", padding: "10px 16px", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              color: activeCategory === cat ? "#d4b896" : "rgba(255,255,255,0.3)",
              borderBottom: activeCategory === cat ? "2px solid #b8966e" : "2px solid transparent",
              fontFamily: "var(--sans)", whiteSpace: "nowrap"
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◯</div>
            <div style={{ fontSize: 13, letterSpacing: "0.06em" }}>No items yet — add your first item above</div>
          </div>
        ) : Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {cat} <span style={{ color: "rgba(255,255,255,0.15)", marginLeft: 6 }}>{catItems.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.04)" }}>
              {catItems.map(item => (
                <div key={item.id} style={{ background: "var(--ink)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, opacity: item.available ? 1 : 0.45 }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--paper)", marginBottom: 2 }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{item.description}</div>}
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#d4b896", flexShrink: 0, minWidth: 60, textAlign: "right" }}>
                    ${item.price.toFixed(2)}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleAvailable(item)} style={BTN({
                      background: item.available ? "rgba(45,138,78,0.12)" : "rgba(255,255,255,0.05)",
                      color: item.available ? "#2d8a4e" : "rgba(255,255,255,0.3)",
                      border: `1px solid ${item.available ? "rgba(45,138,78,0.25)" : "rgba(255,255,255,0.08)"}`,
                      padding: "7px 14px"
                    })}>
                      {item.available ? "Live" : "Hidden"}
                    </button>
                    <button onClick={() => startEdit(item)} style={BTN({ background: "rgba(184,150,110,0.1)", color: "#b8966e", border: "1px solid rgba(184,150,110,0.2)", padding: "7px 14px" })}>
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} style={BTN({ background: "rgba(139,26,26,0.1)", color: "#c0392b", border: "1px solid rgba(139,26,26,0.2)", padding: "7px 14px" })}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#1a1916", border: "1px solid rgba(255,255,255,0.1)", padding: "32px 36px", maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--paper)", marginBottom: 10 }}>Delete item?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => deleteItem(deleteConfirm)} style={BTN({ flex: 1, background: "#8b1a1a", color: "#fff", padding: "12px 0", fontWeight: 500 })}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={BTN({ flex: 1, background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 0" })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
