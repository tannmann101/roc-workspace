import { useState } from 'react';
import { AIAssist, Card, Checklist, KindPill, ProgressBar } from '../ui.jsx';
import { generateProgressReport } from '../lib/assist.js';
import { RUST } from '../theme.js';

export default function ProjectDetail({
  item,
  onToggleTask,
  onAddTask,
  onToggleResource,
  onAddLog,
  onComplete,
  onBack,
}) {
  const [logNote, setLogNote] = useState('');
  const [taskLabel, setTaskLabel] = useState('');

  if (!item) return null;

  const tasks = item.tasks || [];
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const allDone = tasks.length > 0 && done === tasks.length;

  const submitLog = (e) => {
    e.preventDefault();
    if (!logNote.trim()) return;
    onAddLog(item.id, logNote.trim());
    setLogNote('');
  };

  const submitTask = (e) => {
    e.preventDefault();
    if (!taskLabel.trim()) return;
    onAddTask(item.id, taskLabel.trim());
    setTaskLabel('');
  };

  return (
    <div className="page">
      <button type="button" className="link-btn back-link" onClick={onBack}>
        ← Back to dashboard
      </button>

      <div className="page-head">
        <div className="project-card-top">
          <h1>{item.title}</h1>
          <KindPill kind={item.kind} />
        </div>
        <p>{item.scope}</p>
      </div>

      <div className="section-row">
        <section className="section section-half">
          <Card>
            <div className="section-head">
              <h2>Progress</h2>
              <span className="section-count">{pct}%</span>
            </div>
            <ProgressBar value={pct} color={RUST} />
            <p className="project-card-meta">{done}/{tasks.length} tasks complete</p>
            {item.dueDate ? <p className="project-card-due">Due {item.dueDate}</p> : null}
            {item.timeframe ? <p className="project-card-due">Estimated: {item.timeframe}</p> : null}

            <label className="field-label">Tasks</label>
            <Checklist items={tasks} onToggle={(i) => onToggleTask(item.id, i)} />
            <form className="inline-add-form" onSubmit={submitTask}>
              <input
                className="input"
                placeholder="Add a task..."
                value={taskLabel}
                onChange={(e) => setTaskLabel(e.target.value)}
              />
              <button type="submit" className="btn-secondary btn-sm">Add</button>
            </form>

            <label className="field-label">Needed</label>
            <Checklist items={item.resources || []} onToggle={(i) => onToggleResource(item.id, i)} />

            {!allDone && tasks.length > 0 ? (
              <p className="soft-warning">Some tasks are still open -- you can still mark this complete whenever you're ready.</p>
            ) : null}
            <button type="button" className="btn-primary" onClick={() => onComplete(item.id)}>
              Mark complete →
            </button>
          </Card>
        </section>

        <section className="section section-half">
          <Card>
            <div className="section-head">
              <h2>Outcome</h2>
            </div>
            <p className="idea-notes">{item.outcome || 'Not written yet.'}</p>

            <div className="section-head">
              <h2>Log</h2>
            </div>
            {(item.log || []).length === 0 ? (
              <p className="empty-note">No entries yet.</p>
            ) : (
              <ul className="log-list">
                {item.log.map((entry, i) => (
                  <li key={i}>
                    <span className="log-date">{entry.date}</span>
                    {entry.note}
                  </li>
                ))}
              </ul>
            )}
            <form className="inline-add-form" onSubmit={submitLog}>
              <input
                className="input"
                placeholder="Log a quick update..."
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
              />
              <button type="submit" className="btn-secondary btn-sm">Add</button>
            </form>

            <AIAssist
              actionLabel="Generate progress report"
              onGenerate={() => generateProgressReport(item)}
              renderDraft={(draft) => <p className="focus-text">{draft}</p>}
            />
          </Card>
        </section>
      </div>
    </div>
  );
}
