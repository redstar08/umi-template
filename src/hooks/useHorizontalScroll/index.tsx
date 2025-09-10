import { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { isiPad } from '@/utils';

const isInIpad = isiPad();

const on = function (
    element: { addEventListener: (arg0: any, arg1: any, arg2: boolean) => void },
    event: any,
    handler: any,
) {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
};

const off = function (
    element: { removeEventListener: (arg0: any, arg1: any, arg2: boolean) => void },
    event: any,
    handler: any,
) {
    if (element && event) {
        element.removeEventListener(event, handler, false);
    }
};

const defaultCoord = {
    x: 0,
    y: 0,
    isDown: false,
    isMoved: false,
};

export const useHorizontalScroll = (scrollRef: React.RefObject<HTMLElement>) => {
    const coordRef = useRef(defaultCoord);

    const scrollMousedown = useMemoizedFn((event: { pageX: number; pageY: number }) => {
        coordRef.current.isDown = true;
        coordRef.current.isMoved = false;
        coordRef.current.x = event.pageX;
        coordRef.current.y = event.pageY;
    });

    const scrollMouseup = useMemoizedFn(() => {
        coordRef.current.isDown = false;
        coordRef.current.x = 0;
        coordRef.current.y = 0;
    });

    const scrollMousemove = useMemoizedFn((event: { pageX: number }) => {
        const el = scrollRef.current as any;
        const movX = coordRef.current.x - event.pageX;
        coordRef.current.x = event.pageX;
        if (coordRef.current.isDown) {
            el.scrollLeft = el.scrollLeft + movX;
            coordRef.current.isMoved = true;
        }
    });

    useEffect(() => {
        const el = scrollRef.current as any;

        if (el && !isInIpad) {
            on(el, 'mousedown', scrollMousedown);
            on(document, 'mouseup', scrollMouseup);
            on(el, 'mousemove', scrollMousemove);
        }

        return () => {
            if (el && !isInIpad) {
                off(el, 'mousedown', scrollMousedown);
                off(document, 'mouseup', scrollMouseup);
                off(el, 'mousemove', scrollMousemove);

                coordRef.current = defaultCoord;
            }
        };
    }, []);

    return {
        coordRef,
    };
};
