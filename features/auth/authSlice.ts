import { createSlice } from '@reduxjs/toolkit';
import {IAuthResponse} from "@/shared/types";
import {removeTokensFromStore, setAccessToken, setRefreshToken} from "@/services/SecureStore";
import {authEndpoints} from "@/services/endpoints/authEndpoints";


export enum Role {
    Admin = 'admin',
    Moderator = 'moderator',
    Customer = 'customer',
}

export interface IUserPayloadOptions {
    userId: string,
    email: string,
    username: string,
    role: Role,
    name: string,
    secondName?: string,
    version: string,
    permissions: string[],
    organizationId: string,
    sessionId: string
}

interface IUser {
    userId: string,
    email: string,
    username: string,
    role: Role,
    name: string,
    secondName?: string,
    organizationId: string,
}

interface IAuthState {
    loading: boolean; // @TODO I think need remove in future
    user?: IUser | null;
    //payload?: IUserPayloadOptions | null,
    tokens?: any; // @TODO I think need remove in future
    isAuth: boolean;
    error: any;
    success: boolean;
}


export const createAuthInitialState = (): IAuthState => {
    return {
        loading: false,
        user: undefined,
        //payload: undefined,
        isAuth: false,
        error: null,
        success: false,
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState: createAuthInitialState(),
    reducers: {
        login: (state, action: {payload: IUser, type: string}) => {
            console.log('login action.payload', action.payload);
            state.user = action.payload;
            //state.payload = action.payload.user;
            state.isAuth = true;
            state.success = true;
            state.error = false;
        },
        logout: (state, action) => {
            state.user = null;
            //state.payload = null;
            state.isAuth = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authEndpoints.endpoints.signIn.matchFulfilled,
            (state,{ payload, type }) => {
                console.log('payload in api.endpoints.signIn.matchFulfilled', payload);
                const { id, ...user } = {...payload.user, ...{userId: payload.user.id}};
                console.log('payload in api.endpoints.signIn.matchFulfilled', user);
                authSlice.caseReducers.login(state, { payload: user, type });

                // @ts-ignore
                // eslint-disable-next-line no-undef
                setAccessToken(payload.tokens.accessToken);
                // @ts-ignore
                // eslint-disable-next-line no-undef
                setRefreshToken(payload.tokens.refreshToken);
            }
        ),
        builder.addMatcher(
            authEndpoints.endpoints.logout.matchFulfilled,
            (state,{ payload, type }) => {
                state.loading = false;
                console.log('authSlice.caseReducers.logout');
                authSlice.caseReducers.logout(state, { payload, type });
                // @ts-ignore
                // eslint-disable-next-line no-undef
                removeTokensFromStore();
            }
        ),
        builder.addMatcher(
            authEndpoints.endpoints.logout.matchPending,
            (state) => {
                console.log('Logout is pending');
                state.loading = true;
            }
        ),
        builder.addMatcher(
            authEndpoints.endpoints.logout.matchRejected,
            (state, { error, type }) => {
                console.log('Logout failed:', error);
                state.loading = false;
                state.error = error;
            }
        );
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


