import React, {FC, useEffect, useRef} from "react";
import {moveTree} from "../Notice";
import {StyleSheet, TouchableOpacity, Text, ViewStyle, StyleProp, View} from "react-native";


import {PlayerTypes} from "@/constants";
import {Player} from "@/types";

interface NoticeMoveProps {
    object: moveTree
    analysisCurrentMove: (step: number) => boolean;
    goToAnalysisStep: (step: number) => void;
    prevColor: Player
}


const styles = StyleSheet.create({
    current: {
        fontWeight: 'bold',
        color: 'darkgoldenrod'
    },
    defaultStyle: {
        backgroundColor: "transparent",
    }
});

const getStyle = (isActive: boolean) => {
    return isActive ? styles.current : styles.defaultStyle;
};

export const NoticeMove: FC<NoticeMoveProps> = ({object, analysisCurrentMove, goToAnalysisStep, prevColor}) => {

    return (
        <React.Fragment key={'notice-fragment' + object.id}>
            {
                (object.deep) % 2 !== 0 ? (<Text style={{fontWeight: 'bold'}}> {Math.ceil((object.deep) / 2) + '. '}</Text>) : <></>
            }
            {
                (object.color === prevColor && object.color === PlayerTypes.BLACK) ? <Text>...</Text> : <Text></Text>
            }

            <TouchableOpacity  onPress={() => {
                goToAnalysisStep(object.id)
            }} key={'notice' + object.id}>
                <Text style={getStyle(analysisCurrentMove(object.id))}>{object.value + ' '}</Text>
            </TouchableOpacity>

            {
                object.children !== null && (
                    object.children.map((o, i) => (
                        <React.Fragment key={'wrap-fragment-object-' + o.id}>

                        {
                            (i === 0 && o.index > 0 && object.color === PlayerTypes.WHITE && o.color === PlayerTypes.BLACK) ? <Text>{'...'}</Text> : <></>
                        }

                        {
                            i === 0 && o.index > 0 && <View style={{ height: 10 }} />
                        }

                        {
                            o.index > 0 && <View className={'inner-notice-block'}  key={'inner-notice-block' + o.id}>
                                {
                                    ( object.color === PlayerTypes.WHITE ?
                                        <React.Fragment key={'fragment-deep-1' + o.id}>
                                            <Text><Text style={{fontWeight: 'bold'}}>{Math.ceil((object.deep) / 2) + '. '}</Text>{'...   '}</Text>
                                        </React.Fragment>
                                      : <></>)
                                }
                                <NoticeMove prevColor={object.color} key={'notice-move-1' + o.id} object={o}
                                            analysisCurrentMove={analysisCurrentMove} goToAnalysisStep={goToAnalysisStep} />
                            </View>
                        }

                        {
                            o.index === 0 && i > 0 && o.color === PlayerTypes.BLACK &&
                            ( object.color === PlayerTypes.WHITE ?
                                <React.Fragment key={'fragment-deep-2' + o.id}>
                                    <Text><Text style={{fontWeight: 'bold'}}>{Math.ceil((object.deep) / 2) + '. '}</Text>{'...   '}</Text>
                                </React.Fragment>
                            : <></>)
                        }
                        {
                            o.index === 0 &&
                            <NoticeMove prevColor={object.color} key={'notice-move-2' + o.id} object={o} analysisCurrentMove={analysisCurrentMove} goToAnalysisStep={goToAnalysisStep} />
                        }

                        </React.Fragment>
                    ))
                )
            }
        </React.Fragment>
    )
}