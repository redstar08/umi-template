export const proxy = {
    '/example/api/v1': {
        target: 'http://example.com',
        changeOrigin: true,
    },
};
