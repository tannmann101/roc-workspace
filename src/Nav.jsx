import { PHASES } from './theme.js';

const LINKS = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'ideas', status: 'idea' },
  { page: 'upcoming', status: 'pending' },
  { page: 'upnext', status: 'on-deck' },
  { page: 'done', status: 'done' },
];

export default function Nav({ page, onNavigate, items }) {
  const countFor = (status) => (status ? items.filter((item) => item.status === status).length : null);

  return (
    <nav className="nav">
      <div className="nav-brand">The Workshop</div>
      <div className="nav-links">
        {LINKS.map((link) => {
          const count = countFor(link.status);
          const label = link.status ? PHASES[link.status].label : link.label;
          return (
            <button
              key={link.page}
              type="button"
              className={`nav-link ${page === link.page ? 'is-active' : ''}`}
              onClick={() => onNavigate(link.page)}
            >
              {label}
              {count !== null && count > 0 ? <span className="nav-count">{count}</span> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
