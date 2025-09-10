import { useEffect } from 'react';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import { ThemeEnum } from '@/constants/theme';

export default () => {
    const [theme, setTheme] = useLocalStorageState<ThemeEnum>('theme', {
        defaultValue: ThemeEnum.light,
        serializer: (v) => v,
        deserializer: (v) => v as ThemeEnum,
    });

    // 全局监听 window 响应主题模式的切换
    const handleThemeChange = useMemoizedFn((e) => {
        if (e.matches) {
            setTheme(ThemeEnum.dark);
            document.documentElement.id = ThemeEnum.dark;
        } else {
            setTheme(ThemeEnum.light);
            document.documentElement.id = ThemeEnum.light;
        }
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        if (theme === ThemeEnum.system) {
            const currentTheme = mediaQuery?.matches ? ThemeEnum.dark : ThemeEnum.light;
            document.documentElement.id = currentTheme;
            setTheme(currentTheme);
            mediaQuery.addEventListener('change', handleThemeChange);
        } else {
            const currentTheme = theme === ThemeEnum.dark ? ThemeEnum.dark : ThemeEnum.light;
            document.documentElement.id = currentTheme;
            setTheme(currentTheme);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
        };
    }, [theme]);

    return { theme: theme || ThemeEnum.dark, setTheme };
};
