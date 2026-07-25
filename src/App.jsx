import { useState } from 'react';
import RoomView from './RoomView.jsx';
import WorkbenchView from './zones/WorkbenchView.jsx';
import PlaceholderZone from './zones/PlaceholderZone.jsx';
import { ZONE_META } from './theme.js';

export default function App() {
  const [zone, setZone] = useState(null);

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <h1 className="app-title">The Workshop</h1>
          <p className="app-tagline">
            {zone ? ZONE_META[zone].label : 'A room, not a list -- click a zone to step in.'}
          </p>
        </div>
        {zone ? (
          <button type="button" className="back-button" onClick={() => setZone(null)}>
            ← Back to room
          </button>
        ) : null}
      </div>

      {zone === null ? (
        <RoomView onSelectZone={setZone} />
      ) : zone === 'workbench' ? (
        <WorkbenchView />
      ) : (
        <PlaceholderZone zoneKey={zone} />
      )}
    </div>
  );
}
