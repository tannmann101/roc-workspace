import { mockItems } from '../data/mockItems.js';
import { ZONE_META } from '../theme.js';
import { ItemCard } from '../ui.jsx';

export default function WorkbenchView() {
  const items = mockItems.filter((item) => item.status === 'active');
  const meta = ZONE_META.workbench;

  return (
    <div className="zone-panel">
      <div
        className="zone-panel-head"
        style={{ background: 'linear-gradient(120deg, #8A5A34, #5E3B20)' }}
      >
        <p className="zone-panel-title">{meta.label}</p>
        <p className="zone-panel-subtitle">
          {items.length} item{items.length === 1 ? '' : 's'} in progress -- work them, log
          progress, mark complete when done.
        </p>
      </div>
      <div className="zone-panel-body">
        {items.length === 0 ? (
          <p className="zone-empty">Nothing on the bench right now.</p>
        ) : (
          <div className="item-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item}>
                {item.startedAt ? (
                  <p style={{ fontSize: 11, color: '#8A7A5F', margin: '10px 0 0' }}>
                    Started {item.startedAt}
                  </p>
                ) : null}
              </ItemCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
