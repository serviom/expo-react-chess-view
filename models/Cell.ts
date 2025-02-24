import {Figure, FigureNameEn, FigureNamesEnValues} from "./figures/Figure";
import {
  Board,
  CastleKingСoordinates,
} from "./Board";

import {
  getCoupleCoordinateMove,
  getLongCastle,
  getPruningCoordinateMove,
  getShortCastle, makeCoordinateByLine,
  systemCoordinates
} from "../utils/board";

import {PlayerTypes} from "@/constants";
import {CellInfo, Player} from "@/types";

export class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: Player;
  figure: Figure | null;
  enPassantFigure: boolean;
  figureInNextMove: Figure | null | -1;
  board: Board;
  available: boolean; // можливісь фігурі переміщатися на ячейку або навіть вдарити фігуру на цій ячейці

  constructor(board: Board, x: number, y: number, color: Player, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.enPassantFigure = false;
    this.board = board;
    this.available = false;
    this.figureInNextMove = null;
  }

  get coordinateByLine(): string {
    return makeCoordinateByLine(this.x, this.y);
  }

  get systemCoordinate(): systemCoordinates {
    return {
      x: this.x,
      y: this.y
    }
  }

  get interCoordinate(): string {
    return getCoupleCoordinateMove(this);
  }

  setFigureInNextMove(figure: Figure | null | -1) {
    this.figureInNextMove = figure;
  }

  get isFigure(): boolean {
    return this.figure !== null;
  }

  get getFigureColor(): Player | undefined {
    return this.figure?.color;
  }

  get getFigureNameEn(): FigureNameEn | undefined {
    return this.figure?.nameEn;
  }

  get isEnPassantFigure(): boolean {
    return this.enPassantFigure;
  }

  isEmpty(): boolean {
    if (this.figureInNextMove === null) {
      return this.figure === null;
    }

    return this.figureInNextMove === -1;
  }

  get figureColor(): Player {
    const color = this?.figure?.color ?? null;
    if (color === null) {
      throw new Error('Color can not be null');
    }

    return color;
  }

  isEnemy(target: Cell): boolean {
    if (target.figure) {
      return this.figure?.color !== target.figure.color;
    }
    return false;
  }

  isEmptyVertical(target: Cell): boolean {
    if (this.x !== target.x) {
      return false;
    }

    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);
    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) {
        return false
      }
    }
    return true;
  }

  isEmptyHorizontal(target: Cell): boolean {
    if (this.y !== target.y) {
      return false;
    }

    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);
    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) {
        return false
      }
    }
    return true;
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);
    if(absY !== absX)
      return false;

    const dy = this.y < target.y ? 1 : -1
    const dx = this.x < target.x ? 1 : -1

    for (let i = 1; i < absY; i++) {
      if(!this.board.getCell(this.x + dx * i, this.y + dy  * i).isEmpty())
        return false;
    }
    return true;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }

  cleanUpFigure(): void {
    this.figure = null;
  }

  addLostFigure() {
    if (this.figure === null) {
      return;
    }
    this.figure.color === PlayerTypes.BLACK
      ? this.board.lostBlackFigures.push(this.figure)
      : this.board.lostWhiteFigures.push(this.figure)
  }

  isLastLineForTransforming(currentColor: Player) {
    return (currentColor === PlayerTypes.WHITE && this.y === 0) || (currentColor === PlayerTypes.BLACK && this.y === 7);
  }

  moveFigure(target: Cell, lastMoveIsEnPassant: boolean, lastCell: CellInfo | null): string {
    if (!this.figure) {
      return '';
    }

    const selectedFigure = this.figure;
    const opponentFigure = target.figure;

    let lastCodeMove = '';

    // якщо ракіровка
    if (this.figure.isKing() && this.figure.figureDidNotMove()
        && Object.values(CastleKingСoordinates).indexOf(target.coordinateByLine) !== -1
    ) {
      this.board.castleMove(this.figureColor === PlayerTypes.BLACK,this.figureColor === PlayerTypes.BLACK ?
          target.coordinateByLine === CastleKingСoordinates.BLACK_LONG : target.coordinateByLine === CastleKingСoordinates.WHITE_LONG);

        if ([CastleKingСoordinates.BLACK_SHORT, CastleKingСoordinates.WHITE_SHORT].indexOf(target.coordinateByLine) !== -1) {
            lastCodeMove = getShortCastle();
        }

        if ([CastleKingСoordinates.BLACK_LONG, CastleKingСoordinates.WHITE_LONG].indexOf(target.coordinateByLine) !== -1) {
            lastCodeMove = getLongCastle();
        }
        return lastCodeMove;
    }

    this.figure.moveFigure(target);

    // якщо ен пасант
    if (lastMoveIsEnPassant === true && target.isEnPassantFigure && lastCell) {
      const lastCellOnBoard = this.board.getCell(lastCell?.x, lastCell?.y);

      if (lastCellOnBoard.figure) {
        // видаляємо пішака який перестрибнув одну клітинку
        lastCellOnBoard.addLostFigure();
        lastCellOnBoard.figure = null;
      }

      target.setFigure(this.figure);
      this.figure = null;
      return getPruningCoordinateMove(lastMoveIsEnPassant, this, target, selectedFigure, opponentFigure);
    }

    if (target.figure) {
      target.addLostFigure();
    }

    target.setFigure(this.figure);
    this.figure = null;

    // якщо пішак досяг кінця дошки
    if (target.figure?.isPawn() && target.isLastLineForTransforming(selectedFigure.color)) {
        return '';
    }

    return getPruningCoordinateMove(lastMoveIsEnPassant, this, target, selectedFigure, opponentFigure);
  }

  get id (): string {
    return `cell${this.x}${this.y}`
  }

  getCellInfo(): CellInfo {
    return {
      x: this.x,
      y: this.y,
      figureNameEn: this.figure ? this.figure.nameEn : null,
      figureColor:  this.figure ? this.figure.color : null,
      available: this.available,
      isFigure: this.isFigure,
      isEnPassantFigure: this.isEnPassantFigure,
      cellColor: this.color,
      id: this.id
    };
  }
}
