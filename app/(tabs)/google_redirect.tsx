import * as React from 'react';
import {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {useGetUserRedirectQuery} from "@/services/endpoints/authEndpoints";
import {Text} from "@rneui/themed";

WebBrowser.maybeCompleteAuthSession();

export default function App() {

    const [searchParams, setSearchParams] = useState<string>('');

    const { data: iAuthResponse, isLoading, isError, isSuccess, error } = useGetUserRedirectQuery(searchParams, {
        skip: searchParams.length === 0,
    });

   // const authState = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const setUrlParams = async () => {
            const url = await Linking.getInitialURL();
            if (url) {
                const urlObj = new URL(url);
                console.log('searchParams', urlObj.search);
                setSearchParams(urlObj.search);
            }
        };
        setUrlParams();
    }, []);

    useEffect(() => {
        console.log('iAuthResponse', iAuthResponse);
    }, [iAuthResponse]);


    return (
        <>
            {isLoading && <Text>Loading...</Text>}
        </>
        // <Button
        //     title="Sign in with Google"
        //     disabled={!request}
        //     onPress={() => promptAsync()}
        // />
    );
}