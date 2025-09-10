import { useState } from 'react';
import { useInfiniteScroll } from 'ahooks';
import { PaginationType, QueryParamsType, ScollListDataType } from './types';

export * from './types';

const defaultPagination: PaginationType = {
    pageSize: 20,
    currentPage: 1,
    total: 0,
};

const defaultQueryParams: QueryParamsType = {};

interface UseInfiniteScrollService {
    (queryParams: QueryParamsType & PaginationType): Promise<ScollListDataType>;
}

interface UseInfiniteScrollOptions {
    target?: React.RefObject<HTMLElement>;
    threshold?: number;
    manual?: boolean;
    initPagination?: PaginationType;
    initQueryParams?: QueryParamsType;
}

export const useInfiniteScrollTable = (service: UseInfiniteScrollService, options: UseInfiniteScrollOptions) => {
    const {
        target,
        threshold = 100,
        manual = false,
        initPagination = defaultPagination,
        initQueryParams = defaultQueryParams,
    } = options;

    const [queryParams, setQueryParams] = useState<QueryParamsType>(initQueryParams);

    const { data, loading, loadingMore, noMore, mutate, reload } = useInfiniteScroll(
        async (data) => {
            try {
                const current = data ? data.currentPage + 1 : initPagination.currentPage;
                const currentSize = data ? data.pageSize : initPagination.pageSize;
                const result = await service({ currentPage: current, pageSize: currentSize, ...queryParams });
                const list = result.list;
                const total = list.length ? result.total : initPagination.total;
                const pageSize = result.pageSize ?? initPagination.pageSize;

                return {
                    list,
                    total,
                    pageSize,
                    currentPage: current,
                };
            } catch (e) {
                return {
                    list: [],
                    ...initPagination,
                };
            }
        },

        {
            target,
            threshold,
            manual,
            reloadDeps: [queryParams],
            isNoMore: (data) => {
                const isNoMore = !(data && data?.list?.length < data?.total);
                return isNoMore;
            },
        },
    );

    return {
        queryParams,
        setQueryParams,
        dataSource: data?.list || [],
        data,
        loading,
        loadingMore,
        noMore,
        mutate,
        reload,
    };
};
