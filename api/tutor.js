/* =========================================================
   Mr Marvin, the AI tutor — Vercel serverless function.
   POST /api/tutor  { messages: [{role, content}], page?: string }
   Streams the answer back as plain text.

   Providers, tried in order (a failure falls through to the next):
   1. NVIDIA_API_KEY               → NVIDIA Nemotron (OpenAI-style API)
   2. ANTHROPIC_API_KEY            → Claude API directly
   3. AI_GATEWAY_API_KEY / Vercel OIDC token → Claude via Vercel AI Gateway
   Keys live in Vercel environment variables, never in this repository.
   ========================================================= */
const Anthropic = require("@anthropic-ai/sdk");
const { courseText } = require("./_course.js");

const PERSONA = `You are Mr Marvin, a warm, upbeat AI tutor on the "US AP History Study Guide" website. You help a high-school student prepare for AP U.S. History, Units 1-5 (1491-1877).

How you teach:
- Answer the question first, in plain words a 15-year-old understands. Then add the "why it matters on the exam" angle.
- Keep answers short: usually 2-5 short paragraphs or a tight bullet list. Use **bold** for key terms and dates.
- Ground everything in the course notes below. They are the same notes, terms, timelines, videos and practice questions the student sees on the site. Point to them when useful ("the Unit 3 group chat", "the Missouri Compromise flashcard", "Heimler's Unit 4 review video").
- If the student asks about AP U.S. History outside these notes but inside Units 1-5, answer from solid historical knowledge and say it goes a bit beyond the site's notes.
- If they ask about something unrelated to US history or studying, gently steer back.
- Use memory hacks, cause-and-effect chains and quick comparisons. When it helps, end with one quick check-yourself question.
- If they want to be quizzed, ask one AP-style multiple-choice question at a time (A-D), wait for their answer, then explain.
- Be encouraging, never condescending. Small steps every day.
- Never invent quotes, dates or statistics. If unsure, say so.

COURSE NOTES (the website's content):
`;

let SYSTEM = null;
function system() {
  if (!SYSTEM) SYSTEM = PERSONA + courseText();
  return SYSTEM;
}

function clientFor(req) {
  if (process.env.ANTHROPIC_API_KEY) {
    return { client: new Anthropic(), model: "claude-opus-5-5", direct: true };
  }
  const token = process.env.AI_GATEWAY_API_KEY || req.headers["x-vercel-oidc-token"] || process.env.VERCEL_OIDC_TOKEN;
  if (!token) return null;
  return {
    client: new Anthropic({ apiKey: token, baseURL: "https://ai-gateway.vercel.sh" }),
    model: "anthropic/claude-opus-5.5",
    direct: false,
  };
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-16)
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs;
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch (e) { return {}; }
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const status = { ok: true, tutor: "Mr Marvin", providers: { nvidia: !!process.env.NVIDIA_API_KEY, claude: !!clientFor(req) } };
    if (req.query && req.query.check === "1" && process.env.NVIDIA_API_KEY) {
      /* health check: one tiny question, reports whether the NVIDIA model answered */
      let text = "";
      try { await streamNvidia({ messages: [{ role: "user", content: "In one short sentence, what was the Stamp Act?" }] }, t => { text += t; }); status.nvidiaCheck = { ok: true, sample: text.slice(0, 200) }; }
      catch (e) { status.nvidiaCheck = { ok: false, error: String(e && e.message).slice(0, 300) }; }
    }
    res.status(200).json(status);
    return;
  }
  if (req.method !== "POST") { res.status(405).json({ error: "Use POST" }); return; }

  const body = await readBody(req);
  const messages = cleanMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    res.status(400).json({ error: "Send at least one user message." }); return;
  }
  const c = clientFor(req);
  if (!c && !process.env.NVIDIA_API_KEY) { res.status(503).json({ error: "Mr Marvin has no AI credentials on this deployment." }); return; }

  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "";
  const params = {
    model: c.model,
    max_tokens: 4000,
    system: [
      { type: "text", text: system(), cache_control: { type: "ephemeral" } },
    ],
    output_config: { effort: "low" },
    messages: page
      ? [...messages.slice(0, -1), { role: "user", content: `(I'm on the "${page}" part of the site.)\n\n${messages[messages.length - 1].content}` }]
      : messages,
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Accel-Buffering", "no");

  const state = { wrote: false };
  const write = t => { state.wrote = true; res.write(t); };
  const errors = [];

  if (process.env.NVIDIA_API_KEY) {
    try { await streamNvidia(params, write); res.end(); return; }
    catch (err) { errors.push("nvidia: " + (err && err.message)); console.error("tutor nvidia error:", err && err.message); if (state.wrote) { res.end("\n\n_(My connection dropped. Ask me to keep going!)_"); return; } }
  }
  if (c) {
    try { await streamClaude(c, params, write, state); res.end(); return; }
    catch (err) { errors.push("claude: " + (err && err.message)); console.error("tutor claude error:", err && err.status, err && err.message); if (state.wrote) { res.end("\n\n_(My connection dropped. Ask me to keep going!)_"); return; } }
  }
  res.statusCode = 502;
  res.end("__TUTOR_ERROR__");
};

/* ---------- NVIDIA Nemotron, OpenAI-compatible chat completions, streamed ---------- */
async function streamNvidia(params, write) {
  const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + process.env.NVIDIA_API_KEY, "Content-Type": "application/json", "Accept": "text/event-stream" },
    body: JSON.stringify({
      model: process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b",
      messages: [{ role: "system", content: system() }, ...params.messages],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 3000,
      stream: true,
      chat_template_kwargs: { enable_thinking: false },
    }),
  });
  if (!r.ok || !r.body) throw new Error("HTTP " + r.status + " " + (await r.text().catch(() => "")).slice(0, 300));
  const dec = new TextDecoder();
  let buf = "", any = false;
  for await (const chunk of r.body) {
    buf += dec.decode(chunk, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const j = JSON.parse(data);
        const t = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
        if (t) { any = true; write(t); }
      } catch (e) { /* partial or keep-alive line */ }
    }
  }
  if (!any) throw new Error("empty response");
}

/* ---------- Claude (direct or through Vercel AI Gateway), streamed ---------- */
async function streamClaude(c, params, write, state) {
  const stream = c.direct
    ? c.client.beta.messages.stream({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
    : c.client.messages.stream(params);
  stream.on("text", t => write(t));
  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal" && !state.wrote) {
    write("I can't help with that one, but I'd love to help with anything from Units 1–5. Try asking about a person, event or term!");
  }
}
