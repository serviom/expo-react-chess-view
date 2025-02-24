import {ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import Chess from "../../components/Chess";
import {ControlProvider} from "@/providers/chess/ControlProvider";
import {CountersProvider} from "@/providers/chess/CountersProvider";
import {StylesChessProvider} from "@/providers/chess/StylesChessProvider";

const PlayScreen = ()=> {

    return (
        <ThemeChangeProvider>
            <StylesChessProvider>
                <CountersProvider>
                    <ControlProvider>
                        <Chess/>
                    </ControlProvider>
                </CountersProvider>
            </StylesChessProvider>
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

export default PlayScreen;
