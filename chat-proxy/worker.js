/**
 * Cloudflare Worker that proxies the portfolio chatbot to DeepSeek.
 *
 * The DeepSeek API key is stored here as a Worker secret (DEEPSEEK_API_KEY),
 * so it never reaches the browser. GitHub Pages is static and has no env vars —
 * anything in the repo is public, which is why this small proxy exists.
 *
 * Deploy: see chat-proxy/README.md
 */

const ALLOWED_ORIGINS = [
  "https://bejawadaharish.com",
  "https://www.bejawadaharish.com",
  "https://harishb2727.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8123",
  "http://127.0.0.1:8123",
];

const MAX_MESSAGES = 20;
const MAX_CHARS = 12000;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: allowed ? 204 : 403,
        headers: allowed ? corsHeaders(origin) : {},
      });
    }

    if (!allowed) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "messages is required" }, 400, origin);
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: "Too many messages" }, 413, origin);
    }

    const totalChars = messages.reduce(
      (n, m) => n + String(m && m.content ? m.content : "").length,
      0
    );
    if (totalChars > MAX_CHARS) {
      return json({ error: "Conversation too long" }, 413, origin);
    }

    const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages.map((m) => ({
          role: m.role === "system" || m.role === "assistant" ? m.role : "user",
          content: String(m.content || "").slice(0, 8000),
        })),
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("DeepSeek error", upstream.status, detail);
      return json({ error: "Upstream error" }, 502, origin);
    }

    const data = await upstream.json();
    return json(data, 200, origin);
  },
};

function json(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
