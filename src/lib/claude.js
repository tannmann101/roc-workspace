// claude.js
// Client for the generateText Cloud Function (functions/index.js), which
// proxies to the real Claude API server-side -- the API key never reaches
// the browser. Firebase's callable protocol handles auth (the signed-in
// user's ID token) and CORS automatically.

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase.js';

const generateTextFn = httpsCallable(functions, 'generateText');

export async function callClaude(prompt) {
  try {
    const result = await generateTextFn({ prompt });
    return result.data.text.trim();
  } catch (err) {
    throw new Error(err.message || 'Claude request failed.');
  }
}

// Claude sometimes wraps JSON answers in ```json fences even when told not
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
