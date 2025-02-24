// import logo from '../../assets/black-king.png'
import {Cell} from "../Cell";
import {Player, ValueOf} from "../../types";
import {PlayerTypes} from "@/constants";

export const FigureNamesValues =  {
    FIGURE : "Фігура",
    KING   : "Король",
    KNIGHT : "Кінь",
    PAWN   : "Пішак",
    QUEEN  : "Королева",
    ROOK   : "Тура",
    BISHOP : "Слон",
} as const;

export type FigureNames = ValueOf<typeof FigureNamesValues>

export const FigureSides = {
    LEFT       : "left",
    RIGHT      : "right",
    SINGLE     : "single",
    ALL_ROUND  : "all-round",
    ADDITIONAL : "additional"
} as const;

export type FigureSides= ValueOf<typeof FigureSides>

export const FigureSign = {
    KING   : "K",
    KNIGHT : "N",
    PAWN   : "",
    QUEEN  : "Q",
    ROOK   : "R",
    BISHOP : "B",
} as const;

export type FigureSign = ValueOf<typeof FigureSides>

export const FenFigureSign = {
    KING   : "k",
    KNIGHT : "n",
    PAWN   : "p",
    QUEEN  : "q",
    ROOK   : "r",
    BISHOP : "b",
} as const;

export type typeFenFigureSign = ValueOf<typeof FenFigureSign>

export const FigureNamesEnValues = {
    FIGURE : "figure",
    KING   : "king",
    KNIGHT : "knight",
    PAWN   : "pawn",
    QUEEN  : "queen",
    ROOK   : "rook",
    BISHOP : "bishop",
} as const;

export type FigureNameEn = ValueOf<typeof FigureNamesEnValues>

export class Figure {
    color: Player;
    // logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    side: FigureSides;
    isFirstStep: boolean = true;
    nameEn: FigureNameEn;
    noticeSign: string = '';
    noticeFenSign: typeFenFigureSign | null = null;

    constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        // this.logo = null;
        this.name = FigureNamesValues.FIGURE;
        this.side = side;
        this.nameEn = FigureNamesEnValues.FIGURE;
    }

    get fenSign() {
        return this.color === PlayerTypes.WHITE ? this.noticeFenSign?.toUpperCase() : this.noticeFenSign;
    }

    canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
        // validateColorFigure = false не провіряє чи своя фігура чи чужа
        // у випадку якщо ми бєм фігуру яка захищена другою фігурою
        // щоб не опинитися під шахом провірку свій чужий пропускаємо що
        // дає можливість відслідкувати чи не буде шаху після удару
        // можливо не потрібно тому що використали figureInNextMove

        if (validateColorFigure) {
            if (target.figureInNextMove === null && target.figure?.color === this.color) {
                // console.log('canMove Figure 1');
                return false;
            }

            if (target.figureInNextMove !== -1 && target.figureInNextMove?.color === this.color) {
                // console.log('canMove Figure 2');
                return false;
            }
        }

        return true;
    }

    getCell(): Cell {
        return this.cell;
    }

    canCapture(target: Cell): boolean {
        return this.canMove(target, true);
    }

    isKing(): boolean {
        return this.name === FigureNamesValues.KING;
    }

    isKnight(): boolean {
        return this.name === FigureNamesValues.KNIGHT;
    }

    isRook(): boolean {
        return this.name === FigureNamesValues.ROOK;
    }

    isPawn(): boolean {
        return this.name === FigureNamesValues.PAWN;
    }

    isSide(side: FigureSides): boolean {
        return this.side === side;
    }

    leftSide(): boolean {
        return this.side === FigureSides.LEFT;
    }

    rightSide(): boolean {
        return this.side === FigureSides.RIGHT;
    }

    isSingle(): boolean {
        return this.side === FigureSides.SINGLE;
    }

    figureDidMove(): boolean {
        return this.isFirstStep === false;
    }

    figureDidNotMove(): boolean {
        return !this.figureDidMove();
    }

    moveFigure(target: Cell) {
        this.isFirstStep = false;
    }
}
