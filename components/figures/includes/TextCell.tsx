import {Text} from "react-native";
import React, {FC} from "react";
import {interCoordinateHorValue, interCoordinateVertValue} from "@/utils/board";
import {useControl} from "@/providers/chess/ControlProvider";
import {Cell} from "@/models/Cell";

interface TextCellProps {
    styles: any;
    cell: Cell;
}

const TextCell: FC<TextCellProps> = ({styles, cell}: TextCellProps) => {

    const { rotate } = useControl();

    const showVerticalNumberCell = ((!rotate && cell.x === 0) || (rotate && cell.x === 7))
        ? interCoordinateVertValue[cell.y]
        : null;

    const showHorizontalNumberCell = ((!rotate && cell.y === 7) || (rotate && cell.y === 0))
        ? interCoordinateHorValue[cell.x]
        : null;

    if (showVerticalNumberCell === showHorizontalNumberCell === null) {
        return null;
    }

    return (
        <>
            {showVerticalNumberCell !== null && <Text style={styles.verticalNumber}>{showVerticalNumberCell}</Text>}
            {showHorizontalNumberCell !== null && <Text style={styles.horizontalNumber}>{showHorizontalNumberCell}</Text>}
        </>
    )
}

export default TextCell;