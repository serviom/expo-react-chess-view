import React, {useEffect} from 'react';
import {View, Text, Dimensions, PixelRatio, StyleSheet, useWindowDimensions} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
const scale = PixelRatio.get();



const AboutScreen = () => {
    const { width, height } = useWindowDimensions();

    const widthScaled = width * scale;  // Масштабування ширини згідно з щільністю пікселів
    const heightScaled = height * scale;

    useEffect(() => {
        console.log('About Screen');
        console.log(width, height);
    }, []);


    useEffect(() => {
        const changeOrientation = async () => {
            await ScreenOrientation.unlockAsync(); // Дозволяє зміну орієнтації
        };
        changeOrientation();
    }, []);

    return (
        <ThemeChangeProvider>
            <View style={[styles.container, { width: width, height: height, flexDirection: 'column', backgroundColor: 'lightgray'}]}>
                <View>
                    <Text style={styles.text}>Логічні пікселі: {width}x{height}</Text>
                    <Text style={styles.text}>Щільність пікселів: {scale}</Text>
                    <Text style={styles.text}>Масштабовані розміри (пікселі): {widthScaled}x{heightScaled}</Text>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: 'lightgray' }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
                    <View style={{ width: 50, height: 50, backgroundColor: 'blue' }} />
                    <View style={{ width: 50, height: 50, backgroundColor: 'green' }} />
                </View>

                <View style={{ flexDirection: 'column', backgroundColor: 'lightgray' }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
                    <View style={{ width: 50, height: 50, backgroundColor: 'blue' }} />
                    <View style={{ width: 50, height: 50, backgroundColor: 'green' }} />
                </View>
            </View>
        </ThemeChangeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
    },
});

export default AboutScreen;
