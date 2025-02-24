import React from 'react';
import {useSignUpMutation} from '../../services/endpoints/authEndpoints';
import {Link, useRouter} from "expo-router";
import {Text} from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/forms/ControlledInput";
import SubmitButton from "@/components/forms/SubmitButton";
import {Route} from "@/shared/types";
import BlockAnotherRegister from "@/components/ui/BlockAnotherRegister";
import {handleFormSubmission} from "@/common";
import PasswordInput from "@/components/forms/PasswordInput";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {Linking, Platform} from "react-native";


const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    re_password: yup
        .string()
        .required("Repeat password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
}).required();

export interface SignUpValues {
    email: string;
    password: string;
    username: string;
}

export interface SignUpFormValues extends SignUpValues{
    re_password: string;
}

const SignUpScreen = () => {
    const [signUp, { isLoading, isError, isSuccess, error, reset }] = useSignUpMutation();
    const authState = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<SignUpFormValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
            defaultValues: {
                email: process.env.EXPO_PUBLIC_DEFAULT_AUTH_EMAIL as string,
                password: process.env.EXPO_PUBLIC_DEFAULT_AUTH_PASSWORD as string,
                re_password: process.env.EXPO_PUBLIC_DEFAULT_AUTH_PASSWORD as string,
                username: process.env.EXPO_PUBLIC_DEFAULT_AUTH_USERNAME as string,
            },
        }
    );

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data: SignUpFormValues) => {
        try {
            const { re_password, ...values} = data;
            const result = await handleFormSubmission(
                () => signUp(values).unwrap(),
                setError
            );

            if (result.status === 1) {
                if (Platform.OS === 'web') {
                    await Linking.openURL(result.redirectUrl)
                } else {
                    router.push(Route.Activate);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };


    // useEffect(() => {
    //     reset();
    //
    //     if (authState.isAuth) {
    //         // router.push(Route.ProfileInfo);
    //     }
    //
    // }, [reset, pathname]);

    return (
        <ThemeChangeProvider>
            <Text>Register</Text>
            {!authState.isAuth &&
                <>
                    <ControlledInput
                        control={control}
                        name="email"
                        placeholder="Email"
                        leftIcon={{type: 'material', name: 'email'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="username"
                        placeholder="Username"
                        leftIcon={{type: 'material', name: 'account-circle'}}
                        errors={errors}
                    />

                    <PasswordInput control={control} errors={errors} />
                    <PasswordInput control={control} errors={errors} name="re_password" placeholder="Repeat password" />

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Sign Up"
                        loadingText="Loading..."
                    />

                    <Text>Або</Text>
                    <BlockAnotherRegister />

                    <Link href={Route.SignUp}>
                        <Text>
                            New? Sign up - and start playing chess!
                        </Text>
                    </Link>
                </>
            }

            {authState.isAuth && <Text>Login successful!</Text>}
            {isError && <ErrorMessage error={error} />}
        </ThemeChangeProvider>
    );
};

export default SignUpScreen;