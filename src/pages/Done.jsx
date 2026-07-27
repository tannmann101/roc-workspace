import { Card, EmptyState, KindPill, PhaseJump } from '../ui.jsx';

export default function Done({ items, onMovePhase }) {
  const done = [...items.filter((i) => i.status === 'done')].sort((a, b) =>
    (b.completedAt || '').localeCompare(a.completedAt || ''),
  );
  const thisMonth = done.filter((i) => (i.completedAt || '').startsWith('2026-07')).length;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Done</h1>
        <p>The record of finished work -- a visible reason it was all worth doing.</p>
      </div>

      <div className="stat-row">
        <Card className="stat-card">
          <span className="stat-number">{done.length}</span>
          <span className="stat-label">Total completed</span>
        </Card>
        <Card className="stat-card">
          <span className="stat-number">{thisMonth}</span>
          <span className="stat-label">Completed this month</span>
        </Card>
      </div>

      <section className="section">
        {done.length === 0 ? (
          <EmptyState>Nothing finished yet -- it'll show up here once something on the Workbench is marked complete.</EmptyState>
        ) : (
          <div className="card-grid">
            {done.map((item) => (
              <Card key={item.id} className="idea-card">
                <div className="project-card-top">
                  <h3>{item.title}</h3>
                  <KindPill kind={item.kind} />
                </div>
                {item.outcome ? <p className="idea-notes">{item.outcome}</p> : null}
                <div className="chip-row">
                  <span className="chip">Completed {item.completedAt}</span>
                  {item.recurrence ? <span className="chip">{item.recurrence}</span> : null}
                </div>
                <PhaseJump item={item} onMove={onMovePhase} />
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
