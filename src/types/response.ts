export type Response<T = any> = {
    code: string;
    msg: string;
    data: T;
};
