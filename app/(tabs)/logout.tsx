import React from 'react';
import {useSignInMutation, useLogoutMutation} from '../../services/endpoints/authEndpoints';
import {View, Text, Button} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import {useRouter} from "expo-router";
import {Route} from "@/shared/types";
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";

const LoginScreen = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [logout, { isLoading, isError, isSuccess, error }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            router.push(Route.SignIn);
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    return (
        <ThemeChangeProvider>
            <Text>
                 {isLoading ? 'Loading...' : ''}
            </Text>
            {isError && error && (
                <Text>
                    {
                        typeof error === 'string' ? (
                            <> Error: {error}</>
                        ) : (
                            <> Error: {JSON.stringify(error)}</>
                        )
                    }
                </Text>
            )}
            <Button
                testID="btn-submit"
                disabled={isLoading}
                title="Logout"
                onPress={handleLogout}
            />
        </ThemeChangeProvider>
    );
};

export default LoginScreen;