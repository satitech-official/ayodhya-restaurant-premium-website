import crypto from "node:crypto";
import { qrPool } from "@/db/qr-pool";
import { pilotEnabled, sameOrigin, validTable } from "@/lib/qr-dinein";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const voices = {
  hi: process.env.ELEVENLABS_HINDI_VOICE_ID || process.env.ELEVENLABS_VOICE_ID,
  en: process.env.ELEVENLABS_ENGLISH_VOICE_ID || process.env.ELEVENLABS_VOICE_ID,
};
function ready() {
  return Boolean(process.env.ELEVENLABS_API_KEY && voices.hi && voices.en);
}
export async function GET() {
  return Response.json({
    studioVoiceAvailable: pilotEnabled() && ready(),
    disclosure: "Voice is AI-generated, not a human recording.",
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  if (!pilotEnabled()) return Response.json({ error: "Ordering is unavailable." }, { status: 503 });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  if (!ready()) return Response.json({ error: "Studio voice is not configured." }, { status: 503 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "JSON required." }, { status: 415 });
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid message." }, { status: 400 }); }

  const rawText = String(body?.text || "").trim();
  const lang = body?.language === "en" ? "en" : "hi";
  const table = String(body?.table || "");
  if (!validTable(table) || !rawText || rawText.length > 380)
    return Response.json({ error: "Invalid speech text or table." }, { status: 400 });
  // Prevent arbitrary huge or repeated public use of a paid voice service.
  const text = rawText.replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim();
  try {
    if (qrPool) {
      await qrPool.query(
        "CREATE TABLE IF NOT EXISTS qr_tts_usage (id BIGSERIAL PRIMARY KEY, table_code TEXT NOT NULL, visitor_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())"
      );
      const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
      const hash = crypto.createHmac("sha256", process.env.QR_STAFF_SECRET || "qr-tts").update(ip).digest("hex");
      const recent = await qrPool.query(
        "SELECT count(*)::int AS n FROM qr_tts_usage WHERE table_code=$1 AND visitor_hash=$2 AND created_at > NOW()-INTERVAL '15 minutes'",
        [table, hash]
      );
      if (recent.rows[0].n >= 35)
        return Response.json({ error: "Voice usage limit reached. Text ordering is still available." }, { status: 429 });
      await qrPool.query("INSERT INTO qr_tts_usage (table_code,visitor_hash) VALUES ($1,$2)", [table, hash]);
    }

    const voiceId = voices[lang];
    if (!/^[a-zA-Z0-9]{12,60}$/.test(voiceId))
      return Response.json({ error: "Voice configuration invalid." }, { status: 503 });
    const answer = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId) + "?output_format=mp3_44100_128",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
          voice_settings: { stability: 0.52, similarity_boost: 0.77, style: 0.18, use_speaker_boost: true },
        }),
        signal: AbortSignal.timeout(13000),
      }
    );
    if (!answer.ok) {
      console.warn("[Ayodhya QR] premium TTS failed HTTP", answer.status);
      return Response.json({ error: "Studio voice unavailable; device voice fallback." }, { status: 503 });
    }
    const audio = await answer.arrayBuffer();
    if (audio.byteLength > 800000) return Response.json({ error: "Generated voice too long." }, { status: 502 });
    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    console.warn("[Ayodhya QR] TTS connection failed:", error?.message || error);
    return Response.json({ error: "Voice unavailable; text ordering remains available." }, { status: 503 });
  }
}
