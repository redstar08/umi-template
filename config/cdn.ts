export const cdn = {
    cdnUrl: '/',
};

// cdn地址
export const urlPath = () => {
    if (process.env.NODE_ENV === 'development') {
        return '/';
    } else {
        return cdn.cdnUrl;
    }
};
