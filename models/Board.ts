import {Cell} from "./Cell";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure, FigureSides} from "./figures/Figure";
import {CellInfo, Player, ValueOf} from "../types";
import {CastleTypes, getSystemCoordinateByInterByString, systemCoordinates} from "../utils/board";
import {PlayerTypes} from "@/constants";

export const CastleOldKingСoordinates = {
    WHITE: "4,7",
    BLACK: "4,0",
}

export const CastleKingСoordinates = {
    WHITE_SHORT: "6,7",
    WHITE_LONG : "2,7",
    BLACK_LONG : "2,0",
    BLACK_SHORT: "6,0"
}

export const CastleNewRookСoordinates = {
    WHITE_SHORT: "5,7",
    WHITE_LONG : "3,7",
    BLACK_LONG : "3,0",
    BLACK_SHORT: "5,0"
}

export const CastleOldRookСoordinates = {
    WHITE_SHORT: "7,7",
    WHITE_LONG : "0,7",
    BLACK_LONG : "0,0",
    BLACK_SHORT: "7,0"
}

const theEndStatus = {
    TYPE_NONE: "none",
    TYPE_DRAW: "draw",
    TYPE_WON : "won",
} as const;


const START_FEN_STRING_CASTLE = 'KQkq';
const WHITE_SHORT_CASTLE_FEN = 'K';
const WHITE_LONG_CASTLE_FEN = 'Q'
const BLACK_SHORT_CASTLE_FEN = 'k';
const BLACK_LONG_CASTLE_FEN = 'q'

export type typeTheEndStatus = ValueOf<typeof theEndStatus>;

export const WHITE_WON = 'White Won';
export const BLACK_WON = 'Black Won';

type EndStatusObject = {
    status: boolean,
    msg: string
}

export const castleValidCells = {
    'WHITE_LONG' : [
        [2, 7],
        [3, 7]
    ],
    'WHITE_SHORT': [
        [5, 7],
        [6, 7],
    ],
    'BLACK_LONG' : [
        [2, 0],
        [3, 0]
    ],
    'BLACK_SHORT': [
        [5, 0],
        [6, 0],
    ]
}

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];
    blackFigures: Figure[] = [];
    whiteFigures: Figure[] = [];
    // target cell prev move
    targetCellPrevMove: CellInfo | null = null;
    // select figure cell prev move
    figureCellPrevMove: CellInfo | null = null;
    lastMoveIsEnPassant: boolean = false;

    numberOfCells: number = 8;
    fenReportStringCastle: string = '';

    public reset(){
        this.cells = [];
        this.lostBlackFigures = [];
        this.lostWhiteFigures = [];
        this.blackFigures = [];
        this.whiteFigures = [];
        this.targetCellPrevMove = null;
        this.figureCellPrevMove = null;
        this.lastMoveIsEnPassant = false;
        this.initCells();
        this.addFigures();
    }

    public getCells(){
        return this.cells;
    }

    public setCells(cells: Cell[][]): void{
        this.cells = cells;
    }

    public clearOpportunitiesCastleWhite() {
        this.fenReportStringCastle = this.fenReportStringCastle.replace(WHITE_SHORT_CASTLE_FEN, '');
        this.fenReportStringCastle = this.fenReportStringCastle.replace(WHITE_LONG_CASTLE_FEN, '');
    }

    public clearOpportunitiesCastleBlack() {
        this.fenReportStringCastle = this.fenReportStringCastle.replace(BLACK_SHORT_CASTLE_FEN, '');
        this.fenReportStringCastle = this.fenReportStringCastle.replace(BLACK_LONG_CASTLE_FEN, '');
    }

    public setFenReportStringCastle(value: string) {
        this.fenReportStringCastle = value;
    }

    public getFenReportStringCastle(): string {
        return this.fenReportStringCastle;
    }

    public changeFenReportStringCastle(codeMove: string, currentPlayer: Player | null) {
        if (this.fenReportStringCastle === '') {
            return;
        }

        if (this.kingDidMove(PlayerTypes.WHITE)) {
            this.clearOpportunitiesCastleWhite();
        }

        if (this.kingDidMove(PlayerTypes.BLACK)) {
            this.clearOpportunitiesCastleBlack();
        }

        if (this.rookDidMove(PlayerTypes.WHITE, FigureSides.RIGHT)) {
            this.fenReportStringCastle = this.fenReportStringCastle.replace(WHITE_SHORT_CASTLE_FEN, '');
        }

        if (this.rookDidMove(PlayerTypes.WHITE, FigureSides.LEFT)) {
            this.fenReportStringCastle = this.fenReportStringCastle.replace(WHITE_LONG_CASTLE_FEN, '');
        }

        if (this.rookDidMove(PlayerTypes.BLACK, FigureSides.RIGHT)) {
            this.fenReportStringCastle = this.fenReportStringCastle.replace(BLACK_LONG_CASTLE_FEN, '');
        }

        if (this.rookDidMove(PlayerTypes.BLACK, FigureSides.LEFT)) {
            this.fenReportStringCastle = this.fenReportStringCastle.replace(BLACK_SHORT_CASTLE_FEN, '');
        }

        if (codeMove === CastleTypes.SHORT || codeMove === CastleTypes.LONG) {
            if (currentPlayer === PlayerTypes.WHITE) {
                this.clearOpportunitiesCastleWhite();
            }

            if (currentPlayer === PlayerTypes.BLACK) {
                this.clearOpportunitiesCastleBlack();
            }
        }
    }

    initCells() {
        for (let i = 0; i < this.numberOfCells; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < this.numberOfCells; j++) {
                row.push(new Cell(this, j, i, (i + j) % 2 !== 0 ? PlayerTypes.BLACK : PlayerTypes.WHITE, null))
            }
            this.cells.push(row);
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.whiteFigures = this.whiteFigures;
        newBoard.blackFigures = this.blackFigures;
        return newBoard;
    }

    // updateCell: ({}: any) => void,
    public highlightCells( selectedCell: Cell | null, currentPlayer: Player) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                // цей код повинен виконатися швидше, тому що метод playerCanMove містить перевірку на параметр enPassantFigure
                if (this.lastMoveIsEnPassant && this.targetCellPrevMove && this.figureCellPrevMove) {
                    target.enPassantFigure = this.figureCellPrevMove.x === target.x  && (target.y === (this.targetCellPrevMove.y + this.figureCellPrevMove.y) / 2);
                }
                target.available = selectedCell !== null && selectedCell.isFigure && this.playerCanMove(selectedCell, target, currentPlayer);
            }
        }
    }

    public partBoardFen() {
        let empty = 0;
        let fen = '';

        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                if (!target.isEmpty()) {
                    if (empty > 0) {
                        fen += empty.toString();
                        empty = 0;
                    }
                    fen += target.figure?.fenSign;
                } else {
                    empty++;
                }
            }

            if (empty > 0) {
                fen += empty.toString();
                empty = 0;
            }

            if (i < 7) {
                fen += '/';
            }
        }

        return fen;
    }

    public availableMoves(selectedCell: Cell, currentPlayer: Player) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const result = this.playerCanMove(selectedCell, row[j], currentPlayer);
                if (result) {
                    return true;
                }
            }
        }

        return false;
    }

    public getCellByInterCoordinate(code: string): Cell {
        return this.getCellBySystemCoordinates(getSystemCoordinateByInterByString(code));
    }

    public getCellBySystemCoordinates(coordinate: systemCoordinates): Cell {
        return this.getCell(coordinate.x, coordinate.y);
    }

    public getCellByCoordinate(coordinates: string): Cell {
        const arr = coordinates.split(',');
        return this.getCell(parseInt(arr[0]), parseInt(arr[1]));
    }

    public castleMove(isBlack: boolean, isLongCastle: boolean): void {
        const cellOldKing = this.getCellByCoordinate(isBlack ?
            CastleOldKingСoordinates.BLACK : CastleOldKingСoordinates.WHITE);

        const cellOldRook = this.getCellByCoordinate(isBlack ?
            (isLongCastle ? CastleOldRookСoordinates.BLACK_LONG : CastleOldRookСoordinates.BLACK_SHORT) :
            (isLongCastle ? CastleOldRookСoordinates.WHITE_LONG : CastleOldRookСoordinates.WHITE_SHORT));

        const cellKing = this.getCellByCoordinate(isBlack ?
            (isLongCastle ? CastleKingСoordinates.BLACK_LONG : CastleKingСoordinates.BLACK_SHORT) :
            (isLongCastle ? CastleKingСoordinates.WHITE_LONG : CastleKingСoordinates.WHITE_SHORT));

        const cellRook = this.getCellByCoordinate(isBlack ?
            (isLongCastle ? CastleNewRookСoordinates.BLACK_LONG : CastleNewRookСoordinates.BLACK_SHORT) :
            (isLongCastle ? CastleNewRookСoordinates.WHITE_LONG : CastleNewRookСoordinates.WHITE_SHORT));

        if (cellOldRook.figure) {
            cellOldRook.figure.moveFigure(cellRook);
            cellRook.setFigure(cellOldRook.figure);
            cellOldRook.figure = null;
        }

        if (cellOldKing.figure) {
            cellOldKing.figure.moveFigure(cellKing);
            cellKing.setFigure(cellOldKing.figure);
            cellOldKing.figure = null;
        }
    }

    playerCanMove(selectedCell: Cell, target: Cell, currentPlayer: Player) {
        if (selectedCell.figure?.isKing() && this.canCastleMove(selectedCell, target)) {
            return true;
        }
        return !!selectedCell?.figure?.canMove(target) && this.willBeNotKingUnderAttack(selectedCell, target, currentPlayer);
    }

    kingDidMove(color: Player): boolean {
        return this.getKing(color)?.figureDidMove() ?? true;
    }

    rookDidMove(color: Player, side: FigureSides): boolean {
        return this.getRook(color, side)?.figureDidMove() ?? true;
    }

    validCellsForCastle(selectedCell: Cell, cells: number[][]): boolean {
        return cells.every((coordinate) => {
            const target = this.getCell(coordinate[0], coordinate[1]);
            return target.isEmpty() && this.cellIsNotUnderAttack(selectedCell.figureColor, target);
        });
    }

    kingIsNotUnderCheck(selectedCell: Cell, target: Cell): boolean {
        // провірка чи король буде під шахом після ракіровки
        if (!this.cellIsNotUnderAttack(selectedCell.figureColor, target)) {
            return false;
        }

        // провірка чи король під шахом
        if (!this.kingIsNotUnderAttack(selectedCell.figureColor)) {
            return false;
        }

        return true;
    }

    canCastleMove(selectedCell: Cell, target: Cell) {
        // провірка чи не ходив король
        if (this.kingDidMove(selectedCell.figureColor)) {
            return false;
        }

        if (selectedCell.figureColor === PlayerTypes.WHITE) {
            if (target.coordinateByLine === CastleKingСoordinates.WHITE_LONG) {
                // провірка чи не ходила ліва тура
                if (this.rookDidMove(selectedCell.figureColor, FigureSides.LEFT)) {
                    return false;
                }

                // провірка чи пусті ячейки
                // провірка чи ячейки не під ударом
                if (!this.validCellsForCastle(selectedCell, castleValidCells.WHITE_LONG)) {
                    return false;
                }

                return this.kingIsNotUnderCheck(selectedCell, target);
            }

            if (target.coordinateByLine === CastleKingСoordinates.WHITE_SHORT) {
                // провірка чи не ходила права тура
                if (this.rookDidMove(selectedCell.figureColor, FigureSides.RIGHT)) {
                    return false;
                }

                // провірка чи пусті ячейки
                // провірка чи ячейки не під ударом
                if (!this.validCellsForCastle(selectedCell, castleValidCells.WHITE_SHORT)) {
                    return false;
                }

                return this.kingIsNotUnderCheck(selectedCell, target);
            }
        }

        if (selectedCell.figureColor === PlayerTypes.BLACK) {
            if (target.coordinateByLine === CastleKingСoordinates.BLACK_LONG) {
                // провірка чи не ходила права тура
                if (this.rookDidMove(selectedCell.figureColor, FigureSides.RIGHT)) {
                    return false;
                }

                // провірка чи пусті ячейки
                // провірка чи ячейки не під ударом
                if (!this.validCellsForCastle(selectedCell, castleValidCells.BLACK_LONG)) {
                    return false;
                }

                return this.kingIsNotUnderCheck(selectedCell, target);
            }

            if (target.coordinateByLine === CastleKingСoordinates.BLACK_SHORT) {
                // провірка чи не ходила ліва тура
                if (this.rookDidMove(selectedCell.figureColor, FigureSides.LEFT)) {
                    return false;
                }

                // провірка чи пусті ячейки
                // провірка чи ячейки не під ударом
                if (!this.validCellsForCastle(selectedCell, castleValidCells.BLACK_SHORT)) {
                    return false;
                }

                return this.kingIsNotUnderCheck(selectedCell, target);
            }
        }
        return false;
    }

    getOppositeFigures(player: Player): Figure [] {
        return player === PlayerTypes.BLACK ? this.whiteFigures.filter(figure => !this.lostWhiteFigures.includes(figure)) :
            this.blackFigures.filter(figure => !this.lostBlackFigures.includes(figure));
    }

    getFigures(player: Player): Figure [] {
        return player === PlayerTypes.BLACK ? this.blackFigures.filter(figure => !this.lostBlackFigures.includes(figure)) :
            this.whiteFigures.filter(figure => !this.lostWhiteFigures.includes(figure));
    }

    getActiveOppositeFigures(selectedCell: Cell, oppositeFigures: Figure[], target: Cell) {
        if (target.figure && target.figure?.color !== selectedCell.figure?.color) {
            return oppositeFigures.filter(figure => figure !== target.figure);
        }
        return oppositeFigures;
    }

    getOpponent(currentPlayer: Player) {
        return currentPlayer === PlayerTypes.BLACK ? PlayerTypes.BLACK : PlayerTypes.WHITE;
    }

    theEnd(player: Player): EndStatusObject {
        // тут провіряємо чи в нас вже мат чи може пат
        // щоб не провіряти ситуацію на мат після кожного ходу будемо провіряти спочатку на шах королю
        // якщо є шах тоді ми провіряємо чи є можливість походити королем
        // якщо немає тоді можливість походити фігурами прикриваючи короля

        // якщо пат тоді провіряємо чи король не може походити
        // і провірити чи фігури не можуть походити

        const cellKing = this.getKing(player).getCell();

        if (!this.availableMoves(cellKing, player)) {
            const figures = this.getFigures(player);

            // якщо шах
            if (!this.cellIsNotUnderAttack(player, cellKing)) {
                if (!figures.some(figure => this.availableMoves(figure.getCell(), player))) {
                    return {
                        status: true,
                        msg: player === PlayerTypes.BLACK ? WHITE_WON : BLACK_WON
                    }
                }
            }

            // якщо пат
            if (this.cellIsNotUnderAttack(player, cellKing)) {
                if (figures.length === 0 || !figures.some(figure => this.availableMoves(figure.getCell(), player))) {
                    return {
                        status: true,
                        msg: 'You have draw'
                    }
                }
            }
        }

        return {
            status: false,
            msg: ''
        }
    }

    kingIsNotUnderAttack(color: Player): boolean {
        const cellKing = this.getKing(color).getCell();
        return this.cellIsNotUnderAttack(color, cellKing);
    }

    cellIsNotUnderAttack(color: Player, target: Cell): boolean {
        const oppositeFigures = this.getOppositeFigures(color);

        return oppositeFigures.every((figure) => {
            return !figure.canCapture(target);
        });
    }

    willBeNotKingUnderAttack(selectedCell: Cell, target: Cell, color: Player) {

        const colorSelectFigure = selectedCell?.figure?.color ?? null;

        if (colorSelectFigure === null) {
            return true;
        }

        let oppositeFigures = this.getOppositeFigures(colorSelectFigure);

        const getActiveOppositeFigures = this.getActiveOppositeFigures(selectedCell, oppositeFigures, target);

        const cellKing = selectedCell?.figure?.isKing() ? target : this.getKing(color)?.getCell();

        target.setFigureInNextMove(selectedCell.figure);
        selectedCell.setFigureInNextMove(-1);

        const result = getActiveOppositeFigures.every((figure) => {
            return !figure.canCapture(cellKing);
        });

        target.setFigureInNextMove(null);
        selectedCell.setFigureInNextMove(null);

        return result;

    }

    onlyUnique(arr: any[]): any[] {
        return arr.filter((v, i, a) => a.indexOf(v) === i);
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x]
    }

    public getRook(color: Player, side: FigureSides = FigureSides.LEFT): Figure | undefined {
        const figures = this.getFigures(color);
        return figures.find((figure) => {
            return figure.isRook() && figure.isSide(side);
        });
    }

    private getKing(player: Player): Figure {
        const figures = this.getFigures(player);
        const kingFigure = figures.find(figure => figure.isKing());

        if (!kingFigure) {
            throw new Error('Not find king');
        }

        return kingFigure;
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            this.addFigureToArray(new Pawn(PlayerTypes.BLACK, this.getCell(i, 1)));
            this.addFigureToArray(new Pawn(PlayerTypes.WHITE, this.getCell(i, 6)));
        }
    }

    private addKings() {
        this.addFigureToArray(new King(PlayerTypes.BLACK, this.getCell(4, 0), FigureSides.SINGLE));
        this.addFigureToArray(new King(PlayerTypes.WHITE, this.getCell(4, 7), FigureSides.SINGLE));
    }

    private addQueens() {
        this.addFigureToArray(new Queen(PlayerTypes.BLACK, this.getCell(3, 0), FigureSides.SINGLE));
        this.addFigureToArray(new Queen(PlayerTypes.WHITE, this.getCell(3, 7), FigureSides.SINGLE));
    }

    private addBishops() {
        this.addFigureToArray(new Bishop(PlayerTypes.BLACK, this.getCell(2, 0), FigureSides.RIGHT));
        this.addFigureToArray(new Bishop(PlayerTypes.BLACK, this.getCell(5, 0), FigureSides.LEFT));
        this.addFigureToArray(new Bishop(PlayerTypes.WHITE, this.getCell(2, 7), FigureSides.LEFT));
        this.addFigureToArray(new Bishop(PlayerTypes.WHITE, this.getCell(5, 7), FigureSides.RIGHT));
    }

    private addKnights() {
        this.addFigureToArray(new Knight(PlayerTypes.BLACK, this.getCell(1, 0), FigureSides.RIGHT));
        this.addFigureToArray(new Knight(PlayerTypes.BLACK, this.getCell(6, 0), FigureSides.LEFT));
        this.addFigureToArray(new Knight(PlayerTypes.WHITE, this.getCell(1, 7), FigureSides.LEFT));
        this.addFigureToArray(new Knight(PlayerTypes.WHITE, this.getCell(6, 7), FigureSides.RIGHT));
    }

    private addRooks() {
        this.addFigureToArray(new Rook(PlayerTypes.BLACK, this.getCell(0, 0), FigureSides.RIGHT));
        this.addFigureToArray(new Rook(PlayerTypes.BLACK, this.getCell(7, 0), FigureSides.LEFT));
        this.addFigureToArray(new Rook(PlayerTypes.WHITE, this.getCell(0, 7), FigureSides.LEFT));
        this.addFigureToArray(new Rook(PlayerTypes.WHITE, this.getCell(7, 7), FigureSides.RIGHT));
    }

    public addFigureToArray(figure: Figure) {
        if (figure.color === PlayerTypes.BLACK) {
            this.blackFigures.push(figure);
            return;
        }
        this.whiteFigures.push(figure);
    }

    public addFigures() {
        this.addPawns()
        this.addKnights()
        this.addKings()
        this.addBishops()
        this.addQueens()
        this.addRooks()
    }
}
