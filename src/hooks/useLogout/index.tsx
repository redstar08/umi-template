import { useMemoizedFn } from 'ahooks';
import { history } from '@umijs/max';

export const useLogout = () => {
    const logout = useMemoizedFn(async () => {
        localStorage.removeItem('token');
        sessionStorage.clear();
        history.push('/login');
    });

    return {
        logout,
    };
};
