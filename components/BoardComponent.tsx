import React, {useCallback, useEffect, useRef} from 'react';
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {FenFigureSign, Figure, FigureSides, typeFenFigureSign} from "../models/figures/Figure";
import {View} from "react-native";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {resetGame, setAfterAnimate, setSelectedCell, swapPlayer} from "@/features/board/boardSlice";

import {NOTES_LOCAL_STORAGE, PlayerTypes} from "@/constants";
import {CellInfo, modePlayer} from "@/types";
import {
    changeRuleOf50Moves,
    fillMovesRecursive,
    getColorPlayerForFen,
    getEnPassantCell,
    getFenFigureSignBySymbol,
    getPruningCoordinateMove,
    moveIsEnPassant,
    searchItemForAnalysisById
} from "@/utils/board";
import ModalComponent from "@/components/ModalComponent";
import {useControl} from "@/providers/chess/ControlProvider";
import {removeDataInStorage, saveLastCodeMoveToStorage} from "@/utils/storage";
import {useModal} from "@/providers/ModalProvider";
import {getBestmoveByStockfish} from "@/utils/singletons/stockfish";
import {Queen} from "@/models/figures/Queen";
import {Knight} from "@/models/figures/Knight";
import {useCounters} from "@/providers/chess/CountersProvider";
import {useStyles} from "@/providers/chess/StylesChessProvider";
import FigureComponentOnBoard from "@/components/figures/FigureComponentOnBoard";
import {PopupBoxSelectFigureComponent} from "@/components/PopupBoxSelectFigureComponent";
import {Bishop} from "@/models/figures/Bishop";
import {Rook} from "@/models/figures/Rook";

export interface BoardProps {}

export type staticRefObject = {
    targetCell: Cell | null,
    selectedCell: Cell | null,
    selectedFigure: Figure | null,
    opponentFigure: Figure | null,
    switchEnPassant: boolean,
}

const initialStaticRefObject = {
    targetCell: null,
    selectedCell: null,
    selectedFigure: null,
    opponentFigure: null,
    switchEnPassant: false
}

//const BoardComponent = forwardRef((props: BoardProps, ref) => {
const BoardComponent = (props: BoardProps) => {
    const {} = props;
    const {rotate, modeWhitePlayer, modeBlackPlayer} = useControl();
    const currentPlayer =  useSelector((state: RootState) => state.board.currentPlayer);
    const selectedCell  = useSelector((state: RootState) => state.board.selectedCell);
    const [isOpenedSelectFigure, setIsOpenedSelectFigure] = React.useState<boolean>(false);

    // поправити first_move prev move (не працює після анімації)
    // stockfish
    // TODO list dynamic component ( працює гірше ніж через модуль в useRef)

    const start = useSelector((state: RootState) => state.board.start);
    const pause = useSelector((state: RootState) => state.board.pause);
    const analyze = useSelector((state: RootState) => state.board.analyze);
    const step = useSelector((state: RootState) => state.board.step);

    const {board, counterMove, ruleOf50Moves, fenReportStringCastle,
        counterAnalysisMoveIncrease, setCounterAnalysisMoveIncrease, counterAnalysisMove, setCounterAnalysisMove,
        setRuleOf50Moves, setCounterMove, addNotice, setNotice, notice, setAnalysisNotice, analysis_notes} = useCounters();

    const {styles} = useStyles();

    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const counter = useRef<number>(0);
    let myState = useRef<staticRefObject>(initialStaticRefObject);

    useEffect(() => {
        counter.current = counter.current + 1;
        console.log('BoardComponent', counter.current);
    });

    useEffect(() => {
        init();
    }, []);

    function adapter(cells: Cell[][]): CellInfo[] {
        return cells.flatMap(row => row.map(cell => cell.getCellInfo()));
    }

    useEffect(() => {
        if (!pause) {
            //moveBestMove();
        }
    }, [pause]);

    useEffect(() => {
        if (!currentPlayer || !start) {
            return;
        }

        // setBestMove(undefined);

        // кінець ігри
        if (!analyze && start) {
            const {status, msg} = board.current.theEnd(currentPlayer);

            if (status) {
                openModal(msg);
                dispatch(resetGame());
                return;
            }

            if (pause) {
                return;
            }

            if (currentPlayer === PlayerTypes.WHITE && modeWhitePlayer?.value === modePlayer.AUTO ||
                currentPlayer === PlayerTypes.BLACK && modeBlackPlayer?.value === modePlayer.AUTO) {
                //moveBestMove();
            }
        }
    }, [currentPlayer, start]);

    async function init() {
        setNotice([]);
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
        board.current.reset();
        // dispatch(setAllCells(adapter(board.current.getCells())));
    }

    function highlightCells(selectedCell: Cell | null) {
        if (!currentPlayer) {
            return;
        }

        board.current.highlightCells(selectedCell, currentPlayer);
    }


    function currentMoveIsLast(): boolean {
        return notice.current.length === counterMove.current
    }

    const clickHandler = useCallback(async (colIndex: number, rowIndex: number): Promise<void> => {
        const targetCell = board.current.getCell(rowIndex, colIndex);

        if (!currentPlayer) {
            return;
        }

        // якщо вибрана клітинка і там є фігура і туди можна походити ми переходимо
        if (selectedCell) {
            const selectedCellOnBoard = board.current.getCell(selectedCell.x, selectedCell.y);
            if (selectedCellOnBoard !== targetCell && selectedCellOnBoard.figure !== null &&
                board.current.playerCanMove(selectedCellOnBoard, targetCell, currentPlayer)) {
                highlightCells(null);
                await moveOnClick(selectedCellOnBoard, targetCell, null);
                return;
            }
        }

        // якщо ігра продовжується але крок ігри не останній тому що ігрок переглядає свої ходи тоді ходити заборонено
        if (start && !currentMoveIsLast()) {
            return;
        }

        // якщо вибрали клітинку зі своєю фігурою тоді можна позначаємо її
        if (targetCell.figure?.color === currentPlayer) {
            highlightCells(targetCell);
            dispatch(setSelectedCell(targetCell.getCellInfo()));
        }
    }, [selectedCell, currentPlayer]);


    function getAnalysisDeep() {
        const currentMoveTree = searchItemForAnalysisById(analysis_notes.current, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        return currentMoveTree.deep;
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
        getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then((result: any) => {
            //setBestMove(result);
        });
    }



    function unmarkEnPassantFigure() {
        const cell = getEnPassantCell(board.current);
        if (cell !== null) {
            cell.enPassantFigure = false;
        }
    }

    async function setFigure(FigureName: typeFenFigureSign) {
        const targetCell = myState.current.targetCell;
        const selectedCell = myState.current.selectedCell;
        const selectedFigure = myState.current.selectedFigure;
        const opponentFigure = myState.current.opponentFigure;

        if (!currentPlayer || targetCell === null || targetCell.figure === null || selectedCell === null) {
            return;
        }

        if (FenFigureSign.QUEEN === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Queen(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.KNIGHT === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Knight(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.BISHOP === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Bishop(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.ROOK === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Rook(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        const lastCodeMove = getPruningCoordinateMove( board.current.lastMoveIsEnPassant, selectedCell, targetCell, selectedFigure, opponentFigure);
        await wrapSaveLastCodeMove(lastCodeMove);
        finishMove();
    }

    function finishMove() {
        // TODO треба тут витерти попередню elPassant ячейку
        unmarkEnPassantFigure();
        // dispatch(setLastMoveIsEnPassant(myState.current.switchEnPassant));
        board.current.lastMoveIsEnPassant = myState.current.switchEnPassant;
        dispatch(setSelectedCell(null));

        if (!analyze) {
            setCounterMove(counterMove.current + 1);
        }

        // записуємо останній хід
        board.current.targetCellPrevMove = myState.current.targetCell?.getCellInfo() ?? null;
        board.current.figureCellPrevMove = myState.current.selectedCell?.getCellInfo() ?? null;
        dispatch(setAfterAnimate(false));
        dispatch(swapPlayer());
    }

    async function moveOnClick(selectedCell: Cell, targetCell: Cell, promotion: string | null = null) {
        if (selectedCell.figure === null) {
            return;
        }

        const switchEnPassant = moveIsEnPassant(selectedCell, targetCell);
        const selectedFigure = selectedCell.figure;
        const opponentFigure = targetCell.figure;

        myState.current = {
            targetCell,
            selectedCell,
            selectedFigure,
            opponentFigure,
            switchEnPassant
        }

        // якщо зроблений хід пішаком чи збито фігуру targetCell не була пустою
        // тоді ми обновляємо правило 50 ходів до 0
        setRuleOf50Moves(changeRuleOf50Moves(selectedCell, targetCell, ruleOf50Moves))

        const lastCodeMove = selectedCell.moveFigure(targetCell, board.current.lastMoveIsEnPassant, board.current.targetCellPrevMove);

        // lastCodeMove in Portable Game Notation
        if (lastCodeMove) {
            await wrapSaveLastCodeMove(lastCodeMove); // There is still a record in function setFigure
        }

        // promotion існує тільки в тому випадку якщо хід вже відомий наприклад він визначений stockfish-ом
        if (promotion) {
            await setFigure(getFenFigureSignBySymbol(promotion));
            return;
        }

        if (targetCell.figure?.isPawn() && targetCell.isLastLineForTransforming(selectedFigure.color)) {
            setIsOpenedSelectFigure(true);
            return;
        }

        finishMove();
    }

    async function wrapSaveLastCodeMove(codeMove: string) {
        if (analyze) {
            saveLastAnalyzeCodeMove(codeMove);
            board.current.changeFenReportStringCastle(codeMove, currentPlayer);
        } else if (currentMoveIsLast() && start) {
            await saveLastCodeMoveToStorage(codeMove);
            addNotice(codeMove);
            board.current.changeFenReportStringCastle(codeMove, currentPlayer);
        }
    }



    return (
        <>
            <ModalComponent />
            <PopupBoxSelectFigureComponent
                isOpenedSelectFigure={isOpenedSelectFigure}
                setIsOpenedSelectFigure={setIsOpenedSelectFigure}
                targetCell={myState.current?.targetCell}
                setFigure={setFigure}
            />
            <View style={styles.wrapperPlayPlace}>
                <View style={[styles.playPlace, rotate && styles.rotate180]}>
                    <View style={styles.wrapBoard}>
                        <View style={styles.board}>
                            {board.current.cells.map((row, rowIndex) => (
                                <View key={`col-${rowIndex}`} style={styles.wrapCell}>
                                    {row.map((cell, colIndex) => (
                                        <CellComponent
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            click={() => clickHandler(cell.y, cell.x)}
                                            cell={cell}
                                            selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                    {board.current.cells.map((row, rowIndex) => (
                        row.map((cell, colIndex) =>  (
                            cell.figure && <FigureComponentOnBoard rowIndex={rowIndex} colIndex={colIndex} key={`figure-${rowIndex}-${colIndex}`}
                                 figureColor={cell.figure.color} figureNameEn={cell.figure.nameEn} />
                        ))))}
                </View>
            </View>
        </>
    );
};

export default React.memo(BoardComponent);
