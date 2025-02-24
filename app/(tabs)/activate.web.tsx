import React, {useEffect, useState} from 'react';
import {useActivateMutation, useSignInMutation} from '../../services/endpoints/authEndpoints';
import {useRouter, usePathname, Link } from "expo-router";
import {Route} from "@/shared/types";
import {Text} from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import { useForm, SubmitHandler, Controller  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/forms/ControlledInput";
import SubmitButton from "@/components/forms/SubmitButton";
import BlockAnotherEnter from "@/components/ui/BlockAnotherEnter";
import {handleFormSubmission} from "@/common";
import PasswordInput from "@/components/forms/PasswordInput";
import {Linking, Platform, View} from "react-native";
import ErrorMessage from "@/components/ui/ErrorMessage";

const schema = yup.object({
    hash: yup
        .string()
        .min(30, "Password must be at least 6 characters")
        .required("Hash is required"),
}).required();

export interface ActivateFormValues {
    hash: string;
}

const SignInScreen = () => {
    const router = useRouter();
    const [activate, { isLoading, isError, isSuccess, error, reset }] = useActivateMutation();
    const authState = useSelector((state: RootState) => state.auth);

    // const [params, setParams] = useState<{ hash: string }>({
    //     hash: '',
    // });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<ActivateFormValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
        }
    );

    useEffect(() => {
        const getUrlParams = async () => {
            const url = await Linking.getInitialURL();
            if (url) {
                const urlObj = new URL(url);
                const searchParams = new URLSearchParams(urlObj.search);
                setValue('hash', searchParams.get("hash") || "")
                // setParams({
                //     hash: searchParams.get("hash") || "",
                // });
            }
        };
        getUrlParams();
    }, []);


    const onSubmit: SubmitHandler<ActivateFormValues> = async (data: ActivateFormValues) => {
          try {
            const result = await handleFormSubmission(
                () => activate(data).unwrap(),
                setError
            );

            if (result.status === 1) {
                if (Platform.OS === 'web') {
                    await Linking.openURL(result.redirectUrl)
                } else {
                    router.push(Route.SignIn);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ThemeChangeProvider>
            {!authState.isAuth &&
                <>
                    <View>
                        <Text>Activate own account</Text>
                    </View>

                    <ControlledInput
                        control={control}
                        name="hash"
                        placeholder={"Hash"}
                        errors={errors}
                    />

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Activate"
                        loadingText="Loading..."
                    />

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

export default SignInScreen;