import React, { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Images, type ImagesNameType } from 'config';
import { useModel } from '@umijs/max';
import { ImageObserver } from '@/utils/image';
import './index.less';

export interface ImageProps extends React.ImgHTMLAttributes<any> {
    className?: string;
    style?: React.CSSProperties;
    src?: string;
    name?: ImagesNameType;
    fallback?: ImagesNameType | 'xhs-posts';
    lazy?: boolean;
    fallbackholder?: boolean;
    shape?: 'circle' | 'square' | 'radius';
    wrapper?: boolean;
    wrapperClassName?: string;
    onClick?: (e) => void;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const {
        className,
        style,
        name = '',
        src,
        width,
        height,
        lazy = true,
        wrapper = false,
        fallbackholder = false,
        shape = 'square',
        fallback = 'common-empty-image',
        wrapperClassName,
        ...otherProps
    } = props;

    const { theme } = useModel('theme');
    const imageRef = useRef<HTMLImageElement>(null);
    const dataSrc = !name && lazy ? src : void 0;

    const innerSrc = useMemo(() => {
        if (name) {
            return Images?.[name]?.[theme];
        }

        const fallbackSrc = Images[fallback]?.[theme];

        if (lazy && imageRef.current?.src !== src) {
            return fallbackSrc;
        }

        return src || fallbackSrc;
    }, [name, lazy, fallback, src, theme]);

    React.useImperativeHandle(ref, () => imageRef.current as HTMLImageElement, [imageRef.current]);

    useEffect(() => {
        const shouldObserve = imageRef.current && lazy && dataSrc;

        if (shouldObserve) {
            ImageObserver.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                ImageObserver.unobserve(imageRef.current);
            }
        };
    }, [imageRef.current, lazy, dataSrc]);

    if ((name && !Images[name]) || (!name && !src && !fallbackholder)) return null;

    const imageNode = (
        <img
            {...otherProps}
            ref={imageRef}
            style={{ ...style, width, height }}
            className={classNames(className, 'c-image', shape)}
            data-src={dataSrc}
            data-fallback={fallback}
            src={innerSrc}
            loading="lazy"
            referrerPolicy="no-referrer"
        />
    );

    return wrapper ? (
        <span className={classNames('c-image-wrapper', wrapperClassName, shape)}>{imageNode}</span>
    ) : (
        imageNode
    );
});
