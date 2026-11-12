"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import QRWaiter from "@/components/QRWaiter";
import { Check, ChevronDown, Minus, Plus, QrCode, Search, ShoppingBag, X, RefreshCw, GlassWater, Hand, ReceiptText, ArrowRight } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

function options(item) {
  const values = String(item.price || "").split("/").map((p) => Number(String(p).replace(/[^\d.]/g, ""))).filter((v) => Number.isFinite(v) && v > 0);
  return values.map((price, index) => {
    const text = (item.name + " " + (item.description || "")).toLowerCase();
    const label = values.length === 1 ? "Regular" : (text.includes("half") && text.includes("full") ? (index === 0 ? "Half" : "Full") : "Option " + (index + 1));
    return { price, label, index };
  });
}
const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const inputClass = "w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base text-charcoal outline-none focus:border-terracotta";
export default function QRGuestMenu({ items, categories, initialTable, tableCount, enabled }) {
  const isTable = (s) => /^T\d{2}$/.test(s || "") && Number(s.slice(1)) >= 1 && Number(s.slice(1)) <= tableCount;
  const [table, setTable] = useState(isTable(initialTable) ? initialTable : "");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [requestInfo, setRequestInfo] = useState("");
  const [selectedByTouch, setSelectedByTouch] = useState(null);
  const requestId = useRef("");
  const filtered = useMemo(() => items.filter((it) => it.available !== false &&
    (category === "all" || it.category === category) &&
    (it.name + " " + (it.description || "")).toLowerCase().includes(query.trim().toLowerCase())
  ), [items, category, query]);
  const cartDetails = useMemo(() => cart.map((entry) => {
    const item = items.find((it) => String(it.id) === String(entry.id));
    const selected = item && options(item).find((o) => o.index === entry.optionIndex);
    return item && selected ? { ...entry, name:item.name, price:selected.price, variant:selected.label, image:item.image } : null;
  }).filter(Boolean), [cart, items]);
  const subtotal = cartDetails.reduce((a, c) => a + c.price * c.qty, 0);
  const count = cartDetails.reduce((a, c) => a + c.qty, 0);
  function changeItem(id, optionIndex, delta, source = "touch") {
    if (source === "touch") {
      const item = items.find((entry) => String(entry.id) === String(id));
      if (item) setSelectedByTouch({ id: Date.now() + Math.random(), name: item.name, delta });
    }
    setDone(null);setError("");requestId.current="";
    setCart((old) => {
      const key = String(id) + ":" + String(optionIndex);
      const prior = old.find((e) => e.key === key);
      if (!prior && delta > 0) return [...old, { key, id, optionIndex, qty:Math.min(20,delta) }];
      return old.map((e) => e.key === key ? { ...e, qty:Math.min(20,Math.max(0,e.qty+delta)) } : e).filter((e) => e.qty > 0);
    });
  }
  async function placeOrder(e) {
    e.preventDefault();setError("");
    if (!table || !isTable(table)) {setError("Please choose the correct table.");return false;}
    if (!cartDetails.length) {setError("Add an item first.");return false;}
    setBusy(true);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/qr-orders", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
        clientRequestId:requestId.current, table, notes,
        items:cartDetails.map((c) => ({id:c.id,optionIndex:c.optionIndex,qty:c.qty}))
      })});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place your order.");
      setDone(data);setCart([]);setCartOpen(false);
      if (typeof window !== "undefined") sessionStorage.setItem("ayodhya_last_qr_order", data.token);
      return true;
    } catch (err) {setError(err.message || "Could not place order.");return false;}
    finally {setBusy(false);}
  }
  async function service(kind) {
    if (!table) {setRequestInfo("Choose your table first.");return;}
    setRequestInfo("Sending request...");
    try {
      const r=await fetch("/api/qr-service",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({table,kind})});
      const data=await r.json();
      if (!r.ok) throw new Error(data.error);
      setRequestInfo(data.message || "Staff has been notified.");
    }catch(e){setRequestInfo(e.message || "Please call a waiter.");}
  }
  useEffect(() => {
    if(isTable(initialTable)) setTable(initialTable);
  },[initialTable]);
  return (
    <div className={"min-h-screen bg-cream pb-32 text-charcoal " + (enabled ? "lg:pr-[445px]" : "")}>
      <section className="bg-charcoal px-4 pb-10 pt-24 text-cream sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brass">Ayodhya Restaurant · Betul</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Scan. Order. Enjoy.</h1>
          <p className="mt-3 max-w-2xl text-sm text-cream/75 sm:text-base">Order directly to your table from our original restaurant menu. No app download needed.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-charcoal">
              <QrCode className="h-4 w-4 text-terracotta"/><span>Table</span>
              <select value={table} onChange={(e) => {setTable(e.target.value);setError("");}} className="bg-transparent font-bold outline-none" aria-label="Choose restaurant table" disabled={Boolean(isTable(initialTable))}>
                <option value="">Select</option>
                {Array.from({length:tableCount},(_,i)=>"T"+String(i+1).padStart(2,"0")).map((code)=><option key={code} value={code}>{code}</option>)}
              </select>
            </label>
            <span className="rounded-full border border-brass/50 px-3 py-2 text-xs text-brass">Pilot ordering · Staff-confirmed bill</span>
          </div>
        </div>
      </section>
      {!enabled ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <h2 className="text-xl font-bold">QR pilot not enabled on this deployment.</h2>
          <p className="mt-2 text-sm">The restaurant team must configure the server database and explicitly enable the pilot. The regular website is unaffected.</p>
          <Link href="/menu" className="mt-4 inline-block font-semibold underline">Browse restaurant menu</Link>
        </div>
      ) : done ? (
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-sand bg-white p-8 text-center shadow-lg">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={30}/></span>
          <h2 className="mt-5 font-display text-3xl">Order received</h2>
          <p className="mt-2">Order <strong>{done.code}</strong> · Table <strong>{table}</strong></p>
          <p className="mt-2 text-xl font-bold">{money(done.subtotal)}</p>
          <p className="mt-3 text-sm text-walnut">Kitchen staff will confirm your order. Payment is handled by restaurant staff.</p>
          <Link href={"/qr-track/" + done.token} className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-semibold text-white">Track order <ArrowRight size={16}/></Link>
          <button className="mt-4 block w-full text-sm font-semibold underline" onClick={() => {setDone(null);setNotes("");requestId.current="";}}>Place another order</button>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1"><Search size={19} className="absolute left-4 top-3.5 text-walnut"/><input aria-label="Search dishes" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search dosa, paneer, drinks..." className={inputClass + " pl-12"}/></div>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className={inputClass + " sm:max-w-xs"} aria-label="Food category">
              <option value="all">All categories</option>
              {categories.map((c)=><option value={c.slug} key={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[["water","Water",GlassWater],["waiter","Call waiter",Hand],["bill","Request bill",ReceiptText]].map(([kind,label,Icon])=>
              <button key={kind} type="button" onClick={()=>service(kind)} disabled={!table} className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-xs font-bold disabled:opacity-40"><Icon size={15}/>{label}</button>
            )}
          </div>
          {requestInfo && <p role="status" className="mt-2 text-sm text-walnut">{requestInfo}</p>}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item)=>{
              const choices=options(item);
              if(!choices.length) return null;
              return <article key={item.id} className="overflow-hidden rounded-2xl border border-sand bg-white shadow-sm">
                <div className="flex items-stretch gap-3 p-3">
                  <img src={item.image || "/images/fallback-food.svg"} onError={(e)=>{e.currentTarget.src="/images/fallback-food.svg";}} alt={item.name} loading="lazy" className="h-28 w-28 shrink-0 rounded-xl object-cover sm:h-32 sm:w-32"/>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">● Pure Veg</p>
                    <h2 className="mt-1 font-display text-lg font-semibold leading-snug">{item.name}</h2>
                    {item.description && <p className="mt-1 line-clamp-2 text-xs text-walnut">{item.description}</p>}
                    <p className="mt-2 text-sm font-bold text-terracotta">{choices.length>1 ? "From " : ""}{money(choices[0].price)}</p>
                  </div>
                </div>
                <div className="border-t border-sand px-3 py-3">
                  {choices.map((o)=>{
                    const found=cart.find((c)=>c.key===String(item.id)+":"+o.index);
                    return <div key={o.index} className="flex items-center justify-between gap-3 py-1">
                      <span className="text-xs font-medium text-walnut">{o.label}{choices.length>1 ? " · "+money(o.price) : ""}</span>
                      <div className="flex items-center gap-3">
                        {found && <button aria-label={"Remove "+item.name} type="button" onClick={()=>changeItem(item.id,o.index,-1)} className="rounded-full bg-sand/60 p-2"><Minus size={14}/></button>}
                        {found && <b className="text-sm">{found.qty}</b>}
                        <button aria-label={"Add "+item.name+" "+o.label} type="button" onClick={()=>changeItem(item.id,o.index,1)} className="rounded-full bg-terracotta p-2 text-white"><Plus size={14}/></button>
                      </div>
                    </div>;
                  })}
                </div>
              </article>;
            })}
          </div>
          {!filtered.length && <p className="py-16 text-center text-walnut">No matching dishes found.</p>}
          <p className="mt-6 text-center text-xs text-walnut">Items and prices are sourced from Ayodhya Restaurant's audited menu. Confirm final bill and availability with staff.</p>
        </div>
      )}
      {enabled && <QRWaiter table={table} cartDetails={cartDetails} selectedByTouch={selectedByTouch} onAdd={(id,index,qty)=>changeItem(id,index,qty,"assistant")} onRemove={(id,index,qty)=>changeItem(id,index,-qty,"assistant")} onConfirmOrder={()=>placeOrder({preventDefault(){}})} done={done} />}
      {enabled && !done && <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-sand bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div><p className="text-xs font-semibold text-walnut">{count} items · Table {table || "not selected"}</p><strong className="font-display text-2xl">{money(subtotal)}</strong></div>
          <button onClick={()=>{setCartOpen(true);setError("");}} type="button" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-bold text-white disabled:opacity-50" disabled={!cart.length}><ShoppingBag size={18}/> View cart</button>
        </div>
      </div>}
      {cartOpen && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Review your table order">
        <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-xl sm:rounded-3xl sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-terracotta">Table {table || "not selected"}</p><h2 className="font-display text-3xl font-bold">Review order</h2></div><button onClick={()=>setCartOpen(false)} aria-label="Close cart" className="rounded-full border p-2"><X/></button></div>
          <form onSubmit={placeOrder}>
            <div className="mt-5 space-y-3">{cartDetails.map((c)=><div key={c.key} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3"><div className="min-w-0"><b className="block text-sm">{c.name}</b><span className="text-xs text-walnut">{c.variant} · {money(c.price)}</span></div><div className="flex shrink-0 items-center gap-3"><button type="button" onClick={()=>changeItem(c.id,c.optionIndex,-1)} className="rounded-full bg-cream p-1"><Minus size={15}/></button><span>{c.qty}</span><button type="button" onClick={()=>changeItem(c.id,c.optionIndex,1)} className="rounded-full bg-cream p-1"><Plus size={15}/></button></div></div>)}</div>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-wider">Special instructions (optional)<textarea value={notes} onChange={(e)=>setNotes(e.target.value)} maxLength={250} className={inputClass + " mt-2"} rows={3} placeholder="Less spicy, no onion..." /></label>
            <div className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Menu subtotal</span><span>{money(subtotal)}</span></div>
            <p className="mt-1 text-xs text-walnut">No online payment. Staff confirms the final bill; taxes or charges, if any, are not added here.</p>
            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy || !table || !cartDetails.length} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-4 font-bold text-white disabled:opacity-50">{busy ? <><RefreshCw className="animate-spin" size={17}/> Sending...</> : "Place table order"}</button>
          </form>
        </div>
      </div>}
    </div>
  );
}
