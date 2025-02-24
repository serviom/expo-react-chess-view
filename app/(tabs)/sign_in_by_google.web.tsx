import * as React from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '58619747345-7rqdfadgv4doo1osrbia3dc262rbq50k.apps.googleusercontent.com',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            console.log('Token:', response.authentication?.accessToken);
        }
    }, [response]);

    return (
        <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => promptAsync()}
        />
    );
}