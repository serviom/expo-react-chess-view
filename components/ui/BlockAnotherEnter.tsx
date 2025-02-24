import React from 'react';
import {StyleSheet} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Text} from '@rneui/themed';
import {Route} from "@/shared/types";
import BlockEnter from "@/components/ui/blockAnotherEnter/blockEnter";

interface BlockAnotherEnterProps {
}

const BlockAnotherEnter: React.FC<BlockAnotherEnterProps> = () => {
    return (
        <>
            <BlockEnter url={'http://localhost:3000/api/auth/google/login'} text={'Увійти за допомогою Google'} />
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