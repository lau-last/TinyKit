import LocalStorageManager from "./local_storage.js";
import CollapseEffectManager from "./collapse_effect.js";

export default class DropdownManager {

    init(): void {
        this.setFallbackDisplay();
        this.initDropdownStates();
        this.initDropdownButtons();
    };


    // Set display none to dropdown content if it don't have data-mode attribute
    private setFallbackDisplay(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-dropdown"]');
        buttons.forEach(button => {
            const targetSelector = button.getAttribute('data-target');
            if (!targetSelector) return;
            const content = document.querySelector<HTMLElement>(targetSelector);
            if (!content) return;
            if (!content.hasAttribute('data-mode')) {
                content.style.display = 'none';
            }
        });
    }



    // Get dropdown states from local storage
    private initDropdownStates(): void {
        const states: Record<string, string | null> = LocalStorageManager.getStates('tiny_kit_dropdown_state');

        for (const dropdownId in states) {
            const state = states[dropdownId];
            const content = document.getElementById(dropdownId);
            if (!content) continue;
            if (state === 'open') {
                this.expand(content, false);
            } else if (state === 'close') {
                this.collapse(content, false);
            }
        }
    }


    // initialize dropdown buttons with event listeners
    private initDropdownButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-dropdown"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;
                const content = document.querySelector<HTMLElement>(targetSelector);
                if (!content) return;
                const isOpen = content.getAttribute('data-expanded') === 'true';
                isOpen ? this.collapse(content) : this.expand(content);
            });
        });
    };

    // expand dropdown content with animation
    private expand(content: HTMLElement, animate = true): void {
        LocalStorageManager.setState('tiny_kit_dropdown_state', content.id, 'open');
        CollapseEffectManager.expand(content, animate);
    };

    // collapse dropdown content with animation
    private collapse(content: HTMLElement,animate = true): void {
        LocalStorageManager.setState('tiny_kit_dropdown_state', content.id, 'close');
        CollapseEffectManager.collapse(content, animate);
    };

}