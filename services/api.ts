import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {getAccessToken} from "@/services/SecureStore";
import axiosBaseQuery from './axiosBaseQuery';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = createApi({
    reducerPath: 'api',
    // baseQuery: axiosBaseQuery({
    //     baseUrl: apiBaseUrl,
    //     prepareHeaders: async (headers) => {
    //         const token = await getAccessToken();
    //         if (token) {
    //             headers.set('Authorization', `Bearer ${token}`);
    //         }
    //         return headers;
    //     },
    // }),

    // код нижче працює через  fetch
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: async (headers, { getState: any }) => {
            const token = await getAccessToken() || '';
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({})
});


