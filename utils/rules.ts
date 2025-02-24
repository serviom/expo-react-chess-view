import type { Dayjs } from 'dayjs';

export const rules = {
    required: (message: string = "Обов'язкове поле") => ({
        required: true,
        message
    }),
    isDateAfter: (message: string) => () => ({
        validator(_: any, value: Dayjs) {
            if (value.isAfter(Date.now())) {
                return Promise.resolve()
            }
            return Promise.reject(new Error(message));
        }
    })
}