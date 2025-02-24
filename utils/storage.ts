import AsyncStorage from '@react-native-async-storage/async-storage';


import {NOTES_LOCAL_STORAGE} from "@/constants";

export const storeDataInStorage = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error('Помилка при збереженні:', e);
    }
};

export const getDataInStorage = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.error('Помилка при отриманні:', e);
    }
};

export const removeDataInStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error('Помилка при видаленні:', e);
    }
};

export const saveLastCodeMoveToStorage = async (lastCodeMove: string) => {
    const notes = await getDataInStorage(NOTES_LOCAL_STORAGE) || '[]';
    const json = JSON.parse(notes) as string[];
    json.push(lastCodeMove);
    await storeDataInStorage(NOTES_LOCAL_STORAGE, JSON.stringify(json));
}
