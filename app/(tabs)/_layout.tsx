import React from 'react';
import { useSelector } from 'react-redux';
import {RootState} from "@/features/store";
import {Role, Route} from "@/shared/types";
import {Tabs} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
    const isAuth = useSelector((state: RootState) => state.auth.isAuth);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    return (
        <Tabs
            // detachInactiveScreens={true}
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                    href: Route.Home
                }}
            />

            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    ),
                    href: Route.About
                }}
            />


            <Tabs.Screen
                name="sign_in"
                options={{
                    title: 'Sign In',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'log-in' : 'log-in-outline'} color={color} size={24}/>
                    ),
                    href: !isAuth ? Route.SignIn : null,
                }}
            />

            <Tabs.Screen
                name="sign_in_by_google"
                options={{
                    title: 'Sign In By Google',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'log-in' : 'log-in-outline'} color={color} size={24}/>
                    ),
                    href: null
                }}
            />

            <Tabs.Screen
                name="play"
                options={{
                    title: 'Play Chess',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'log-out' : 'log-out-outline'} color={color} size={24}/>
                    ),
                    href: Route.Play
                }}
            />

            <Tabs.Screen
                name="logout"
                options={{
                    title: 'Logout',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'log-out' : 'log-out-outline'} color={color} size={24}/>
                    ),
                    href: isAuth ? Route.Logout : null,
                }}
            />

            <Tabs.Screen
                name="sign_up"
                options={{
                    title: 'Sign Up',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'person-add' : 'person-add-outline'} color={color}
                                  size={24}/>
                    ),
                    href: !isAuth ? Route.SignUp : null,
                }}
            />

            <Tabs.Screen
                name="activate"
                options={{
                    title: 'Activate',
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'person-add' : 'person-add-outline'} color={color}
                                  size={24}/>
                    ),
                    href: null,
                }}
            />

            <Tabs.Screen
                name="screen"
                options={{
                    title: 'Test admin Screen',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: isAuth && userRole === Role.Admin ? Route.Screen : null,
                }}
            />

            <Tabs.Screen
                name="forgot_password"
                options={{
                    title: 'Forgot password',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: null
                }}
            />

            <Tabs.Screen
                name="reset_password"
                options={{
                    title: 'Reset password',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: null
                }}
            />

            <Tabs.Screen
                name="modal"
                options={{
                    title: 'Reset password',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: null
                }}
            />

            <Tabs.Screen
                name="animate"
                options={{
                    title: 'Reset password',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: '/(tabs)/modal'
                }}
            />

            <Tabs.Screen
                name="canvas"
                options={{
                    title: 'Canvas',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: '/(tabs)/canvas'
                }}
            />

            <Tabs.Screen
                name="board_screen"
                options={{
                    title: 'Canvas board',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
                    ),
                    href: null
                }}
            />

        </Tabs>
    );
}