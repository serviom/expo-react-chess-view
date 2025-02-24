import React, {FC, useEffect, useState} from "react";
import {
    setSelectedCell,
    setCurrentPlayer,
    setAnalyze,
    setStart,
    setStep
} from "@/features/board/boardSlice";
import {NoticeMove} from "./includes/NoticeMove";
import {
    CastleTypes,
    changeRuleOf50Moves,
    END_GAME,
    fillMovesRecursive,
    getSystemCoordinateMoveByShort,
    isBlackMove,
    moveIsEnPassant,
    oneAnalysisMove,
    searchItemForAnalysisByDeep,
    searchItemForAnalysisByDeepAndId,
    searchItemForAnalysisById,
    searchItemRecursiveForLast,
    searchMustItemForAnalysisById
} from "../utils/board";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Input} from "@rneui/themed";
import {RootState, useAppDispatch} from "@/features/store";
import {useSelector} from "react-redux";
import {storeDataInStorage} from "@/utils/storage";

import {KEY_NOTES_LOCAL_STORAGE, NOTES_LOCAL_STORAGE, PlayerTypes, VALUE_NOTES_LOCAL_STORAGE} from "@/constants";
import {Player} from "@/types";
import {Board} from "@/models/Board";
import {useCounters} from "@/providers/chess/CountersProvider";

export interface NoticeProps {}

export interface moveTree {
    value: string,
    color: Player,
    deep: number,
    index: number,
    id: number,
    children: moveTree[]
}

const getStyle = (isActive: boolean) => {
    return isActive ? styles.current : styles.defaultStyle;
};

const Notice: FC<NoticeProps> = ({}:NoticeProps) => {
    const [pgn, setPgn] = useState('');

    const {board, counterMove, ruleOf50Moves, fenReportStringCastle,
        counterAnalysisMoveIncrease, setCounterAnalysisMoveIncrease, counterAnalysisMove, setCounterAnalysisMove,
        setRuleOf50Moves, setCounterMove, setFenReportStringCastle, setAnalysisNotice, analysis_notes} = useCounters();

    // для переходу між кроками аналізатора

    const [isNext, setIsNext] = useState<boolean>(false);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [isPrev, setIsPrev] = useState<boolean>(false);
    const [isFirst, setIsFirst] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const {currentPlayer, start, analyze, step} = useSelector((state: RootState) => state.board);

    const {notice, setNotice} = useCounters();

    useEffect(() => {
        if (start) {
            setPgn('');
        }
    }, [start]);

    useEffect(() => {
        setIsNext(checkIsNext());
        setIsLast(checkIsLast());
        setIsPrev(checkIsPrev());
        setIsFirst(checkIsFirst());
    }, [currentPlayer, start, step]);


    function numberOfLastMove(): number {
        return notice.current.length;
    }

    function initNewBoard() {
        board.current.reset();
    }

    function checkIsNext() {
        if (!analyze) {

            return counterMove.current !== numberOfLastMove();
        }

        if (counterAnalysisMove.current === counterAnalysisMoveIncrease.current) {
            return false;
        }

        const currentMoveTree = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        if (!currentMoveTree.children || currentMoveTree.children.length === 0) {
            return false;
        }

        if (currentMoveTree.children.length > 1) {
            // якщо наступний крок це основна цепочка по якій була розіграна шахматна гра тоді він завжди доступний
            const currentMoveNextTree = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current + 1);
            if (currentMoveNextTree && currentMoveNextTree.index === 0) {
                return true;
            }

            return false
        }
        return true;
    }

    function checkIsLast() {
        return analyze ? getLastIdMove() === counterAnalysisMove.current : numberOfLastMove() === counterMove.current;
    }

    function getLastIdMove(): number | null {
        const currentMoveTree = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);
        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }
        return searchItemRecursiveForLast(currentMoveTree)?.id ?? null;
    }

    function checkIsPrev() {
        return analyze ? counterAnalysisMove.current !== 1 : counterMove.current !== 1;
    }

    function checkIsFirst() {
        if (!analyze) {
            return counterMove.current === 1;
        }

        if (counterAnalysisMove.current === 1) {
            return true;
        }

        const currentMoveTree = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        const currentMoveNextTree = searchItemForAnalysisByDeepAndId(analysis_notes.current, currentMoveTree.deep - 1, currentMoveTree.id - 1);

        if (!currentMoveNextTree) {
            return true;
        }

        return false;
    }

    function clearSelectedCell() {
        dispatch(setSelectedCell(null));
        // TODO not use useImperativeHandle hook
        // childRef.current?.clearSelectedCell();
    }

    function currentMoveIsLast(): boolean {
        return numberOfLastMove() === counterMove.current;
    }

    function currentMoveAnalysisIsLast(): boolean {
        return numberOfLastMove() === counterAnalysisMove.current;
    }

    function getNextAnalysisStep() {
        return counterAnalysisMove.current
    }

    function getPrevAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);

        if (!currentTreeMove || currentTreeMove.deep < 1 || currentTreeMove.id < 1) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(analysis_notes.current, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            parentTreeMove = searchItemForAnalysisByDeep(analysis_notes.current, currentTreeMove.deep - 1);
        }

        if (!parentTreeMove) {
            throw new Error('parentTreeMove is null');
        }

        return parentTreeMove.id;
    }

    function getFirstAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);

        if (!currentTreeMove) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(analysis_notes.current, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            return currentTreeMove.id;
        }

        let id: number = parentTreeMove.id;

        while (true) {
            const parentTreeMoveNew = searchItemForAnalysisByDeepAndId(analysis_notes.current, parentTreeMove.deep - 1, parentTreeMove.id - 1);

            if (parentTreeMoveNew === null) {
                break;
            }

            if (parentTreeMoveNew) {
                id = parentTreeMoveNew.id;
                parentTreeMove = parentTreeMoveNew;
            }
        }

        return id;
    }

    function prevMove(): void {
        clearSelectedCell();

        const newStep = analyze ? getPrevAnalysisStep() : counterMove.current - 1;

        if (newStep === 0) {
            return;
        }
        wrapGoToStep(newStep);
    }

    function lastMove(): void {
        clearSelectedCell();
        const lastIdMove = analyze ? getLastIdMove() : numberOfLastMove();

        if (!lastIdMove) {
            return;
        }

        wrapGoToStep(lastIdMove);
    }

    function firstMove(): void {
        clearSelectedCell();
        // для аналізу перший крок буде кроком початку розгалуження в аналізі партії
        wrapGoToStep(analyze ? getFirstAnalysisStep() : 1);
    }

    function nextMove(): void {
        clearSelectedCell();

        if (!analyze && currentMoveIsLast()) {
            return;
        }

        if (analyze && currentMoveAnalysisIsLast()) {
            return;
        }

        const newStep = analyze ? getNextAnalysisStep() : counterMove.current + 1;

        wrapGoToStep(newStep);
    }

    function wrapGoToStep(step: number): void {
        if (analyze) {
            goToAnalysisStep(step);
            return;
        }
        goToStep(step);
    }

    function loadAnalyze(position: number): void {
        setCounterAnalysisMoveIncrease(position);
        clearSelectedCell();
        goToAnalysisStep(position);
    }

    function incrementCounter() {
        setCounterMove(counterMove.current + 1);
    }

    function goToStep(step: number): void {
        clearSelectedCell();
        if (step === counterMove.current) {
            return;
        }

        //const newBoard = step < board.current.counterMove ? initNewBoard() : board.current.getCopyBoard();

        if (step < counterMove.current) {
            board.current.reset();
            setCounterMove(0);
        }

        while (counterMove.current < step) {
            incrementCounter();
            const codeMove = notice.current[counterMove.current - 1] ?? '';

            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, board.current, isBlackMove(counterMove.current));
            }
        }

        dispatch(setCurrentPlayer(getOppositePlayer(counterMove.current)));
        dispatch(setStep(step));
    }



    function goToAnalysisStep(step: number): void {
        const moves: string[] = [];
        const notes = analysis_notes;
        const lastObject = fillMovesRecursive(notes.current, step, moves);

        clearSelectedCell();
        initNewBoard();

        moves.forEach((codeMove, index) => {
            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, board.current, isBlackMove(index + 1));
            }
        });

        setCounterAnalysisMove(step);
        dispatch(setCurrentPlayer(getOppositePlayer(step)));
    }

    function getOppositePlayer(step: number) {
        return isBlackMove(step) ? PlayerTypes.WHITE : PlayerTypes.BLACK
    }

    function currentMove(step: number): boolean {
        return step === counterMove.current
    }

    function analysisCurrentMove(step: number): boolean {
        return step === counterAnalysisMove.current
    }

    function addMovesToArray(moves: string, codesInArray: string[]) {
        let [a, b] = moves.split(' ');
        codesInArray.push(a);
        b && codesInArray.push(b);
    }

    function indexOfLast(string: string, search: string) {
        let lastIndex = -1;
        for (let i = 0; i < string.length; i++) {
            if (string.indexOf(search, i) !== -1) {
                lastIndex = string.indexOf(search, i);
            }
        }
        return lastIndex;
    }

    function getLastMatch(regex: RegExp, string: string) {
        let match;
        let lastMatch = null;

        while ((match = regex.exec(string)) !== null) {
            lastMatch = match;
        }

        return lastMatch;
    }

    function makeMainTreeObject(movesInArray: string[], children: moveTree | null): moveTree | null {

        const identifier = movesInArray.length - 1;

        const lastValue = movesInArray.pop();

        if (lastValue === undefined) {
            return children;
        }

        let tree = {
            value: lastValue,
            color: identifier % 2 !== 0 ? PlayerTypes.BLACK : PlayerTypes.WHITE,
            deep: identifier + 1,
            index: 0,
            id: identifier + 1,
            children: children === null ? [] : [children]
        }

        return makeMainTreeObject(movesInArray, tree);
    }


    return (
        <View style={styles['wrapNotice']}>
            {
                analyze && (
                    <Text>Включений аналіз партії</Text>
                )
            }

            { !start &&
                <View style={[]}>
                    <View>
                        <Input
                            style={styles.textarea}
                            multiline={true}
                            numberOfLines={4}
                            value={pgn}
                            onChangeText={setPgn}
                        />
                    </View>
                    <View style={{paddingLeft: 10, paddingRight: 10}}>
                        <Button
                            title={'Load game'}
                            disabled={false}
                            onPress={async (e) => {
                                setAnalyze(true);
                                setStart();
                                await loadGameFromPngHistory();
                            }}
                        />
                    </View>
                </View>
            }

            <View style={styles.historyMoves}>
                { !analyze && (
                    <View style={styles.mainMoves}>
                    {
                        notice.current.map((codeMove: string, index: number) => {
                            return (
                                <View key={'notice-fragment' + index} style={styles.pairMoves}>
                                    {
                                    (index + 1) % 2 !== 0 ? (
                                        <Text style={{fontWeight: 'bold'}}>{Math.ceil((index + 1) / 2) + '. '}</Text>
                                    ) : <></>
                                    }
                                    <TouchableOpacity  onPress={() => goToStep(index + 1)} key={'notice' + index}>
                                        <Text style={getStyle(currentMove(index + 1))}>{codeMove + ''}</Text>
                                    </TouchableOpacity>
                                    {(index + 1) % 2 == 0 ? <Text>{' '}</Text> : <Text>{', '}</Text>}
                                </View>
                            )
                        })
                    }
                    </View>
                    )
                }
                { analyze && (analysis_notes.current.id ?? false) && (
                    <View style={styles['mainMoves']}>
                        <NoticeMove prevColor={analysis_notes.current.color} object={analysis_notes.current} analysisCurrentMove={analysisCurrentMove} goToAnalysisStep={goToAnalysisStep} />
                    </View>
                    )
                }
            </View>

            <View style={styles.wrapControl}>
                <View style={[isFirst && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (isFirst) {
                            return;
                        }
                        firstMove();
                    }}>
                        <Text style={styles.controlText}>first move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[!isPrev && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (!isPrev) {
                            return;
                        }
                        prevMove();
                    }}>
                        <Text>prev move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[!isNext && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (!isNext) {
                            return;
                        }
                        nextMove();
                    }}>
                        <Text>next move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[isLast && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (isLast) {
                            return;
                        }
                        lastMove();
                    }}>
                        <Text>last move</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    textarea: {
        height: 100, // Аналог `rows={10}`
        width: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
    wrapNotice: {

    },
    disable: {
        opacity: 0.5
    },
    wrapControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
    },
    controlText: {
        // color: 'yellow'
    },
    separator: {
        marginHorizontal: 4, // Відступи між роздільниками
        fontSize: 18,
        color: 'blue',
    },
    pairMoves: {
        flexDirection: 'row',
    },
    mainMoves: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    historyMoves: {

    },
    historyMovesCurrent: {
        fontWeight: 'bold',
        color: 'darkgoldenrod'
    },
    innerNoticeBlock: {
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },
    current: {
        fontWeight: 'bold',
        color: 'darkgoldenrod'
    },
    defaultStyle: {
        backgroundColor: "transparent",
    }
});


export default Notice;

