import React, { useEffect, useRef, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { Popover, type PopoverProps } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import classNames from 'classnames';
import { useModel } from '@umijs/max';

function isHTMLElement(node: Node | null): node is HTMLElement {
    return !!node && node.nodeType === Node.ELEMENT_NODE;
}

function getClosestElementFromRange(range?: Range): HTMLElement | null {
    if (!range) return null;
    const node = range.commonAncestorContainer;
    return isHTMLElement(node) ? node : node.parentElement;
}

export enum SelectionPopoverTrigger {
    Selection = 'selection',
    Click = 'click',
}

interface Position {
    top: number;
    left: number;
}

const defaultPosition: Position = {
    top: 0,
    left: 0,
};

const defaultIsTargetElement = (dom?: HTMLElement) => true;

export function computeAdjustedPosition(
    rect: DOMRect, // 触发元素
    size: [number, number], // popover 宽高
    placement: TooltipPlacement, // 位置
    gap: number = 10, // trigger 和 popover 的间距
): { top: number; left: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const [popoverWidth, popoverHeight] = size;

    const baseLeft = rect.left + scrollLeft;
    const baseTop = rect.top + scrollTop;
    const baseRight = rect.right + scrollLeft;
    const baseBottom = rect.bottom + scrollTop;

    let left = 0;
    let top = 0;

    switch (placement) {
        case 'topLeft':
            // popover 右下角 = trigger 左上角
            left = baseLeft - popoverWidth - gap;
            top = baseTop - popoverHeight - gap;
            break;
        case 'topRight':
            // popover 左下角 = trigger 右上角
            left = baseRight + gap;
            top = baseTop - popoverHeight - gap;
            break;
        case 'bottomLeft':
            // popover 右上角 = trigger 左下角
            left = baseLeft - popoverWidth - gap;
            top = baseBottom + gap;
            break;
        case 'bottomRight':
            // popover 左上角 = trigger 右下角
            left = baseRight + gap;
            top = baseBottom + gap;
            break;
    }

    // clamp 避免越界
    const viewportBottom = scrollTop + viewportHeight;
    left = Math.min(Math.max(left, scrollLeft), scrollLeft + viewportWidth - popoverWidth);
    top = Math.min(Math.max(top, scrollTop), viewportBottom - popoverHeight);

    return { top, left };
}

interface UseSelectionPopoverOptions {
    target?: string | HTMLElement | React.RefObject<HTMLElement> | (() => HTMLElement | null | undefined) | null;
    trigger?: SelectionPopoverTrigger;
    minTextLength?: number;
    debounceWait?: number;
    rootClassName?: string;
    popoverSize?: [number, number];
    placement?: TooltipPlacement;
    popoverContent?: React.ReactNode;
    positionThreshold?: number; // 位置变化阈值，避免微小变化导致的闪烁
    popoverProps?: PopoverProps;
    onStart?: (params: { dom?: HTMLElement | null; text?: string }) => void;
    isTargetElement?: (dom?: HTMLElement) => boolean;
}

export function useSelectionPopover(options: UseSelectionPopoverOptions = {}) {
    const {
        target,
        trigger = SelectionPopoverTrigger.Selection,
        minTextLength = 1,
        debounceWait = 100,
        rootClassName,
        popoverSize = [100, 100],
        placement = 'bottomRight',
        popoverContent,
        positionThreshold = 5,
        popoverProps,
        onStart,
        isTargetElement = defaultIsTargetElement,
    } = options;

    const { selectedTextRef, activeElementRef, selectionPopoverRef } = useModel('global');
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<Position>(defaultPosition);
    const lastPositionRef = useRef<Position>(defaultPosition);

    useEffect(() => {
        document.addEventListener('mouseup', onTrigger);

        return () => {
            document.removeEventListener('mouseup', onTrigger);
        };
    }, []);

    // 获取目标元素的辅助函数
    const getTargetElement = useMemoizedFn((): HTMLElement | null => {
        if (!target) return null;

        if (typeof target === 'string') {
            return document.querySelector(target);
        }

        if (target instanceof HTMLElement) {
            return target;
        }

        if (target && typeof target === 'object' && 'current' in target) {
            return target.current;
        }

        if (target && typeof target === 'function') {
            return target() || null;
        }

        return null;
    });

    // 检查位置变化是否超过阈值
    const shouldUpdatePosition = useMemoizedFn((newPosition: Position): boolean => {
        const lastPos = lastPositionRef.current;
        const deltaTop = Math.abs(newPosition.top - lastPos.top);
        const deltaLeft = Math.abs(newPosition.left - lastPos.left);
        return deltaTop > positionThreshold || deltaLeft > positionThreshold;
    });

    const { run: onSelection } = useDebounceFn(
        (e) => {
            try {
                const selection = window.getSelection();

                if (!selection || !selection.rangeCount) {
                    return;
                }

                // 限定区域（可选）
                const currentTarget = e.target;
                const targetElement = getTargetElement();
                const popupElement = selectionPopoverRef.current?.popupElement;
                // console.log('onClick -> e',  currentTarget, targetElement, popupElement,);

                if (popupElement?.contains(currentTarget)) {
                    return;
                }

                if (!targetElement?.contains(currentTarget) || !isTargetElement?.(currentTarget)) {
                    closePopover();
                    return;
                }

                const selectedText = selection.toString().trim();

                // 检查文本长度是否满足最小要求
                if (selectedText.length < minTextLength) {
                    closePopover();
                    return;
                }

                const range = selection.getRangeAt(0);
                const endRange = range.cloneRange();
                endRange.setStart(range.endContainer, range.endOffset - 1);
                endRange.setEnd(range.endContainer, range.endOffset);
                const rect = endRange.getBoundingClientRect();

                const newPosition = computeAdjustedPosition(rect, popoverSize, placement);

                // 只有当位置变化超过阈值时才更新位置，避免闪烁
                if (!visible || shouldUpdatePosition(newPosition)) {
                    setPosition(newPosition);
                    lastPositionRef.current = newPosition;
                }

                const dom = getClosestElementFromRange(range);

                setVisible(true);
                selectedTextRef.current = selectedText;
                activeElementRef.current = dom;
                onStart?.({ dom, text: selectedText });
            } catch (error) {
                console.error('Error handling selection:', error);
                closePopover();
            }
        },
        { wait: debounceWait },
    );

    const { run: onClick } = useDebounceFn(
        (e) => {
            try {
                const currentTarget = e.target;
                const targetElement = getTargetElement();
                const popupElement = selectionPopoverRef.current?.popupElement;
                // console.log('onClick -> e',  currentTarget, targetElement, popupElement,);

                if (popupElement?.contains(currentTarget)) {
                    return;
                }

                if (!targetElement?.contains(currentTarget) || !isTargetElement?.(currentTarget)) {
                    closePopover();
                    return;
                }

                const rect = currentTarget.getBoundingClientRect();
                const newPosition = computeAdjustedPosition(rect, popoverSize, placement);

                // 只有当位置变化超过阈值时才更新位置，避免闪烁
                if (!visible || shouldUpdatePosition(newPosition)) {
                    setPosition(newPosition);
                    lastPositionRef.current = newPosition;
                }

                setVisible(true);
                activeElementRef.current = currentTarget;
                onStart?.({ dom: currentTarget, text: currentTarget.textContent?.trim() });
            } catch (error) {
                console.error('Error handling click:', error);
                closePopover();
            }
        },
        { wait: debounceWait },
    );

    const onTrigger = useMemoizedFn((e) => {
        switch (trigger) {
            case SelectionPopoverTrigger.Selection:
                onSelection(e);
                break;
            case SelectionPopoverTrigger.Click:
                onClick(e);
                break;
        }
    });

    // 手动隐藏弹出框
    const closePopover = useMemoizedFn(() => {
        setVisible(false);
        lastPositionRef.current = defaultPosition;
        activeElementRef.current = null;
        selectedTextRef.current = '';
    });

    const popoverNode = (
        <Popover
            arrow={false}
            trigger={[]}
            placement={placement}
            {...popoverProps}
            rootClassName={classNames('c-selection-popover', rootClassName)}
            open={visible}
            ref={selectionPopoverRef}
            styles={{
                root: {
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    width: 0,
                    height: 0,
                },
            }}
            content={popoverContent}
        />
    );

    return {
        visible,
        position,
        setVisible,
        closePopover,
        popoverNode,
    };
}
