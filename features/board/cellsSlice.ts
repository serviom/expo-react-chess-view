import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";


//const NUMBER_OF_CELLS = 8;

//const generateItems = () =>
// Array.from({ length:  NUMBER_OF_CELLS * NUMBER_OF_CELLS}, (_, index): IItem  => ({
//     id: index,
//     name: `Square ${index}`
//     // props: {
//     //     label: `Square ${index}`
//     // }
// }));

const cellsAdapter = createEntityAdapter(); // Створюємо адаптер

const cellsSlice = createSlice({
    name: "cells",
    initialState: cellsAdapter.getInitialState(),
    reducers: {
        setAllCells: cellsAdapter.setAll, // Добавляє всі елементи
        addCell: cellsAdapter.addOne, // Добавляє всі елементи
        // addCell: (state, action) => {
        //     console.log(action);
        //     //cellsAdapter.addOne(state, { id: action.payload.id, name: `Square ${action.payload.id}` });
        // },
        updateCell: cellsAdapter.updateOne, // Оновлює елемент
        removeCell: cellsAdapter.removeOne, // Видаляє елемент
    },
});

export const { addCell, updateCell, removeCell, setAllCells } = cellsSlice.actions;
export const { selectById, selectAll } = cellsAdapter.getSelectors(
    (state: any) => state.cells || cellsAdapter.getInitialState()
);
export default cellsSlice.reducer;
