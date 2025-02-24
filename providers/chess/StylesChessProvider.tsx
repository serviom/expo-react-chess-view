import React, { createContext, useContext, useMemo } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import {
    BASE_AVAIBLE_CIRCLE,
    BASE_CELL_SIZE,
    BASE_FIGURES_FILE_HEIGHT,
    BASE_FIGURES_FILE_WIDTH,
    BASE_FONT_SIZE_LINE_NUMBER
} from "@/constants";

interface StylesChessProviderProps {
    styles: any,
    cellSize: number
    theme: any
}

const StylesContext = createContext<StylesChessProviderProps>({} as StylesChessProviderProps);

export const StylesChessProvider = ({ children }: { children: React.ReactNode }) => {
    const { width } = useWindowDimensions();
    const cellSize = Math.floor((width - 14) / 8);

    const { theme } = useTheme();

    // Динамічні стилі залежно від теми
    const styles = useMemo(() => StyleSheet.create({
        wrapperPlayPlace: {
            flex: 1,
            alignItems: 'center',
        },
        header: {
            textAlign: 'center',
            marginBottom: 10,
        },
        playPlace: {
            position: "relative",
            flexDirection: 'row',
            width: cellSize * 8,
            height: cellSize * 8
        },
        rotate180: {
            transform: [{ rotate: '180deg' }],
        },
        wrapBoard: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: "100%",
            position: "static"
        },
        board: {
            flexDirection: 'column',
            position: "static"
        },
        wrapCell: {
            flexDirection: 'row',
        },
        white_mode3: {
            marginTop: -420 * cellSize / BASE_CELL_SIZE
        },
        black_mode3: {
            marginTop: -518 * cellSize / BASE_CELL_SIZE
        },
        white_mode2: {
            marginTop: -206 * cellSize / BASE_CELL_SIZE
        },
        black_mode2: {
            marginTop: -288 * cellSize / BASE_CELL_SIZE
        },
        white_mode1: {
            marginTop: -6 * cellSize / BASE_CELL_SIZE
        },
        black_mode1: {
            marginTop: -84 * cellSize / BASE_CELL_SIZE
        },
        king: {
            transform: [{ translateX: -2 * cellSize / BASE_CELL_SIZE }]
        },
        knight: {
            transform: [{ translateX: -396 * cellSize / BASE_CELL_SIZE }]
        },
        pawn: {
            transform: [{ translateX: -494 * cellSize / BASE_CELL_SIZE }]
        },
        queen: {
            transform: [{ translateX: -100 * cellSize / BASE_CELL_SIZE }]
        },
        rook: {
            transform: [{ translateX: -200 * cellSize / BASE_CELL_SIZE }]
        },
        bishop: {
            transform: [{ translateX: -298 * cellSize / BASE_CELL_SIZE }]
        },
        cell: {
            width: cellSize,
            height: cellSize,
            justifyContent: 'center',
            alignItems: 'center',
        },
        black: {
            backgroundColor: 'deepskyblue', // Колір для чорних клітинок
        },
        white: {
            backgroundColor: '#eed4ac', // Колір для білих клітинок
        },
        selected: {
            backgroundColor: 'yellow', // Колір для вибраної клітинки
        },
        highlightPrev: {
            backgroundColor: 'lightsalmon', //'lightsalmon', // Колір для підсвітки попередньої клітинки
        },
        highlightLast: {
            backgroundColor: 'salmon', // Колір для підсвітки останньої клітинки
        },
        available: {
            width: BASE_AVAIBLE_CIRCLE * cellSize / BASE_CELL_SIZE,
            height: BASE_AVAIBLE_CIRCLE * cellSize / BASE_CELL_SIZE,
            borderRadius: 10,
            backgroundColor: 'rgba(0, 255, 0, 0.5)', // Круглий індикатор доступної клітинки
        },
        availableWithFigure: {
            backgroundColor: 'green'
        },
        figure: {
            // @ts-ignore
            contentFit: 'cover',
            width: BASE_FIGURES_FILE_WIDTH * cellSize / BASE_CELL_SIZE, // Ширина зображення
            height: BASE_FIGURES_FILE_HEIGHT * cellSize / BASE_CELL_SIZE, // Висота зображення
            backgroundRepeat: 'no-repeat',
        },
        wrap_image_container: {
            position: "absolute",
            width: cellSize,
            height: cellSize,
            pointerEvents: 'none'
        },
        image_container: {
            width: cellSize,
            height: cellSize,
            overflow: 'hidden', // Аналог overflow: hidden
            alignItems: 'center', // Аналог align-items: center
            justifyContent: 'center', // Аналог justify-content: center
        },
        horizontalNumber: {
            color: 'white',
            position: 'absolute',
            bottom: '1%',
            right: '5%',
            fontSize: BASE_FONT_SIZE_LINE_NUMBER * cellSize / BASE_CELL_SIZE
        },
        verticalNumber: {
            color: 'white',
            position: 'absolute',
            top: '1%',
            left: '5%',
            fontSize: BASE_FONT_SIZE_LINE_NUMBER * cellSize / BASE_CELL_SIZE
        },
        timeDebug: {
            color: 'white',
            position: 'absolute',
            top: '1%',
            right: '5%',
            fontSize: BASE_FONT_SIZE_LINE_NUMBER * cellSize / BASE_CELL_SIZE
        },
    }), [cellSize, theme.mode]);

    return (
        <StylesContext.Provider value={{ styles, cellSize, theme }}>
            {children}
        </StylesContext.Provider>
    );
};

export const useStyles = () => {
    const context = useContext(StylesContext);
    if (!context) {
        throw new Error("useStyles must be used within a StylesProvider");
    }
    return context;
};
