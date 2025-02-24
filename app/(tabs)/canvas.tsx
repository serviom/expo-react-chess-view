import React, {useEffect} from 'react';
import  Canvas, {Image as CanvasImage } from 'react-native-canvas';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {View, Text} from "react-native";
import {useSelector} from "react-redux";
import {addCell, setAllCells, selectAll, updateCell} from "../../features/board/cellsSlice";
import {useAppDispatch} from "@/features/store";
import {Button} from "@rneui/themed";
import GridComponent from "@/components/GridComponent";
import {IItem} from "../../components/ItemComponent";


const generateItems = () =>
    Array.from({ length: 4 }, (_, index): IItem  => ({
        id: index,
        name: `Square ${index}`
        // props: {
        //     label: `Square ${index}`
        // }
    }));


const CanvasScreen = () => {

    // const components = {


    const dispatch = useAppDispatch();

    const cells = useSelector(selectAll);

    const handleCanvas = (canvas: any) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'purple';
        ctx.fillRect(0, 0, 100, 100);

        const img = new CanvasImage(canvas);
        img.src = '@/assets/black-rook.png';


        img.addEventListener('load', () => {
            console.log('Canvas screen');
            ctx.drawImage(img, 50, 50, 100, 100);
        });
    };


    const handleAddItem = () => {
        const newId = Object.keys(cells).length; // Генеруємо новий ID
        dispatch(addCell({ id: newId, name: 'asfasdf' } as IItem));
    };


    const updateItem = () => {
        dispatch(updateCell( {id: 1, changes: { name: 'Updated Name'}}));
    }

    const updateItem2 = () => {
        dispatch(updateCell( {id: 2, changes: { name: 'Updated Name'}}));
    }

    useEffect(() => {
        dispatch(setAllCells(generateItems())); // Заповнюємо store
    }, [dispatch]);

    return (
        <ThemeChangeProvider>
            <View>
                <Canvas ref={handleCanvas}/>
            </View>
            <View>
                <Button onPress={handleAddItem}>Додати новий елемент</Button>
                <Button onPress={updateItem}>Обновити елемент</Button>
                <Button onPress={updateItem2}>Обновити2 елемент</Button>
                <GridComponent />
            </View>
        </ThemeChangeProvider>
    );
};

export default CanvasScreen;