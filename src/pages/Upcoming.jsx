import { useState } from 'react';
import { AIAssist, Card, Checklist, EmptyState, KindPill, PhaseJump } from '../ui.jsx';
import { draftProfile } from '../lib/assist.js';

function ProfileCard({ item, onUpdateProfile, onToggleResource, onAddResource, onSendToUpNext, onMovePhase }) {
  const [newResource, setNewResource] = useState('');

  const field = (name) => (e) => onUpdateProfile(item.id, { [name]: e.target.value });

  const addResource = (e) => {
    e.preventDefault();
    if (!newResource.trim()) return;
    onAddResource(item.id, newResource.trim());
    setNewResource('');
  };

  return (
    <Card className="profile-card">
      <div className="project-card-top">
        <h3>{item.title}</h3>
        <KindPill kind={item.kind} />
      </div>
      {item.notes ? <p className="idea-notes">{item.notes}</p> : null}

      <label className="field-label">What will be done</label>
      <textarea
        className="input"
        rows={2}
        value={item.scope || ''}
        placeholder="Describe the scope of work..."
        onChange={field('scope')}
      />

      <label className="field-label">What the result affords</label>
      <textarea
        className="input"
        rows={2}
        value={item.outcome || ''}
        placeholder="What changes once this is done..."
        onChange={field('outcome')}
      />

      <div className="idea-form-row">
        <div className="field-col">
          <label className="field-label">Timeframe</label>
          <input className="input" value={item.timeframe || ''} placeholder="e.g. 1-2 weekends" onChange={field('timeframe')} />
        </div>
        <div className="field-col">
          <label className="field-label">Target date</label>
          <input
            type="date"
            className="input"
            value={item.dueDate || ''}
            onChange={field('dueDate')}
          />
        </div>
      </div>

      <label className="field-label">Needed</label>
      <Checklist
        items={item.resources || []}
        onToggle={(i) => onToggleResource(item.id, i)}
      />
      <form className="inline-add-form" onSubmit={addResource}>
        <input
          className="input"
          placeholder="Add something needed..."
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
        />
        <button type="submit" className="btn-secondary btn-sm">Add</button>
      </form>

      <AIAssist
        actionLabel="Draft this profile"
        onGenerate={() => draftProfile(item)}
        onAccept={(draft) =>
          onUpdateProfile(item.id, {
            scope: item.scope || draft.scope,
            outcome: item.outcome || draft.outcome,
            timeframe: item.timeframe || draft.timeframe,
            resources: [...(item.resources || []), ...draft.resources],
          })
        }
        renderDraft={(draft) => (
          <div className="ai-profile-draft">
            <p><strong>Scope:</strong> {draft.scope}</p>
            <p><strong>Outcome:</strong> {draft.outcome}</p>
            <p><strong>Timeframe:</strong> {draft.timeframe}</p>
            {draft.resources.length > 0 ? (
              <p><strong>Adds to needed:</strong> {draft.resources.map((r) => r.label).join(', ')}</p>
            ) : null}
            <p className="ai-draft-hint">Only fills in fields you haven't already written -- won't overwrite your own text.</p>
          </div>
        )}
      />

      <button type="button" className="btn-primary" onClick={() => onSendToUpNext(item.id)}>
        Send to Up Next →
      </button>
      <PhaseJump item={item} onMove={onMovePhase} />
    </Card>
  );
}

export default function Upcoming({ items, onUpdateProfile, onToggleResource, onAddResource, onSendToUpNext, onMovePhase }) {
  const upcoming = items.filter((i) => i.status === 'pending');

  return (
    <div className="page">
      <div className="page-head">
        <h1>Upcoming</h1>
        <p>Ideas that have been greenlit. Flesh out what it needs before it goes on deck.</p>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Project profiles</h2>
          <span className="section-count">{upcoming.length}</span>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState>Nothing here -- move an idea forward from the Ideas page.</EmptyState>
        ) : (
          <div className="card-grid card-grid-wide">
            {upcoming.map((item) => (
              <ProfileCard
                key={item.id}
                item={item}
                onUpdateProfile={onUpdateProfile}
                onToggleResource={onToggleResource}
                onAddResource={onAddResource}
                onSendToUpNext={onSendToUpNext}
                onMovePhase={onMovePhase}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
