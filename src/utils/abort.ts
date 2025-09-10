export const abortControllerMap: Map<string, AbortController> = new Map();

export const cancelRequest = (url: string) => {
    const controller = abortControllerMap.get(url);

    if (controller) {
        controller.abort();
        abortControllerMap.delete(url);
    }
};
