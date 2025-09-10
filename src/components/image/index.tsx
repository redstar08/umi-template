import React, { useEffect, useRef } from 'react';
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
    fallback?: ImagesNameType;
    lazy?: boolean;
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
        shape = 'square',
        fallback = 'common-empty-image',
        wrapperClassName,
        ...otherProps
    } = props;

    const { theme } = useModel('theme');
    const imageRef = useRef<HTMLImageElement>(null);
    const innerSrc = name ? Images?.[name]?.[theme] : lazy ? Images?.[fallback]?.[theme] : src;
    const dataSrc = !name && lazy ? src : void 0;

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

    if ((name && !Images[name]) || (!name && !src)) return null;

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
