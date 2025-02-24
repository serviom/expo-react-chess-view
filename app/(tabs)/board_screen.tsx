import React, {useRef, useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import Canvas from 'react-native-canvas';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import { Image } from "react-native-canvas";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const TILE_SIZE = 64; // Розмір однієї клітинки
const BOARD_SIZE = 8; // 8x8 клітинок
const ALL_FIGURES_WIDTH = 1119;
const ALL_FIGURES_HEIGHT = 1543;

const convertAssetToBase64 = async () => {
    try {
        const asset = Asset.fromModule(require('../../assets/figures.png'));
        await asset.downloadAsync();

        const base64 = await FileSystem.readAsStringAsync(asset.localUri as string, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
    } catch (error) {
        console.error('Error:', error);
    }
};

const ChessBoard = () => {
    const canvasBoard = useRef(null);
    const canvasFigures = useRef(null);

    useEffect(() => {
        const drawFigures = async (canvasBoard: any, canvasFigures: any) => {
            if (!canvasBoard) return;
            if (!canvasFigures) return;

            const ctxFigures = canvasFigures.getContext('2d');
            canvasFigures.width = ALL_FIGURES_WIDTH;
            canvasFigures.height = ALL_FIGURES_HEIGHT;
            const base64String = await convertAssetToBase64();
            const img = new Image(canvasFigures, ALL_FIGURES_HEIGHT, ALL_FIGURES_WIDTH);
            img.src = `data:image/png;base64,${base64String}`
            //img.src = require('@/assets/figures.svg');

            img.addEventListener("load", async () => {
                console.log('draw figures');
                //ctx.drawImage(img, 0, 0, ALL_FIGURES_WIDTH, ALL_FIGURES_HEIGHT);
                await ctxFigures.drawImage(img, 0, 0, ALL_FIGURES_WIDTH, ALL_FIGURES_HEIGHT, 0, 0,
                    512, 512 * ALL_FIGURES_HEIGHT / ALL_FIGURES_WIDTH);

                const ctxBoard = canvasBoard.getContext('2d');
                canvasBoard.width = TILE_SIZE * BOARD_SIZE;
                canvasBoard.height = TILE_SIZE * BOARD_SIZE;

                for (let row = 0; row < BOARD_SIZE; row++) {
                    for (let col = 0; col < BOARD_SIZE; col++) {
                        ctxBoard.fillStyle = (row + col) % 2 === 0 ? '#EEE' : '#888';
                        ctxBoard.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }

                // ctxBoard.fillStyle = 'green';
                // ctxBoard.font = '20px Arial';
                // ctxBoard.fillRect(30, 30, 200, 200);
                // ctxBoard.fillText('Fuck You2!!!', 0, 50);
                // //const ctxFigures = canvasFigures.getContext('2d');
                // const imageData = ctxBoard.getImageData(30, 30, 200, 200);
                // ctxBoard.putImageData(imageData, 70, 70);
            });
        };

        if (canvasBoard.current && canvasFigures.current) {
            drawFigures(canvasBoard.current, canvasFigures.current);
        }
    }, []);


    return (
        <ThemeChangeProvider>
            <View style={styles.container}>
                <Canvas ref={canvasBoard} style={styles.board} />
                <Canvas ref={canvasFigures} style={styles.figures} />
                {/*<Canvas ref={canvasFigure} style={styles.figure} />*/}
            </View>
        </ThemeChangeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    board: {
        width: TILE_SIZE * BOARD_SIZE,
        height: TILE_SIZE * BOARD_SIZE,
    },
    figures: {
        // display: "none",
        width: 512,
        height: 512 * ALL_FIGURES_HEIGHT / ALL_FIGURES_WIDTH,
    },
    figure: {
        width: TILE_SIZE,
        height: TILE_SIZE,
    },
});

export default ChessBoard;