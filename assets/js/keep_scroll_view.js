import LocalStorageManager from "./local_storage.js";
export default class KeepScrollViewManager {
    init() {
        this.keepScrollInit();
        this.bindEvents();
    }
    ;
    keepScrollInit() {
        const keepScroll = document.querySelectorAll('[data-action="keep-scroll-view"]');
        if (keepScroll.length === 0)
            return;
        keepScroll.forEach((element) => {
            this.handleScrollElement(element);
        });
    }
    ;
    handleScrollElement(element) {
        if (!element || element.tagName === 'BODY')
            return;
        element.addEventListener('scroll', () => {
            const scrollY = element.scrollTop;
            LocalStorageManager.setState('tiny_kit_keep-scroll-view', element.id, scrollY.toString());
        });
    }
    // handleScrollBody(element: HTMLElement) {
    //     if (!element || element.tagName !== 'BODY') return;
    //     window.addEventListener('scroll', () => {
    //         const scrollY = window.scrollY;
    //         localStorage.setItem('menuScrollY', scrollY.toString());
    //     });
    // }
    restoreScrollPosition() {
        const keepScroll = document.querySelectorAll('[data-action="keep-scroll-view"]');
        if (keepScroll.length === 0)
            return;
        keepScroll.forEach((element) => {
            const scrollY = LocalStorageManager.getState('tiny_kit_keep-scroll-view', element.id);
            if (!scrollY)
                return;
            if (typeof scrollY === "string") {
                element.scrollTop = parseInt(scrollY);
            }
        });
    }
    ;
    bindEvents() {
        window.addEventListener('load', () => {
            this.restoreScrollPosition();
        });
    }
    ;
}
