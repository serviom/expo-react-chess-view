export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}.${month}.${day}`
}

export const getTimeInNumber = (): number => {
    return new Date().getTime();
}

export const roundTime = (time: number, step: number = 100): number => {
    return Math.round(time / step) * step;
}
