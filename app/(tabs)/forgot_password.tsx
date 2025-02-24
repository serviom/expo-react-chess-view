import React, {useEffect} from 'react';
import {useForgotPasswordMutation, useSignInMutation} from '../../services/endpoints/authEndpoints';
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
import ErrorMessage from "@/components/ui/ErrorMessage";

const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
}).required();

export interface ForgotPasswordValues {
    email: string;
}

const ForgotScreen = () => {
    const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();
    const authState = useSelector((state: RootState) => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ForgotPasswordValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
            defaultValues: {
                email: process.env.EXPO_PUBLIC_DEFAULT_AUTH_EMAIL as string,
            },
        }
    );

    const onSubmit: SubmitHandler<ForgotPasswordValues> = async (data: ForgotPasswordValues) => {
        try {
            const result = await handleFormSubmission(
                () => forgotPassword(data).unwrap(),
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
            <Text>Forgot Password</Text>
            {!authState.isAuth &&
                <>
                    <ControlledInput
                        control={control}
                        name="email"
                        placeholder="Email"
                        leftIcon={{type: 'material', name: 'email'}}
                        errors={errors}
                    />

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Forgot Password"
                        loadingText="Loading..."
                    />

                    <Link href={Route.SignUp}>
                        <Text>
                            New? Sign up - and start playing chess!
                        </Text>
                    </Link>
                </>
            }
            {isError && <ErrorMessage error={error} />}
        </ThemeChangeProvider>
    );
};

export default ForgotScreen;