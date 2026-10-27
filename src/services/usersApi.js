import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://reqres.in/api/',
    prepareHeaders: (headers) => {
      headers.set('x-api-key', import.meta.env.VITE_REQRES_API_KEY);
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    
    // READ: list of users (with page number)
    getUsers: builder.query({
      query: (page = 1) => `users?page=${page}`,
      providesTags: ['Users'],
    }),

    // READ: one user
    getUserById: builder.query({
      query: (id) => `users/${id}`,
      transformResponse: (response) => response.data,
    }),

    // CREATE
    addUser: builder.mutation({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),

    // UPDATE
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users'],
    }),

    // DELETE
    deleteUser: builder.mutation({
      query: (id) => ({ url: `users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;