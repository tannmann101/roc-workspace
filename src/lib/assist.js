// assist.js
// Real AI-assist generators, backed by the Gemini free tier (see gemini.js
// and the README for setup). Every function here is the "generate" half of
// the AIAssist pattern used throughout the app: it only ever returns a
// draft for a preview. Nothing in this file writes to item state -- that
// happens in the page component, and only when she clicks "Use this."

import { callGemini, safeParseJson } from './gemini.js';

export async function draftIdeaExpansion(idea) {
  const text = await callGemini(
    `You're helping someone think through a home project idea before they commit to it. ` +
      `The idea: "${idea.title}"${idea.notes ? ` -- notes: ${idea.notes}` : ''}${idea.category ? ` (category: ${idea.category})` : ''}.\n\n` +
      `Give exactly 3 short, concrete questions or considerations she should think about before moving this idea forward. ` +
      `One per line, no numbering, no preamble, no markdown.`,
  );
  const lines = text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.]+\s*/, '').trim())
    .filter(Boolean);
  return lines.length > 0 ? lines.slice(0, 3) : [text];
}

export async function draftProfile(idea) {
  const text = await callGemini(
    `You're drafting a project profile for a home-workshop planning app. ` +
      `The idea: "${idea.title}"${idea.notes ? ` -- notes: ${idea.notes}` : ''}. ` +
      `Kind: ${idea.kind}. Category: ${idea.category || 'unspecified'}.\n\n` +
      `Respond with ONLY strict JSON, no markdown fences, no commentary, in exactly this shape:\n` +
      `{"scope": "1-2 sentences describing what will actually be done", "outcome": "1 sentence describing what changes once it's done", "timeframe": "a short realistic estimate like '1-2 weekends' or 'one afternoon'", "resources": ["material or tool 1", "material or tool 2"]}\n` +
      `Keep the resources array to only things clearly implied by the idea; use an empty array if unclear.`,
  );
  const parsed = safeParseJson(text);
  return {
    scope: parsed?.scope || 'Could not draft a scope -- try regenerating.',
    outcome: parsed?.outcome || '',
    timeframe: parsed?.timeframe || '',
    resources: Array.isArray(parsed?.resources)
      ? parsed.resources.filter((label) => typeof label === 'string').map((label) => ({ label, acquired: false }))
      : [],
  };
}

export async function suggestWeeklyPlan(item) {
  const text = await callGemini(
    `Someone is planning when to work on "${item.title}", estimated timeframe: "${item.timeframe || 'unknown'}". ` +
      `Suggest which 1-2 days of a Mon-Sun week fit best for a task like this (weekend-sized work should land on Sat/Sun, ` +
      `quick tasks can go on a weekday evening). Respond with ONLY strict JSON, no markdown fences: ` +
      `{"days": ["Sat","Sun"], "note": "one short sentence explaining the suggestion"} ` +
      `using day abbreviations Mon/Tue/Wed/Thu/Fri/Sat/Sun.`,
  );
  const parsed = safeParseJson(text);
  const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    days: Array.isArray(parsed?.days) ? parsed.days.filter((d) => validDays.includes(d)) : [],
    note: parsed?.note || 'Could not generate a suggestion -- try regenerating.',
  };
}

export async function generateWeeklyFocus(activeItems) {
  if (activeItems.length === 0) {
    return "Nothing's active right now -- pull something from Up Next when you're ready to start.";
  }
  const summary = activeItems
    .map((item) => {
      const next = (item.tasks || []).find((t) => !t.done);
      return `- ${item.title}${item.dueDate ? ` (due ${item.dueDate})` : ''}: next task is ${next ? `"${next.label}"` : 'none logged'}`;
    })
    .join('\n');
  return callGemini(
    `Here are the active projects in a home workshop tracker:\n${summary}\n\n` +
      `Write a short (2-4 sentence), warm, practical "this week's focus" note referencing what's next and any due dates. ` +
      `Plain text, no markdown.`,
  );
}

export async function generateProgressReport(item) {
  const tasks = item.tasks || [];
  const done = tasks.filter((t) => t.done).length;
  const logText = (item.log || []).map((entry) => `${entry.date}: ${entry.note}`).join('\n') || 'No log entries.';
  return callGemini(
    `Project: "${item.title}". Tasks complete: ${done}/${tasks.length}. Recent log:\n${logText}\n\n` +
      `Write a short 1-3 sentence progress summary. Plain text, no markdown.`,
  );
}
