import {Slot, Stack} from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import {View} from "react-native";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default RootLayout;