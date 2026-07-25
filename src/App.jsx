import { useCallback, useState } from 'react';
import RoomView from './RoomView.jsx';
import WorkbenchView from './zones/WorkbenchView.jsx';
import CabinetView from './zones/CabinetView.jsx';
import PlaceholderZone from './zones/PlaceholderZone.jsx';
import CabinetDoors from './CabinetDoors.jsx';
import { ZONE_META } from './theme.js';

export default function App() {
  const [zone, setZone] = useState(null);
  const [transition, setTransition] = useState(null); // 'opening' | 'closing' | null

  const handleSelectZone = useCallback((nextZone) => {
    if (nextZone === 'cabinet') {
      setZone('cabinet');
      setTransition('opening');
    } else {
      setZone(nextZone);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (zone === 'cabinet') {
      setTransition('closing');
    } else {
      setZone(null);
    }
  }, [zone]);

  const handleTransitionDone = useCallback(() => {
    setTransition((current) => {
      if (current === 'closing') setZone(null);
      return null;
    });
  }, []);

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
          <button type="button" className="back-button" onClick={handleBack}>
            ← Back to room
          </button>
        ) : null}
      </div>

      {zone === null ? (
        <RoomView onSelectZone={handleSelectZone} />
      ) : zone === 'workbench' ? (
        <WorkbenchView />
      ) : zone === 'cabinet' ? (
        <CabinetView />
      ) : (
        <PlaceholderZone zoneKey={zone} />
      )}

      {transition ? <CabinetDoors phase={transition} onDone={handleTransitionDone} /> : null}
    </div>
  );
}
