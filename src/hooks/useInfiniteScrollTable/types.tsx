export interface QueryOrderType {
    column: string;
    asc: boolean;
}

export interface PaginationType {
    pageSize?: number;
    currentPage?: number;
    total?: number;
}

export interface QueryParamsType {
    orders?: Array<QueryOrderType>;
    [key: string]: any;
}

export interface ScollListParamsType extends PaginationType, QueryParamsType {}

export interface ScollListDataType {
    list: any[];
    total: number;
    pageSize?: number;
    currentPage?: number;
    [key: string]: any;
}
