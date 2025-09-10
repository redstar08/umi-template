import { useEffect } from 'react';
import { useDebounceFn } from 'ahooks';
import { useModel } from '@umijs/max';

/**
 * Hook to set viewport-related CSS variables (--vh, --vw, --w-full, --h-full)
 */
export function useViewportCssVariables(debounceDelay = 100) {
    const { token } = useModel('global');

    // 更新 CSS 变量
    const { run: update, cancel } = useDebounceFn(
        () => {
            const vw = window.innerWidth * 0.01;
            const vh = window.innerHeight * 0.01;

            const root = document.documentElement;
            root.style.setProperty('overflow', 'hidden');
            root.style.setProperty('--vw', `${vw}px`);
            root.style.setProperty('--vh', `${vh}px`);
            root.style.setProperty('--w-full', `${vw * 100}px`);
            root.style.setProperty('--h-full', `${vh * 100}px`);

            // 100ms 后移除 overflow 属性，避免页面闪烁
            setTimeout(() => {
                root.style.removeProperty('overflow');
            }, 100);
        },
        {
            wait: 0,
            leading: true,
        },
    );

    useEffect(() => {
        // 绑定事件
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        update(); // 初始化调用一次

        // 卸载时移除监听
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
            cancel();
        };
    }, [token]);

    return { update }; // 如果需要，暴露出来供外部手动调用
}
