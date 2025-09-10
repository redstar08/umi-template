import { history, type RequestConfig } from '@umijs/max';
import { abortControllerMap } from '@/utils/abort';
import { message } from '@/components/message';
import './debug';

export const request: RequestConfig<{ code: string }> = {
    errorConfig: {
        errorHandler: (e: any) => {},
    },
    requestInterceptors: [
        (url, options) => {
            const token = localStorage.getItem('token');

            if (token) {
                options.headers = {
                    ...options.headers,
                    token,
                };
            }

            const controller = new AbortController();
            options.signal = controller.signal;
            abortControllerMap.set(url, controller);

            return { url, options };
        },
    ],
    responseInterceptors: [
        (response: any) => {
            const url = response.config?.url;
            abortControllerMap.delete(url);

            return response;
        },
    ],
};
