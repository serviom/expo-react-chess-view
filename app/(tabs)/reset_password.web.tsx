import React, {useEffect, useState} from 'react';
import {
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useSignInMutation
} from '../../services/endpoints/authEndpoints';
import {useRouter, usePathname, Link } from "expo-router";
import {Route} from "@/shared/types";
import {Text} from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/forms/ControlledInput";
import SubmitButton from "@/components/forms/SubmitButton";
import {handleFormSubmission} from "@/common";
import { Linking } from 'react-native';
import PasswordInput from "@/components/forms/PasswordInput";
import ErrorMessage from "@/components/ui/ErrorMessage";

const schema = yup.object({
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    re_password: yup
        .string()
        .required("Repeat password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
}).required();

export interface ResetPasswordFormValues {
    password: string;
    re_password: string;
}

const ForgotScreen = () => {
    const [resetPassword, { isLoading, isError, error }] = useResetPasswordMutation();
    const authState = useSelector((state: RootState) => state.auth);

    const [params, setParams] = useState<{ changePasswordHash: string; email: string }>({
        changePasswordHash: '',
        email: '',
    });

    useEffect(() => {
        const getUrlParams = async () => {
            const url = await Linking.getInitialURL();
            if (url) {
                const urlObj = new URL(url);
                const searchParams = new URLSearchParams(urlObj.search);
                setParams({
                    changePasswordHash: searchParams.get("changePasswordHash") || "",
                    email: searchParams.get("email") || "",
                });
            }
        };

        getUrlParams();
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ResetPasswordFormValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
        }
    );

    const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data: ResetPasswordFormValues) => {
        try {

            const result = await handleFormSubmission(
                () => resetPassword({...data, ...params}).unwrap(),
                setError
            );

            if (result.status === 1) {
                await Linking.openURL(result.redirectUrl)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ThemeChangeProvider>
            <Text>Reset Password</Text>
            {!authState.isAuth &&
                <div className="reset-password-container">
                    <PasswordInput control={control} errors={errors} />
                    <PasswordInput control={control} errors={errors} name="re_password" placeholder="Repeat password" />

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Reset Password"
                        loadingText="Loading..."
                    />
                </div>
            }

            {isError && <ErrorMessage error={error} />}

        </ThemeChangeProvider>
    );
};

export default ForgotScreen;