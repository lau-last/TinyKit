import LocalStorageManager from "./local_storage.js";

export default class KeepScrollViewManager {

    init() {
        this.keepScrollInit();
        this.bindEvents();
    };

    private keepScrollInit() {
        const keepScroll = document.querySelectorAll('[data-action="keep-scroll-view"]');
        if (keepScroll.length === 0) return;

        keepScroll.forEach((element: HTMLElement) => {
            this.handleScrollElement(element);
        });
    };

    handleScrollElement(element: HTMLElement) {
        if (!element || element.tagName === 'BODY') return;
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

    private restoreScrollPosition() {
        const keepScroll = document.querySelectorAll('[data-action="keep-scroll-view"]');
        if (keepScroll.length === 0) return;

        keepScroll.forEach((element: HTMLElement) => {
            const scrollY = LocalStorageManager.getState('tiny_kit_keep-scroll-view', element.id);
            if (!scrollY) return;
            if (typeof scrollY === "string") {
                element.scrollTop = parseInt(scrollY);
            }
        });
    };

    private bindEvents() {
        window.addEventListener('load', () => {
            this.restoreScrollPosition();
        });
    };

}