import LocalStorageManager from "./local_storage.js";
import BurgerManager from "./burger.js";
export default class NavbarSideManager {
    init() {
        this.initSideNavbar();
    }
    ;
    initSideNavbar() {
        this.onlyOneSideBarOpenInLocalStorage();
        this.initSidebarStates();
        this.handleOpenButton();
        this.handleCloseButton();
    }
    ;
    initSidebarStates() {
        const states = LocalStorageManager.getStates('tiny_kit_sidebar_state');
        const body = document.body;
        const contents = [];
        body.style.transition = 'none';
        for (const sidebar in states) {
            if (states[sidebar] === 'open') {
                const content = document.getElementById(sidebar);
                if (!content)
                    continue;
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
    }
    ;
    handleStateOfSidebar(content) {
        if (!content)
            return;
        const state = (content.classList.contains('show-aside-start') || content.classList.contains('show-aside-end'))
            ? 'open'
            : 'closed';
        LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, state);
    }
    ;
    removeClass(currentButton) {
        const openButtons = document.querySelectorAll('[data-action="toggle-sidebar"]');
        if (!openButtons)
            return;
        openButtons.forEach(button => {
            if (button !== currentButton) {
                const target = button.getAttribute('data-target');
                if (!target)
                    return;
                const content = document.querySelector(target);
                if (!content)
                    return;
                LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, 'closed');
                button.classList.remove('animate-burger');
                content.classList.remove('show-aside-start');
                content.classList.remove('show-aside-end');
                document.body.style.marginLeft = '0';
                document.body.style.marginRight = '0';
            }
        });
    }
    ;
    handleOpenButton() {
        const openButtons = document.querySelectorAll('[data-action="toggle-sidebar"]');
        if (!openButtons)
            return;
        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (!target)
                    return;
                const content = document.querySelector(target);
                if (!content)
                    return;
                this.removeClass(button);
                this.handleToggleClass(content);
                this.handlePushMode(content);
                this.handleStateOfSidebar(content);
            });
        });
    }
    ;
    handleCloseButton() {
        const closeButtons = document.querySelectorAll('[data-action="close-sidebar"]');
        if (!closeButtons)
            return;
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (!target)
                    return;
                const content = document.querySelector(target);
                if (!content)
                    return;
                LocalStorageManager.setState('tiny_kit_sidebar_state', content.id, 'closed');
                this.handleToggleClass(content);
                this.handlePushMode(content);
            });
        });
    }
    ;
    handleToggleClass(content) {
        const side = this.getSide(content);
        content.classList.toggle(`show-aside-${side}`);
    }
    ;
    handlePushMode(content) {
        const side = this.getSide(content);
        const mode = this.getMode(content);
        if (mode !== 'push')
            return;
        const isVisibleStart = side === 'start' && content.classList.contains('show-aside-start');
        const isVisibleEnd = side === 'end' && content.classList.contains('show-aside-end');
        if (side === 'start') {
            document.body.style.marginLeft = isVisibleStart ? '300px' : '0';
        }
        else if (side === 'end') {
            document.body.style.marginRight = isVisibleEnd ? '300px' : '0';
        }
    }
    ;
    getMode(content) {
        return content.getAttribute('data-mode') || 'hover';
    }
    ;
    getSide(content) {
        return content.getAttribute('data-position') || 'start';
    }
    ;
    onlyOneSideBarOpenInLocalStorage() {
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
    }
    ;
}
