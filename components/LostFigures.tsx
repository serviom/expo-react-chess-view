import React, {FC, useContext} from 'react';
import {Figure} from "../models/figures/Figure";
import {StyleSheet, Dimensions, View, Text} from "react-native";
import {useCounters} from "@/providers/chess/CountersProvider";
import {Player} from "@/types";
import {PlayerTypes} from "@/constants";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import FigureComponents from "@/components/figures/FigureComponents";
import {useStyles} from "@/providers/chess/StylesChessProvider";

interface LostFiguresProps {
    player: Player;
}

const SCALE = 0.75;

const LostFigures: FC<LostFiguresProps> = ({player}) => {

    const {board} = useCounters();
    const {cellSize} = useStyles();

    // використовується для того щоб ре-рендити постійно коли змінюється currentPlayer
    const currentPlayer = useSelector((state: RootState) => state.board.currentPlayer);
    const figures = player === PlayerTypes.WHITE ? board.current.lostWhiteFigures : board.current.lostBlackFigures;

    const styles = StyleSheet.create({
        small_figures: {
            flexDirection: "row",
            flexWrap: 'wrap',
        },
        small_figure: {
            transform: [{ scale: SCALE }],
        },
        warp_small_figure: {
            alignItems: "center",
            justifyContent: "center",
            overflow: 'hidden',
            width: cellSize * SCALE,
            height: cellSize * SCALE,
        }
    });

    return (
        <View style={styles.small_figures}>
            {figures.map((figure: Figure, index: number) => {
                const Figure = FigureComponents[figure.color][figure.nameEn];
                return Figure &&
                    <View style={styles.warp_small_figure} key={`lost-figure-${figure.nameEn}-${figure.color}-${index}`}>
                        <View style={styles.small_figure}>
                            <Figure figureColor={figure.color}
                                    figureNameEn={figure.nameEn}/>
                        </View>
                    </View>
            })}
        </View>
    );
};

export default LostFigures;



