import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Canvas from 'react-native-canvas';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import { Image } from "react-native-canvas";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const TILE_SIZE = 64; // Розмір однієї клітинки
const BOARD_SIZE = 8; // 8x8 клітинок

const convertAssetToBase64 = async () => {
    try {
        const asset = Asset.fromModule(require('../../assets/black-pawn.png'));
        await asset.downloadAsync();

        const base64 = await FileSystem.readAsStringAsync(asset.localUri as string, {
            encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Base64:', base64);
        return base64;
    } catch (error) {
        console.error('Error:', error);
    }
};

const ChessBoard = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const drawBoard = async (canvas) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            canvas.width = TILE_SIZE * BOARD_SIZE;
            canvas.height = TILE_SIZE * BOARD_SIZE;

            // Малюємо шахову дошку
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    ctx.fillStyle = (row + col) % 2 === 0 ? '#EEE' : '#888';
                    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }

            const base64String = await convertAssetToBase64();
            const img = new Image(canvas, TILE_SIZE, TILE_SIZE);
            img.src = `data:image/png;base64,${base64String}`

            img.addEventListener("load", () => {
                console.log("Have successfully loaded ")
                ctx.drawImage(img, 4 * TILE_SIZE, 4 * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            });
        };

        drawBoard(canvasRef.current);
    }, []);

    return (
        <ThemeChangeProvider>
            <View style={styles.container}>
                <Canvas ref={canvasRef} style={styles.canvas} />
            </View>
        </ThemeChangeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    canvas: {
        width: TILE_SIZE * BOARD_SIZE,
        height: TILE_SIZE * BOARD_SIZE,
    },
});

export default ChessBoard;