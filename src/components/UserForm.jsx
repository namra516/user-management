import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
} from '../services/usersApi';

export default function UserForm({ userId, onDone }) {
  const isEdit = Boolean(userId);

  // Only fetch the existing user when editing
  const { data: existing, isLoading: loadingUser } = useGetUserByIdQuery(userId, {
    skip: !isEdit,
  });
  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { first_name: '', last_name: '', email: '', job: '' },
  });

  // When the existing user arrives, fill the form boxes
  useEffect(() => {
    if (existing) {
      reset({
        first_name: existing.first_name,
        last_name: existing.last_name,
        email: existing.email,
        job: '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values) => {
    setSuccess('');
    setServerError('');
    try {
      if (isEdit) {
        await updateUser({ id: userId, ...values }).unwrap();
        setSuccess('User updated successfully!');
      } else {
        await addUser(values).unwrap();
        setSuccess('User created successfully!');
        reset();
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  if (isEdit && loadingUser)
    return <p className="py-10 text-center text-slate-500">Loading form...</p>;

  return (
    <form
      className="mx-auto max-w-md rounded-2xl bg-white p-5 text-left shadow-md"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="mb-5 text-center text-2xl font-bold">
        {isEdit ? 'Edit User' : 'Add New User'}
      </h2>

      {success && (
        <p className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-center text-green-800">
          {success}
        </p>
      )}
      {serverError && (
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-center text-red-800">
          {serverError}
        </p>
      )}

      <label className="mb-4 block text-sm font-semibold">
        First name *
        <input
          type="text"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          {...register('first_name', {
            required: 'First name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
          })}
        />
        {errors.first_name && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.first_name.message}
          </span>
        )}
      </label>

      <label className="mb-4 block text-sm font-semibold">
        Last name *
        <input
          type="text"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          {...register('last_name', {
            required: 'Last name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
          })}
        />
        {errors.last_name && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.last_name.message}
          </span>
        )}
      </label>

      <label className="mb-4 block text-sm font-semibold">
        Email *
        <input
          type="email"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email',
            },
          })}
        />
        {errors.email && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.email.message}
          </span>
        )}
      </label>

      <label className="mb-4 block text-sm font-semibold">
        Job (optional)
        <input
          type="text"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          {...register('job', {
            minLength: { value: 2, message: 'At least 2 characters' },
            maxLength: { value: 50, message: 'Max 50 characters' },
          })}
        />
        {errors.job && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.job.message}
          </span>
        )}
      </label>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium transition hover:bg-slate-100"
          onClick={onDone}
        >
          ← Back to list
        </button>
        <button
          type="submit"
          className="rounded-lg border border-indigo-600 bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={adding || updating}
        >
          {adding || updating ? 'Saving...' : isEdit ? 'Save changes' : 'Create user'}
        </button>
      </div>
    </form>
  );
}