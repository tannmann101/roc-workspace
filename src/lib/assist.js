// assist.js
// Placeholder "AI assist" generators. These are deterministic templates,
// not a real model call -- there's no backend yet for that (see README).
// They exist to prove out the interaction pattern every AI tool in this
// app should follow: generate a draft into a preview, let her read it,
// and only apply it to the real fields if she clicks Accept. Nothing here
// writes to item state on its own.

export function draftIdeaExpansion(idea) {
  const cat = idea.category || 'this kind of project';
  return [
    `What's the rough budget range for ${idea.title.toLowerCase()}?`,
    `Does it need a tool or material you don't already have on hand?`,
    `Is there a ${cat} idea already in Upcoming this could piggyback on, to save a trip for materials?`,
  ];
}

export function draftProfile(idea) {
  const isTask = idea.kind === 'task' || idea.kind === 'maintenance';
  return {
    scope: isTask
      ? `Do the core work for "${idea.title}" in a single session, checking for anything that needs to be ordered ahead of time.`
      : `Break "${idea.title}" into rough stages: prep and measure, build or install, then finish. Adjust once the real steps are clearer.`,
    outcome: `Draft: describe what changes once "${idea.title}" is done -- what stops being a problem, or what becomes possible.`,
    timeframe: isTask ? 'One session' : '1-2 weekends',
    resources: idea.notes && /\b(oak|pine|walnut|paint|stain|glue)\b/i.test(idea.notes)
      ? [{ label: 'Materials mentioned in the idea notes -- confirm quantities', acquired: false }]
      : [],
  };
}

export function suggestWeeklyPlan(item) {
  const days = /weekend/i.test(item.timeframe || '') ? ['Sat', 'Sun'] : ['Tue', 'Sat'];
  return {
    days,
    note: `Based on "${item.timeframe || 'the estimated timeframe'}", ${days.join(' and ')} look like the best fit -- adjust to whatever your week actually looks like.`,
  };
}

export function generateWeeklyFocus(activeItems) {
  if (activeItems.length === 0) {
    return "Nothing's active right now -- pull something from Up Next when you're ready to start.";
  }
  const lines = activeItems.map((item) => {
    const nextTask = (item.tasks || []).find((t) => !t.done);
    const due = item.dueDate ? ` (due ${item.dueDate})` : '';
    return nextTask
      ? `${item.title}${due}: next up is "${nextTask.label}."`
      : `${item.title}${due}: no open tasks logged yet -- worth breaking it down.`;
  });
  return `This week: ${lines.join(' ')}`;
}

export function generateProgressReport(item) {
  const tasks = item.tasks || [];
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const lastLog = (item.log || [])[item.log?.length - 1];
  const lastLine = lastLog ? ` Last note: "${lastLog.note}"` : '';
  return `${item.title} is ${pct}% through its checklist (${done}/${tasks.length} tasks).${lastLine}`;
}
