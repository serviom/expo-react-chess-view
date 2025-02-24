import React, {FC, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {modePlayerOptions} from "../../types";
import {BestMove} from "../../utils/singletons/stockfish";
import {StyleSheet, Text, View} from "react-native";
import {Button, CheckBox} from '@rneui/themed';
import {useControl} from "@/providers/chess/ControlProvider";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {
    endGame as endGameControl,
    resetGame as resetGameBoard,
    restartGame as restartGameControl,
    setPause,
    startGame as startGameBoard
} from "@/features/board/boardSlice";
import {NOTES_LOCAL_STORAGE} from "@/constants";
import {removeDataInStorage} from "@/utils/storage";
import {useCounters} from "@/providers/chess/CountersProvider";

interface ControlProps {}

const Control: FC<ControlProps> = ({}: ControlProps) => {
    const pause = useSelector((state: RootState) => state.board.pause)
    const { mode, setMode, rotate, setRotate, setModeWhitePlayer, setModeBlackPlayer,
        modeWhitePlayer, modeBlackPlayer} = useControl();

    const [bestMove, setBestMove] = useState<BestMove | undefined>(undefined);

    const dispatch = useAppDispatch();

    const {resetCounters, board} = useCounters();

    function changeMode(selectedMode: number) {
        setMode(selectedMode);
    }

    function switchRotate() {
        setRotate(!rotate);
    }

    const restart = async () => {
        resetCounters();
        //dispatch(setCells(adapter(board.current.getCells())));
        dispatch(startGameBoard())
        dispatch(restartGameControl())
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
    }

    const end = async () => {
        resetCounters();
        //dispatch(setCells(adapter(board.current.getCells())));
        dispatch(resetGameBoard())
        dispatch(endGameControl())
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
    }


    function showBestMove() {
        // getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then(() => {
        //     setBestMove({
        //         from: 'a2',
        //         to: 'a3',
        //         promotion: ''
        //     });
        // });
    }

    function moveBestMove() {
        // getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then((result: any) => {
        //     setBestMove(result);
        // });
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 5, gap: 2 }}>
                    <Button style={styles.button} title={'Start game'} onPress={restart} />
                    <Button style={styles.button} title={'Restart game'} onPress={restart} />
                    <Button style={styles.button} title={'End game'} onPress={end} />
                    <CheckBox title="Обернути" checked={rotate} onPress={switchRotate} />
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Text style={{textAlign: "center", fontWeight: "bold"}}>Тип фігур</Text>
                    <CheckBox title="Тип 1" checked={mode === 1} onPress={() => changeMode(1)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                    <CheckBox title="Тип 2" checked={mode === 2} onPress={() => changeMode(2)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                    <CheckBox title="Тип 3" checked={mode === 3} onPress={() => changeMode(3)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                </View>
            </View>

            {/* Рядочок */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 5 }}>
                    <Text>Mode white player</Text>
                    <Picker selectedValue={modeWhitePlayer} onValueChange={(value) => setModeWhitePlayer(value)}>
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Text>Mode black player</Text>
                    <Picker selectedValue={modeBlackPlayer} onValueChange={(value) => setModeBlackPlayer(value)}>
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 5, gap: 2 }}>
                    <Button style={styles.button} title={'Move Best Move'} onPress={moveBestMove} />
                    <Button style={styles.button} disabled={bestMove !== undefined} title={'Show Best Move'} onPress={showBestMove} />
                    {bestMove !== undefined && (
                        <View>
                            <Text>{'From: ' + bestMove.from + ' -> ' + bestMove.to + (bestMove.promotion ? ' | promo: ' + bestMove.promotion : '')}</Text>
                        </View>
                    )}
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Button title={pause ? 'Pause on' : 'Pause off'} onPress={() => dispatch(setPause(!pause))} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
    }
})

export default Control;

