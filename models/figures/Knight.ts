import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";


import {PlayerTypes} from "@/constants";
import {Player} from "@/types";
// import blackLogo from "../../assets/black-knight.png";
// import whiteLogo from "../../assets/white-knight.png";

export class Knight extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    // this.logo = color === valuesColors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNamesValues.KNIGHT;
    this.nameEn = FigureNamesEnValues.KNIGHT;
    this.noticeSign = FigureSign.KNIGHT;
    this.noticeFenSign = FenFigureSign.KNIGHT;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if(!super.canMove(target, validateColorFigure)) {
      return false;
    }

    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);

    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
}
