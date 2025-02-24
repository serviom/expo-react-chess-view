import React, {FC, useEffect, useMemo} from "react";
import FigureComponents, {FigureComponentOnBoardProps} from "@/components/figures/FigureComponents";
import {useControl} from "@/providers/chess/ControlProvider";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {useCounters} from "@/providers/chess/CountersProvider";
import {setAfterAnimate} from "@/features/board/boardSlice";
import {useStyles} from "@/providers/chess/StylesChessProvider";

const DURATION = 150;

const FigureComponentOnBoard: FC<FigureComponentOnBoardProps> = ({
                                                                     figureNameEn,
                                                                     figureColor,
                                                                     rowIndex,
                                                                     colIndex
                                                                 }: FigureComponentOnBoardProps) => {

    const {rotate} = useControl();
    const {board} = useCounters();

    const {styles, cellSize} = useStyles();

    const selectedCell = useSelector((state: RootState) => state.board.selectedCell);
    const dispatch = useAppDispatch();

    const left = useSharedValue(board.current.figureCellPrevMove?.x as number * cellSize); // Завжди викликається
    const top = useSharedValue(board.current.figureCellPrevMove?.y as number * cellSize); // Завжди викликається

    const animate = useMemo(() => {
        return (
            selectedCell === null &&
            board.current.targetCellPrevMove &&
            board.current.figureCellPrevMove &&
            board.current.targetCellPrevMove.x === colIndex &&
            board.current.targetCellPrevMove.y === rowIndex
        );
    }, [selectedCell, board.current.targetCellPrevMove, board.current.figureCellPrevMove, colIndex, rowIndex]);

    useEffect(() => {
        if (!animate) return;

        const leftMovements = withTiming(colIndex * cellSize, {duration: DURATION, easing: Easing.ease}, (finished) => {
            if (finished) {
                runOnJS(onAnimationComplete)(true);
            }
        })

        const topMovements = withTiming(rowIndex * cellSize, {duration: DURATION, easing: Easing.ease})

        left.value = withSequence(leftMovements);
        top.value = withSequence(topMovements);
    }, [animate]);

    const animatedStyle = useAnimatedStyle(() => ({
        left: left.value,
        top: top.value,
    }));

    const onAnimationComplete = (value: boolean) => {
        dispatch(setAfterAnimate(value));
    }

    const Figure = React.useMemo(() => {
        return FigureComponents[figureColor][figureNameEn];
    }, [figureColor, figureNameEn]);

    return (
        <Animated.View style={[styles.wrap_image_container,
            animate ? animatedStyle : {top: cellSize * rowIndex, left: cellSize * colIndex},
            rotate && styles.rotate180]}>
            {Figure && <Figure figureNameEn={figureNameEn} figureColor={figureColor}/>}
        </Animated.View>
    )
};

export default React.memo(FigureComponentOnBoard);