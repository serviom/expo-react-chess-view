import React, { useState } from "react";
import { Icon } from "@rneui/themed";
import ControlledInput from "@/components/forms/ControlledInput";

interface PasswordInputProps {
    control: any;
    name?: string;
    placeholder?: string;
    errors: Record<string, any>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
         control,
         name="password",
         placeholder="Password",
         errors,
     }: PasswordInputProps) => {

    const [isSecure, setIsSecure] = useState(true);

    const toggleSecureEntry = () => setIsSecure((prev) => !prev);

    return (
        <ControlledInput
            control={control}
            name={name}
            placeholder={placeholder}
            secureTextEntry={isSecure}
            leftIcon={{type: 'material', name: 'lock'}}
            errors={errors}
            rightIcon={
                <Icon
                    type="material"
                    name={isSecure ? "visibility-off" : "visibility"} // Іконки для показу/приховування
                    onPress={toggleSecureEntry}
                    size={24}
                    color="gray"
                />
            }
        />
    );
};

export default PasswordInput;
