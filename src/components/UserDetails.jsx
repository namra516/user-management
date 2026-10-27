import { useGetUserByIdQuery } from '../services/usersApi';

export default function UserDetails({ id, onBack, onEdit }) {
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id);

  if (isLoading)
    return <p className="py-10 text-center text-slate-500">Loading user...</p>;
  if (isError)
    return <p className="py-10 text-center text-red-600">Could not load this user.</p>;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-5 text-center shadow-md">
      <img
        src={user.avatar}
        alt={user.first_name}
        className="mx-auto h-36 w-36 rounded-full object-cover"
      />
      <h2 className="mt-4 text-2xl font-bold">
        {user.first_name} {user.last_name}
      </h2>
      <p className="break-all text-slate-500">{user.email}</p>
      <p className="mt-1 text-sm text-slate-400">User ID: {user.id}</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100"
          onClick={onBack}
        >
          ← Back
        </button>
        <button
          className="rounded-lg border border-indigo-600 bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
}