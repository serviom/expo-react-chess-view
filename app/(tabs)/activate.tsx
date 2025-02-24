import React, {useEffect} from 'react';
import {useActivateMutation} from '../../services/endpoints/authEndpoints';
import {Link, useRouter} from "expo-router";
import {Route} from "@/shared/types";
import {Text} from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/forms/ControlledInput";
import SubmitButton from "@/components/forms/SubmitButton";
import {handleFormSubmission} from "@/common";
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

const ActivateScreen = () => {
    const router = useRouter();
    const [activate, { isLoading, isError, isSuccess, error, reset }] = useActivateMutation();
    const authState = useSelector((state: RootState) => state.auth);

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
                        leftIcon={{type: 'material', name: 'hashtag'}}
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

export default ActivateScreen;