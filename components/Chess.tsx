import React, {FC} from 'react';
import BoardComponent from "./BoardComponent";
import Notice from "./Notice";
import {Text, View} from "react-native";
import Control from "@/components/Control/Control";
import {PlayerTypes} from "@/constants";
import LostFigures from "@/components/LostFigures";
import Timer from "@/components/Control/includes/Timer";


const Chess: FC = () => {

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <View style={{ width: "100%" }}>
                <Notice />
            </View>
            <View>
                <View>
                    <Timer />
                </View>
                <View>
                   <LostFigures
                        player={PlayerTypes.WHITE}
                    />
                </View>
                <View>
                    <BoardComponent />
                </View>
                <View>
                    <LostFigures
                        player={PlayerTypes.BLACK}
                    />
                </View>
                <View>
                    <Control/>
                </View>
            </View>
        </View>
    );
};

export default Chess;