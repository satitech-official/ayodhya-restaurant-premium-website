"use client";
import { useEffect, useState } from "react";
import { LockKeyhole, ShieldCheck, LogOut, ChefHat } from "lucide-react";
import QRKitchen from "@/components/admin/QRKitchen";

export default function QRStaffGateway(){
  const [authenticated,setAuthenticated]=useState(false);
  const [loading,setLoading]=useState(true);
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    let active=true;
    fetch("/api/qr-staff/session",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(active)setAuthenticated(Boolean(d.authenticated));}).catch(()=>{if(active)setError("Unable to verify staff login.");}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  async function login(e){
    e.preventDefault();setBusy(true);setError("");
    try{
      const r=await fetch("/api/qr-staff/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
      const d=await r.json();
      if(!r.ok||!d.authenticated)throw new Error(d.error||"Could not sign in.");
      setAuthenticated(true);setPassword("");
    }catch(err){setError(err.message||"Could not sign in.");}finally{setBusy(false);}
  }
  async function logout(){
    await fetch("/api/qr-staff/session",{method:"DELETE"});
    setAuthenticated(false);setPassword("");
  }
  if(loading)return <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal"><p className="text-sm">Checking kitchen access...</p></div>;
  if(!authenticated)return <main className="flex min-h-screen items-center justify-center bg-charcoal px-4 text-charcoal">
    <div className="w-full max-w-md rounded-3xl bg-cream p-8 shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-white"><ChefHat size={28}/></div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-terracotta">Ayodhya Restaurant · Betul</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Kitchen staff login</h1>
      <p className="mt-2 text-sm text-walnut">Dedicated access for dine-in QR orders. Your main website and takeaway admin remain separate.</p>
      <form className="mt-7" onSubmit={login}>
        <label htmlFor="qr-staff-pass" className="text-sm font-semibold">Staff access code</label>
        <input id="qr-staff-pass" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-sand bg-white px-4 py-3.5 text-base outline-none focus:border-terracotta" placeholder="Enter your kitchen code"/>
        {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy||!password} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3.5 font-bold text-white disabled:opacity-50"><LockKeyhole size={17}/>{busy?"Signing in...":"Open Kitchen Dashboard"}</button>
      </form>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-walnut"><ShieldCheck size={14}/>Orders visible only to authorized staff</p>
    </div>
  </main>;
  return <main className="min-h-screen bg-[#f6efe6] px-4 py-8 sm:px-7">
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex justify-end"><button onClick={logout} className="flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm font-semibold text-walnut"><LogOut size={16}/>Sign out</button></div>
      <QRKitchen apiPath="/api/qr-staff/orders" qrSetupPath="/qr-staff/qr"/>
    </div>
  </main>;
}
