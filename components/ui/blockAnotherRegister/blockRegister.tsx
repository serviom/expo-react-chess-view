import React from "react";
import {Link} from "expo-router";
import {Text} from "@rneui/themed";
import {Href} from "expo-router/build/typed-routes/types";



interface RegisterProps {
    children?: React.ReactNode;
    text: string;
    url: Href;
}

const BlockRegister: React.FC<RegisterProps> = ({
        url,
        text,
        children
    }: RegisterProps) => {

    return (
        <Link href={url}>
            <Text>
                {text}
            </Text>
            {children}
        </Link>
    );
};

export default BlockRegister;