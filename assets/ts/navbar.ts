import LocalStorageManager from "./local_storage.js";
import CollapseEffectManager from "./collapse_effect.js";
import BurgerManager from "./burger.js";

export default class NavbarManager {
    init(): void {
        this.initNavbarStates();
        this.initToggleNavbar();
    };

    private initNavbarStates(): void {
        const states = LocalStorageManager.getStates('tiny_kit_navbar_state');
        for (const navbar in states) {
            if (states[navbar] === 'open') {
                const content = document.getElementById(navbar);
                if (!content) continue;
                this.expand(content, false);
                BurgerManager.updateBurger(navbar, 'navbar');
            }
        }
    };

    private initToggleNavbar(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-navbar"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;

                const content = document.querySelector<HTMLElement>(targetSelector);
                if (!content) return;

                // Par défaut, si data-expanded est null, on considère que c'est ouvert (true)
                const expandedAttr = content.getAttribute('data-expanded');
                const isOpen = expandedAttr === 'true' || expandedAttr === null;

                if (isOpen) {
                    this.collapse(content);
                } else {
                    this.expand(content);
                }
            });
        });
    };

    private expand(content: HTMLElement, animate = true): void {
        LocalStorageManager.setState('tiny_kit_navbar_state', content.id, 'open');
        CollapseEffectManager.expand(content, animate);
    };

    private collapse(content: HTMLElement): void {
        LocalStorageManager.setState('tiny_kit_navbar_state', content.id, 'close');
        CollapseEffectManager.collapse(content, true, true);
    };
}
