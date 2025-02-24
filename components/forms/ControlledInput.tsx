import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';
import {Input, Text } from '@rneui/themed';
import {IconNode} from "@rneui/base";

interface ControlledInputProps {
    control: any;
    name: string;
    placeholder: string;
    secureTextEntry?: boolean;
    leftIcon?: {
        type: string;
        name: string;
    };
    errors: Record<string, any>;
    rightIcon?: IconNode;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
                                                             control,
                                                             name,
                                                             placeholder,
                                                             secureTextEntry = false,
                                                             leftIcon,
                                                             errors,
                                                             rightIcon
                                                         }: ControlledInputProps) => {

    const getErrorMessage = () => {
        return errors && errors[name] ? errors[name]?.message : null;
    }


    return (
        <>
            <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                    <Input
                        leftIcon={leftIcon}
                        style={styles.input}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={getErrorMessage()}
                        renderErrorMessage={!!getErrorMessage()}
                        errorStyle={styles.errorStyle}
                        rightIcon={rightIcon}
                    />
                )}
                name={name}
            />
            {/*{errors && errors[name] && (<Text style={styles.errorText}>{errors[name]?.message}</Text>)}*/}
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    errorStyle: {

    }
});

export default ControlledInput;
