import { useState } from 'react';
import { mockItems } from '../data/mockItems.js';
import { KIND_COLORS, KIND_LABELS } from '../theme.js';

const ITEMS_PER_SHELF = 3;

function chunk(items, size) {
  const shelves = [];
  for (let i = 0; i < items.length; i += size) shelves.push(items.slice(i, i + size));
  return shelves;
}

function resourceFillPercent(item) {
  if (item.resources.length === 0) return 100;
  const acquired = item.resources.filter((resource) => resource.acquired).length;
  return Math.round((acquired / item.resources.length) * 100);
}

function Jar({ item, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`cabinet-jar-unit ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <span className="jar-lid" style={{ background: KIND_COLORS[item.kind] }} />
      <span className="jar-body">
        <span className="jar-fill" style={{ height: `${resourceFillPercent(item)}%` }} />
      </span>
      <span className="jar-label">
        <span className="jar-label-title">{item.title}</span>
        {item.dueDate ? <span className="jar-label-due">Due {item.dueDate}</span> : null}
        {item.rainyDay ? <span className="jar-label-rain">Rainy day</span> : null}
      </span>
    </button>
  );
}

export default function CabinetView() {
  const items = mockItems.filter((item) => item.status === 'pending');
  const shelves = chunk(items, ITEMS_PER_SHELF);
  const [selectedId, setSelectedId] = useState(null);
  const selected = items.find((item) => item.id === selectedId) || null;

  return (
    <div className="cabinet-interior">
      <div className="cabinet-interior-head">
        <p className="zone-panel-title">The Cabinet</p>
        <p className="zone-panel-subtitle">
          {items.length} item{items.length === 1 ? '' : 's'} approved and waiting -- tap a jar
          for the full label.
        </p>
      </div>

      <div className="cabinet-shelves">
        {items.length === 0 ? (
          <p className="zone-empty">The cabinet is empty right now.</p>
        ) : (
          shelves.map((row, i) => (
            <div className="cabinet-shelf-row" key={i}>
              <div className="cabinet-shelf-items">
                {row.map((item) => (
                  <Jar
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
                  />
                ))}
              </div>
              <div className="cabinet-shelf-plank" />
            </div>
          ))
        )}
      </div>

      {selected ? (
        <div className="cabinet-detail">
          <button
            type="button"
            className="cabinet-detail-close"
            onClick={() => setSelectedId(null)}
            aria-label="Close label"
          >
            &times;
          </button>
          <div className="cabinet-detail-top">
            <h3>{selected.title}</h3>
            <span className="kind-pill" style={{ background: KIND_COLORS[selected.kind] }}>
              {KIND_LABELS[selected.kind]}
            </span>
          </div>
          {selected.notes ? <p className="cabinet-detail-notes">{selected.notes}</p> : null}
          <div className="item-meta-row">
            <span className="item-meta-chip">{selected.category}</span>
            {selected.dueDate ? <span className="item-meta-chip">Due {selected.dueDate}</span> : null}
            {selected.rainyDay ? <span className="item-meta-chip">Rainy day</span> : null}
          </div>
          {selected.resources.length > 0 ? (
            <ul className="cabinet-resource-list">
              {selected.resources.map((resource, i) => (
                <li key={i} className={resource.acquired ? 'is-acquired' : ''}>
                  <span className="resource-check">{resource.acquired ? '✓' : ''}</span>
                  {resource.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="zone-empty">No resources listed.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
