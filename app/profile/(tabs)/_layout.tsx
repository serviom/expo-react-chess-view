import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Route} from "@/shared/types";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
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
                name="info"
                options={{
                    title: 'Profile Info',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
                    ),
                    href: Route.ProfileInfo
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'User settings',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
                    ),
                    href: Route.ProfileSettings
                }}
            />
        </Tabs>
    );
}