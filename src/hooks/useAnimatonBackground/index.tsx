import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';

export const useAnimatonBackground = (target: string | HTMLElement = '#root') => {
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    const update = useMemoizedFn(() => {
        vantaEffect?.resize();
    });

    useEffect(() => {
        window.addEventListener('resize', update);

        if (typeof VANTA === 'object' && target && !vantaEffect) {
            const effect = VANTA?.WAVES({
                el: target,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x111414,
            });
            setVantaEffect(effect);
        }

        return () => {
            window.removeEventListener('resize', update);
            vantaEffect?.destroy();
        };
    }, [target, vantaEffect]);
};
