import { useState } from 'react';
import UserList from './components/userList';
import UserDetails from './components/userDetails';
import UserForm from './components/userForm';

export default function App() {
  // which screen are we on?  list | details | add | edit
  const [view, setView] = useState({ name: 'list' });
  // which page of users are we on?
  const [page, setPage] = useState(1);

  const goHome = () => setView({ name: 'list' });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">User Management</h1>
          {view.name === 'list' && (
            <button
              className="rounded-lg border border-indigo-600 bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              onClick={() => setView({ name: 'add' })}
            >
              + Add User
            </button>
          )}
        </header>

        {view.name === 'list' && (
          <UserList
            page={page}
            setPage={setPage}
            onView={(id) => setView({ name: 'details', id })}
            onEdit={(id) => setView({ name: 'edit', id })}
          />
        )}

        {view.name === 'details' && (
          <UserDetails
            id={view.id}
            onBack={goHome}
            onEdit={() => setView({ name: 'edit', id: view.id })}
          />
        )}

        {view.name === 'add' && <UserForm onDone={goHome} />}
        {view.name === 'edit' && <UserForm userId={view.id} onDone={goHome} />}
      </div>
    </div>
  );
}