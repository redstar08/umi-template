import React from 'react';
import classNames from 'classnames';
import { Image, ImageProps } from '@/components';
import './index.less';

interface AvatarProps extends ImageProps {
    size?: number;
    border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = (props) => {
    const {
        className,
        size,
        fallback = 'common-empty-avatar',
        border = true,
        shape = 'circle',
        fallbackholder = true,
        ...rest
    } = props;

    return (
        <Image
            {...rest}
            wrapperClassName={classNames('c-avatar-img', className, { border })}
            wrapper
            shape={shape}
            width={size}
            height={size}
            fallback={fallback}
            fallbackholder={fallbackholder}
        />
    );
};
