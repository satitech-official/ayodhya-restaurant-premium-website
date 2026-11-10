"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, ChefHat, ClipboardList, CreditCard, RefreshCw, Printer, ExternalLink } from "lucide-react";
const statuses=["new","accepted","preparing","ready","served","completed","cancelled"];
const next={new:"accepted",accepted:"preparing",preparing:"ready",ready:"served",served:"completed"};
const labels={new:"New",accepted:"Accepted",preparing:"Cooking",ready:"Ready",served:"Served",completed:"Completed",cancelled:"Cancelled"};
const money=(n)=>"₹"+Number(n||0).toLocaleString("en-IN");
const columns=["new","accepted","preparing","ready","served"];
export default function QRKitchen(){
  const [orders,setOrders]=useState([]);
  const [requests,setRequests]=useState([]);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState("");
  const [sound,setSound]=useState(false);
  const [ready,setReady]=useState(false);
  const lastSeen=useRef(null);
  const audio=useRef(null);
  const fetchOrders=useCallback(async()=>{
    try{
      const r=await fetch("/api/admin/qr-orders",{cache:"no-store"});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Could not fetch orders.");
      setOrders(data.orders||[]);setRequests(data.requests||[]);setError("");setReady(true);
      const current=(data.orders||[]).filter((o)=>o.status==="new").map((o)=>o.code).sort().join("|");
      if(lastSeen.current!==null && current!==lastSeen.current && sound && current){
        try{const Ctx=window.AudioContext||window.webkitAudioContext;const ctx=audio.current||new Ctx();audio.current=ctx;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=880;gain.gain.value=.07;osc.start();osc.stop(ctx.currentTime+.18);}catch{}
      }
      lastSeen.current=current;
    }catch(e){setError(e.message||"Refresh failed.");setReady(true);}
  },[sound]);
  useEffect(()=>{fetchOrders();const t=setInterval(fetchOrders,3500);return()=>clearInterval(t);},[fetchOrders]);
  async function update(action,id,from,to,value){
    const key=String(id)+action;setBusy(key);setError("");
    try{
      const r=await fetch("/api/admin/qr-orders",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,id,from,to,value})});
      const d=await r.json();if(!r.ok || !d.ok)throw new Error(d.error||"Order was changed. Refresh and retry.");
      await fetchOrders();
    }catch(e){setError(e.message);}finally{setBusy("");}
  }
  function printKOT(o){
    const win=window.open("","_blank","width=360,height=650");
    if(!win){setError("Allow popups to print KOT.");return;}
    const esc=(s)=>String(s??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const rows=o.items.map((i)=>"<div>"+esc(i.quantity)+" × "+esc(i.name)+" "+esc(i.option||"")+"</div>").join("");
    win.document.write("<!doctype html><html><head><title>KOT "+esc(o.code)+"</title><style>@page{size:58mm auto;margin:3mm}body{font:13px monospace;color:black}h2{margin-bottom:3px}hr{border:0;border-top:1px dashed black}</style></head><body><h2>AYODHYA KITCHEN</h2><b>"+esc(o.code)+"</b> | Table <b>"+esc(o.table)+"</b><hr>"+rows+"<hr><small>"+esc(o.notes||"")+"</small></body></html>");
    win.document.close();win.focus();win.print();
  }
  return <div className="text-charcoal">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Ayodhya Restaurant · Pilot</p><h1 className="mt-2 font-display text-4xl font-bold">Live Kitchen Orders</h1><p className="mt-2 text-sm text-walnut">QR table ordering · refreshed every 3.5 seconds · existing takeaway unaffected.</p></div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/qr-setup" className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-bold text-white"><ExternalLink size={16}/> QR setup & print</Link>
        <button type="button" onClick={()=>setSound((v)=>!v)} className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm font-bold"><Bell size={16}/>{sound?"Sound on":"Enable sound"}</button>
        <button type="button" onClick={fetchOrders} className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm font-bold"><RefreshCw size={16}/>Refresh</button>
      </div>
    </div>
    {error&&<p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    {!!requests.length && <section className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-4"><h2 className="flex items-center gap-2 font-display text-xl font-bold"><Bell size={19}/> Service requests ({requests.length})</h2><div className="mt-3 flex flex-wrap gap-3">{requests.map((r)=><div className="rounded-xl border bg-white px-3 py-3 text-sm" key={r.id}><strong>{r.table_code} · {r.kind}</strong><button className="ml-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white" disabled={busy===String(r.id)+"resolve_request"} onClick={()=>update("resolve_request",r.id)}>Resolved</button></div>)}</div></section>}
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{columns.map((status)=><section key={status} className="min-h-56 rounded-2xl border border-sand bg-white/80 p-3">
      <div className="mb-4 flex justify-between border-b border-sand pb-3"><h2 className="font-display text-xl font-bold">{labels[status]}</h2><span className="rounded-full bg-cream px-3 py-1 text-xs font-bold">{orders.filter((o)=>o.status===status).length}</span></div>
      <div className="space-y-3">{orders.filter((o)=>o.status===status).map((o)=><article key={o.id} className="rounded-xl border border-sand bg-white p-3 shadow-sm">
        <div className="flex justify-between gap-2"><strong>{o.code}</strong><strong className="rounded-full bg-terracotta/10 px-2 text-terracotta">{o.table}</strong></div>
        <p className="mt-1 text-[11px] text-walnut">{new Date(o.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</p>
        <ul className="mt-3 space-y-1 border-t border-dashed pt-2 text-xs">{o.items.map((i,n)=><li key={n}><b>{i.quantity}×</b> {i.name}{i.option?" ("+i.option+")":""}</li>)}</ul>
        {o.notes&&<p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs">Note: {o.notes}</p>}
        <p className="mt-2 border-t pt-2 text-sm font-bold">{money(o.subtotal)}</p>
        <div className="mt-2 grid gap-2">
          {next[status]&&<button className="rounded-lg bg-terracotta px-3 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={Boolean(busy)} onClick={()=>update("status",o.id,o.status,next[status])}>Move to {labels[next[status]]}</button>}
          <button onClick={()=>update("payment",o.id,null,null,o.paymentStatus==="paid"?"unpaid":"paid")} disabled={Boolean(busy)} className="rounded-lg border border-emerald-600 px-2 py-1.5 text-xs font-semibold text-emerald-800">{o.paymentStatus==="paid"?"Paid ✓ (undo)":"Mark paid (manual)"}</button>
          <button onClick={()=>printKOT(o)} className="flex items-center justify-center gap-2 rounded-lg border border-sand py-1.5 text-xs"><Printer size={13}/>Print KOT</button>
          {["new","accepted","preparing","ready"].includes(status)&&<button className="py-1 text-xs text-red-700 underline" onClick={()=>{if(confirm("Cancel "+o.code+"?"))update("status",o.id,o.status,"cancelled");}}>Cancel order</button>}
        </div>
      </article>)}</div>
    </section>)}</div>
    {ready&&orders.length===0&&!error&&<p className="mt-8 text-center text-sm text-walnut">No QR orders yet. Scan a QR from the setup page to test.</p>}
    {orders.some((o)=>["completed","cancelled"].includes(o.status))&&<section className="mt-8 rounded-xl bg-white p-5"><h2 className="font-display text-2xl">Recent closed orders</h2><div className="mt-3 space-y-2">{orders.filter((o)=>["completed","cancelled"].includes(o.status)).map((o)=><p key={o.id} className="text-sm">{o.code} · {o.table} · {labels[o.status]} · {money(o.subtotal)} · {o.paymentStatus}</p>)}</div></section>}
  </div>;
}
