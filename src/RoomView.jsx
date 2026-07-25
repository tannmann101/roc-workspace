import { mockItems } from './data/mockItems.js';
import { ZONE_META, STATUS_ZONE } from './theme.js';

// Furniture placed like it would actually sit in a room: back-wall pieces
// (corkboard, cabinet, shelf) are smaller and higher; floor pieces (drawer,
// workbench) are bigger and lower, closer to the viewer. Corkboard sits
// above the drawer on the left (a wall-then-floor pair), the cabinet sits
// above the workbench in the center (same pairing, workbench pulled forward
// into the room), and the shelf holds the right wall on its own.
const ZONES = [
  { key: 'corkboard', top: 4, left: 3, width: 25, height: 30 },
  { key: 'cabinet', top: 2, left: 31, width: 24, height: 39 },
  { key: 'shelf', top: 9, left: 77, width: 20, height: 27 },
  { key: 'drawer', top: 65, left: 3, width: 16, height: 29, standing: true },
  { key: 'workbench', top: 44, left: 21, width: 76, height: 51, standing: true },
];

function ZoneCard({ zoneKey, className, decoration, style, onSelect, count, peek }) {
  const meta = ZONE_META[zoneKey];
  return (
    <button
      type="button"
      className={`zone-spot ${className}`}
      style={style}
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
    { top: '5%', left: '10%', rotate: -6, w: '34%', h: '19%', color: '#F4D9A4' },
    { top: '9%', left: '54%', rotate: 4, w: '30%', h: '17%', color: '#EFC9C0' },
    { top: '6%', left: '78%', rotate: -3, w: '18%', h: '20%', color: '#D7E3D0' },
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
            style={{ top: `calc(${c.top} - 5px)`, left: `calc(${c.left} + ${c.w} / 2 - 4px)` }}
          />
        </span>
      ))}
    </>
  );
}

function CabinetDecor() {
  const jars = [
    { left: '10%', color: '#B7C9C4' },
    { left: '33%', color: '#D7B98A' },
    { left: '56%', color: '#C79A8E' },
    { left: '79%', color: '#A9B98C' },
  ];
  return (
    <span className="cabinet-glass">
      <span className="cabinet-shelf-line" style={{ bottom: '36%' }} />
      {jars.map((j, i) => (
        <span
          key={i}
          className="cabinet-jar"
          style={{ left: j.left, bottom: 8, background: j.color }}
        />
      ))}
    </span>
  );
}

function ShelfDecor() {
  const tools = [
    { left: '16%', w: 8, h: 26, color: '#C0392B', rotate: -4 },
    { left: '42%', w: 10, h: 20, color: '#D9B589', rotate: 2 },
    { left: '66%', w: 9, h: 30, color: '#5C6B2C', rotate: -2 },
  ];
  return (
    <>
      <span className="shelf-plank" style={{ bottom: '30%' }} />
      {tools.map((t, i) => (
        <span
          key={i}
          className="shelf-tool"
          style={{
            left: t.left,
            bottom: 'calc(30% + 8px)',
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
    { top: '46%', left: '8%', w: '9%', h: '20%', color: '#C0392B', rotate: -6 },
    { top: '58%', left: '30%', w: '11%', h: '14%', color: '#4C5B61', rotate: 4 },
    { top: '44%', left: '48%', w: '7%', h: '22%', color: '#5C6B2C', rotate: 10 },
    { top: '56%', left: '64%', w: '10%', h: '16%', color: '#D9B589', rotate: -8 },
    { top: '48%', left: '82%', w: '8%', h: '18%', color: '#8C6410', rotate: 6 },
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

const DECOR = {
  corkboard: <CorkboardDecor />,
  cabinet: <CabinetDecor />,
  shelf: <ShelfDecor />,
  drawer: <DrawerDecor />,
  workbench: <WorkbenchDecor />,
};

export default function RoomView({ onSelectZone }) {
  return (
    <div className="room">
      <div className="room-stage">
        <span className="room-wall" />
        <span className="room-floor" />
        <span className="room-baseboard" />

        {ZONES.filter((z) => z.standing).map((zone) => (
          <span
            key={zone.key}
            className="floor-shadow"
            style={{
              top: `${zone.top + zone.height - 2}%`,
              left: `${zone.left + zone.width * 0.08}%`,
              width: `${zone.width * 0.84}%`,
            }}
          />
        ))}

        {ZONES.map((zone) => {
          const items = mockItems.filter((item) => STATUS_ZONE[item.status] === zone.key);
          return (
            <ZoneCard
              key={zone.key}
              zoneKey={zone.key}
              className={`z-${zone.key}`}
              decoration={DECOR[zone.key]}
              style={{
                top: `${zone.top}%`,
                left: `${zone.left}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
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
