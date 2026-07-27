// theme.js
// Design tokens for the clean/modern/warm workspace UI. No skeuomorphic
// wood/cork/glass textures here -- warmth comes from a soft cream base,
// an earthy accent palette, and a serif+sans type pairing, not literal
// materials.

export const SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const SERIF = "'Fraunces', 'Iowan Old Style', Georgia, serif";

export const PAGE = '#FAF6EE';
export const CARD = '#FFFFFF';
export const CARD_SOFT = '#F6F0E4';
export const INK = '#2B241C';
export const INK_SOFT = '#635642';
export const MUTE = '#948569';
export const LINE = '#E7DCC7';

export const RUST = '#B5622F';
export const RUST_SOFT = '#F3E2D4';
export const CLAY = '#C1502E';
export const CLAY_SOFT = '#F4DCD3';
export const AMBER = '#C99A3D';
export const AMBER_SOFT = '#F3E7CB';
export const MOSS = '#6B7D4F';
export const MOSS_SOFT = '#E4E9D8';
export const SAGE = '#5C8368';
export const SAGE_SOFT = '#DEEAE0';
export const SLATE = '#5B6672';
export const SLATE_SOFT = '#E4E7EA';

export const RADIUS = 14;
export const RADIUS_SM = 9;
export const SHADOW = '0 1px 2px rgba(43,36,28,0.06), 0 8px 24px rgba(43,36,28,0.08)';
export const SHADOW_SM = '0 1px 2px rgba(43,36,28,0.08)';
export const TRANSITION = '140ms ease';

// Kind accents (project | task | maintenance)
export const KIND_COLORS = {
  project: CLAY,
  task: SLATE,
  maintenance: MOSS,
};

export const KIND_LABELS = {
  project: 'Project',
  task: 'Task',
  maintenance: 'Maintenance',
};

// Phase / status config -- drives nav labels, badges, and page chrome.
// Status values are unchanged from the original data model sketch so
// existing item data stays compatible; only the presentation is new.
export const PHASES = {
  idea: { key: 'idea', label: 'Ideas', singular: 'Idea', color: AMBER, soft: AMBER_SOFT },
  pending: { key: 'pending', label: 'Upcoming', singular: 'Upcoming', color: CLAY, soft: CLAY_SOFT },
  'on-deck': { key: 'on-deck', label: 'Up Next', singular: 'Up Next', color: MOSS, soft: MOSS_SOFT },
  active: { key: 'active', label: 'Active', singular: 'Active', color: RUST, soft: RUST_SOFT },
  done: { key: 'done', label: 'Done', singular: 'Done', color: SAGE, soft: SAGE_SOFT },
};

// Ordered phase keys -- drives the universal "move to any phase" control,
// since a jump should never block on the linear idea→...→done path.
export const PHASE_ORDER = ['idea', 'pending', 'on-deck', 'active', 'done'];

