import { KIND_COLORS, KIND_LABELS } from './theme.js';

export function KindPill({ kind }) {
  return (
    <span className="kind-pill" style={{ background: KIND_COLORS[kind] }}>
      {KIND_LABELS[kind]}
    </span>
  );
}

export function ItemCard({ item, children }) {
  return (
    <div className="item-card">
      <div className="item-card-top">
        <p className="item-title">{item.title}</p>
        <KindPill kind={item.kind} />
      </div>
      {item.notes ? <p className="item-notes">{item.notes}</p> : null}
      <div className="item-meta-row">
        <span className="item-meta-chip">{item.category}</span>
        {item.dueDate ? <span className="item-meta-chip">Due {item.dueDate}</span> : null}
        {item.rainyDay ? <span className="item-meta-chip">Rainy day</span> : null}
        {item.recurrence ? <span className="item-meta-chip">{item.recurrence}</span> : null}
      </div>
      {children}
    </div>
  );
}
