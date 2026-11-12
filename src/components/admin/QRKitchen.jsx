"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, ChefHat, ClipboardList, CreditCard, RefreshCw, Printer, ExternalLink } from "lucide-react";
const statuses=["new","accepted","preparing","ready","served","completed","cancelled"];
const next={new:"accepted",accepted:"preparing",preparing:"ready",ready:"served",served:"completed"};
const labels={new:"New",accepted:"Accepted",preparing:"Cooking",ready:"Ready",served:"Served",completed:"Completed",cancelled:"Cancelled"};
const money=(n)=>"₹"+Number(n||0).toLocaleString("en-IN");
const columns=["new","accepted","preparing","ready","served"];
export default function QRKitchen({apiPath="/api/admin/qr-orders",qrSetupPath="/admin/qr-setup"}){
  const [orders,setOrders]=useState([]);
  const [requests,setRequests]=useState([]);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState("");
  const [sound,setSound]=useState(false);
  const [announcementLanguage,setAnnouncementLanguage]=useState("hi");
  const [announcedCount,setAnnouncedCount]=useState(0);
  const [ready,setReady]=useState(false);
  const lastSeen=useRef(null);
  const soundRef=useRef(false);
  const languageRef=useRef("hi");
  const audio=useRef(null);
  const seenOrders=useRef(new Set());
  useEffect(()=>{soundRef.current=sound;},[sound]);
  useEffect(()=>{languageRef.current=announcementLanguage;},[announcementLanguage]);

  const playChime=useCallback(()=>{
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx)return;
      const ctx=audio.current||new Ctx();
      audio.current=ctx;
      if(ctx.state==="suspended")ctx.resume().catch(()=>{});
      for(const [i,freq] of [784,988,1175].entries()){
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.connect(gain);gain.connect(ctx.destination);
        osc.frequency.value=freq;osc.type="sine";
        gain.gain.setValueAtTime(0.001,ctx.currentTime+i*.16);
        gain.gain.exponentialRampToValueAtTime(.10,ctx.currentTime+i*.16+.03);
        gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.16+.19);
        osc.start(ctx.currentTime+i*.16);
        osc.stop(ctx.currentTime+i*.16+.20);
      }
    }catch{}
  },[]);
  const speakOut=useCallback((text,lang=languageRef.current)=>{
    if(!window.speechSynthesis)return;
    try{
      const voice=new SpeechSynthesisUtterance(text);
      voice.lang=lang==="en"?"en-IN":"hi-IN";
      voice.rate=.9;voice.volume=1;voice.pitch=1;
      const exact=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(lang==="en"?"en-in":"hi"));
      if(exact)voice.voice=exact;
      window.speechSynthesis.speak(voice);
    }catch{}
  },[]);
  const announceNewOrder=useCallback((order)=>{
    const n=Number(String(order.table||"").replace(/\D/g,""))||order.table;
    const dishes=(order.items||[]).map(i=>i.quantity+" "+i.name+(i.option?" "+i.option:"")).join(", ");
    const code=String(order.code||"").replace(/-/g," ");
    const sentence=languageRef.current==="en"
      ?"New order from table number "+n+". Order number "+code+". "+dishes+". Please accept the order."
      :"नया ऑर्डर टेबल नंबर "+n+" से आया है। ऑर्डर नंबर "+code+"। "+dishes+"। कृपया ऑर्डर स्वीकार करें।";
    playChime();
    speakOut(sentence);
    setAnnouncedCount(k=>k+1);
  },[playChime,speakOut]);
  function toggleVoice(){
    if(soundRef.current){
      setSound(false);soundRef.current=false;
      try{window.speechSynthesis?.cancel();}catch{}
      return;
    }
    // MUST be initiated by a user gesture: mobile/desktop browser sound policies.
    setSound(true);soundRef.current=true;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(Ctx){const ctx=audio.current||new Ctx();audio.current=ctx;ctx.resume().catch(()=>{});}
      window.speechSynthesis?.cancel();
    }catch{}
    const waiting=orders.filter(o=>o.status==="new");
    if(waiting.length){
      for(const order of waiting.slice(-3))announceNewOrder(order);
    }else{
      playChime();
      speakOut(languageRef.current==="en"?"Kitchen voice alerts on. New orders will be announced with table number.":"किचन वॉइस अलर्ट चालू है। नया ऑर्डर आते ही टेबल नंबर बोलकर बताया जाएगा।");
    }
  }
  const fetchOrders=useCallback(async()=>{
    try{
      const r=await fetch(apiPath,{cache:"no-store"});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"Could not fetch orders.");
      setOrders(data.orders||[]);setRequests(data.requests||[]);setError("");setReady(true);
      const active=(data.orders||[]).filter(o=>o.status==="new");
      if(lastSeen.current===null){
        // Do not generate surprise audio for orders that existed before dashboard loaded.
        seenOrders.current=new Set(active.map(o=>o.code));
        lastSeen.current="initialized";
      }else{
        const unseen=active.filter(o=>!seenOrders.current.has(o.code)).reverse();
        for(const o of unseen){
          seenOrders.current.add(o.code);
          if(soundRef.current)announceNewOrder(o);
        }
      }
    }catch(e){setError(e.message||"Refresh failed.");setReady(true);}
  },[apiPath,announceNewOrder]);
  useEffect(()=>{fetchOrders();const t=setInterval(fetchOrders,3500);return()=>clearInterval(t);},[fetchOrders]);
  async function update(action,id,from,to,value){
    const key=String(id)+action;setBusy(key);setError("");
    try{
      const r=await fetch(apiPath,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,id,from,to,value})});
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
        <Link href={qrSetupPath} className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-bold text-white"><ExternalLink size={16}/> QR setup & print</Link>
        <select aria-label="Voice announcement language" value={announcementLanguage} onChange={e=>setAnnouncementLanguage(e.target.value)} className="rounded-full border border-sand bg-white px-3 py-2 text-sm font-bold"><option value="hi">Hindi voice</option><option value="en">English voice</option></select>
        <button type="button" onClick={toggleVoice} className={"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold "+(sound?"border-emerald-600 bg-emerald-600 text-white":"border-orange-500 bg-orange-50 text-orange-800")}><Bell size={16}/>{sound?"Voice alerts ON":"Activate chef voice alerts"}</button>
        <button type="button" onClick={fetchOrders} className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm font-bold"><RefreshCw size={16}/>Refresh</button>
      </div>
    </div>
    {!sound&&<p role="status" className="mt-5 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">🔔 Chef announcement is not enabled yet. Click “Activate chef voice alerts” once on this kitchen device and keep the dashboard open. Browser audio cannot start itself without permission.</p>}
    {sound&&<p role="status" className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">🔊 Voice alerts active · new orders are announced by table number, order code and dishes. Announcements this session: {announcedCount}.</p>}
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
