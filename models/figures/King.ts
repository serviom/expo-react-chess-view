import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign, FigureNames} from "./Figure";
import {Cell} from "../Cell";


import {PlayerTypes} from "@/constants";
import {Player} from "@/types";
// import blackLogo from "../../assets/black-king.png";
// import whiteLogo from "../../assets/white-king.png";

export class King extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    // this.logo = color === valuesColors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNamesValues.KING;
    this.nameEn = FigureNamesEnValues.KING;
    this.noticeSign = FigureSign.KING;
    this.noticeFenSign = FenFigureSign.KING;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if(!super.canMove(target, validateColorFigure)) {
      return false;
    }

    const xDiagonal = target.x - this.cell.x;
    const yDiagonal = target.y - this.cell.y;

    const dy = Math.abs(yDiagonal) === 1 && target.x === this.cell.x;
    const dx = Math.abs(xDiagonal) === 1 && target.y === this.cell.y;

    if(dx || dy) {
      return true;
    }

    const absX = Math.abs(xDiagonal);
    const absY = Math.abs(yDiagonal);

    if(absY !== absX || absX > 1 || absY > 1) {
      return false;
    }

    return true;
  }
}
