import { mockItems } from './data/mockItems.js';
import { ZONE_META, STATUS_ZONE } from './theme.js';

function ZoneCard({ zoneKey, className, decoration, onSelect, count, peek }) {
  const meta = ZONE_META[zoneKey];
  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(zoneKey)}
      aria-label={`Open ${meta.label}`}
    >
      <div className="zone-card">
        {decoration}
        <div className="zone-head">
          <div>
            <p className="zone-title">{meta.label}</p>
            <p className="zone-subtitle">{meta.subtitle}</p>
          </div>
          <span className="zone-badge">{count}</span>
        </div>
        <div className="zone-peek">
          {peek.length === 0 ? (
            <span className="zone-empty">Nothing here right now</span>
          ) : (
            peek.map((item) => (
              <span key={item.id} className="zone-peek-item">
                {item.title}
              </span>
            ))
          )}
        </div>
      </div>
    </button>
  );
}

function CorkboardDecor() {
  const cards = [
    { top: 8, left: '10%', rotate: -6, w: 46, h: 32, color: '#F4D9A4' },
    { top: 14, left: '55%', rotate: 4, w: 40, h: 30, color: '#EFC9C0' },
    { top: 10, left: '78%', rotate: -3, w: 34, h: 34, color: '#D7E3D0' },
  ];
  return (
    <>
      {cards.map((c, i) => (
        <span key={i}>
          <span
            className="cork-card"
            style={{
              top: c.top,
              left: c.left,
              width: c.w,
              height: c.h,
              transform: `rotate(${c.rotate}deg)`,
              background: c.color,
            }}
          />
          <span
            className="cork-pin"
            style={{ top: c.top - 3, left: `calc(${c.left} + ${c.w / 2}px - 4px)` }}
          />
        </span>
      ))}
    </>
  );
}

function CabinetDecor() {
  const jars = [
    { left: 18, bottom: 14, color: '#B7C9C4' },
    { left: 42, bottom: 14, color: '#D7B98A' },
    { left: 66, bottom: 14, color: '#C79A8E' },
    { left: 90, bottom: 14, color: '#A9B98C' },
  ];
  return (
    <span className="cabinet-glass">
      <span className="cabinet-shelf-line" style={{ bottom: '38%' }} />
      {jars.map((j, i) => (
        <span
          key={i}
          className="cabinet-jar"
          style={{ left: j.left, bottom: j.bottom, background: j.color }}
        />
      ))}
    </span>
  );
}

function ShelfDecor() {
  const tools = [
    { left: '20%', w: 8, h: 30, color: '#C0392B', rotate: -4 },
    { left: '45%', w: 10, h: 24, color: '#D9B589', rotate: 2 },
    { left: '68%', w: 9, h: 34, color: '#5C6B2C', rotate: -2 },
  ];
  return (
    <>
      <span className="shelf-plank" />
      {tools.map((t, i) => (
        <span
          key={i}
          className="shelf-tool"
          style={{
            left: t.left,
            width: t.w,
            height: t.h,
            background: t.color,
            transform: `rotate(${t.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

function WorkbenchDecor() {
  const items = [
    { top: 62, left: '12%', w: 34, h: 20, color: '#C0392B', rotate: -6 },
    { top: 100, left: '55%', w: 40, h: 16, color: '#4C5B61', rotate: 4 },
    { top: 66, left: '72%', w: 22, h: 22, color: '#5C6B2C', rotate: 10 },
  ];
  return (
    <>
      <span className="bench-pegboard" />
      {items.map((it, i) => (
        <span
          key={i}
          className="bench-item"
          style={{
            top: it.top,
            left: it.left,
            width: it.w,
            height: it.h,
            background: it.color,
            transform: `rotate(${it.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

function DrawerDecor() {
  return (
    <span className="drawer-front">
      <span className="drawer-handle" />
    </span>
  );
}

const ZONES = [
  { key: 'corkboard', className: 'z-corkboard', decoration: <CorkboardDecor /> },
  { key: 'cabinet', className: 'z-cabinet', decoration: <CabinetDecor /> },
  { key: 'shelf', className: 'z-shelf', decoration: <ShelfDecor /> },
  { key: 'drawer', className: 'z-drawer', decoration: <DrawerDecor /> },
  { key: 'workbench', className: 'z-workbench', decoration: <WorkbenchDecor /> },
];

export default function RoomView({ onSelectZone }) {
  return (
    <div className="room">
      <div className="room-grid">
        {ZONES.map((zone) => {
          const items = mockItems.filter((item) => STATUS_ZONE[item.status] === zone.key);
          return (
            <ZoneCard
              key={zone.key}
              zoneKey={zone.key}
              className={zone.className}
              decoration={zone.decoration}
              onSelect={onSelectZone}
              count={items.length}
              peek={items.slice(0, 2)}
            />
          );
        })}
      </div>
    </div>
  );
}
