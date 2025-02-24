import KingBlack from "./black/KingBlack";
import KingWhite from "./white/KingWhite";
import {PlayerTypes} from "@/constants";
import {FigureNameEn, FigureNamesEnValues} from "@/models/figures/Figure";
import {FC} from "react";
import {Player} from "@/types";
import PawnBlack from "@/components/figures/black/PawnBlack";
import PawnWhite from "@/components/figures/white/PawnWhite";
import QueenBlack from "@/components/figures/black/QueenBlack";
import QueenWhite from "@/components/figures/white/QueenWhite";
import RookBlack from "@/components/figures/black/RookBlack";
import RookWhite from "@/components/figures/white/RookWhite";
import BishopBlack from "@/components/figures/black/BishopBlack";
import BishopWhite from "@/components/figures/white/BishopWhite";
import KnightBlack from "@/components/figures/black/KnightBlack";
import KnightWhite from "@/components/figures/white/KnightWhite";

export interface FigureComponentOnBoardProps {
    figureNameEn: FigureNameEn;
    figureColor: Player;
    rowIndex: number;
    colIndex: number;
}

export interface FigureComponentProps {
    figureNameEn: FigureNameEn;
    figureColor: Player;
}

type FigureComponentType = FC<FigureComponentProps>;

type PlayerFigures = Partial<Record<FigureNameEn, FigureComponentType>>;

type FigureComponentsType = Record<Player, PlayerFigures>;

const FigureComponents: FigureComponentsType  = {
    [PlayerTypes.BLACK]: {
        [FigureNamesEnValues.KING]: KingBlack,
        [FigureNamesEnValues.PAWN]: PawnBlack,
        [FigureNamesEnValues.QUEEN]: QueenBlack,
        [FigureNamesEnValues.ROOK]: RookBlack,
        [FigureNamesEnValues.BISHOP]: BishopBlack,
        [FigureNamesEnValues.KNIGHT]: KnightBlack,
    },
    [PlayerTypes.WHITE]: {
        [FigureNamesEnValues.KING]: KingWhite,
        [FigureNamesEnValues.PAWN]: PawnWhite,
        [FigureNamesEnValues.QUEEN]: QueenWhite,
        [FigureNamesEnValues.ROOK]: RookWhite,
        [FigureNamesEnValues.BISHOP]: BishopWhite,
        [FigureNamesEnValues.KNIGHT]: KnightWhite,
    }
} as const;

export default FigureComponents;