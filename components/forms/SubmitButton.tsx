import React from 'react';
import {StyleSheet} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Button} from '@rneui/themed';

interface SubmitButtonProps {
    isLoading: boolean;
    onPress: () => void;
    title: string;
    loadingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
                                                       isLoading,
                                                       onPress,
                                                       title,
                                                       loadingText = 'Loading...',
                                                   }) => {
    return (
        <ThemedView style={[styles.container]}>
            <Button
                title={isLoading ? loadingText : title}
                disabled={isLoading}
                onPress={onPress}
            />
        </ThemedView>
    );
};

export default SubmitButton;

const styles = StyleSheet.create({
    container: {
        margin: 10,
        width: '100%',
    }
});