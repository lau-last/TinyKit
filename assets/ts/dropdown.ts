import LocalStorageManager from "./local_storage.js";
import CollapseEffectManager from "./collapse_effect.js";

export default class DropdownManager {

    init(): void {
        this.initDropdownStates();
        this.initDropdownButtons();
    };

    private initDropdownStates(): void {
        const states: Record<string, string | null> = LocalStorageManager.getStates('tiny_kit_dropdown_state');
        for (const dropdownId in states) {
            if (states[dropdownId] === 'open') {
                const content = document.getElementById(dropdownId);
                if (!content) continue;
                this.expand(content, false);
            }
        }
    };

    private initDropdownButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-dropdown"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;

                const content = document.querySelector<HTMLElement>(targetSelector);
                if (!content) return;

                this.toggleArrow(button);

                const isOpen = content.getAttribute('data-expanded') === 'true';
                isOpen ? this.collapse(content) : this.expand(content);
            });
        });
    };

    private toggleArrow(button: HTMLElement): void {
        const arrow = button.querySelector<HTMLElement>('[data-arrow]');
        if (!arrow) return;
        const current = arrow.getAttribute('data-arrow');
        arrow.setAttribute('data-arrow', current === 'up' ? 'down' : 'up');
    };

    private updateArrow(content: HTMLElement): void {
        const button = document.querySelector<HTMLElement>(`[data-action="toggle-dropdown"][data-target="#${content.id}"]`);
        if (button) {
            const arrow = button.querySelector<HTMLElement>('[data-arrow]');
            if (arrow) {
                arrow.style.transition = 'none';
                arrow.setAttribute('data-arrow', 'up');
                void arrow.offsetHeight;  // force reflow
                arrow.style.transition = '';
            }
        }
    };

    private expand(content: HTMLElement, animate = true): void {
        LocalStorageManager.setState('tiny_kit_dropdown_state', content.id, 'open');
        CollapseEffectManager.expand(content, animate, () => this.updateArrow(content));
    };

    private collapse(content: HTMLElement): void {
        LocalStorageManager.setState('tiny_kit_dropdown_state', content.id, 'close');
        CollapseEffectManager.collapse(content);
    };

}
