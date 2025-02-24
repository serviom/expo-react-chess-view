import {api} from '../api';
import {
    IActivateResponse,
    IAuthResponse,
    IForgotPasswordResponse,
    IResetPasswordResponse,
    ISignUpResponse
} from '@/shared/types';
import {SignInFormValues} from "@/app/(tabs)/sign_in";
import {SignUpFormValues, SignUpValues} from "@/app/(tabs)/sign_up";
import {ForgotPasswordValues} from "@/app/(tabs)/forgot_password";
import {BaseNextRequest} from "next/dist/server/base-http";
import {ActivateFormValues} from "@/app/(tabs)/activate";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ResetPasswordValues {
    password: string;
    re_password: string;
    changePasswordHash: string;
    email: string;
}

export const authEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<IAuthResponse, SignInFormValues>({

            // queryFn: async (credentials, _queryApi, _extraOptions, fetchWithBQ) => {
            //     // Додаємо затримку перед запитом
            //     await delay(2000);
            //
            //     // Виконуємо запит через `fetchWithBQ`
            //     const result = await fetchWithBQ({
            //         url: '/auth/signIn',
            //         method: 'POST',
            //         body: credentials,
            //     });
            //
            //     // Повертаємо результат запиту
            //     return result.data
            //         ? { data: result.data }
            //         : { error: result.error };
            // },

            query: (credentials) => {
                return {
                    url: '/auth/signIn',
                    method: 'POST',
                    body: credentials,
                }
            },

            // onQueryStarted: async (arg, { queryFulfilled }) => {
            //     try {
            //         await queryFulfilled;
            //     } catch (err) {
            //         console.error('Помилка у запиті signIn:', err);
            //     }
            // },
        }),
        signUp: builder.mutation<ISignUpResponse, SignUpValues>({
            query: (credentials) => {
                return {
                    url: '/auth/signUp',
                    method: 'POST',
                    body: credentials,
                }
            }
        }),
        activate: builder.mutation<IActivateResponse, ActivateFormValues>({
            query: (credentials) => {
                return {
                    url: '/auth/signUp',
                    method: 'POST',
                    body: credentials,
                }
            }
        }),
        forgotPassword: builder.mutation<IForgotPasswordResponse, ForgotPasswordValues>({
            query: (credentials) => {
                return {
                    url: '/auth/forgotPassword',
                    method: 'POST',
                    body: credentials,
                }
            }
        }),
        resetPassword: builder.mutation<IResetPasswordResponse, ResetPasswordValues>({
            query: (credentials) => {
                return {
                    url: '/auth/resetPassword',
                    method: 'POST',
                    body: credentials,
                }
            }
        }),
        logout: builder.mutation({
            query: (params) => {
                console.log('Logout params:', params);
                return {
                    url: '/auth/logout',
                    method: 'POST',
                    body: params,
                };
            },
        }),
        getUserProfile: builder.query({
            query: (id) => ({ url: `/auth/user-profile` }),
        }),
        getUserRedirect: builder.query<IAuthResponse, string>({
            query: (searchParams) => ({ url: `/auth/google/redirect${searchParams}`}),
        }),
    }),
    overrideExisting: false,
});

export const { useActivateMutation, useSignInMutation, useSignUpMutation,
    useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation,
    useGetUserProfileQuery, useGetUserRedirectQuery } = authEndpoints;