import React from 'react';
import {StyleSheet} from "react-native";
import {Route} from "@/shared/types";
import BlockEnter from "@/components/ui/blockAnotherEnter/blockEnter";

interface BlockAnotherEnterProps {
}

const BlockAnotherEnter: React.FC<BlockAnotherEnterProps> = () => {
    return (
        <>
            <BlockEnter url={'http://localhost:3000/api/auth/google/login'} text={'Увійти за допомогою Google'} />
            {/*<BlockEnter url={Route.SignInByFacebook} text={'Увійти за допомогою Facebook'} />*/}
        </>
    );
};

export default BlockAnotherEnter;

const styles = StyleSheet.create({
    container: {
        margin: 10,
        width: '100%',
    }
});