import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IUserPayloadOptions} from "@/features/auth/authSlice";

export const NAME_ACCESS_TOKENS  = 'accessToken';
export const NAME_REFRESH_TOKENS  = 'refreshToken';

export const getAccessToken = async () => {
    return await getTokenFromStore(NAME_ACCESS_TOKENS);
};

export const getRefreshToken = async () => {
    return await getTokenFromStore(NAME_REFRESH_TOKENS);
};

export const getTokenFromStore = async (tokenName: string) => {
    return (Platform.OS === 'ios' || Platform.OS === 'android') ? await SecureStore.getItemAsync(tokenName) : await AsyncStorage.getItem(tokenName);
};

export const setTokenInStore = async (tokenName: string, value: string) => {
    return (Platform.OS === 'ios' || Platform.OS === 'android') ? await SecureStore.setItemAsync(tokenName, value) : await AsyncStorage.setItem(tokenName, value);
};

export const setAccessToken = async (value: string) => {
    return await setTokenInStore(NAME_ACCESS_TOKENS, value);
};

export const setRefreshToken = async (value: string) => {
    return await setTokenInStore(NAME_REFRESH_TOKENS, value);
};

export const removeTokensFromStore = async (tokenName: string) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await SecureStore.deleteItemAsync(NAME_ACCESS_TOKENS);
        await SecureStore.deleteItemAsync(NAME_REFRESH_TOKENS);
    } else {
        await AsyncStorage.removeItem(NAME_ACCESS_TOKENS);
        await AsyncStorage.removeItem(NAME_REFRESH_TOKENS);
    }
};

export const getPayloadFromToken = async (): Promise<IUserPayloadOptions | null> => {
    const token = await getAccessToken();
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('current timestamp', new Date().getTime() / 1000);
            console.log('payload.exp', payload.exp);
            const isTokenValid = payload && new Date().getTime() / 1000 < payload.exp;
            return isTokenValid ? payload : null;
        } catch {
            return null;
        }
    }
    return null;
}


// setAuthToken('mySecureAuthToken')
//     .then(() => console.log('Auth token saved'))
//     .catch(error => console.error('Error saving auth token', error));