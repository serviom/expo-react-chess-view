import {moveTree} from "../../components/Notice";
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CellInfo, Player} from "@/types";
import {PlayerTypes} from "@/constants";

export interface BoardState {
    cells: CellInfo[],
    selectedCell: CellInfo | null;
    currentPlayer: Player | null;
    start: number,
    finish: boolean,
    pause: boolean,
    analyze: boolean,
    afterAnimate: boolean,
    step: number,
}

export interface analysisMovesPayload {
    keys: string[],
    moves: string[]
}

export interface analysisCodeMovePayload {
    index: number,
    newId: number,
    codeMove: string,
    searchObject: moveTree
}

const boardInitialState: BoardState = {
    cells: [],
    selectedCell: null,
    currentPlayer: null,
    start: 0,
    finish: false,
    pause: false,
    analyze: false,
    afterAnimate: false,
    step: 0,
}

const boardSlice = createSlice({
    name: 'board',
    initialState: boardInitialState,
    reducers: {
        setStart: (state) => {
            state.start = state.start + 1;
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        setFinish: (state, action: {payload: boolean, type: string }) => {
            state.finish = action.payload;
        },
        setAnalyze: (state, action: {payload: boolean, type: string }) => {
            state.analyze = action.payload;
        },
        setPause: (state, action: {payload: boolean, type: string }) => {
            state.pause = action.payload;
        },
        endGame: (state) => {
            state.start = 0;
            state.analyze = false;
        },
        restartGame: (state) => {
            state.start =  state.start + 1;
            state.analyze = false;
        },
        setSelectedCell: (state, action: PayloadAction<CellInfo | null>) => {
            state.selectedCell = action.payload;
        },
        setCurrentPlayer: (state, action: PayloadAction<Player | null>) => {
            state.currentPlayer = action.payload;
        },
        setAfterAnimate: (state, action: PayloadAction<boolean>) => {
            state.afterAnimate = action.payload;
        },
        swapPlayer: (state) => {
            state.currentPlayer = state.currentPlayer === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE;
        },
        resetGame: (state) => {
            state.currentPlayer = null;
            state.selectedCell = null;
        },
        startGame: (state) => {
            boardSlice.caseReducers.resetGame(state);
            state.currentPlayer = PlayerTypes.WHITE;
        },
        setCells: (state, action: PayloadAction<CellInfo[]>) => {
            state.cells = action.payload;
        },
        updateCells(state, action: PayloadAction<CellInfo[]>) {
            action.payload.forEach(({ x, y, ...updates }) => {
                const cell = state.cells.find(cell => cell.x === x && cell.y === y);
                if (cell) {
                    Object.assign(cell, updates);
                }
            });
        }
    },
    extraReducers: (builder) => {
        // builder.addMatcher(
        //     authEndpoints.endpoints.signIn.matchFulfilled,
        //     (state,{ payload, type }) => {
        //         console.log('payload in api.endpoints.signIn.matchFulfilled', payload);
        //         const { id, ...user } = {...payload.user, ...{userId: payload.user.id}};
        //         console.log('payload in api.endpoints.signIn.matchFulfilled', user);
        //         boardSlice.caseReducers.login(state, { payload: user, type });
        //
        //         // @ts-ignore
        //         // eslint-disable-next-line no-undef
        //         setAccessToken(payload.tokens.accessToken);
        //         // @ts-ignore
        //         // eslint-disable-next-line no-undef
        //         setRefreshToken(payload.tokens.refreshToken);
        //     }
        // )
    },
});

export const {
    resetGame,
    setSelectedCell,
    setCells,
    setCurrentPlayer,
    startGame,
    swapPlayer,
    setStart,
    setAnalyze,
    setPause,
    endGame,
    restartGame,
    setAfterAnimate,
    setStep
} = boardSlice.actions;

export default boardSlice.reducer;


