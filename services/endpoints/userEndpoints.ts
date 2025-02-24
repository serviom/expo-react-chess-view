import { api } from '../api';

export const userEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserData: builder.query({
            query: (userId) => `/users/${userId}`,
        }),
    }),
    overrideExisting: false,
});

export const { useGetUserDataQuery } = userEndpoints;