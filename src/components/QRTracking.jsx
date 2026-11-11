"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";

const statuses = ["new","accepted","preparing","ready","served","completed"];
const labels = { new:"Received",accepted:"Accepted by kitchen",preparing:"Preparing your food",ready:"Ready to serve",served:"Served at your table",completed:"Completed",cancelled:"Cancelled" };
const money=(n)=>"₹"+Number(n||0).toLocaleString("en-IN");
export default function QRTracking({token}) {
  const [order,setOrder]=useState(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      try{
        const res=await fetch("/api/qr-orders/"+encodeURIComponent(token),{cache:"no-store"});
        const data=await res.json();
        if(!res.ok)throw new Error(data.error||"Could not load order.");
        if(alive){setOrder(data.order);setError("");}
      }catch(e){if(alive)setError(e.message||"Unable to refresh order.");}
      finally{if(alive)setLoading(false);}
    };
    load();const timer=setInterval(load,3500);
    return ()=>{alive=false;clearInterval(timer);};
  },[token]);
  const index=order?statuses.indexOf(order.status):-1;
  return <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-charcoal">
    <div className="mx-auto max-w-xl rounded-3xl border border-sand bg-white p-6 shadow-lg sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">Ayodhya Restaurant · Live Order</p>
      <h1 className="mt-3 font-display text-4xl">Your order status</h1>
      {loading && <p className="mt-6 flex items-center gap-2 text-sm"><RefreshCw className="animate-spin" size={17}/> Checking your order...</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
      {order && <>
        <div className="mt-6 flex justify-between border-b border-sand pb-5"><div><p className="text-xs text-walnut">Order number</p><p className="text-xl font-bold">{order.code}</p></div><div className="text-right"><p className="text-xs text-walnut">Table</p><p className="text-xl font-bold">{order.table}</p></div></div>
        {order.status==="cancelled"? <p className="mt-5 rounded-xl bg-red-50 p-4 font-bold text-red-700">Order cancelled. Please speak with staff.</p> :
          <ol className="mt-7 space-y-5">{statuses.map((status,i)=><li key={status} className="flex gap-4"><span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 "+(index>=i?"border-emerald-600 bg-emerald-600 text-white":"border-sand text-walnut")}>{index>=i?<Check size={18}/>:i+1}</span><div className="pt-1"><strong className={index>=i?"text-emerald-700":"text-walnut"}>{labels[status]}</strong>{index===i&&<p className="text-xs text-walnut">Current status · refreshes automatically</p>}</div></li>)}</ol>}
        <div className="mt-7 rounded-2xl bg-cream p-5">
          <h2 className="font-display text-xl font-bold">Your items</h2>
          {order.items.map((it,i)=><div className="mt-3 flex justify-between gap-3 text-sm" key={i}><span>{it.name} × {it.quantity}{it.option?" ("+it.option+")":""}</span><strong>{money(it.lineTotal)}</strong></div>)}
          <div className="mt-4 flex justify-between border-t border-sand pt-4 font-bold"><span>Menu subtotal</span><span>{money(order.subtotal)}</span></div>
          <p className="mt-2 text-xs text-walnut">Payment: {order.paymentStatus==="paid"?"Marked paid by staff":"Pay at counter / waiter"}. Any final adjustments are confirmed by staff.</p>
        </div>
        <p className="mt-5 text-center text-xs text-walnut">Keep this private link to track your order. Don't share it publicly.</p>
        <Link href={"/qr-order?table="+order.table} className="mt-5 block rounded-full bg-terracotta px-6 py-3 text-center font-bold text-white">Order something else</Link>
      </>}
      {!order&&!loading&&!error&&<p className="mt-6">No order found.</p>}
    </div>
  </div>;
}
