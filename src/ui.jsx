import { useState } from 'react';
import { KIND_COLORS, KIND_LABELS, PHASES, PHASE_ORDER } from './theme.js';

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

// The universal "jump to any phase" control -- a movement between phases
// is just a status change, so nothing should have to walk the linear
// idea → ... → done path to get there. Stops click/keydown propagation so
// it can sit inside a whole-card onClick (e.g. the Dashboard's project
// cards) without also triggering the card's own click handler.
export function PhaseJump({ item, onMove }) {
  if (!onMove) return null;
  const options = PHASE_ORDER.filter((key) => key !== item.status);

  return (
    <select
      className="input phase-jump"
      value=""
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        if (e.target.value) onMove(item.id, e.target.value);
      }}
      aria-label={`Move "${item.title}" to a different phase`}
    >
      <option value="">Move to...</option>
      {options.map((key) => (
        <option key={key} value={key}>
          {PHASES[key].label}
        </option>
      ))}
    </select>
  );
}

// A compact breadcrumb of an item's phase transitions, for the Active
// project view and anywhere else the full movement history is useful.
export function PhaseHistory({ history }) {
  if (!history || history.length === 0) {
    return <p className="empty-note">No moves logged yet.</p>;
  }
  return (
    <ul className="history-list">
      {history.map((entry, i) => (
        <li key={i}>
          <span className="log-date">{new Date(entry.at).toLocaleDateString()}</span>
          {entry.from
            ? `${PHASES[entry.from]?.label || entry.from} → ${PHASES[entry.to]?.label || entry.to}`
            : `Started in ${PHASES[entry.to]?.label || entry.to}`}
        </li>
      ))}
    </ul>
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
// she explicitly accepts it. onGenerate may return a value or a promise --
// real AI calls are async, so this always awaits it.
export function AIAssist({ actionLabel = 'Generate', onGenerate, onAccept, renderDraft }) {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onGenerate();
      setDraft(result);
    } catch (err) {
      setError(err.message || 'Something went wrong generating this.');
    } finally {
      setLoading(false);
    }
  };

  if (draft === null) {
    return (
      <div className="ai-assist">
        <button type="button" className="ai-btn" disabled={loading} onClick={generate}>
          <span className="ai-spark">✨</span> {loading ? 'Generating…' : actionLabel}
        </button>
        {error ? (
          <p className="ai-error">
            {error} <button type="button" className="link-btn ai-error-retry" onClick={generate}>Try again</button>
          </p>
        ) : null}
      </div>
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
        <button type="button" className="ai-btn-retry" disabled={loading} onClick={generate}>
          {loading ? 'Regenerating…' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}
