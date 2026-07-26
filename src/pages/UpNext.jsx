import { AIAssist, Card, EmptyState, KindPill } from '../ui.jsx';
import { suggestWeeklyPlan } from '../lib/assist.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function PlanCard({ item, onUpdatePlanning, onToggleDay, onStartActive }) {
  const days = item.weeklyPlan || [];

  return (
    <Card className="profile-card">
      <div className="project-card-top">
        <h3>{item.title}</h3>
        <KindPill kind={item.kind} />
      </div>
      {item.scope ? <p className="idea-notes">{item.scope}</p> : null}
      <div className="chip-row">
        {item.timeframe ? <span className="chip">{item.timeframe}</span> : null}
        {item.dueDate ? <span className="chip">Target {item.dueDate}</span> : null}
      </div>

      <label className="field-label">Which days will you work on this?</label>
      <div className="day-picker">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            className={`day-chip ${days.includes(day) ? 'is-selected' : ''}`}
            onClick={() => onToggleDay(item.id, day)}
          >
            {day}
          </button>
        ))}
      </div>

      <label className="field-label">Planning notes</label>
      <textarea
        className="input"
        rows={2}
        placeholder="Logistics -- where you'll work, what needs picking up first..."
        value={item.planningNotes || ''}
        onChange={(e) => onUpdatePlanning(item.id, e.target.value)}
      />

      <AIAssist
        actionLabel="Suggest a schedule"
        onGenerate={() => suggestWeeklyPlan(item)}
        onAccept={(draft) => {
          draft.days.forEach((day) => {
            if (!days.includes(day)) onToggleDay(item.id, day);
          });
        }}
        renderDraft={(draft) => <p className="focus-text">{draft.note}</p>}
      />

      <button type="button" className="btn-primary" onClick={() => onStartActive(item.id)}>
        Start on the Workbench →
      </button>
    </Card>
  );
}

export default function UpNext({ items, onUpdatePlanning, onToggleDay, onStartActive }) {
  const upNext = items.filter((i) => i.status === 'on-deck');

  return (
    <div className="page">
      <div className="page-head">
        <h1>Up Next</h1>
        <p>The queue of what's coming up -- deliberately small. Plan the logistics before it starts.</p>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>On deck</h2>
          <span className="section-count">{upNext.length}</span>
        </div>
        {upNext.length > 3 ? (
          <p className="soft-warning">This queue is meant to stay small (one to three items) -- consider sending some back to Upcoming.</p>
        ) : null}
        {upNext.length === 0 ? (
          <EmptyState>Nothing queued -- send a project profile over from Upcoming.</EmptyState>
        ) : (
          <div className="card-grid card-grid-wide">
            {upNext.map((item) => (
              <PlanCard
                key={item.id}
                item={item}
                onUpdatePlanning={onUpdatePlanning}
                onToggleDay={onToggleDay}
                onStartActive={onStartActive}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
