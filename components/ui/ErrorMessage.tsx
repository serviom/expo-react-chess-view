import React from "react";
import { Text } from "@rneui/themed";

interface ErrorMessageProps {
    error: unknown;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;

    return (
        <Text>
            {typeof error === "string" ? (
                <Text> Error: {error}</Text>
            ) : (
                <Text> Error: {JSON.stringify(error)}</Text>
            )}
        </Text>
    );
};

export default ErrorMessage;
