import LocalStorageManager from "./local_storage.js";
import BurgerManager from "./burger.js";

export default class NavbarSideManager {
    init(): void {
        this.initSideNavbar();
    };

    initSideNavbar(): void {
        this.setFallbackDisplay();
        this.onlyOneSideBarOpenInLocalStorage();
        this.initSidebarStates();
        this.handleOpenButton();
        this.handleCloseButton();
    };


    // Set display none to sidebar content if it don't have data-mode attribute
    private setFallbackDisplay(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-sidebar"]');

        buttons.forEach(button => {
            const targetSelector = button.getAttribute('data-target');
            if (!targetSelector) return;

            const content = document.querySelector<HTMLElement>(targetSelector);
            if (!content) return;

            const mode = content.dataset.mode;
            const position = content.dataset.position;

            const isValidMode = mode === 'overlay' || mode === 'push';
            const isValidPosition = position === 'start' || position === 'end';

            if (!isValidMode || !isValidPosition) {
                content.style.display = 'none';
            }
        });
    }


    // Init sidebar states from local storage
    private initSidebarStates(): void {
        const states = LocalStorageManager.getStates('tiny_kit_sidebar_state');
        const body = document.body;
        const contents: HTMLElement[] = [];

        body.style.transition = 'none';

        for (const sidebar in states) {
            if (states[sidebar] === 'open') {
                const content = document.getElementById(sidebar);
                if (!content) continue;
                content.style.transition = 'none';
                contents.push(content);
                this.handleToggleClass(content);
                this.handlePushMode(content);
                BurgerManager.updateBurger(sidebar, 'sidebar');
            }
        }

        void body.offsetWidth; // Trigger reflowxx
        body.style.transition = '';
        contents.forEach(content => {
            content.style.transition = '';
        });
    };


    // Set state of sidebar in local storage
    private handleStateOfSidebar(content: HTMLElement): void {
        if (!content) return;
        const state = (content.classList.contains('show-aside-start') || content.classList.contains('show-aside-end'))
            ? 'open'
            : 'closed';

        LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, state);
    };


    // Remove class from other sidebar (close other sidebar)
    private removeClass(currentButton: Element): void {
        const openButtons = document.querySelectorAll('[data-action="toggle-sidebar"]');
        if (!openButtons) return;

        openButtons.forEach(button => {
            if (button !== currentButton) {
                const target = button.getAttribute('data-target');
                if (!target) return;
                const content = document.querySelector<HTMLElement>(target);
                if (!content) return
                LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, 'closed');
                button.classList.remove('animate-burger');
                content.classList.remove('show-aside-start');
                content.classList.remove('show-aside-end');
                document.body.style.marginLeft = '0';
                document.body.style.marginRight = '0';
            }
        });
    };

    // Open sidebar with event listener (click)
    private handleOpenButton(): void {
        const openButtons = document.querySelectorAll('[data-action="toggle-sidebar"]');
        if (!openButtons) return;

        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (!target) return;
                const content = document.querySelector<HTMLElement>(target);
                if (!content) return;
                // const mode = this.getMode(content);
                this.removeClass(button);
                this.handleToggleClass(content);
                this.handlePushMode(content);
                this.handleStateOfSidebar(content);
            });
        });
    };

    // Close sidebar with event listener (click)
    private handleCloseButton(): void {
        const closeButtons = document.querySelectorAll('[data-action="close-sidebar"]');
        if (!closeButtons) return;

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (!target) return;
                const content = document.querySelector<HTMLElement>(target);
                if (!content) return;

                LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, 'closed');

                this.handleToggleClass(content);
                this.handlePushMode(content);
            });
        });
    };

    // Add class to sidebar or remove class
    private handleToggleClass(content: HTMLElement): void {
        const side = this.getSide(content);
        content.classList.toggle(`show-aside-${side}`);
    };

    // Add margin to body if sidebar is open in push mode
    private handlePushMode(content: HTMLElement): void {
        const side = this.getSide(content);
        const mode = this.getMode(content);

        if (mode !== 'push') return;

        const isVisibleStart = side === 'start' && content.classList.contains('show-aside-start');
        const isVisibleEnd = side === 'end' && content.classList.contains('show-aside-end');

        if (side === 'start') {
            document.body.style.marginLeft = isVisibleStart ? '300px' : '0';
        } else if (side === 'end') {
            document.body.style.marginRight = isVisibleEnd ? '300px' : '0';
        }
    };


    // Get sidebar mode
    private getMode(content: HTMLElement): string {
        return content.getAttribute('data-mode') || 'overlay';
    };


    // Get sidebar position
    private getSide(content: HTMLElement): string {
        return content.getAttribute('data-position') || 'start';
    };


    // Only one sidebar open in local storage
    private onlyOneSideBarOpenInLocalStorage(): void {
        const states = LocalStorageManager.getStates('tiny_kit_sidebar_state');
        const lastStateUpdate = LocalStorageManager.getLastUpdated('tiny_kit_sidebar_state');

        let count = 0;
        for (const sidebar in states) {
            if (states[sidebar] === 'open') {
                count++;
            }
        }

        if (count > 1 && lastStateUpdate) {
            for (const sidebar in states) {
                if (sidebar !== lastStateUpdate.id && states[sidebar] === 'open') {
                    LocalStorageManager.setState('tiny_kit_sidebar_state', sidebar, 'closed');
                }
            }
        }
    };
}
