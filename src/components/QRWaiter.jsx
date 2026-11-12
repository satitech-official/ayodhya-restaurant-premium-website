"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, CheckCircle2, ChevronDown, ChevronUp, Mic, MicOff, Minus, Plus, Send, ShoppingBag, Volume2, VolumeX, X } from "lucide-react";

const money = (v) => "₹" + Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const greetings = {
  both: "नमस्ते! Welcome to Ayodhya Restaurant. मैं आपका virtual waiter हूँ. What would you like to order today? आप डिश पर टैप कर सकते हैं या मुझसे बोलकर ऑर्डर दे सकते हैं।",
  hi: "नमस्ते! आयोध्या रेस्टोरेंट में आपका स्वागत है। मैं आपका वेटर हूँ। बताइए आज आप क्या खाना पसंद करेंगे? आप मेन्यू में डिश पर टैप कर सकते हैं या मुझसे बोल सकते हैं।",
  en: "Welcome to Ayodhya Restaurant! I'll take your order. You can tap a dish on the menu, speak to me, or type what you'd like. What can I get you today?",
};
const yesRE = /^(हाँ|हां|हा|haan|han|yes|yep|confirm|कन्फर्म|पक्का|भेजो|भेज दो|लगा दो|place it|place order|confirm order)\s*[!.।]*$/i;
const noRE = /^(नहीं|nahi|nahin|no|change|बदलना है|कुछ बदलना|modify)\s*[!.।]*$/i;
const rupeeSpeech = (s, lang) => String(s || "").replace(/[🙏🥘✅🍽️]/gu, "").replace(/₹(\d+(?:\.\d+)?)/g, (m, n) => lang === "en" ? n + " rupees" : n + " रुपये");
const isHindi = (lang) => lang !== "en";

export default function QRWaiter({
  table, cartDetails, onAdd, onRemove, onConfirmOrder, done, selectedByTouch,
}) {
  const [language, setLanguage] = useState("both");
  const [expanded, setExpanded] = useState(true); // AUTOMATICALLY OPEN after scanning QR, never requires opening chat
  const [messages, setMessages] = useState([{ role: "assistant", text: greetings.both }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [voiceReady, setVoiceReady] = useState(false);
  const [review, setReview] = useState(false);
  const [hint, setHint] = useState("");
  const [mode, setMode] = useState("guided");
  const sending = useRef(false);
  const speech = useRef(null);
  const speechListening = useRef(null);
  const end = useRef(null);
  const lastTouch = useRef(0);
  const voiceUnlocked = useRef(false);
  const cartCount = cartDetails.reduce((sum, e) => sum + e.qty, 0);
  const cartTotal = cartDetails.reduce((sum, e) => sum + e.qty * e.price, 0);

  const say = useCallback((words, preferred = language) => {
    if (!voiceOn || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      if (preferred === "both") {
        const first = new SpeechSynthesisUtterance("नमस्ते! आयोध्या रेस्टोरेंट में आपका स्वागत है। बताइए क्या खाना पसंद करेंगे?");
        first.lang = "hi-IN"; first.rate = 0.95;
        const second = new SpeechSynthesisUtterance("Welcome to Ayodhya Restaurant. What would you like to order?");
        second.lang = "en-IN"; second.rate = 0.95;
        window.speechSynthesis.speak(first);
        window.speechSynthesis.speak(second);
        speech.current = second;
      } else {
        const u = new SpeechSynthesisUtterance(rupeeSpeech(words, preferred));
        u.lang = preferred === "en" ? "en-IN" : "hi-IN";
        u.rate = 0.96; u.pitch = 1.04;
        const match = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(preferred === "en" ? "en-in" : "hi"));
        if (match) u.voice = match;
        window.speechSynthesis.speak(u);
        speech.current = u;
      }
    } catch { /* Voice output not supported; chat remains fully usable. */ }
  }, [language, voiceOn]);

  // Attempt welcome narration automatically. iOS/Android autoplay policies often require a tap:
  // visible bilingual greeting always loads automatically and sound is unlocked on first user gesture.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let alreadyStarted = false;
    const speakHello = () => {
      if (!voiceUnlocked.current) {
        voiceUnlocked.current = true;
        setVoiceReady(true);
        if (!alreadyStarted) say(greetings.both, "both");
      }
    };
    try {
      const u = new SpeechSynthesisUtterance("नमस्ते! Welcome to Ayodhya Restaurant!");
      u.lang = "hi-IN"; u.rate = 0.94;
      u.onstart = () => { alreadyStarted = true; setVoiceReady(true); voiceUnlocked.current = true; };
      window.speechSynthesis?.speak(u);
    } catch { /* First gesture will unlock narration. */ }
    window.addEventListener("pointerdown", speakHello, { once: true, passive: true });
    window.addEventListener("keydown", speakHello, { once: true });
    return () => {
      window.removeEventListener("pointerdown", speakHello);
      window.removeEventListener("keydown", speakHello);
      try { speechListening.current?.abort(); window.speechSynthesis?.cancel(); } catch {}
    };
  // Run only on mount. Voice and menu remain visible regardless of autoplay support.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (expanded) end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, expanded, review]);

  useEffect(() => {
    if (!selectedByTouch || selectedByTouch.id === lastTouch.current) return;
    lastTouch.current = selectedByTouch.id;
    const adding = selectedByTouch.delta > 0;
    const name = selectedByTouch.name;
    const count = Math.abs(selectedByTouch.delta);
    const text = language === "en"
      ? (adding ? "Added " : "Removed ") + count + " " + name + ". Would you like anything else? When you're ready, I'll review your full order."
      : (adding ? count + " × " + name + " आपके ऑर्डर में जोड़ दिया है।" : count + " × " + name + " कम कर दिया है।") + " क्या कुछ और लेना चाहेंगे? ऑर्डर पूरा हो तो रिव्यू करें।";
    setMessages((old) => [...old, { role: "assistant", text }]);
    setReview(false); // Every modification invalidates any previous confirmation screen.
    say(text);
  }, [selectedByTouch, language, say]);

  useEffect(() => {
    if (!done) return;
    setReview(false);
    setExpanded(true);
    const text = language === "en"
      ? "Thank you! Your confirmed order " + done.code + " from table " + table + " has been sent to the kitchen."
      : "धन्यवाद! टेबल " + table + " का ऑर्डर नंबर " + done.code + " किचन में भेज दिया गया है।";
    setMessages((old) => [...old, { role: "assistant", text }]);
    say(text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function chooseLanguage(next) {
    setLanguage(next);
    const intro = next === "both" ? greetings.both : greetings[next];
    setMessages((old) => [...old, { role: "assistant", text: intro }]);
    say(intro, next);
  }

  function requestReview() {
    if (!cartDetails.length) {
      const text = language === "en" ? "Your cart is empty. Please choose a dish first." : "अभी आपका ऑर्डर खाली है। पहले कोई डिश चुनिए।";
      setMessages((old) => [...old, { role: "assistant", text }]);
      say(text);
      return;
    }
    setReview(true); setExpanded(true);
    const list = cartDetails.map((e) => e.qty + " " + e.name + (e.variant && e.variant !== "Regular" ? " " + e.variant : "")).join(", ");
    const text = language === "en"
      ? "Let me confirm: " + list + ". Total " + money(cartTotal) + ". Is this exactly what you want, or would you like to add or remove anything? I will send it only after your confirmation."
      : "ऑर्डर दोबारा सुन लीजिए: " + list + "। कुल " + money(cartTotal) + "। क्या यही चाहिए, या कुछ कम या ज़्यादा करना चाहेंगे? आपकी पुष्टि के बाद ही किचन में भेजूँगा।";
    setMessages((old) => [...old, { role: "assistant", text }]);
    say(text);
  }

  async function finalConfirm() {
    if (!cartDetails.length || !table || sending.current || done) return;
    sending.current = true; setBusy(true); setHint(language === "en" ? "Sending your order to kitchen..." : "किचन में ऑर्डर भेज रहे हैं...");
    try {
      const ok = await onConfirmOrder();
      if (ok) { setReview(false); setHint(""); }
      else setHint(language === "en" ? "Order could not be saved. Please retry." : "ऑर्डर सेव नहीं हो सका, फिर कोशिश करें।");
    } catch {
      setHint(language === "en" ? "Unable to place order. Please try again." : "ऑर्डर नहीं जा पाया, फिर कोशिश करें।");
    } finally {
      sending.current = false; setBusy(false);
    }
  }

  async function handleUtterance(message) {
    const input = String(message || "").trim();
    if (!input || sending.current || done) return;
    setDraft(""); setHint(""); setExpanded(true);
    setMessages((old) => [...old, { role: "user", text: input }]);
    if (!table) {
      const text = language === "en" ? "Please select your table first." : "पहले अपनी टेबल चुनें।";
      setMessages((old) => [...old, { role: "assistant", text }]); say(text); return;
    }
    if (review && yesRE.test(input)) { await finalConfirm(); return; }
    if (review && noRE.test(input)) {
      setReview(false);
      const text = language === "en" ? "Of course. Tell me what to change, or use the plus and minus buttons." : "जी बिल्कुल। बताइए क्या बदलना है, या प्लस-माइनस बटन इस्तेमाल करें।";
      setMessages((old) => [...old, { role: "assistant", text }]); say(text); return;
    }
    sending.current = true; setBusy(true);
    try {
      const response = await fetch("/api/qr-waiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input, table, language,
          cart: cartDetails.map((c) => ({ id: c.id, qty: c.qty, optionIndex: c.optionIndex })),
          history: messages.slice(-4),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sorry, I couldn't hear that.");
      for (const op of data.operations || []) {
        if (op.type === "remove") onRemove(op.id, op.optionIndex, op.qty);
        else onAdd(op.id, op.optionIndex, op.qty);
      }
      const text = String(data.reply || (language === "en" ? "What else would you like?" : "और क्या चाहिए?"));
      setMessages((old) => [...old, { role: "assistant", text }]);
      setMode(data.mode || "guided");
      if (data.wantsCheckout) {
        // First render the updated cart then review; never auto-place.
        setReview(true);
      } else if ((data.operations || []).length) setReview(false);
      say(text, language === "both" ? "hi" : language);
    } catch (error) {
      const text = error.message || (language === "en" ? "Please try again or tap a menu item." : "कृपया फिर बोलें या डिश पर टैप करें।");
      setMessages((old) => [...old, { role: "assistant", text }]); setHint(text);
    } finally {
      sending.current = false; setBusy(false);
    }
  }

  function microphone() {
    if (listening) { try { speechListening.current?.stop(); } catch {} return; }
    const Recognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!Recognition) {
      setHint(language === "en" ? "Voice input isn't supported here. Type your order or use Chrome on Android." : "इस ब्राउज़र पर माइक उपलब्ध नहीं है। लिखकर बताएँ या Android Chrome इस्तेमाल करें।");
      return;
    }
    try {
      window.speechSynthesis?.cancel();
      const r = new Recognition();
      r.lang = language === "en" ? "en-IN" : "hi-IN";
      r.interimResults = false; r.continuous = false;
      r.maxAlternatives = 1;
      r.onresult = (e) => {
        const words = e.results?.[0]?.[0]?.transcript;
        if (words) handleUtterance(words);
      };
      r.onerror = (e) => {
        setHint(e.error === "not-allowed"
          ? (language === "en" ? "Please allow microphone permission." : "कृपया माइक की अनुमति दें।")
          : (language === "en" ? "I couldn't hear clearly. Please try again." : "आवाज़ साफ़ नहीं आई, फिर बोलिए।"));
        setListening(false);
      };
      r.onend = () => setListening(false);
      speechListening.current = r;
      r.start(); setListening(true);
      setHint(language === "en" ? "I'm listening. Please speak..." : "सुन रहा हूँ, बोलिए...");
    } catch { setListening(false); setHint("Microphone unavailable / माइक उपलब्ध नहीं है।"); }
  }

  return <div className="pointer-events-none fixed inset-x-2 bottom-[82px] z-[55] flex justify-end sm:inset-x-auto sm:bottom-5 sm:right-5 lg:right-5 lg:top-[106px] lg:bottom-[24px]">
    {!expanded ? (
      <button type="button" onClick={() => setExpanded(true)} className="pointer-events-auto ml-auto flex items-center gap-2 rounded-full border-2 border-white bg-terracotta px-5 py-3 text-sm font-bold text-white shadow-2xl" aria-label="Reopen virtual waiter">
        <Bot size={19}/> आपका Waiter · Order by voice <ChevronUp size={17}/>
      </button>
    ) : (
      <section className="pointer-events-auto flex h-[min(54dvh,535px)] w-full max-w-[430px] flex-col overflow-hidden rounded-[22px] border border-brass/35 bg-[#fffaf1] text-charcoal shadow-[0_14px_60px_rgba(0,0,0,.3)] sm:h-[min(72dvh,650px)] lg:h-full" aria-label="Auto-open bilingual waiter and voice ordering">
        <header className="flex shrink-0 items-center justify-between gap-2 bg-charcoal px-3 py-3 text-white">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta"><Bot size={21}/></span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-base font-semibold">आपका Waiter · Your Waiter</h2>
            <p className="truncate text-[10px] text-brass">Table {table || "—"} · Chat + Voice + Touch</p>
          </div>
          <button type="button" className="rounded-full p-1.5 text-white hover:bg-white/10" onClick={() => { setVoiceOn(!voiceOn); window.speechSynthesis?.cancel(); }} aria-label={voiceOn ? "Mute waiter" : "Unmute waiter"}>
            {voiceOn ? <Volume2 size={18}/> : <VolumeX size={18}/>}
          </button>
          <button type="button" onClick={() => setExpanded(false)} aria-label="Minimize waiter, keep menu open" className="rounded-full p-1.5 hover:bg-white/10"><ChevronDown size={22}/></button>
        </header>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-sand bg-white px-3 py-2">
          {[
            { k: "both", name: "हिंदी + English" },
            { k: "hi", name: "हिंदी" },
            { k: "en", name: "English" },
          ].map((e) => <button key={e.k} type="button" onClick={() => chooseLanguage(e.k)} className={"rounded-full px-3 py-1.5 text-[11px] font-semibold " + (language === e.k ? "bg-terracotta text-white" : "bg-cream text-charcoal")}>{e.name}</button>)}
          {!voiceReady && <span className="text-[10px] text-walnut">Tap once for audio / आवाज़</span>}
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-cream/50 p-3" aria-live="polite">
          {messages.map((m, i) => <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={"max-w-[94%] rounded-2xl px-3 py-2 text-[13px] leading-5 " + (m.role === "user" ? "bg-terracotta text-white" : "border border-sand bg-white text-charcoal")}>
              {m.role === "assistant" && <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-terracotta">Waiter</span>}
              {m.text}
            </div>
          </div>)}
          {busy && <p className="rounded-xl bg-white p-3 text-xs text-walnut">One moment · एक क्षण...</p>}
          {cartCount > 0 && <div className="rounded-xl border border-brass/30 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <strong className="flex items-center gap-1.5 text-[12px]"><ShoppingBag size={14}/> Your Order / आपका ऑर्डर</strong>
              <span className="text-sm font-bold text-terracotta">{money(cartTotal)}</span>
            </div>
            {cartDetails.map((e) => <div key={e.key} className="mt-2 flex items-center justify-between gap-2 border-t border-sand/65 pt-2 text-[12px]">
              <span className="min-w-0 flex-1">{e.name}{e.variant && e.variant !== "Regular" ? " · " + e.variant : ""}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onRemove(e.id, e.optionIndex, 1)} className="rounded-full bg-cream p-1.5" aria-label={"Reduce " + e.name}><Minus size={13}/></button>
                <strong>{e.qty}</strong>
                <button type="button" onClick={() => onAdd(e.id, e.optionIndex, 1)} className="rounded-full bg-cream p-1.5" aria-label={"Increase " + e.name}><Plus size={13}/></button>
              </div>
            </div>)}
            {!review && !done && <button onClick={requestReview} type="button" className="mt-3 w-full rounded-lg bg-charcoal px-3 py-2 text-xs font-bold text-white">ऑर्डर पूरा · Review & Confirm</button>}
          </div>}
          {review && !done && <div className="rounded-xl border-2 border-emerald-600 bg-emerald-50 p-3">
            <h3 className="font-bold text-emerald-900">यही चाहिए? · Is this correct?</h3>
            <p className="mt-1 text-[12px] text-emerald-900">
              {cartCount} items · {money(cartTotal)}. Add or remove anything? कुछ कम या ज़्यादा करना है?
            </p>
            <p className="mt-1 text-[11px] text-emerald-900">Only your final confirmation will send the order to the chef.</p>
            <button type="button" disabled={busy || !cartCount || !table} onClick={finalConfirm} className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50">हाँ, Confirm & Send to Kitchen</button>
            <button type="button" onClick={() => setReview(false)} className="mt-2 w-full text-[12px] font-semibold text-emerald-800 underline">Change order / कुछ बदलना है</button>
          </div>}
          {done && <Link className="block rounded-lg bg-emerald-700 px-3 py-3 text-center text-xs font-bold text-white" href={"/qr-track/" + done.token}>Track order {done.code} · ऑर्डर ट्रैक करें</Link>}
          <div ref={end}/>
        </div>
        <div className="shrink-0 border-t border-sand bg-white p-3">
          {!!hint && <p role="status" className="mb-2 text-[11px] text-amber-800">{hint}</p>}
          <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleUtterance(draft); }}>
            <button type="button" onClick={microphone} disabled={busy || !!done} aria-label={listening ? "Stop listening" : "Speak your order in Hindi or English"} className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 " + (listening ? "animate-pulse bg-red-600" : "bg-terracotta")}>
              {listening ? <MicOff size={20}/> : <Mic size={20}/>}
            </button>
            <input aria-label="Hindi or English food order" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={350} disabled={!!done} className="min-w-0 flex-1 rounded-full border border-sand bg-cream px-3 py-2.5 text-[14px] outline-none focus:border-terracotta" placeholder="मुझे ये चाहिए / I want..." />
            <button type="submit" disabled={busy || !draft.trim() || !!done} aria-label="Send to waiter" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-white disabled:opacity-40"><Send size={17}/></button>
          </form>
          <p className="mt-1.5 text-center text-[10px] text-walnut">Assistant opens automatically; microphone requires browser permission. Audio may need first tap.</p>
        </div>
      </section>
    )}
  </div>;
}
