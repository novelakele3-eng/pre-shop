import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Crown, Droplets, Flame, Flower2, Gem, Gift, Heart, ImageIcon, Languages, Leaf, Lock, Minus, Moon, MousePointerClick, Plus, ReceiptText, Search, Send, ShieldCheck, ShoppingBag, Sparkles, SprayCan, Star, Sun, Truck, Wind, X } from "lucide-react";
import { categories, products } from "./data/products";
import type { CartItem } from "./types";
import { sendOrder } from "./lib/telegram";
import { heroImages } from "./data/image-config";

const categoryIcon: Record<string, JSX.Element> = {
  All: <Sparkles size={14} />,
  Perfume: <SprayCan size={14} />,
  "Body Care": <Droplets size={14} />,
  "Gift Set": <Gift size={14} />,
};

/** Draggable floating image. Drag it anywhere; it springs back softly on release. */
function Floaty({ className, depth = 1, children }: { className: string; depth?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  return (
    <div
      ref={ref}
      className={`floaty ${className} ${drag ? "dragging" : ""}`}
      style={{ "--depth": depth, transform: `translate3d(${pos.x}px,${pos.y}px,0) rotate(${pos.x * 0.04}deg)` } as React.CSSProperties}
      onPointerDown={(e) => { ref.current?.setPointerCapture(e.pointerId); start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; setDrag(true); }}
      onPointerMove={(e) => { if (start.current) setPos({ x: e.clientX - start.current.x, y: e.clientY - start.current.y }); }}
      onPointerUp={() => { start.current = null; setDrag(false); setPos({ x: 0, y: 0 }); }}
      onPointerCancel={() => { start.current = null; setDrag(false); setPos({ x: 0, y: 0 }); }}
    >
      <div className="floaty-inner">{children}</div>
    </div>
  );
}

function Bottle({ gold = false }: { gold?: boolean }) {
  const id = gold ? "g" : "d";
  return (
    <svg viewBox="0 0 120 200" className="bottle-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`glass-${id}`} x1="0" x2="1"><stop offset="0" stopColor={gold ? "#f3e2b3" : "#ffffff"} stopOpacity=".35"/><stop offset=".5" stopColor={gold ? "#d9b86a" : "#d9b86a"} stopOpacity=".18"/><stop offset="1" stopColor="#ffffff" stopOpacity=".08"/></linearGradient>
        <linearGradient id={`cap-${id}`} x1="0" x2="1"><stop offset="0" stopColor="#a8832f"/><stop offset=".45" stopColor="#f3e2b3"/><stop offset="1" stopColor="#a8832f"/></linearGradient>
        <linearGradient id={`liq-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3e2b3" stopOpacity=".9"/><stop offset="1" stopColor="#a8832f" stopOpacity=".85"/></linearGradient>
      </defs>
      <rect x="44" y="6" width="32" height="28" rx="5" fill={`url(#cap-${id})`}/>
      <rect x="52" y="34" width="16" height="12" fill={`url(#cap-${id})`} opacity=".8"/>
      <rect x="14" y="46" width="92" height="144" rx="20" fill={`url(#glass-${id})`} stroke="#f3e2b3" strokeOpacity=".55" strokeWidth="1.2"/>
      <rect x="22" y="104" width="76" height="78" rx="14" fill={`url(#liq-${id})`} opacity=".75"/>
      <rect x="32" y="70" width="56" height="26" rx="4" fill="none" stroke="#f3e2b3" strokeOpacity=".7"/>
      <text x="60" y="87" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#f3e2b3" fontFamily="serif">SHOP</text>
      <path d="M26 58 Q24 120 28 176" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) + " ETB";

export default function App() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
  const [language, setLanguage] = useState<"en" | "am">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const t = {
    en: { shop: "Shop", about: "About", contact: "Contact", bag: "Bag", collection: "THE COLLECTION", choose: "Choose your favorites", add: "Add to bag", review: "Review & send", name: "Full name", phone: "Phone", address: "Delivery address", send: "Send order to shop", total: "Grand total", success: "Order sent successfully", sms: "A confirmation text message will be sent to your phone. After that, we will contact you by phone to confirm your order.", continue: "Continue shopping", search: "Search products..." },
    am: { shop: "ሱቅ", about: "ስለ እኛ", contact: "እውቂያ", bag: "ቅርጫት", collection: "የእቃዎች ስብስብ", choose: "የሚወዱትን ይምረጡ", add: "ወደ ቅርጫት ጨምር", review: "ይመልከቱ እና ይላኩ", name: "ሙሉ ስም", phone: "ስልክ ቁጥር", address: "የመላኪያ አድራሻ", send: "ትዕዛዙን ይላኩ", total: "ጠቅላላ", success: "ትዕዛዙ ተልኳል", sms: "የማረጋገጫ ቴክስት መልዕክት ወደ ስልክዎ ይላካል። ከዚያ ትዕዛዙን ለማረጋገጥ በስልክ እንገናኝዎታለን።", continue: "ወደ ግዢ ይመለሱ", search: "እቃ ይፈልጉ..." }
  }[language];

  const filtered = useMemo(() => products.filter((p) => {
    const inCategory = category === "All" || p.category === category;
    const inSearch = p.name.toLowerCase().includes(query.toLowerCase());
    return inCategory && inSearch;
  }), [category, query]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function add(product: CartItem) {
    setCart((current) => {
      const exists = current.find((i) => i.id === product.id);
      if (exists) return current.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function change(id: string, delta: number) {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart.length) return;
    setSending(true);
    try {
      await sendOrder({
        ...form,
        items: cart.map((item) => ({
          name: item.name, size: item.size, quantity: item.quantity,
          price: item.price, total: item.price * item.quantity
        })),
        total
      });
      setSent(true);
      setCart([]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Order failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`app-shell ${theme === "light" ? "light" : ""}`}>
      <div className="utility-bar"><div></div><div className="utilities"><button className="util-btn" aria-label="Change language" onClick={() => setLanguage(language === "en" ? "am" : "en")}><Languages size={13}/><span>{language === "en" ? "አማ" : "EN"}</span></button><button className="util-btn icon-only" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><span className="theme-icon" key={theme}>{theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}</span></button></div></div>
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><SprayCan size={17} strokeWidth={1.6}/></span><span>Shop <em>Perfume</em></span></div>
        <nav>
          <a href="#shop">{t.shop}</a><a href="#about">{t.about}</a><a href="#contact">{t.contact}</a>
        </nav>
        <button className="cart-button" onClick={() => setCheckout(true)}>
          <ShoppingBag size={18} strokeWidth={1.6}/><span>{t.bag}</span><b key={itemCount} className="count-pop">{itemCount}</b>
        </button>
      </header>

      <main>
        <section className="hero" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5)); e.currentTarget.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5)); }}>
          <div className="hero-copy">
            <div className="eyebrow"><Crown size={15}/> LUXURY FRAGRANCE HOUSE</div>
            <h1>Find a scent<br/><em>that stays.</em></h1>
            <p>Rare oud, soft amber and blooming florals. Choose your fragrance, set quantities, and send your complete order straight to the shop.</p>
            <div className="hero-actions">
              <a className="hero-cta" href="#shop">Explore collection <span className="cta-arrow"><ArrowRight size={16}/></span></a>
              <span className="hint"><MousePointerClick size={14}/> Drag the bottles</span>
            </div>
            <div className="trust">
              <span><ShieldCheck size={15}/> 100% authentic</span>
              <span><Truck size={15}/> Fast delivery</span>
              <span><Gift size={15}/> Gift wrapping</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-glow"></div><div className="art-ring"></div><div className="art-ring ring-2"></div>
            <Floaty className="f-main" depth={1}>{heroImages.main ? <img src={heroImages.main} alt="Featured perfume" draggable={false} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : null}<Bottle gold /></Floaty>
            <Floaty className="f-left" depth={1.8}><Bottle /></Floaty>
            <Floaty className="f-right" depth={1.4}><Bottle /></Floaty>
            <Floaty className="chip c1" depth={2.4}><Flower2 size={16}/> Rose</Floaty>
            <Floaty className="chip c2" depth={2}><Flame size={16}/> Oud</Floaty>
            <Floaty className="chip c3" depth={2.6}><Leaf size={16}/> Musk</Floaty>
            <Floaty className="chip c4" depth={1.6}><Wind size={16}/> Amber</Floaty>
            <Floaty className="chip c5" depth={2.2}><Star size={16}/> Vanilla</Floaty>
            <i className="spark s1"></i><i className="spark s2"></i><i className="spark s3"></i><i className="spark s4"></i>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div className="marquee-track">{[0,1].map(k => <span key={k}><Gem size={14}/> OUD <Sparkles size={14}/> AMBER <Flower2 size={14}/> ROSE <Crown size={14}/> MUSK <Star size={14}/> VANILLA <Flame size={14}/> SANDALWOOD <Droplets size={14}/> JASMINE&nbsp;</span>)}</div></div>

        <section className="shop" id="shop">
          <div className="section-head">
            <div><div className="eyebrow">{t.collection}</div><h2>{t.choose}</h2></div>
            <div className="search"><Search size={17} strokeWidth={1.6}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} /></div>
          </div>

          <div className="categories">
            {categories.map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{categoryIcon[c]}{c}</button>)}
          </div>

          <div className="grid">
            {filtered.map((product, index) => (
              <article className="product-card" key={product.id} style={{ "--i": index } as React.CSSProperties}
                onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height; e.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 9}deg`); e.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 11}deg`); e.currentTarget.style.setProperty("--gx", `${x * 100}%`); e.currentTarget.style.setProperty("--gy", `${y * 100}%`); }}
                onPointerLeave={(e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}>
                <div className="product-image">
                  {product.badge && <span className="badge"><Sparkles size={10}/>{product.badge}</span>}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.classList.add("empty-image");
                    }}
                  />
                  <span className="image-label"><ImageIcon size={22} strokeWidth={1.3}/>ADD YOUR IMAGE</span><button type="button" className="fav" aria-label="Favorite"><Heart size={15}/></button>
                </div>
                <div className="product-info">
                  <div><p className="category-label">{product.category}</p><h3>{product.name}</h3><span>{product.size}</span></div>
                  <strong>{money(product.price)}</strong>
                </div>
                <button className="add-button" onClick={() => add(product as CartItem)}><span>{t.add}</span><span className="plus-chip"><Plus size={15}/></span></button>
              </article>
            ))}
          </div>
        </section>

        <section className="how" id="about">
          <div><span><MousePointerClick size={20} strokeWidth={1.5}/><em>01</em></span><h3>Choose</h3><p>Pick products and the exact quantity you want.</p></div>
          <div><span><ReceiptText size={20} strokeWidth={1.5}/><em>02</em></span><h3>Review</h3><p>Your subtotal and grand total are calculated automatically.</p></div>
          <div><span><Send size={20} strokeWidth={1.5}/><em>03</em></span><h3>Send</h3><p>Submit once and the shop receives the full order through Telegram.</p></div>
        </section>
      </main>

      {cart.length > 0 && !checkout && (
        <button className="floating-bag" onClick={() => setCheckout(true)}>
          <span><ShoppingBag size={18} strokeWidth={1.6}/> {itemCount} item{itemCount > 1 ? "s" : ""}</span><b>{money(total)}</b>
        </button>
      )}

      {checkout && (
        <div className="overlay" onClick={() => !sending && setCheckout(false)}>
          <aside className="checkout" onClick={e => e.stopPropagation()}>
            <div className="checkout-head"><div><span className="eyebrow">YOUR ORDER</span><h2>{t.review}</h2></div><button className="close-btn" aria-label="Close" onClick={() => setCheckout(false)}><X size={18}/></button></div>
            {sent ? (
              <div className="success"><div className="success-icon"><Check size={26} strokeWidth={2.4}/></div><h2>{t.success}</h2><p>{t.sms}</p><button onClick={() => {setSent(false);setCheckout(false)}}>{t.continue}</button></div>
            ) : (
              <form onSubmit={submitOrder}>
                <div className="order-lines">
                  {cart.map(item => <div className="order-line" key={item.id}>
                    <div><b>{item.name}</b><small>{item.size} · {money(item.price)}</small></div>
                    <div className="quantity"><button type="button" onClick={() => change(item.id, -1)}><Minus size={14}/></button><b>{item.quantity}</b><button type="button" onClick={() => change(item.id, 1)}><Plus size={14}/></button></div>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>)}
                </div>
                <div className="total-row"><span>{t.total}</span><b>{money(total)}</b></div>
                <div className="form-grid">
                  <label>{t.name}<input required value={form.customerName} onChange={e => setForm({...form, customerName:e.target.value})} placeholder="Your name"/></label>
                  <label>{t.phone}<input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="09..."/></label>
                  <label className="full">{t.address}<input required value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="City / area / address"/></label>
                </div>
                <button className="send-button" disabled={sending}>{sending ? <><span className="spinner"></span>Sending...</> : <>{t.send} <ArrowRight size={18}/></>}</button>
                <p className="secure-note"><Lock size={11}/> Your order details are sent securely through your backend connection.</p>
              </form>
            )}
          </aside>
        </div>
      )}

      <footer id="contact"><div className="brand"><span className="brand-mark"><SprayCan size={17} strokeWidth={1.6}/></span><span>Shop <em>Perfume</em></span></div><div className="foot-icons"><Gem size={15}/><Crown size={15}/><Flower2 size={15}/><Heart size={15}/></div><span>Luxury fragrance · © 2026</span></footer>
    </div>
  );
}