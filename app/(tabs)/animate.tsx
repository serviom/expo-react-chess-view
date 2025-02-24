import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { useState } from 'react';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";

// @ts-ignore
const { Value, timing } = Animated;

const AnimateScreen = () => {
    const [scale] = useState(new Value(1));
    const [opacity] = useState(new Value(1));

    const startAnimation = () => {
        // Задаємо анімацію для масштабу
        timing(scale, {
            toValue: 2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
        }).start();

        // Задаємо анімацію для прозорості
        timing(opacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
        }).start();
    };

    return (
        <ThemeChangeProvider>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View
                    style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'tomato',
                        transform: [{ scale }],
                        opacity,
                    }}
                />
                <TouchableOpacity onPress={startAnimation}>
                    <Text>Start Animation</Text>
                </TouchableOpacity>
            </View>
        </ThemeChangeProvider>
    );
};

export default AnimateScreen;
