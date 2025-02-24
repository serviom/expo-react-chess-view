import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";
import {Player} from "@/types";
export class Queen extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    this.name = FigureNamesValues.QUEEN;
    this.nameEn = FigureNamesEnValues.QUEEN;
    this.noticeSign = FigureSign.QUEEN;
    this.noticeFenSign = FenFigureSign.QUEEN;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if(!super.canMove(target, validateColorFigure)) {
      // console.log('super canMove');
      return false;
    }

    if (this.cell.isEmptyDiagonal(target)) {
      // console.log(target);
      // console.log('is empty diagonal');
    }

    if(this.cell.isEmptyVertical(target)
        || this.cell.isEmptyHorizontal(target)
        || this.cell.isEmptyDiagonal(target)) {
      return true;
    }

    return false
  }
}
