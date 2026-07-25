import { useEffect, useRef, useState } from 'react';

// Full-screen transition overlay for stepping into/out of the Cabinet.
// phase 'opening': doors start shut (matches the cabinet's closed look from
// the room), then swing open to reveal the interior already mounted behind.
// phase 'closing': doors start open (implicitly, from having just been
// opened), then swing shut before the parent swaps back to the room view.
export default function CabinetDoors({ phase, onDone }) {
  const [open, setOpen] = useState(phase === 'closing');
  const rightDoorRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(phase === 'opening'));
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    const el = rightDoorRef.current;
    if (!el) return undefined;
    const handleEnd = (event) => {
      if (event.propertyName === 'transform') onDone();
    };
    el.addEventListener('transitionend', handleEnd);
    return () => el.removeEventListener('transitionend', handleEnd);
  }, [onDone]);

  return (
    <div className={`cabinet-doors ${open ? 'is-open' : 'is-closed'}`}>
      <div className="cabinet-door cabinet-door-left">
        <span className="cabinet-door-glass" />
        <span className="cabinet-door-handle" />
      </div>
      <div className="cabinet-door cabinet-door-right" ref={rightDoorRef}>
        <span className="cabinet-door-glass" />
        <span className="cabinet-door-handle" />
      </div>
    </div>
  );
}
