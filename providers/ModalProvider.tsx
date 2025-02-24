import React, { createContext, useContext, useState } from 'react';

interface ChessModalContextProps {
    isOpen: boolean,
    message: string,
    openModal: (msg: string) => void,
    closeModal: () => void,
}

const ModalContext = createContext<ChessModalContextProps>({} as ChessModalContextProps);

export const ModalProvider = ({ children } : { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const openModal = (msg: string) => {
        setMessage(msg);
        setIsOpen(true);
        console.log('openModal');
    };

    const closeModal = () => {
        setIsOpen(false);
        setMessage('');
    };

    return (
        <ModalContext.Provider value={{ isOpen, message, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};