import { mockItems } from '../data/mockItems.js';
import { ZONE_META } from '../theme.js';
import { ItemCard } from '../ui.jsx';

const ZONE_STATUS = {
  corkboard: 'idea',
  cabinet: 'pending',
  shelf: 'on-deck',
  drawer: 'done',
};

const ZONE_BLURB = {
  corkboard: 'Browse and pin ideas here; promote one to the Cabinet when it is greenlit. Pin/browse/promote controls land in a later build phase.',
  cabinet: 'Set due dates, check off resources, and promote to the Shelf when ready. Grooming controls land in a later build phase.',
  shelf: 'Reorder the queue and start the next item on the Workbench. Deliberately small -- one to three items. Reorder/start controls land in a later build phase.',
  drawer: 'The finished-projects record. Recurring maintenance respawns from here. Browsing-only controls land in a later build phase.',
};

const ZONE_HEAD_BG = {
  corkboard: 'linear-gradient(120deg, #B08D46, #7A5230)',
  cabinet: 'linear-gradient(120deg, #6E441F, #4A2C13)',
  shelf: 'linear-gradient(120deg, #A97A4C, #6E441F)',
  drawer: 'linear-gradient(120deg, #6E441F, #4A2C13)',
};

export default function PlaceholderZone({ zoneKey }) {
  const status = ZONE_STATUS[zoneKey];
  const items = mockItems.filter((item) => item.status === status);
  const meta = ZONE_META[zoneKey];

  return (
    <div className="zone-panel">
      <div className="zone-panel-head" style={{ background: ZONE_HEAD_BG[zoneKey] }}>
        <p className="zone-panel-title">{meta.label}</p>
        <p className="zone-panel-subtitle">
          {items.length} item{items.length === 1 ? '' : 's'} -- {meta.subtitle.toLowerCase()}
        </p>
      </div>
      <div className="zone-panel-body">
        {items.length === 0 ? (
          <p className="zone-empty">Nothing here right now.</p>
        ) : (
          <div className="item-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
        <div className="placeholder-body">
          <p>{ZONE_BLURB[zoneKey]}</p>
        </div>
      </div>
    </div>
  );
}
