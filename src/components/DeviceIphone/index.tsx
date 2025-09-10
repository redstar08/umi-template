import React from 'react';
import classNames from 'classnames';
import './index.less';

interface DeviceIphoneProps {
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
}

export const DeviceIphone: React.FC<DeviceIphoneProps> = (props) => {
    const { style, className, children } = props;

    return (
        <div style={style} className={classNames('marvel-device iphone-x', className)}>
            <div className="notch">
                <div className="camera"></div>
                <div className="speaker"></div>
            </div>
            <div className="sleep"></div>
            <div className="volume"></div>
            <div className="screen">{children}</div>
        </div>
    );
};
