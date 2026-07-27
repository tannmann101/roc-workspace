// gemini.js
// Thin client for Google's Gemini API (free tier via AI Studio -- see
// README for how to get a key). Called directly from the browser: there's
// no backend in this stack, so the key is restricted by HTTP referrer in
// Google Cloud Console rather than hidden behind a server. That's the
// standard mitigation for a client-only app like this one, not an
// oversight -- see README for the exact steps.

const MODEL = 'gemini-2.0-flash';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('No Gemini API key set -- add VITE_GEMINI_API_KEY to .env.local (see README).');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Hit Gemini's free-tier rate limit -- wait a moment and try again.");
    }
    throw new Error(`Gemini request failed (${res.status}).`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response -- try regenerating.');
  }
  return text.trim();
}

// Gemini sometimes wraps JSON answers in ```json fences even when told not
// to -- strip those before parsing, and fail soft (null) rather than throw,
// since a malformed draft should fall back gracefully, not crash the page.
export function safeParseJson(text) {
  try {
    const cleaned = text.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
