import DOMPurify from 'dompurify';
import { isArray } from 'lodash';
import { v4 as uuid } from 'uuid';
import { message } from '@/components';

export function copyToClipBoard(text: string, successMsg = 'Copy success') {
    const dom = document.createElement('textarea');
    dom.style.position = 'absolute';
    dom.style.left = '-9999px';
    dom.style.top = '-9999px';
    dom.style.background = 'transparent';
    document.body.appendChild(dom);
    dom.value = text;
    dom.select();
    document.execCommand('copy');
    document.body.removeChild(dom);

    message.success(successMsg);
}

export const emailRegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export function isEmail(email) {
    return emailRegExp.test(email);
}

export function isiPad() {
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K|iPad/.test(navigator.userAgent);
    const isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const isIPad = isMac && isTouchCapable;

    return isIPad;
}

export const isMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android|windows phone|blackberry|opera mini|iemobile|webos|mobile/i.test(userAgent);
};

export function preloadImages(imageUrls, callback) {
    const loadedImages: HTMLImageElement[] = [];
    let imagesToLoad = imageUrls.length;

    function imageLoaded() {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            callback(loadedImages);
        }
    }

    for (const imageUrl of imageUrls) {
        const image = new Image();
        image.onload = imageLoaded;
        image.src = imageUrl;
        loadedImages.push(image);
    }
}

export const uuidify = (list?: Array<any>) => {
    if (isArray(list)) {
        return list.map((item: any) => {
            return {
                uid: uuid(),
                ...item,
            };
        });
    }

    return [];
};

export const addHttpsPrefix = (url) => {
    let trimUrl = url?.trim();
    if (!trimUrl) return '';
    const URLRegex = /^(http|https):\/\//i;
    // 如果 URL 以 http:// 或 https:// 开头（忽略大小写），将前缀部分转换为小写
    if (URLRegex.test(trimUrl)) {
        return trimUrl.replace(URLRegex, (match) => match.toLowerCase());
    }
    // 如果没有前缀，则添加 https://
    return `https://${trimUrl}`;
};

export const lowerCaseUrl = (input) => {
    const url = addHttpsPrefix(input);
    try {
        const urlObj = new URL(url);
        return urlObj.href;
    } catch (error) {
        return url;
    }
};

// Source: https://stackoverflow.com/a/8234912/2013580
export const urlRegExp = new RegExp(
    /^(https?:)\/\/([a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+\.[a-z]{2,6}|\w+\.[a-z]{2,6})(:\d+)?(\/[^\s]*)?(?:\?[^\s]*)?(#[^\s]*)?$/,
);
export function isValidUrl(url: string, lowerCase = false): boolean {
    return lowerCase ? urlRegExp.test(lowerCaseUrl(url)) : urlRegExp.test(url);
}

// 检测设备类型
export function getDeviceType() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints;

    const isMac = /Macintosh|Mac OS X/.test(userAgent) && !/iPhone|iPad|iPod/.test(userAgent);
    const isIPad = /iPad/.test(userAgent) || (isMac && maxTouchPoints > 1); // iPad 特殊处理

    const screenWidth = window.innerWidth; // 获取屏幕宽度

    if (isIPad) {
        return 'iPad'; // 明确是 iPad 设备
    }
    if (isMac) {
        if (screenWidth > 1512) {
            return 'largeMac'; // 大屏幕的 Mac 设备
        }
        return 'smallMac'; // 小屏幕的 Mac 设备
    }
    if (screenWidth > 1512) {
        return 'large'; // 非 Mac 的大屏设备
    }
    if (screenWidth <= 1512) {
        return 'small'; // 非 Mac 的小屏设备
    }

    return 'unknown'; // 未知设备类型
}

export const defaultHtmlOptions = {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['span', 'br', 'p', 'strong'],
    ALLOWED_ATTR: ['class', 'data-*'],
};

export const getSafeContent = (content, options = {}) => {
    return DOMPurify.sanitize(content, {
        USE_PROFILES: { html: false },
        ...options,
    });
};

export function requestFullscreen(element?: HTMLElement | null): void {
    element = element ?? document.documentElement;

    if (!element) {
        return;
    }

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
        // Safari
        (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
        // IE/Edge 旧版
        (element as any).msRequestFullscreen();
    }
}

export function exitFullscreen(): void {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
        // Safari
        (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
        // IE/Edge 旧版
        (document as any).msExitFullscreen();
    }
}
