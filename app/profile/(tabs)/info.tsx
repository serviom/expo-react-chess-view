import React from 'react';
import {useGetUserProfileQuery} from '../../../services/endpoints/authEndpoints';
import {View, Text} from "react-native";
import {Link} from "expo-router";
import {Route} from "@/shared/types";

const ProfileInfoScreen = () => {

    const {data, isLoading, isError, isSuccess, error } = useGetUserProfileQuery({});

    return (
        <View>

            <Link href={Route.Home}>
                Home
            </Link>

            <Text>
                {isLoading ? 'Loading...' : ''}
            </Text>
            <Text>
                {isSuccess ? JSON.stringify(data): <></>}
            </Text>

            {isError && error && (
                <Text>
                    {
                        typeof error === 'string' ? (
                            <> Error: {error}</>
                        ) : (
                            <> Error: {JSON.stringify(error)}</>
                        )
                    }
                </Text>
            )}

        </View>
    );
};

export default ProfileInfoScreen;