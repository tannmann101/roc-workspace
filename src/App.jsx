import { useState } from 'react';
import { signOut } from 'firebase/auth';
import AuthGate, { useAuthUser } from './AuthGate.jsx';
import { auth } from './firebase.js';
import { useItems } from './useItems.js';
import Nav from './Nav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Ideas from './pages/Ideas.jsx';
import Upcoming from './pages/Upcoming.jsx';
import UpNext from './pages/UpNext.jsx';
import Done from './pages/Done.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';

const today = () => new Date().toISOString().slice(0, 10);

function Shell({ user }) {
  const { items, status, addItem, patchItem } = useItems(true);
  const [page, setPage] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  if (status === 'forbidden') {
    return <AuthGate user={user} forbidden />;
  }

  // The single place a status change happens, so every jump between
  // phases -- whether via a page's own "next step" button or the
  // universal PhaseJump control -- logs the same short history trail and
  // picks up the same phase-entry side effects (seeding a task/log list
  // on Active, stamping a date on Done, etc). Movement between phases is
  // just a status change and should never be blocked or handled
  // differently depending on where it's triggered from.
  const moveToPhase = (id, newStatus, extraFields = {}) =>
    patchItem(id, (item) => {
      if (item.status === newStatus) return {};
      const history = [
        ...(item.history || []),
        { from: item.status || null, to: newStatus, at: new Date().toISOString() },
      ];
      const sideEffects =
        newStatus === 'active'
          ? { startedAt: today(), tasks: item.tasks || [], log: item.log || [] }
          : newStatus === 'pending'
            ? { approvedAt: today() }
            : newStatus === 'done'
              ? { completedAt: today() }
              : {};
      return { ...sideEffects, ...extraFields, status: newStatus, history };
    });

  const handlers = {
    addIdea: (form) =>
      addItem({
        title: form.title.trim(),
        notes: form.notes.trim(),
        kind: form.kind,
        category: form.category.trim(),
        rainyDay: form.rainyDay,
        status: 'idea',
        resources: [],
        history: [{ from: null, to: 'idea', at: new Date().toISOString() }],
      }),
    moveToUpcoming: (id) => moveToPhase(id, 'pending'),
    updateProfile: (id, fields) => patchItem(id, fields),
    toggleResource: (id, index) =>
      patchItem(id, (item) => ({
        resources: (item.resources || []).map((r, i) => (i === index ? { ...r, acquired: !r.acquired } : r)),
      })),
    addResource: (id, label) =>
      patchItem(id, (item) => ({ resources: [...(item.resources || []), { label, acquired: false }] })),
    sendToUpNext: (id) => moveToPhase(id, 'on-deck'),
    updatePlanning: (id, note) => patchItem(id, { planningNotes: note }),
    toggleDay: (id, day) =>
      patchItem(id, (item) => {
        const days = item.weeklyPlan || [];
        return { weeklyPlan: days.includes(day) ? days.filter((d) => d !== day) : [...days, day] };
      }),
    startActive: (id) => moveToPhase(id, 'active'),
    toggleTask: (id, index) =>
      patchItem(id, (item) => ({
        tasks: (item.tasks || []).map((t, i) => (i === index ? { ...t, done: !t.done } : t)),
      })),
    addTask: (id, label) =>
      patchItem(id, (item) => ({ tasks: [...(item.tasks || []), { label, done: false }] })),
    addLog: (id, note) =>
      patchItem(id, (item) => ({ log: [...(item.log || []), { date: today(), note }] })),
    completeProject: (id) => {
      moveToPhase(id, 'done');
      setSelectedProjectId(null);
    },
    movePhase: (id, newStatus) => {
      moveToPhase(id, newStatus);
      if (id === selectedProjectId && newStatus !== 'active') setSelectedProjectId(null);
    },
  };

  const navigate = (nextPage) => {
    setSelectedProjectId(null);
    setPage(nextPage);
  };

  const selectedProject = selectedProjectId ? (items || []).find((i) => i.id === selectedProjectId) : null;

  return (
    <div className="app-shell">
      <Nav page={page} onNavigate={navigate} items={items || []} userEmail={user.email} onSignOut={() => signOut(auth)} />

      <main className="main">
        {status === 'loading' && !items ? (
          <p className="auth-loading">loading the workshop…</p>
        ) : status === 'error' ? (
          <p className="auth-error">Couldn't load the workspace. Try refreshing.</p>
        ) : selectedProject ? (
          <ProjectDetail
            item={selectedProject}
            onToggleTask={handlers.toggleTask}
            onAddTask={handlers.addTask}
            onToggleResource={handlers.toggleResource}
            onAddLog={handlers.addLog}
            onComplete={handlers.completeProject}
            onMovePhase={handlers.movePhase}
            onBack={() => setSelectedProjectId(null)}
          />
        ) : page === 'dashboard' ? (
          <Dashboard
            items={items || []}
            onOpenProject={setSelectedProjectId}
            onNavigate={navigate}
            onMovePhase={handlers.movePhase}
          />
        ) : page === 'ideas' ? (
          <Ideas
            items={items || []}
            onAddIdea={handlers.addIdea}
            onMoveToUpcoming={handlers.moveToUpcoming}
            onMovePhase={handlers.movePhase}
          />
        ) : page === 'upcoming' ? (
          <Upcoming
            items={items || []}
            onUpdateProfile={handlers.updateProfile}
            onToggleResource={handlers.toggleResource}
            onAddResource={handlers.addResource}
            onSendToUpNext={handlers.sendToUpNext}
            onMovePhase={handlers.movePhase}
          />
        ) : page === 'upnext' ? (
          <UpNext
            items={items || []}
            onUpdatePlanning={handlers.updatePlanning}
            onToggleDay={handlers.toggleDay}
            onStartActive={handlers.startActive}
            onMovePhase={handlers.movePhase}
          />
        ) : (
          <Done items={items || []} onMovePhase={handlers.movePhase} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  const user = useAuthUser();
  return <AuthGate user={user}>{user && <Shell user={user} />}</AuthGate>;
}
