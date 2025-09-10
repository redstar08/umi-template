import { useRef, useState } from 'react';
import { useLocalStorageState } from 'ahooks';
import { ImagePreviewRef } from '@/components/Preview';

export default () => {
    const [token, setToken] = useLocalStorageState('token', {
        defaultValue: '',
        serializer: (v) => v ?? '',
        deserializer: (v) => v,
    });

    const [pageLoading, setPageLoading] = useState<boolean>(false);

    const [lang, setLang] = useLocalStorageState('lang', {
        defaultValue: localStorage.getItem('lang') || 'zh-CN',
    });

    const imagePreviewRef = useRef<ImagePreviewRef>(null);
    const activeElementRef = useRef<HTMLElement | null>(null);

    return {
        token,
        setToken,
        pageLoading,
        setPageLoading,
        lang,
        setLang,
        imagePreviewRef,
        activeElementRef,
    };
};
