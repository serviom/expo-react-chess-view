import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";
import {Player} from "@/types";

export class Rook extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    this.name = FigureNamesValues.ROOK;
    this.nameEn = FigureNamesEnValues.ROOK;
    this.noticeSign = FigureSign.ROOK;
    this.noticeFenSign =  FenFigureSign.ROOK;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if (!super.canMove(target, validateColorFigure)) {
      return false;
    }

    if (this.cell.isEmptyVertical(target)) {
      return true;
    }

    if (this.cell.isEmptyHorizontal(target)) {
      return true;
    }

    return false
  }
}
