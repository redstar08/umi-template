import { useEffect, useRef, useState } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Button } from 'antd';
import { exitFullscreen, requestFullscreen } from '@/utils';
import './index.less';

export const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = useMemoizedFn(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            requestFullscreen(fullscreenRef.current);
        }
    });

    const handleFullscreenChange = useMemoizedFn(() => {
        setIsFullscreen(document.fullscreenElement !== null);
    });

    useEffect(() => {
        window.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const placeholderNode = (
        <Button
            type="text"
            className="c-fullscreen-btn"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
        >
            {isFullscreen ? '退出全屏' : '全屏'}
        </Button>
    );

    return { fullscreenRef, isFullscreen, setIsFullscreen, toggleFullscreen, placeholderNode };
};
