/**
 * @description antd table hook
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PaginationProps, TableProps } from 'antd';
import { GetRowKey } from 'antd/es/table/interface';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { BoxLoading, Empty } from '@/components';
import './index.less';

const defaultPagination = {
    total: 0,
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
};

const autoFetchActions = ['paginate', 'sort'];

interface LocalOptions<ResultItem> {
    rowKey?: string | GetRowKey<ResultItem>;
    manual?: boolean;
    formatResult?: (
        res: any,
        params: any,
    ) => { list: ResultItem[]; total: number; current?: number; pageSize?: number };
    initPagination?: PaginationProps;
}

const defaultOption: LocalOptions<any> = {
    rowKey: 'id',
    manual: false,
    initPagination: defaultPagination,
    formatResult: (res, params) => {
        const { list, current, pageSize, total } = res || {};
        return { list, current, pageSize, total };
    },
};

/**
 * @param service 列表接口
 * @param initTableParams 列表接口筛选用参数
 * @param options 自定义配置
 */
export function useTable<TableParams = any, ResultItem = any>(
    service: (params: {
        current: number;
        pageSize: number;
        sorter: any;
        [key: string]: any;
    }) => Promise<{ total: number; list: ResultItem[] }>,
    initTableParams?: TableParams,
    options?: LocalOptions<ResultItem>,
) {
    const intl = useIntl();
    const mergedOptions = options ? { ...defaultOption, ...options } : defaultOption;

    const { formatResult, initPagination, rowKey, manual } = mergedOptions;

    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(initPagination);
    const [tableParams, setTableParams] = useState<TableParams | undefined>(initTableParams);
    const [dataSource, setDataSource] = useState<ResultItem[]>([]);

    const fetchPromiseRef = useRef(Promise.resolve());
    const isMountedRef = useRef(false);

    const forceFetch = () => {
        fetchData(pagination);
    };

    const fetchData = async ({ current, pageSize, sorter = {} }: any) => {
        try {
            setLoading(true);
            const params = { ...tableParams, current, pageSize, sorter };
            const result = await service(params);
            const { list, total } = formatResult?.(result, params) || result;

            if (current === 1 || (current > 1 && list?.length)) {
                setDataSource(list || []);
                setPagination({
                    ...pagination,
                    current,
                    pageSize,
                    total: total || 0,
                });
            } else {
                return fetchData({ current: 1, pageSize, sorter });
            }
        } catch (error) {
            console.log('useTable -> error', error);
        } finally {
            setLoading(false);
        }
    };

    const onTableChange: TableProps<any>['onChange'] = (...args) => {
        const [pagination, filters, sorter, extra] = args;

        if (isEmpty(extra) || autoFetchActions.includes(extra.action)) {
            fetchData({ ...pagination, sorter });
        }
    };

    const fetchPromise = () => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            if (manual) return;
        }

        fetchPromiseRef.current = fetchPromiseRef.current.then(() => fetchData({ ...pagination, current: 1 }));
    };

    useEffect(() => {
        fetchPromise();
    }, [tableParams]);

    const localePagination = useMemo(() => {
        return {
            ...pagination,
            locale: {
                items_per_page: intl.formatMessage({ id: 'common-table-page' }),
            },
        };
    }, [pagination, intl]);

    return {
        loading,
        pagination: localePagination,
        setPagination,
        dataSource,
        setDataSource,
        tableParams,
        setTableParams,
        onTableChange,
        forceFetch,
        defaultTableProps: {
            rowKey,
            loading: {
                spinning: loading,
                indicator: <BoxLoading />,
            },
            pagination: localePagination,
            dataSource,
            onChange: onTableChange,
            locale: {
                emptyText: <Empty className="use-table-empty" />,
            },
        },
    };
}

export default useTable;
