import React, {useEffect, useMemo, useState} from "react";
import {Dimensions, PixelRatio, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View} from "react-native";
import {darkColors, lightColors, makeStyles, Switch, Text, useThemeMode} from '@rneui/themed';
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";
import {ThemedView} from "@/components/ThemedView";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ModalProvider} from "@/providers/ModalProvider";
import * as ScreenOrientation from "expo-screen-orientation";
const scale = PixelRatio.get();

type styleProps = {
    mode: string;
};

const HEIGHT_BLOCKS = 28;
export const PADDING = 5;
export const BORDER = 1;

export const ThemeChangeProvider = ({ children }: { children?: React.ReactNode })=> {
    const { mode, setMode } = useThemeMode();
    const [heightThemedView, setHeightThemedView] = useState<number>(HEIGHT_BLOCKS);
    const themeStyles = makeThemeStyles({mode});

    const toggleSwitch = () => {
        setMode(mode === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        setMode('light');
    }, []);

    useEffect(() => {
        const changeOrientation = async () => {
            await ScreenOrientation.unlockAsync(); // Дозволяє зміну орієнтації
        };
        changeOrientation();
    }, []);

    const handleLoadThemedView = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeightThemedView(height);
    };

    const getInnerBlockHeight = useMemo((): number =>  {
        return heightThemedView - HEIGHT_BLOCKS * 2 - PADDING * 4 - BORDER * 4;
    }, [heightThemedView]);

    return (
        <SafeAreaProvider>
            <StatusBar style={mode}/>
            <Toast/>
            <SafeAreaView style={styles.safeArea}>
            <ThemedView style={[styles.container]} onLayout={handleLoadThemedView}>
                <View style={[styles.viewSwitch, themeStyles.borderStyle]}>
                    <Text>Switch Color</Text>
                    <View style={{ height: HEIGHT_BLOCKS, justifyContent: 'center' }}>
                        <Switch
                            style={{ alignSelf: 'center', transform: [{ scale: 0.8 }]}}
                            value={mode === "dark"}
                            onValueChange={toggleSwitch}
                        />
                    </View>
                </View>
                <View style={[styles.centerBlock, themeStyles.borderStyle, {height: getInnerBlockHeight}]}>
                    <ScrollView>
                        <ScrollView horizontal={false}>
                            <ModalProvider>
                                {children}
                            </ModalProvider>
                        </ScrollView>
                    </ScrollView>
                </View>
                <View style={[styles.bottomBlock, themeStyles.borderStyle]}>
                    <Text>Bottom Block</Text>
                </View>
            </ThemedView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const makeThemeStyles = makeStyles((theme, props: styleProps) => ({
    borderStyle: {
        borderStyle: 'solid',
        borderColor: props.mode === "dark" ? lightColors.background : darkColors.background,
        borderWidth: BORDER
    },
}));

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    viewSwitch: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    bottomBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: HEIGHT_BLOCKS
    },
    centerBlock: {
        width: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: PADDING,
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
    }
});