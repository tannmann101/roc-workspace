import { useState } from 'react';
import { KIND_COLORS, KIND_LABELS } from './theme.js';

export function Card({ className = '', children, onClick, ...rest }) {
  return (
    <div
      className={`card ${onClick ? 'is-clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(e) : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

export function KindPill({ kind }) {
  return (
    <span className="kind-pill" style={{ background: KIND_COLORS[kind] }}>
      {KIND_LABELS[kind]}
    </span>
  );
}

export function ProgressBar({ value, color }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function Checklist({ items, onToggle, readOnly }) {
  if (!items || items.length === 0) {
    return <p className="empty-note">Nothing listed yet.</p>;
  }
  return (
    <ul className="checklist">
      {items.map((item, i) => (
        <li key={i} className={item.done ?? item.acquired ? 'is-done' : ''}>
          <button
            type="button"
            className="checklist-box"
            disabled={readOnly}
            onClick={() => onToggle?.(i)}
            aria-label={(item.done ?? item.acquired) ? 'Mark not done' : 'Mark done'}
          >
            {(item.done ?? item.acquired) ? '✓' : ''}
          </button>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ children }) {
  return <div className="empty-state">{children}</div>;
}

// A single reusable pattern for every "AI assist" tool in the app: a button
// that generates a draft into a preview, never touching real state until
// she explicitly accepts it.
export function AIAssist({ actionLabel = 'Generate', onGenerate, onAccept, renderDraft }) {
  const [draft, setDraft] = useState(null);

  if (draft === null) {
    return (
      <button type="button" className="ai-btn" onClick={() => setDraft(onGenerate())}>
        <span className="ai-spark">✨</span> {actionLabel}
      </button>
    );
  }

  return (
    <div className="ai-draft">
      <div className="ai-draft-label">
        <span className="ai-spark">✨</span> AI draft -- review before using it
      </div>
      <div className="ai-draft-body">{renderDraft(draft)}</div>
      <div className="ai-draft-actions">
        {onAccept ? (
          <button
            type="button"
            className="ai-btn-accept"
            onClick={() => {
              onAccept(draft);
              setDraft(null);
            }}
          >
            Use this
          </button>
        ) : null}
        <button type="button" className="ai-btn-discard" onClick={() => setDraft(null)}>
          Discard
        </button>
        <button type="button" className="ai-btn-retry" onClick={() => setDraft(onGenerate())}>
          Regenerate
        </button>
      </div>
    </div>
  );
}
