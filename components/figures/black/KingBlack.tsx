import React, {FC, useEffect} from "react";
import {FigureComponentProps} from "@/components/figures/FigureComponents";
import FigureComponent from "@/components/figures/FigureComponent";

const KingBlack: FC<FigureComponentProps> = ({figureNameEn, figureColor}: FigureComponentProps) => {

    useEffect(() => {
        console.log('KingBlack');
    });

    return (
        <FigureComponent figureNameEn={figureNameEn} figureColor={figureColor} />
    )
}

export default React.memo(KingBlack)