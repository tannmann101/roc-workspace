// theme.js
// Shared design tokens for The Workshop -- warm wood / craft-room palette,
// distinct from status/kind accent colors used on item cards.

export const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif";
export const SERIF = "'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

// Room backdrop -- warm wood wall + floor
export const WALL = "#C9A877";
export const WALL_DARK = "#B8955F";
export const FLOOR = "#8A5A34";
export const WOOD = "#8A5A34";
export const WOOD_LIGHT = "#A97A4C";
export const WOOD_DARK = "#5E3B20";
export const WOOD_GRAIN = "rgba(94,59,32,0.18)";

// Ink / neutrals
export const INK = "#2B1E12";
export const INK_SOFT = "#5A4A38";
export const PAPER = "#FBF6EC";
export const PAPER_SOFT = "#F3EAD6";
export const LINE = "#D8C6A3";

// Zone accents
export const CORK = "#D9B589";
export const CORK_DARK = "#C29A69";
export const GLASS = "rgba(224,238,235,0.35)";
export const BRASS = "#B08D46";
export const RUST = "#A5522F";
export const MOSS = "#5C6B2C";
export const SLATE = "#4C5B61";

export const SHADOW = "0 2px 6px rgba(43,30,18,0.18), 0 10px 28px rgba(43,30,18,0.16)";
export const SHADOW_SOFT = "0 1px 3px rgba(43,30,18,0.12)";
export const RADIUS = 14;
export const RADIUS_SM = 8;
export const TRANSITION = "160ms ease";

// Kind accents (project | task | maintenance)
export const KIND_COLORS = {
  project: RUST,
  task: SLATE,
  maintenance: MOSS,
};

export const KIND_LABELS = {
  project: "Project",
  task: "Task",
  maintenance: "Maintenance",
};

// Status -> zone mapping, drives which zone an item shows up in
export const STATUS_ZONE = {
  idea: "corkboard",
  pending: "cabinet",
  "on-deck": "shelf",
  active: "workbench",
  done: "drawer",
};

export const ZONE_META = {
  corkboard: { label: "The Corkboard", subtitle: "Someday-maybes" },
  cabinet: { label: "The Cabinet", subtitle: "Approved, pending" },
  shelf: { label: "The Shelf", subtitle: "On deck" },
  workbench: { label: "The Workbench", subtitle: "Active work" },
  drawer: { label: "The Drawer", subtitle: "Done & archived" },
};
