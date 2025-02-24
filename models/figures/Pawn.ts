import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";
import {PlayerTypes} from "@/constants";
import {Player} from "@/types";

export class Pawn extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    //this.logo = color === valuesColors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNamesValues.PAWN;
    this.nameEn = FigureNamesEnValues.PAWN;
    this.noticeSign = FigureSign.PAWN;
    this.noticeFenSign = FenFigureSign.PAWN;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if(!super.canMove(target, validateColorFigure)) {
      return false;
    }

    const isBlack = this.cell.figure?.color === PlayerTypes.BLACK;

    const direction = isBlack ? 1 : -1;
    const firstStepDirection = isBlack ? 2 : -2;

    // це код коли він йде вперед на один або два кроки
    if ((target.y === this.cell.y + direction || (this.figureDidNotMove() && target.y === this.cell.y + firstStepDirection
        && this.cell.board.getCell(target.x, isBlack ? target.y - 1 : target.y + 1 ).isEmpty()))
        && target.x === this.cell.x && this.cell.board.getCell(target.x, target.y).isEmpty()) {
      return true;
    }

    // це код при якому пішак б'є фігури
    if(target.y === this.cell.y + direction && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
      && (this.cell.isEnemy(target) || target.isEnPassantFigure)) {
      return true;
    }

    return false;
  }

  canCapture(target: Cell) : boolean {
    const direction = this.cell.figure?.color === PlayerTypes.BLACK ? 1 : -1

    if(target.y === this.cell.y + direction
        && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)) {
      return true;
    }

    return false;
  }

  // Пішак зробив хід якщо для чорних положення по висоті не 6 і для білих не 1
  figureDidMove(): boolean {
    if (this.color === PlayerTypes.WHITE) {
      return this.cell.y !== 6;
    }

    if (this.color === PlayerTypes.BLACK) {
      return this.cell.y !== 1;
    }

    return false;
  }
}
