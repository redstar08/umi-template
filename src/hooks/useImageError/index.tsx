import { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Images } from 'config';
import { useModel } from '@umijs/max';
import { ImageObserver } from '@/utils/image';

export const useImageError = () => {
    const { theme } = useModel('theme');

    const onImgError = useMemoizedFn((e) => {
        const image = e?.target as HTMLImageElement;
        if (image?.tagName === 'IMG' && image.dataset.error !== 'true') {
            const defaultUrl = Images['common-empty-image']?.[theme];
            const fallback = image.dataset.fallback as string;
            const fallbackUrl = Images[fallback]?.[theme] || defaultUrl;

            if (fallbackUrl && image.src !== fallbackUrl) {
                image.src = fallbackUrl;
                image.style['object-fit'] = 'cover';
                image.dataset.error = 'true';
            }
        }
    });

    useEffect(() => {
        window.addEventListener('error', onImgError, true);

        return () => {
            window.removeEventListener('error', onImgError, true);
            ImageObserver.disconnect();
        };
    }, []);

    return {
        onImgError,
    };
};
