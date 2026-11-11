"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Mic, MicOff, MessageCircle, Send, Volume2, VolumeX, X, CheckCircle2, ShoppingBag, ChevronRight } from "lucide-react";

const greeting="नमस्ते! 🙏 आयोध्या रेस्टोरेंट में आपका स्वागत है। मैं आपका हिंदी वेटर हूँ। बताइए, आज आप क्या खाना पसंद करेंगे?";
const rupee=(amount)=>"₹"+Number(amount||0).toLocaleString("en-IN");
const confirmWords=/(हाँ|हां|हॉं|haan|han|yes|confirm|कन्फर्म|पक्का|लगा दो|भेज दो|order kar|ऑर्डर कर)/i;
function voiceText(t){
  return String(t).replace(/[🙏🥘✅🍽️]/gu,"").replace(/₹(\d+)/g,"$1 रुपये").replace(/\s+/g," ");
}
export default function QRWaiter({table,cartDetails,onAdd,onRemove,onConfirmOrder,done}){
  const [open,setOpen]=useState(false);
  const [started,setStarted]=useState(false);
  const [messages,setMessages]=useState([{role:"assistant",text:greeting}]);
  const [draft,setDraft]=useState("");
  const [busy,setBusy]=useState(false);
  const [listening,setListening]=useState(false);
  const [voiceOn,setVoiceOn]=useState(true);
  const [confirming,setConfirming]=useState(false);
  const [hint,setHint]=useState("");
  const [mode,setMode]=useState("guided");
  const end=useRef(null),rec=useRef(null),voice=useRef(null),sending=useRef(false);
  const cartCount=cartDetails.reduce((sum,i)=>sum+i.qty,0);
  const cartTotal=cartDetails.reduce((sum,i)=>sum+i.qty*i.price,0);
  const canListen=typeof window!=="undefined"&&Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);
  useEffect(()=>{if(open)end.current?.scrollIntoView({behavior:"smooth",block:"end"});},[messages,open,confirming]);
  useEffect(()=>()=>{try{rec.current?.abort();window.speechSynthesis?.cancel();}catch{}},[]);
  useEffect(()=>{if(done){setConfirming(false);setMessages(m=>[...m,{role:"assistant",text:"शुक्रिया! आपका ऑर्डर "+done.code+" किचन में भेज दिया गया है। नीचे ट्रैकिंग लिंक पर स्थिति देखें।"}]);}},[done]);
  const speak=useCallback((text)=>{
    if(!voiceOn||typeof window==="undefined"||!window.speechSynthesis)return;
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(voiceText(text));
      u.lang="hi-IN";u.rate=0.93;u.pitch=1.05;u.volume=0.95;
      const hi=window.speechSynthesis.getVoices().find(v=>/^hi[-_]/i.test(v.lang));
      if(hi)u.voice=hi;
      window.speechSynthesis.speak(u);
      voice.current=u;
    }catch{}
  },[voiceOn]);
  function openChat(){
    setOpen(true);
    if(!started){setStarted(true);speak(greeting);}
  }
  async function doConfirm(){
    if(!table){const r="पहले अपनी टेबल चुनिए।";setMessages(m=>[...m,{role:"assistant",text:r}]);speak(r);return;}
    if(!cartDetails.length){setConfirming(false);const r="आपकी टोकरी अभी खाली है। पहले कुछ खाने के लिए बताइए।";setMessages(m=>[...m,{role:"assistant",text:r}]);speak(r);return;}
    if(sending.current)return;
    sending.current=true;setBusy(true);setHint("किचन में ऑर्डर भेज रहा हूँ...");
    try{
      const success=await onConfirmOrder();
      if(success){setConfirming(false);setHint("");setOpen(false);}
      else{setHint("ऑर्डर नहीं भेजा जा सका। कृपया नीचे दिखाई गई गलती देखें या फिर कोशिश करें।");}
    }catch{setHint("कृपया फिर कोशिश करें।");}
    finally{sending.current=false;setBusy(false);}
  }
  async function sendMessage(message){
    const input=String(message||"").trim();
    if(!input||sending.current)return;
    setDraft("");setHint("");
    setMessages(old=>[...old,{role:"user",text:input}]);
    if(!table){
      const reply="ज़रूर! पहले ऊपर से अपनी टेबल चुन लीजिए, फिर मैं आपका ऑर्डर ले लूँगा।";
      setMessages(old=>[...old,{role:"assistant",text:reply}]);speak(reply);return;
    }
    if(confirming&&confirmWords.test(input)){await doConfirm();return;}
    sending.current=true;setBusy(true);
    try{
      const r=await fetch("/api/qr-waiter",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:input,table,history:messages.slice(-4)})
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||"इस समय सुन नहीं पा रहा हूँ।");
      for(const op of data.operations||[]){
        if(op.type==="remove")onRemove(op.id,op.optionIndex,op.qty);
        else onAdd(op.id,op.optionIndex,op.qty);
      }
      const text=String(data.reply||"और क्या चाहिए?");
      setMessages(old=>[...old,{role:"assistant",text}]);
      if(data.wantsCheckout)setConfirming(true);
      else if((data.operations||[]).length)setConfirming(false);
      setMode(data.mode||"guided");speak(text);
    }catch(err){
      const text=err.message||"कृपया दोबारा बोलिए या मेन्यू से ऑर्डर करें।";
      setMessages(old=>[...old,{role:"assistant",text}]);setHint(text);
    }finally{setBusy(false);sending.current=false;}
  }
  function startListening(){
    if(listening){try{rec.current?.stop();}catch{}return;}
    const Ctor=typeof window!=="undefined"&&(window.SpeechRecognition||window.webkitSpeechRecognition);
    if(!Ctor){setHint("इस ब्राउज़र में बोलकर ऑर्डर देना उपलब्ध नहीं है। कृपया टाइप करें।");return;}
    try{
      window.speechSynthesis?.cancel();
      const speech=new Ctor();
      speech.lang="hi-IN";speech.interimResults=false;speech.continuous=false;speech.maxAlternatives=1;
      speech.onresult=e=>{
        const sentence=e.results?.[0]?.[0]?.transcript||"";
        if(sentence.trim())sendMessage(sentence);
      };
      speech.onerror=e=>{if(e.error!=="aborted")setHint(e.error==="not-allowed"?"माइक की अनुमति दें, या लिखकर ऑर्डर करें।":"आवाज़ समझ नहीं आई। फिर से माइक दबाइए।");setListening(false);};
      speech.onend=()=>setListening(false);
      rec.current=speech;
      speech.start();setListening(true);setHint("सुन रहा हूँ… बोलिए।");
    }catch{setListening(false);setHint("माइक शुरू नहीं हो सका। लिखकर बताइए।");}
  }
  return <>
    {!open&&!started&&<button type="button" onClick={openChat} className="fixed bottom-[180px] right-4 z-[54] max-w-[235px] rounded-2xl border border-sand bg-white px-4 py-3 text-left text-sm font-semibold text-charcoal shadow-lg sm:bottom-[105px] sm:right-8" aria-label="AI वेटर से बात करें">🙏 नमस्ते! क्या खाना पसंद करेंगे? <ChevronRight size={15} className="ml-1 inline text-terracotta"/></button>}
    {!open&&<button type="button" onClick={openChat} className="fixed bottom-[108px] right-4 z-[55] flex items-center gap-3 rounded-full border border-white/30 bg-terracotta px-4 py-3 text-sm font-bold text-white shadow-[0_12px_36px_rgba(0,0,0,.25)] transition hover:scale-[1.03] sm:bottom-8 sm:right-8" aria-label="हिंदी AI वेटर से ऑर्डर करें">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><Bot size={22}/></span><span className="text-left leading-tight">हिंदी AI वेटर<small className="block text-[10px] font-medium">बोलकर ऑर्डर करें</small></span>
    </button>}
    {open&&<div role="dialog" aria-modal="true" aria-label="Hindi order taking assistant" className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-5">
      <div className="flex h-[94dvh] max-h-[800px] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl bg-[#fffaf1] text-charcoal shadow-2xl sm:h-[min(85vh,760px)] sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between gap-3 bg-charcoal px-5 py-4 text-cream">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 bg-terracotta text-white"><Bot size={24}/></span>
            <div><h2 className="font-display text-xl font-semibold">आपका हिंदी वेटर</h2><p className="text-[11px] text-cream/65">Ayodhya Restaurant · {table||"टेबल चुनें"} · {mode==="guided"?"स्मार्ट वॉइस सहायक":"AI सहायक"}</p></div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={()=>{setVoiceOn(v=>!v);window.speechSynthesis?.cancel();}} className="rounded-full p-2 hover:bg-white/15" aria-label={voiceOn?"आवाज़ बंद करें":"आवाज़ चालू करें"}>{voiceOn?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
            <button onClick={()=>{setOpen(false);try{rec.current?.stop();window.speechSynthesis?.cancel();}catch{}}} className="rounded-full p-2 hover:bg-white/15" aria-label="वेटर बंद करें"><X size={21}/></button>
          </div>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.map((m,i)=><div key={i} className={"flex "+(m.role==="user"?"justify-end":"justify-start")}>
            <div className={"max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-sm "+(m.role==="user"?"rounded-br-sm bg-terracotta text-white":"rounded-bl-sm border border-sand bg-white text-charcoal")}>
              {m.role==="assistant"&&<p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-terracotta">Ayodhya वेटर</p>}
              <p>{m.text}</p>
            </div>
          </div>)}
          {busy&&<div className="w-fit rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-walnut">वेटर आपका ऑर्डर देख रहा है...</div>}
          {!!cartDetails.length&&<section className="rounded-2xl border border-sand bg-white p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold"><ShoppingBag size={16}/>आपका ऑर्डर · {cartCount} आइटम</p>
            <div className="space-y-1.5">{cartDetails.map((c,i)=><div className="flex justify-between gap-3 text-xs" key={i}><span>{c.qty} × {c.name}{c.variant&&c.variant!=="Regular"?" · "+c.variant:""}</span><b>{rupee(c.price*c.qty)}</b></div>)}</div>
            <div className="mt-3 flex justify-between border-t border-sand pt-3 text-sm font-bold"><span>कुल मेन्यू राशि</span><span>{rupee(cartTotal)}</span></div>
            <p className="mt-1 text-[10px] text-walnut">अंतिम बिल रेस्टोरेंट स्टाफ कन्फर्म करेगा।</p>
          </section>}
          {confirming&&!done&&<div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4">
            <h3 className="flex items-center gap-2 font-bold text-emerald-900"><CheckCircle2 size={19}/> क्या ऑर्डर किचन में भेज दूँ?</h3>
            <p className="mt-2 text-sm text-emerald-900">आपके द्वारा चुने गए {cartCount} आइटम का कुल {rupee(cartTotal)} है। सिर्फ आपकी पुष्टि के बाद ऑर्डर जाएगा।</p>
            <button disabled={busy||!cartCount} onClick={doConfirm} className="mt-3 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">हाँ, मेरा ऑर्डर कन्फर्म करें</button>
            <button onClick={()=>setConfirming(false)} className="mt-2 w-full text-xs font-semibold text-emerald-900 underline">नहीं, कुछ बदलना है</button>
          </div>}
          {done&&<Link href={"/qr-track/"+done.token} className="block rounded-xl bg-emerald-700 px-4 py-3 text-center font-bold text-white">ऑर्डर ट्रैक करें · {done.code}</Link>}
          <div ref={end}/>
        </div>
        <div className="shrink-0 border-t border-sand bg-white px-4 py-3 sm:px-5">
          {hint&&<p role="status" className="mb-2 text-xs text-amber-800">{hint}</p>}
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {["दो पनीर टिक्का","एक लस्सी","क्या खास है?","ऑर्डर लगा दो"].map(t=><button type="button" key={t} disabled={busy} onClick={()=>sendMessage(t)} className="shrink-0 rounded-full border border-sand bg-cream px-3 py-2 text-xs font-semibold text-terracotta disabled:opacity-40">{t}</button>)}
          </div>
          <form onSubmit={e=>{e.preventDefault();sendMessage(draft);}} className="flex items-center gap-2">
            <button type="button" disabled={busy} onClick={startListening} aria-label={listening?"बोलना बंद करें":"माइक से ऑर्डर दें"} className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white "+(listening?"animate-pulse bg-red-600":"bg-terracotta")}>{listening?<MicOff size={19}/>:<Mic size={19}/>}</button>
            <input aria-label="खाने का ऑर्डर लिखें" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="आप क्या खाना चाहेंगे?" maxLength={350} className="min-w-0 flex-1 rounded-full border border-sand bg-cream px-4 py-3 text-[15px] outline-none focus:border-terracotta"/>
            <button type="submit" disabled={busy||!draft.trim()} aria-label="ऑर्डर का संदेश भेजें" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-white disabled:opacity-40"><Send size={17}/></button>
          </form>
          <p className="mt-2 text-center text-[10px] text-walnut">वॉइस हर ब्राउज़र में उपलब्ध नहीं है। AI वेटर केवल वास्तविक मेन्यू से सुझाव देता है; ऑर्डर भेजने से पहले पुष्टि ज़रूरी है।</p>
        </div>
      </div>
    </div>}
  </>;
}