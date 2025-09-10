export const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: './home',
    },
    {
        path: '*',
        component: './404',
    },
];
