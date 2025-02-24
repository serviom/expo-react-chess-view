import axios, { AxiosRequestConfig } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';



const axiosBaseQuery =
    ({
         baseUrl,
         prepareHeaders,
     }: {
        baseUrl?: string;
        prepareHeaders?: (headers: Headers, context: { getState: any }) => Promise<Headers>;
    }): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
        },
        unknown,
        unknown
    > =>
        async ({ url, method, data, params }, api) => {
            try {
                // Створюємо екземпляр заголовків
                const headers = new Headers();

                // Якщо передано `prepareHeaders`, викликаємо його
                if (prepareHeaders) {
                    await prepareHeaders(headers, { getState: api.getState });
                }

                // Конвертуємо `Headers` в об'єкт для Axios
                const headersObject: Record<string, string> = {};
                headers.forEach((value: any, key: any) => {
                    headersObject[key] = value;
                });

                // Виконуємо запит через Axios
                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: headersObject, // Додаємо підготовлені заголовки
                });

                return { data: result.data };
            } catch (axiosError) {
                const err = axiosError as any;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };

export default axiosBaseQuery;