import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";


import {PlayerTypes} from "@/constants";
import {Player} from "@/types";
// import blackLogo from '../../assets/black-bishop.png'
// import whiteLogo from '../../assets/white-bishop.png'

export class Bishop extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    // this.logo = color === valuesColors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNamesValues.BISHOP;
    this.nameEn = FigureNamesEnValues.BISHOP;
    this.noticeSign = FigureSign.BISHOP;
    this.noticeFenSign = FenFigureSign.BISHOP;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if(!super.canMove(target, validateColorFigure)) {
      return false;
    }

    if(this.cell.isEmptyDiagonal(target)) {
      return true;
    }

    return false
  }
}
