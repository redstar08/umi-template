import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Images } from 'config';
import lottie from 'lottie-web';
import { useModel } from '@umijs/max';
import './index.less';

export interface PageLoadingProps {
    style?: React.CSSProperties;
    className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = (props) => {
    const { style, className } = props;

    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useModel('theme');

    useEffect(() => {
        lottie.loadAnimation({
            container: ref?.current as HTMLDivElement, // the dom element that will contain the animation
            loop: true,
            autoplay: true,
            path: Images['common-loading']?.[theme], // the path to the animation json
        });
    }, []);

    return (
        <div style={style} className={classNames('page-loading-content', className)}>
            <div className="loading-box" ref={ref}></div>
        </div>
    );
};
