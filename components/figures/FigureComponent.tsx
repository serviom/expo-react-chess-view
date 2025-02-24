import React, {FC} from "react";
import {ImageBackground} from "expo-image";
import {FigureComponentProps} from "@/components/figures/FigureComponents";
import {useControl} from "@/providers/chess/ControlProvider";
import {useStyles} from "@/providers/chess/StylesChessProvider";

const FigureComponent: FC<FigureComponentProps> = ({figureNameEn, figureColor}: FigureComponentProps) => {

    const {mode} = useControl();
    const {styles} = useStyles();

    return (
        <ImageBackground
            style={styles.image_container}
            source={require('@/assets/figures.svg')}
            imageStyle={[
                styles.figure,
                styles[figureNameEn as keyof typeof styles],
                styles[`${figureColor}_mode${mode}` as keyof typeof styles],
            ]}/>
    )
};

export default React.memo(FigureComponent)