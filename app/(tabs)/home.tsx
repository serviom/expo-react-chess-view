import { View, StyleSheet } from 'react-native';
import {Link, useRouter} from "expo-router";
import {Route} from "@/shared/types";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import React from 'react';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import { Text } from '@rneui/themed';

const HomeScreen = ()=> {
    const authState = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    return (
        <ThemeChangeProvider>
                <Text style={styles.text}>Home screen</Text>
                <Link href={Route.About} style={styles.button}>
                    <Text>Go to About screen</Text>
                </Link>
                <Link href={Route.SignIn} style={styles.button}>
                    <Text>Go to Login screen</Text>
                </Link>
                <Link href={'/animate'} style={styles.button}>
                    <Text>Animate</Text>
                </Link>
                <Link href={'/modal'} style={styles.button}>
                    <Text>Modal</Text>
                </Link>
                <Link href={'/canvas'} style={styles.button}>
                    <Text>Canvas page</Text>
                </Link>
                <Link href={'/board_screen'} style={styles.button}>
                    <Text>Board screen</Text>
                </Link>
                {
                    !authState.isAuth &&
                    <Link href={Route.ForgotPassword} style={styles.button}>
                        <Text>Forgot password</Text>
                    </Link>
                }
                {
                    authState.isAuth &&
                    <Link href={Route.ProfileInfo} style={styles.button}>
                        <Text>User profile</Text>
                    </Link>
                }
                {
                    authState.isAuth &&
                    <Link href={Route.ProfileSettings} style={styles.button}>
                        <Text>Settings profile</Text>
                    </Link>
                }
        </ThemeChangeProvider>
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});

export default HomeScreen;
