import { App as AntdApp } from 'antd';
import { useModel } from '@umijs/max';
import { MessagePlaceholder } from '../message';
import { ImagePreview } from '../Preview';

const antdAppConfig = {
    message: {
        maxCount: 3,
    },
    component: (({ children }) => children) as React.FC<{ children?: React.ReactNode }>,
};

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { imagePreviewRef } = useModel('global');

    return (
        <AntdApp {...antdAppConfig}>
            {children}
            <MessagePlaceholder />
            <ImagePreview ref={imagePreviewRef} />
        </AntdApp>
    );
};
