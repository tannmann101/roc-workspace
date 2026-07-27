const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

// Same household allow-list as firestore.rules -- keep the two in sync by
// hand, since Functions runs in a separate deploy from the Firestore rules.
const ALLOWED_EMAILS = ['tannerwesgardner@gmail.com', 'rochelleygardner@gmail.com'];

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 512;

// The one thing every AI-assist tool in the app calls: takes a prompt,
// returns Claude's raw text. All the "draft into a preview, only write on
// accept" logic lives client-side (src/ui.jsx's AIAssist) -- this function
// has no opinion about what the prompt is for.
exports.generateText = onCall({ secrets: [anthropicApiKey] }, async (request) => {
  const email = request.auth?.token?.email;
  if (!email || !ALLOWED_EMAILS.includes(email)) {
    throw new HttpsError('permission-denied', 'Not authorized.');
  }

  const prompt = request.data?.prompt;
  if (!prompt || typeof prompt !== 'string') {
    throw new HttpsError('invalid-argument', 'A prompt string is required.');
  }

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicApiKey.value(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    console.error('Claude request threw', err);
    throw new HttpsError('unavailable', 'Could not reach Claude.');
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error('Claude API error', response.status, errText);
    if (response.status === 429) {
      throw new HttpsError('resource-exhausted', "Hit Claude's rate limit -- wait a moment and try again.");
    }
    throw new HttpsError('internal', `Claude request failed (${response.status}).`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new HttpsError('internal', 'Claude returned an empty response.');
  }

  return { text: text.trim() };
});
