import LocalStorageManager from "./local_storage.js";
import CollapseEffectManager from "./collapse_effect.js";
import BurgerManager from "./burger.js";
export default class NavbarManager {
    init() {
        this.initNavbarStates();
        this.initToggleNavbar();
    }
    ;
    initNavbarStates() {
        const states = LocalStorageManager.getStates('navbar_state');
        for (const navbar in states) {
            if (states[navbar] === 'open') {
                const content = document.getElementById(navbar);
                if (!content)
                    continue;
                this.expand(content, false);
                BurgerManager.updateBurger(navbar, 'navbar');
            }
        }
    }
    ;
    initToggleNavbar() {
        const buttons = document.querySelectorAll('[data-action="toggle-navbar"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector)
                    return;
                const content = document.querySelector(targetSelector);
                if (!content)
                    return;
                // Par défaut, si data-expanded est null, on considère que c'est ouvert (true)
                const expandedAttr = content.getAttribute('data-expanded');
                const isOpen = expandedAttr === 'true' || expandedAttr === null;
                if (isOpen) {
                    this.collapse(content);
                }
                else {
                    this.expand(content);
                }
            });
        });
    }
    ;
    expand(content, animate = true) {
        LocalStorageManager.setState('navbar_state', content.id, 'open');
        CollapseEffectManager.expand(content, animate);
    }
    ;
    collapse(content) {
        LocalStorageManager.setState('navbar_state', content.id, 'close');
        CollapseEffectManager.collapse(content);
    }
    ;
}
