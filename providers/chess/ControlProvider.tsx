import React, {createContext, useContext, useState} from 'react';
import {MODE, ROTATE} from "@/constants";
import {initialStateModePlayerOptions, ISelectOption, SingleValue} from "@/types";


interface ChessControlContextProps {
    mode: number,
    setMode: (val: number) => void
    rotate: boolean;
    setRotate: (val: boolean) => void
    modeWhitePlayer: SingleValue<ISelectOption>,
    modeBlackPlayer: SingleValue<ISelectOption>,
    setModeWhitePlayer: (val: SingleValue<ISelectOption>) => void,
    setModeBlackPlayer: (val: SingleValue<ISelectOption>) => void,
}

const ControlContext = createContext<ChessControlContextProps>({} as ChessControlContextProps);

export const ControlProvider = ({ children } : { children: React.ReactNode }) => {
    const [mode, setMode] = useState<number>(MODE);
    const [rotate, setRotate] = useState<boolean>(ROTATE);
    const [modeWhitePlayer, setModeWhitePlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [modeBlackPlayer, setModeBlackPlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);

    return (
        <ControlContext.Provider value={{setModeWhitePlayer, setModeBlackPlayer, modeWhitePlayer, modeBlackPlayer, mode, setMode, rotate, setRotate}}>
            {children}
        </ControlContext.Provider>
    );
};

export const useControl = () => {
    return useContext(ControlContext);
};