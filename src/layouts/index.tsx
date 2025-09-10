import { useEffect, useMemo, useState } from 'react';
import 'animate.css';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { routes } from 'config';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import { IntlProvider } from 'react-intl';
import { history, Outlet, useLocation, useModel } from '@umijs/max';
import { getDarkAlgorithm, themeToken } from '@/constants';
import { ThemeEnum } from '@/constants/theme';
import { useImageError, useViewportCssVariables } from '@/hooks';
import { App } from '@/components';
import en_US from '../locales/en-US';
import zh_CN from '../locales/zh-CN';
import { Main } from './Main';

const messages = {
    'en-US': en_US,
    'zh-CN': zh_CN,
};

export default function Layouts() {
    const { pathname } = useLocation();

    const { lang, token } = useModel('global');
    const { theme, setTheme } = useModel('theme');
    const [locale, setLocale] = useState('zh-cn');
    dayjs.locale(locale);

    useImageError();

    useViewportCssVariables();

    useEffect(() => {
        setLocale(lang === 'zh-CN' ? 'zh-cn' : 'en');
    }, [lang]);

    const childeNode: React.ReactNode = <Main />;
    const appNode = <App>{childeNode}</App>;
    const currentAntdLocale = locale === 'zh-cn' ? zhCN : enUS;

    const currentThemeConfig = useMemo(() => {
        return {
            cssVar: true,
            hashed: false,
            token: themeToken[theme],
            // algorithm: getDarkAlgorithm(theme),
        };
    }, [theme]);

    return (
        <ConfigProvider locale={currentAntdLocale} theme={currentThemeConfig}>
            <IntlProvider locale={lang as any} messages={messages[lang as any]}>
                {appNode as any}
            </IntlProvider>
        </ConfigProvider>
    );
}
