import { AIAssist, Card, EmptyState, KindPill, ProgressBar } from '../ui.jsx';
import { RUST } from '../theme.js';
import { generateWeeklyFocus } from '../lib/assist.js';

function taskProgress(item) {
  const tasks = item.tasks || [];
  if (tasks.length === 0) return { pct: 0, done: 0, total: 0, next: null };
  const done = tasks.filter((t) => t.done).length;
  const next = tasks.find((t) => !t.done) || null;
  return { pct: Math.round((done / tasks.length) * 100), done, total: tasks.length, next };
}

export default function Dashboard({ items, onOpenProject, onNavigate }) {
  const active = items.filter((i) => i.status === 'active');
  const upNext = items.filter((i) => i.status === 'on-deck');
  const needed = items
    .filter((i) => i.status === 'active' || i.status === 'pending' || i.status === 'on-deck')
    .map((item) => ({ item, missing: (item.resources || []).filter((r) => !r.acquired) }))
    .filter((row) => row.missing.length > 0);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>What's active, what's still needed, and what's coming up next.</p>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Active</h2>
          <span className="section-count">{active.length}</span>
        </div>
        {active.length === 0 ? (
          <EmptyState>Nothing active right now -- pull something from Up Next when you're ready.</EmptyState>
        ) : (
          <div className="card-grid">
            {active.map((item) => {
              const progress = taskProgress(item);
              return (
                <Card key={item.id} className="project-card" onClick={() => onOpenProject(item.id)}>
                  <div className="project-card-top">
                    <h3>{item.title}</h3>
                    <KindPill kind={item.kind} />
                  </div>
                  <ProgressBar value={progress.pct} color={RUST} />
                  <p className="project-card-meta">
                    {progress.total > 0
                      ? `${progress.done}/${progress.total} tasks -- next: ${progress.next ? progress.next.label : 'all done, ready to complete'}`
                      : 'No checklist logged yet'}
                  </p>
                  {item.dueDate ? <p className="project-card-due">Due {item.dueDate}</p> : null}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <div className="section-row">
        <section className="section section-half">
          <div className="section-head">
            <h2>Still needed</h2>
          </div>
          {needed.length === 0 ? (
            <EmptyState>Nothing outstanding -- everything active or upcoming is fully resourced.</EmptyState>
          ) : (
            <Card className="needed-list">
              {needed.map(({ item, missing }) => (
                <div key={item.id} className="needed-row">
                  <span className="needed-title">{item.title}</span>
                  <span className="needed-items">{missing.map((r) => r.label).join(', ')}</span>
                </div>
              ))}
            </Card>
          )}
        </section>

        <section className="section section-half">
          <div className="section-head">
            <h2>Up next</h2>
            <button type="button" className="link-btn" onClick={() => onNavigate('upnext')}>
              View all →
            </button>
          </div>
          {upNext.length === 0 ? (
            <EmptyState>The queue is empty -- send something over from Upcoming.</EmptyState>
          ) : (
            <Card className="needed-list">
              {upNext.map((item) => (
                <div key={item.id} className="needed-row">
                  <span className="needed-title">{item.title}</span>
                  <span className="needed-items">{item.timeframe || 'timeframe not set'}</span>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Weekly focus</h2>
        </div>
        <Card>
          <AIAssist
            actionLabel="Generate weekly focus"
            onGenerate={() => generateWeeklyFocus(active)}
            renderDraft={(draft) => <p className="focus-text">{draft}</p>}
          />
        </Card>
      </section>
    </div>
  );
}
