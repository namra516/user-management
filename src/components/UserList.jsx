import { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../services/usersApi';

export default function UserList({ page, setPage, onView, onEdit }) {
  const { data, isLoading, isFetching, isError, refetch } = useGetUsersQuery(page);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // ReqRes is a "fake" API: it says "deleted!" but doesn't really delete.
  // So we remember deleted ids and hide them ourselves.
  const [removedIds, setRemovedIds] = useState([]);
  const [message, setMessage] = useState('');

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.first_name} ${user.last_name}?`)) return;
    try {
      await deleteUser(user.id).unwrap();
      setRemovedIds((ids) => [...ids, user.id]);
      setMessage(`${user.first_name} was deleted.`);
    } catch {
      setMessage('Could not delete the user. Please try again.');
    }
  };

  if (isLoading)
    return <p className="py-10 text-center text-slate-500">Loading users...</p>;

  if (isError)
    return (
      <div className="py-10 text-center text-red-600">
        <p className="mb-3">Oops! Could not load users.</p>
        <button
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100"
          onClick={refetch}
        >
          Try again
        </button>
      </div>
    );

  const users = data.data.filter((u) => !removedIds.includes(u.id));

  return (
    <>
      {message && (
        <p className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-center text-green-800">
          {message}
        </p>
      )}

      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
          isFetching ? 'opacity-60' : ''
        }`}
      >
        {users.map((user) => (
          <div
            className="rounded-2xl bg-white p-5 text-center shadow-md"
            key={user.id}
          >
            <img
              src={user.avatar}
              alt={user.first_name}
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
            <h3 className="mt-3 text-lg font-semibold">
              {user.first_name} {user.last_name}
            </h3>
            <p className="break-all text-sm text-slate-500">{user.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100"
                onClick={() => onView(user.id)}
              >
                View
              </button>
              <button
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100"
                onClick={() => onEdit(user.id)}
              >
                Edit
              </button>
              <button
                className="rounded-lg border border-red-300 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isDeleting}
                onClick={() => handleDelete(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Prev
        </button>
        <span className="text-sm text-slate-600">
          Page {data.page} of {data.total_pages}
        </span>
        <button
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === data.total_pages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>
    </>
  );
}