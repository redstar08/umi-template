import React, { useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Image } from 'antd';

export type ImageElementProps = Partial<
    Pick<
        React.ImgHTMLAttributes<HTMLImageElement>,
        | 'src'
        | 'crossOrigin'
        | 'decoding'
        | 'draggable'
        | 'loading'
        | 'referrerPolicy'
        | 'sizes'
        | 'srcSet'
        | 'useMap'
        | 'alt'
    >
>;

type ImagePreviewGroupPreview = Parameters<typeof Image.PreviewGroup>[0]['preview'];

export type PreviewGroupPreview = Exclude<ImagePreviewGroupPreview, boolean | undefined>;

const defaultPreview: PreviewGroupPreview = {
    visible: false,
    current: 0,
};

const IconStyle = {
    width: 30,
    height: 30,
    fontSize: 24,
};

export interface ImagePreviewRef {
    open: (data: ImagePreviewProps) => void;
    close: () => void;
}

export interface ImagePreviewProps extends PreviewGroupPreview {
    images?: ImageElementProps[];
}

export const ImagePreview = React.forwardRef<ImagePreviewRef, ImagePreviewProps>((props, ref) => {
    const [images, setImages] = useState<ImageElementProps[]>([]);
    const [preview, setPreview] = useState<PreviewGroupPreview>(defaultPreview);

    const open = useMemoizedFn((data) => {
        const { images, ...preview } = data;
        setImages(images);
        setPreview({
            ...preview,
            visible: true,
        });
    });

    const close = useMemoizedFn(() => {
        setImages([]);
        setPreview(defaultPreview);
    });

    const onChange = useMemoizedFn((current: number) => {
        setPreview({
            ...preview,
            current,
        });
    });

    const onVisibleChange = useMemoizedFn((value: boolean) => {
        setPreview({
            ...preview,
            visible: value,
        });
    });

    React.useImperativeHandle(ref, () => {
        return {
            open,
            close,
        };
    }, []);

    const previewProps = useMemo(() => {
        return {
            ...preview,
            destroyOnClose: true,
            onChange,
            onVisibleChange,
        };
    }, [preview]);

    return <Image.PreviewGroup items={images} preview={previewProps} />;
});
