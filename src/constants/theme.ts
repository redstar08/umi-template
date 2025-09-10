import { theme as AntdTheme } from 'antd';

export enum ThemeEnum {
    system = 'system',
    dark = 'dark',
    light = 'light',
}

export const themeToken = {
    [ThemeEnum.light]: {},
    [ThemeEnum.dark]: {
        colorTextBase: '#ffffff',
        colorBgBase: '#000000',
        borderRadius: 10,
    },
};

export const getDarkAlgorithm = (theme: string) => {
    return function (seedToken, mapToken) {
        const darkToken = AntdTheme.darkAlgorithm(seedToken, mapToken);

        return {
            ...darkToken,
            ...themeToken[theme],
        };
    };
};
