import React from "react";
import {Link} from "expo-router";
import {Text} from "@rneui/themed";
import {Href} from "expo-router/build/typed-routes/types";


interface BlockProps {
    children?: React.ReactNode;
    text: string;
    url: Href;
}

const BlockEnter: React.FC<BlockProps> = ({
        url,
        children,
        text,
    }: BlockProps) => {

    return (
        <Link href={url}>
            <Text>
                {text}
            </Text>
            {children}
        </Link>
    );
};

export default BlockEnter;