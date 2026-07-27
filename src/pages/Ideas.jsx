import { useState } from 'react';
import { AIAssist, Card, EmptyState, KindPill, PhaseJump } from '../ui.jsx';
import { draftIdeaExpansion } from '../lib/assist.js';

const KINDS = ['project', 'task', 'maintenance'];

export default function Ideas({ items, onAddIdea, onMoveToUpcoming, onMovePhase }) {
  const ideas = items.filter((i) => i.status === 'idea');
  const [form, setForm] = useState({ title: '', notes: '', category: '', kind: 'project', rainyDay: false });

  const update = (field) => (e) => {
    const value = field === 'rainyDay' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAddIdea(form);
    setForm({ title: '', notes: '', category: '', kind: 'project', rainyDay: false });
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Ideas</h1>
        <p>Low-friction capture -- anything for down the line. Nothing here is a commitment.</p>
      </div>

      <Card className="idea-form-card">
        <form className="idea-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="What's the idea?"
            value={form.title}
            onChange={update('title')}
            required
          />
          <textarea
            className="input"
            placeholder="Any notes -- what sparked it, what it might involve..."
            value={form.notes}
            onChange={update('notes')}
            rows={2}
          />
          <div className="idea-form-row">
            <select className="input" value={form.kind} onChange={update('kind')}>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Category (furniture, garden...)"
              value={form.category}
              onChange={update('category')}
            />
            <label className="checkbox-label">
              <input type="checkbox" checked={form.rainyDay} onChange={update('rainyDay')} />
              Rainy day
            </label>
            <button type="submit" className="btn-primary">
              Add idea
            </button>
          </div>
        </form>
      </Card>

      <section className="section">
        <div className="section-head">
          <h2>Pinned</h2>
          <span className="section-count">{ideas.length}</span>
        </div>
        {ideas.length === 0 ? (
          <EmptyState>Nothing pinned yet -- add your first idea above.</EmptyState>
        ) : (
          <div className="card-grid">
            {ideas.map((idea) => (
              <Card key={idea.id} className="idea-card">
                <div className="project-card-top">
                  <h3>{idea.title}</h3>
                  <KindPill kind={idea.kind} />
                </div>
                {idea.notes ? <p className="idea-notes">{idea.notes}</p> : null}
                <div className="chip-row">
                  {idea.category ? <span className="chip">{idea.category}</span> : null}
                  {idea.rainyDay ? <span className="chip">Rainy day</span> : null}
                </div>

                <AIAssist
                  actionLabel="Expand this idea"
                  onGenerate={() => draftIdeaExpansion(idea)}
                  renderDraft={(draft) => (
                    <ul className="ai-consider-list">
                      {draft.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                />

                <button type="button" className="btn-secondary" onClick={() => onMoveToUpcoming(idea.id)}>
                  Move this idea →
                </button>
                <PhaseJump item={idea} onMove={onMovePhase} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
