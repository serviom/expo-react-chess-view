import React, {createContext, useContext, useRef} from 'react';
import {Board} from "@/models/Board";
import {RefMyObject} from "@/types";
import {PayloadAction} from "@reduxjs/toolkit";
import {moveTree} from "@/components/Notice";

interface ChessCountersContextProps {
    // показує поточну позицію в дереві ходів для гри
    counterMove: RefMyObject<number>,
    setCounterMove: (value: number) => void,
    // показує поточну позицію в дереві ходів для аналізатора
    counterAnalysisMove: RefMyObject<number>,
    setCounterAnalysisMove: (value: number) => void,
    // counterAnalysisMoveIncrease завжди збільшується на 1 при кожному новому кроці для аналізу
    counterAnalysisMoveIncrease: RefMyObject<number>,
    setCounterAnalysisMoveIncrease: (value: number) => void,
    // коли ми формуємо fen код для шахів ми передаємо строку кодування можливості рокировки
    fenReportStringCastle: RefMyObject<string>,
    setFenReportStringCastle: (value: string) => void,
    // правило 50 ходів коли не ходять пішаком і не бють фігуру
    ruleOf50Moves: RefMyObject<number>,
    setRuleOf50Moves: (value: number) => void,
    board: RefMyObject<Board>,
    setBoard: (value: Board) => void,
    resetCounters: () => void,
    notice: RefMyObject<string[]>,
    setNotice: (value: string[]) => void,
    addNotice: (value: string) => void,
    analysis_notes: RefMyObject<moveTree>,
    setAnalysisNotice: (value: moveTree) => void
}

const START_COUNTER = 0;
const START_FEN_STRING_CASTLE = 'KQkq';

const CountersContext = createContext<ChessCountersContextProps>({} as ChessCountersContextProps);

export const CountersProvider = ({ children } : { children: React.ReactNode }) => {
    const counterMove = useRef<number>(START_COUNTER);
    const counterAnalysisMove = useRef<number>(START_COUNTER);
    const counterAnalysisMoveIncrease = useRef<number>(START_COUNTER);
    const fenReportStringCastle = useRef<string>(START_FEN_STRING_CASTLE);
    const ruleOf50Moves = useRef<number>(START_COUNTER);
    const notice = useRef<string[]>([]);
    const analysis_notes = useRef<moveTree>({} as moveTree);

    const boardInit = new Board();
    boardInit.reset();
    const board = useRef<Board>(boardInit);

    const setNotice = (value: string[]): void => {
        notice.current = value;
    }
    const addNotice = (value: string): void => {
        notice.current.push(value)
    }
    const setAnalysisNotice = (value: moveTree): void => {
        analysis_notes.current = value
    }
    const setCounterMove = (value: number) => {
        counterMove.current  = value;
    };

    const setCounterAnalysisMove = (value: number) => {
        counterAnalysisMove.current  = value;
    };

    const setCounterAnalysisMoveIncrease = (value: number) => {
        counterAnalysisMoveIncrease.current  = value;
    };

    const setFenReportStringCastle = (value: string) => {
        fenReportStringCastle.current  = value;
    };

    const setRuleOf50Moves = (value: number) => {
        ruleOf50Moves.current  = value;
    };

    const setBoard = (value: Board) => {
        board.current  = value;
    };

    const resetCounters = () => {
        setCounterMove(START_COUNTER);
        setCounterAnalysisMove(START_COUNTER);
        setCounterAnalysisMoveIncrease(START_COUNTER);
        setRuleOf50Moves(START_COUNTER);
        setFenReportStringCastle(START_FEN_STRING_CASTLE);
        setNotice([]);
        board.current.reset();
    }

    return (
        <CountersContext.Provider value={{setAnalysisNotice, analysis_notes, setNotice, addNotice, notice,resetCounters, setBoard, setCounterAnalysisMoveIncrease, setFenReportStringCastle, setRuleOf50Moves,
            board, counterMove, setCounterMove, counterAnalysisMove, setCounterAnalysisMove,
            counterAnalysisMoveIncrease, fenReportStringCastle, ruleOf50Moves }}>
            {children}
        </CountersContext.Provider>
    );
};

export const useCounters = () => {
    return useContext(CountersContext);
};