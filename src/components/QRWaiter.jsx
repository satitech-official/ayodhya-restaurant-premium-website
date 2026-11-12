"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AudioLines, Bot, Check, ChevronDown, ChevronUp, Headphones, MessageCircle,
  Mic, MicOff, Minus, Plus, Send, ShoppingBasket, Sparkles, Volume2, VolumeX, X,
} from "lucide-react";

const fmt = (v) => "₹" + Number(v || 0).toLocaleString("en-IN");
const welcome = {
  both: "नमस्ते! Welcome to Ayodhya. बताइए, आज क्या खाना पसंद करेंगे?",
  hi: "नमस्ते! आयोध्या में आपका स्वागत है। आज क्या खाना पसंद करेंगे?",
  en: "Welcome to Ayodhya! What can I get for you today?",
};
const yes = /^(हाँ|हां|जी हाँ|haan|han|yes|confirm|कन्फर्म|पक्का|भेज दो|लगा दो|place order)\s*[!.।]*$/i;
const no = /^(नहीं|nahin|nahi|no|change|बदलना है|कुछ बदलना|modify)\s*[!.।]*$/i;
const sanitizeSpeech = (s, language) =>
  String(s || "").replace(/[\u{1F300}-\u{1FAFF}]/gu, "").replace(/₹(\d+)/g, (_, a) => a + (language === "en" ? " rupees" : " रुपये")).trim();

export default function QRWaiter({ table, cartDetails, onAdd, onRemove, onConfirmOrder, done, selectedByTouch }) {
  const [language, setLanguage] = useState("both");
  // Mobile: the greeting + voice dock appears immediately; transcript is a separate optional sheet.
  // Desktop: transcript lives in an allocated sidebar, never over the food menu.
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: welcome.both }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [review, setReview] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [premiumReady, setPremiumReady] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [hint, setHint] = useState("");
  const sent = useRef(false);
  const recognition = useRef(null);
  const currentAudio = useRef(null);
  const currentUrl = useRef(null);
  const voiceTask = useRef(null);
  const voiceSerial = useRef(0);
  const transcriptBottom = useRef(null);
  const lastTouchId = useRef(null);
  const hasWelcomed = useRef(false);
  const currentLanguage = useRef("both");
  const currentCart = useRef(cartDetails);
  const count = cartDetails.reduce((n, e) => n + e.qty, 0);
  const total = cartDetails.reduce((n, e) => n + e.qty * e.price, 0);
  currentCart.current = cartDetails;
  currentLanguage.current = language;

  useEffect(() => {
    let mounted = true;
    fetch("/api/qr-waiter/voice", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : {})
      .then((data) => { if (mounted) setPremiumReady(Boolean(data.studioVoiceAvailable)); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const stopVoice = useCallback(() => {
    voiceSerial.current += 1;
    try { voiceTask.current?.abort(); } catch {}
    try { currentAudio.current?.pause(); } catch {}
    if (currentUrl.current) { try { URL.revokeObjectURL(currentUrl.current); } catch {} }
    currentUrl.current = null;
    try { window.speechSynthesis?.cancel(); } catch {}
    setVoiceStatus("idle");
  }, []);

  const fallbackVoice = useCallback((words, locale) => {
    if (!window.speechSynthesis) return;
    const speech = new SpeechSynthesisUtterance(sanitizeSpeech(words, locale));
    speech.lang = locale === "en" ? "en-IN" : "hi-IN";
    speech.rate = locale === "en" ? 0.93 : 0.92;
    speech.pitch = 1.0;
    const candidates = window.speechSynthesis.getVoices();
    const preferred = candidates.find(v => {
      const name = (v.name || "").toLowerCase();
      return v.lang.toLowerCase().startsWith(locale === "en" ? "en-in" : "hi") &&
        /(google|microsoft|natural|neural|heera|hemant|lekha)/.test(name);
    }) || candidates.find(v => v.lang.toLowerCase().startsWith(locale === "en" ? "en" : "hi"));
    if (preferred) speech.voice = preferred;
    speech.onstart = () => setVoiceStatus("speaking");
    speech.onend = () => setVoiceStatus("idle");
    speech.onerror = () => setVoiceStatus("idle");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }, []);

  const speak = useCallback(async (text, locale = currentLanguage.current) => {
    if (!voiceEnabled || typeof window === "undefined") return;
    const target = locale === "en" ? "en" : (locale === "hi" ? "hi" : /[\u0900-\u097f]/.test(text) ? "hi" : "en");
    const spoken = sanitizeSpeech(text, target);
    if (!spoken) return;
    const serial = ++voiceSerial.current;
    try { voiceTask.current?.abort(); currentAudio.current?.pause(); window.speechSynthesis?.cancel(); } catch {}
    if (currentUrl.current) { URL.revokeObjectURL(currentUrl.current); currentUrl.current = null; }
    if (premiumReady) {
      const controller = new AbortController();
      voiceTask.current = controller;
      setVoiceStatus("preparing");
      try {
        const response = await fetch("/api/qr-waiter/voice", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: spoken.slice(0, 380), table, language: target }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("premium voice failed");
        const sound = await response.blob();
        if (serial !== voiceSerial.current) return;
        const url = URL.createObjectURL(sound);
        currentUrl.current = url;
        const audio = new Audio(url);
        currentAudio.current = audio;
        audio.onplay = () => setVoiceStatus("speaking");
        audio.onended = () => { if (serial === voiceSerial.current) setVoiceStatus("idle"); URL.revokeObjectURL(url); if (currentUrl.current === url) currentUrl.current = null; };
        audio.onerror = () => { if (serial === voiceSerial.current) setVoiceStatus("idle"); };
        await audio.play(); // May require a user gesture on mobile.
        return;
      } catch (error) {
        if (serial !== voiceSerial.current || controller.signal.aborted) return;
      }
    }
    if (serial === voiceSerial.current) fallbackVoice(spoken, target);
  }, [voiceEnabled, premiumReady, table, fallbackVoice]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // QR scan auto-opens the compact assistant; audio permission is controlled by the browser.
    const unlock = () => {
      if (!hasWelcomed.current) {
        hasWelcomed.current = true;
        setAudioUnlocked(true);
        speak(welcome.both, "hi");
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => { window.removeEventListener("pointerdown", unlock); stopVoice(); };
  // Initial gesture only. Never repeatedly replay welcome on re-render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedByTouch || lastTouchId.current === selectedByTouch.id) return;
    lastTouchId.current = selectedByTouch.id;
    setReview(false);
    const message = language === "en"
      ? (selectedByTouch.delta > 0 ? "Added " : "Removed ") + selectedByTouch.name + ". Anything else?"
      : selectedByTouch.name + (selectedByTouch.delta > 0 ? " जोड़ दिया। और कुछ?" : " कम कर दिया। कुछ और?");
    setMessages(m => [...m, { role: "assistant", text: message }]);
    // A tap on the menu should not trigger loud repeated speech in a busy dining room.
  }, [selectedByTouch, language]);

  useEffect(() => {
    if (!done) return;
    setReview(false);
    setChatOpen(true);
    const msg = language === "en" ? "Thanks! Order " + done.code + " is with the kitchen." : "धन्यवाद! ऑर्डर " + done.code + " किचन में भेज दिया है।";
    setMessages(m => [...m, { role: "assistant", text: msg }]);
    speak(msg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => { if (chatOpen) transcriptBottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, review, chatOpen]);

  function chooseLanguage(lang) {
    setLanguage(lang);
    const msg = welcome[lang];
    setMessages(m => [...m, { role: "assistant", text: msg }]);
    speak(msg, lang === "en" ? "en" : "hi");
  }

  function startReview() {
    const list = currentCart.current;
    if (!list.length) {
      const msg = language === "en" ? "First choose something from the menu." : "पहले मेन्यू से कुछ चुन लीजिए।";
      setMessages(m => [...m, { role: "assistant", text: msg }]);
      speak(msg);
      return;
    }
    setReview(true);
    setChatOpen(true);
    const lines = list.map(e => e.qty + " " + e.name + (e.variant !== "Regular" ? " " + e.variant : "")).join(", ");
    const sum = list.reduce((n, e) => n + e.qty * e.price, 0);
    const msg = language === "en"
      ? "Your order is " + lines + ". Total " + fmt(sum) + ". Shall I send it, or would you like any changes?"
      : "आपका ऑर्डर है " + lines + "। कुल " + fmt(sum) + "। किचन में भेजूँ, या कुछ बदलना है?";
    setMessages(m => [...m, { role: "assistant", text: msg }]);
    speak(msg);
  }

  async function confirm() {
    if (sent.current || done || !table || !currentCart.current.length) return;
    sent.current = true; setBusy(true); setHint("");
    try {
      const success = await onConfirmOrder();
      if (!success) setHint("Order was not saved. Please try again. / ऑर्डर नहीं गया।");
      else setReview(false);
    } catch { setHint("Couldn't send the order. / ऑर्डर नहीं गया।"); }
    finally { sent.current = false; setBusy(false); }
  }

  async function sendMessage(input) {
    const text = String(input || "").trim();
    if (!text || sent.current || done) return;
    setDraft(""); setHint("");
    setMessages(m => [...m, { role: "user", text }]);
    setChatOpen(true);
    if (!table) {
      const msg = "Please select your table first. / पहले टेबल चुनिए।";
      setMessages(m => [...m, { role: "assistant", text: msg }]); speak(msg); return;
    }
    if (review && yes.test(text)) { await confirm(); return; }
    if (review && no.test(text)) {
      setReview(false);
      const msg = language === "en" ? "Of course. Tell me what to change." : "ज़रूर, बताइए क्या बदलना है।";
      setMessages(m => [...m, { role: "assistant", text: msg }]); speak(msg); return;
    }
    sent.current = true; setBusy(true);
    try {
      const res = await fetch("/api/qr-waiter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text, table, language,
          cart: currentCart.current.map(c => ({ id: c.id, qty: c.qty, optionIndex: c.optionIndex })),
          history: messages.slice(-5),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Waiter unavailable");
      for (const op of data.operations || []) {
        if (op.type === "remove") onRemove(op.id, op.optionIndex, op.qty);
        else onAdd(op.id, op.optionIndex, op.qty);
      }
      if (data.wantsCheckout) {
        // Next render has up-to-date cart. Never place an order without explicit customer approval.
        setReview(true);
        const list = currentCart.current;
        const msg = language === "en"
          ? "Sure. Let's check your items and total. Any changes before I send it?"
          : "जी, एक बार पूरा ऑर्डर देख लीजिए। कुछ कम या ज़्यादा?";
        setMessages(m => [...m, { role: "assistant", text: msg }]); speak(msg);
      } else {
        const answer = String(data.reply || "Anything else?").slice(0,500);
        setReview(false);
        setMessages(m => [...m, { role: "assistant", text: answer }]);
        speak(answer);
      }
    } catch (error) {
      const msg = String(error.message || "Please try again.").slice(0,200);
      setMessages(m => [...m, { role: "assistant", text: msg }]); setHint(msg);
    } finally { sent.current = false; setBusy(false); }
  }

  function mic(locale) {
    if (listening) { try { recognition.current?.stop(); } catch {} return; }
    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      setHint("Microphone speech recognition isn't available on this browser. Please type your order.");
      setChatOpen(true);
      return;
    }
    stopVoice();
    try {
      const rec = new SpeechRecognition();
      rec.lang = locale || (language === "en" ? "en-IN" : "hi-IN");
      rec.continuous = false; rec.interimResults = false;
      rec.onresult = e => { const phrase = e.results?.[0]?.[0]?.transcript; if (phrase) sendMessage(phrase); };
      rec.onerror = e => {
        setListening(false);
        setHint(e.error === "not-allowed" ? "Please allow microphone / माइक की अनुमति दें।" : "Please speak again / फिर बोलिए।");
      };
      rec.onend = () => setListening(false);
      recognition.current = rec;
      rec.start();
      setListening(true);
      setHint(locale === "en-IN" ? "Listening in English..." : "सुन रहा हूँ...");
    } catch { setListening(false); setHint("Please try typing your order."); }
  }

  const toggleSound = () => {
    if (voiceEnabled) { stopVoice(); setVoiceEnabled(false); }
    else { setVoiceEnabled(true); setAudioUnlocked(true); }
  };
  const speaking = voiceStatus === "speaking" || voiceStatus === "preparing";

  return (
    <aside className="pointer-events-none fixed inset-x-3 bottom-[88px] z-[55] lg:inset-x-auto lg:bottom-5 lg:right-4 lg:top-[102px] lg:w-[318px]" aria-label="Ayodhya AI-assisted table waiter">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[480px] flex-col overflow-hidden rounded-[22px] border border-[#e8d9c8] bg-[#fffdf8] shadow-[0_16px_42px_rgba(42,30,19,0.16)] lg:h-full lg:max-w-none lg:rounded-[24px]">
        <div className="flex items-center gap-2.5 bg-white px-3 py-3 lg:px-4">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f5e7d9] text-[#a95333]">
            <AudioLines size={22} className={speaking ? "animate-pulse" : ""}/>
            {speaking && <span className="absolute -inset-1 rounded-full border border-[#bd764e]/40 animate-ping" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[.14em] text-[#a95333]">Ayodhya · Table {table || "—"}</p>
            <p className="truncate text-[14px] font-semibold text-[#32251e]">Your personal waiter</p>
            <p className="truncate text-[11px] text-[#897768]">{speaking ? "Speaking..." : listening ? "Listening..." : "नमस्ते! What would you like?"}</p>
          </div>
          <button type="button" onClick={toggleSound} aria-label={voiceEnabled ? "Mute assistant" : "Unmute assistant"} className="grid h-9 w-9 place-items-center rounded-full text-[#7b675b] hover:bg-[#f7eee7]">
            {voiceEnabled ? <Volume2 size={18}/> : <VolumeX size={18}/>}
          </button>
          <button type="button" aria-label={chatOpen ? "Minimize conversation" : "See conversation"} onClick={() => setChatOpen(v => !v)} className="grid h-9 w-9 place-items-center rounded-full bg-[#f6eee6] text-[#a95333] lg:hidden">
            {chatOpen ? <ChevronDown size={19}/> : <MessageCircle size={19}/>}
          </button>
        </div>
        {/* Menu is never obscured on mobile until guest explicitly expands the transcript. */}
        <div className={(chatOpen ? "flex" : "hidden") + " min-h-0 flex-col lg:flex lg:flex-1"}>
          <div className="flex items-center gap-1.5 border-y border-[#f1e7df] px-3 py-2">
            {[
              ["both","Hinglish"],["hi","हिंदी"],["en","English"]
            ].map(([value, label]) => <button key={value} type="button" onClick={() => chooseLanguage(value)} className={"rounded-full px-3 py-1.5 text-[11px] font-semibold " + (language === value ? "bg-[#a85334] text-white" : "bg-[#f5eee7] text-[#65544a]")}>{label}</button>)}
            <span className="ml-auto text-[10px] text-[#96897e]">{premiumReady ? "Studio voice" : "Device voice"}</span>
          </div>
          <div className="max-h-[32dvh] min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#faf6f1] p-3 lg:max-h-none">
            {messages.slice(-16).map((m, i) => <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={"max-w-[94%] rounded-2xl px-3 py-2 text-[12px] leading-[1.55] " + (m.role === "user" ? "rounded-br-sm bg-[#a85334] text-white" : "rounded-bl-sm border border-[#e9dfd4] bg-white text-[#41352e]")}>
                {m.text}
              </div>
            </div>)}
            {review && !done && <div className="rounded-xl border border-[#c8d9bf] bg-[#f1f7ed] p-3">
              <strong className="text-[13px] text-[#3d6335]">Is this correct? · यही चाहिए?</strong>
              {cartDetails.map(c => <p key={c.key} className="mt-1 flex justify-between gap-1 text-[11px]"><span>{c.qty} × {c.name}{c.variant !== "Regular" ? " (" + c.variant + ")" : ""}</span><b>{fmt(c.qty*c.price)}</b></p>)}
              <div className="mt-2 flex justify-between border-t border-[#c8d9bf] pt-2 text-[12px] font-bold"><span>Total</span><span>{fmt(total)}</span></div>
              <p className="mt-2 text-[11px] text-[#536d48]">Kuch kam ya zyada? / Any changes?</p>
              <button type="button" onClick={confirm} disabled={busy || !count} className="mt-2 w-full rounded-xl bg-[#426b3a] px-3 py-2.5 text-[12px] font-bold text-white disabled:opacity-50">Confirm & Send to Kitchen</button>
              <button type="button" onClick={() => setReview(false)} className="mt-2 w-full text-[11px] font-semibold text-[#426b3a] underline">Change order / कुछ बदलना है</button>
            </div>}
            {!!done && <Link href={"/qr-track/" + done.token} className="block rounded-xl bg-[#426b3a] px-3 py-3 text-center text-xs font-bold text-white">Track order · {done.code}</Link>}
            <div ref={transcriptBottom}/>
          </div>
          <div className="border-t border-[#eee3d9] bg-white px-3 py-2">
            {count > 0 && <div className="mb-2 rounded-xl bg-[#faf4ed] px-3 py-2">
              <div className="flex items-center justify-between text-[12px] font-bold text-[#513a2c]"><span>{count} items selected</span><span>{fmt(total)}</span></div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cartDetails.slice(0,4).map(c => <span key={c.key} className="rounded-full bg-white px-2 py-1 text-[10px] text-[#685344]">{c.qty}× {c.name}</span>)}
              </div>
              {!review && !done && <button type="button" onClick={startReview} className="mt-2 w-full rounded-lg bg-[#3f342e] px-3 py-2 text-[11px] font-bold text-white">Review order · ऑर्डर चेक करें</button>}
            </div>}
            <form onSubmit={e => { e.preventDefault(); sendMessage(draft); }} className="flex items-center gap-1.5">
              <input aria-label="Message to waiter" disabled={!!done} value={draft} onChange={e => setDraft(e.target.value)} placeholder="I'd like... / मुझे चाहिए..." maxLength={350} className="min-w-0 flex-1 rounded-full border border-[#e5d7ca] bg-[#faf6f2] px-3 py-2.5 text-[12px] outline-none focus:border-[#b76a49]"/>
              <button type="submit" disabled={busy || !draft.trim() || !!done} aria-label="Send message to waiter" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#a85334] text-white disabled:opacity-50"><Send size={15}/></button>
            </form>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-[#efe5dc] bg-white px-3 py-2.5">
          <button type="button" onClick={() => { setChatOpen(true); mic(language === "en" ? "en-IN" : "hi-IN"); }} disabled={busy || !!done} aria-label={listening ? "Stop recording" : "Speak Hindi order"} className={"flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-bold text-white transition disabled:opacity-40 " + (listening ? "animate-pulse bg-rose-600" : "bg-[#a85334]")}>
            {listening ? <MicOff size={18}/> : <Mic size={18}/>}
            {listening ? "Listening..." : "Speak / बोलें"}
          </button>
          <button type="button" onClick={() => { setChatOpen(true); mic("en-IN"); }} disabled={busy || !!done} className="rounded-full border border-[#ead9ca] px-3 py-2 text-[11px] font-bold text-[#8c563e] disabled:opacity-40" aria-label="Speak English order">EN</button>
          <button type="button" onClick={() => setChatOpen(v => !v)} className="flex items-center gap-1 rounded-full bg-[#f7eee7] px-3 py-2 text-[11px] font-bold text-[#7c5844] lg:hidden"><MessageCircle size={14}/>Chat</button>
        </div>
        {hint && <p role="status" className="px-3 pb-2 text-[10px] text-amber-800">{hint}</p>}
        <p className="hidden border-t border-[#f1e7de] px-3 py-2 text-center text-[10px] text-[#9a8980] lg:block">AI-generated voice · Tap mic to speak · Your menu remains available</p>
      </div>
    </aside>
  );
}
