import { useState } from 'react';
import Nav from './Nav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Ideas from './pages/Ideas.jsx';
import Upcoming from './pages/Upcoming.jsx';
import UpNext from './pages/UpNext.jsx';
import Done from './pages/Done.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import { mockItems } from './data/mockItems.js';

const today = () => new Date().toISOString().slice(0, 10);

function newId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [items, setItems] = useState(mockItems);
  const [page, setPage] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const patchItem = (id, patch) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...(typeof patch === 'function' ? patch(item) : patch) } : item,
      ),
    );
  };

  const handlers = {
    addIdea: (form) => {
      setItems((current) => [
        ...current,
        {
          id: newId(),
          title: form.title.trim(),
          notes: form.notes.trim(),
          kind: form.kind,
          category: form.category.trim(),
          rainyDay: form.rainyDay,
          status: 'idea',
          resources: [],
        },
      ]);
    },
    moveToUpcoming: (id) => patchItem(id, { status: 'pending', approvedAt: today() }),
    updateProfile: (id, fields) => patchItem(id, fields),
    toggleResource: (id, index) =>
      patchItem(id, (item) => ({
        resources: (item.resources || []).map((r, i) => (i === index ? { ...r, acquired: !r.acquired } : r)),
      })),
    addResource: (id, label) =>
      patchItem(id, (item) => ({ resources: [...(item.resources || []), { label, acquired: false }] })),
    sendToUpNext: (id) => patchItem(id, { status: 'on-deck' }),
    updatePlanning: (id, note) => patchItem(id, { planningNotes: note }),
    toggleDay: (id, day) =>
      patchItem(id, (item) => {
        const days = item.weeklyPlan || [];
        return { weeklyPlan: days.includes(day) ? days.filter((d) => d !== day) : [...days, day] };
      }),
    startActive: (id) =>
      patchItem(id, (item) => ({
        status: 'active',
        startedAt: today(),
        tasks: item.tasks || [],
        log: item.log || [],
      })),
    toggleTask: (id, index) =>
      patchItem(id, (item) => ({
        tasks: (item.tasks || []).map((t, i) => (i === index ? { ...t, done: !t.done } : t)),
      })),
    addTask: (id, label) =>
      patchItem(id, (item) => ({ tasks: [...(item.tasks || []), { label, done: false }] })),
    addLog: (id, note) =>
      patchItem(id, (item) => ({ log: [...(item.log || []), { date: today(), note }] })),
    completeProject: (id) => {
      patchItem(id, { status: 'done', completedAt: today() });
      setSelectedProjectId(null);
    },
  };

  const navigate = (nextPage) => {
    setSelectedProjectId(null);
    setPage(nextPage);
  };

  const selectedProject = selectedProjectId ? items.find((i) => i.id === selectedProjectId) : null;

  return (
    <div className="app-shell">
      <Nav page={page} onNavigate={navigate} items={items} />

      <main className="main">
        {selectedProject ? (
          <ProjectDetail
            item={selectedProject}
            onToggleTask={handlers.toggleTask}
            onAddTask={handlers.addTask}
            onToggleResource={handlers.toggleResource}
            onAddLog={handlers.addLog}
            onComplete={handlers.completeProject}
            onBack={() => setSelectedProjectId(null)}
          />
        ) : page === 'dashboard' ? (
          <Dashboard items={items} onOpenProject={setSelectedProjectId} onNavigate={navigate} />
        ) : page === 'ideas' ? (
          <Ideas items={items} onAddIdea={handlers.addIdea} onMoveToUpcoming={handlers.moveToUpcoming} />
        ) : page === 'upcoming' ? (
          <Upcoming
            items={items}
            onUpdateProfile={handlers.updateProfile}
            onToggleResource={handlers.toggleResource}
            onAddResource={handlers.addResource}
            onSendToUpNext={handlers.sendToUpNext}
          />
        ) : page === 'upnext' ? (
          <UpNext
            items={items}
            onUpdatePlanning={handlers.updatePlanning}
            onToggleDay={handlers.toggleDay}
            onStartActive={handlers.startActive}
          />
        ) : (
          <Done items={items} />
        )}
      </main>
    </div>
  );
}
