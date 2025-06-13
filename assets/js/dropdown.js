import LocalStorageManager from "./local_storage.js";
import CollapseEffectManager from "./collapse_effect.js";
export default class DropdownManager {
    init() {
        this.initDropdownStates();
        this.initDropdownButtons();
    }
    ;
    initDropdownStates() {
        const states = LocalStorageManager.getStates('dropdown_state');
        for (const dropdownId in states) {
            if (states[dropdownId] === 'open') {
                const content = document.getElementById(dropdownId);
                if (!content)
                    continue;
                this.expand(content, false);
            }
        }
    }
    ;
    initDropdownButtons() {
        const buttons = document.querySelectorAll('[data-action="toggle-dropdown"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector)
                    return;
                const content = document.querySelector(targetSelector);
                if (!content)
                    return;
                this.toggleArrow(button);
                const isOpen = content.getAttribute('data-expanded') === 'true';
                isOpen ? this.collapse(content) : this.expand(content);
            });
        });
    }
    ;
    toggleArrow(button) {
        const arrow = button.querySelector('[data-arrow]');
        if (!arrow)
            return;
        const current = arrow.getAttribute('data-arrow');
        arrow.setAttribute('data-arrow', current === 'up' ? 'down' : 'up');
    }
    ;
    updateArrow(content) {
        const button = document.querySelector(`[data-action="toggle-dropdown"][data-target="#${content.id}"]`);
        if (button) {
            const arrow = button.querySelector('[data-arrow]');
            if (arrow) {
                arrow.style.transition = 'none';
                arrow.setAttribute('data-arrow', 'up');
                void arrow.offsetHeight; // force reflow
                arrow.style.transition = '';
            }
        }
    }
    ;
    expand(content, animate = true) {
        LocalStorageManager.setState('dropdown_state', content.id, 'open');
        CollapseEffectManager.expand(content, animate, () => this.updateArrow(content));
    }
    ;
    collapse(content) {
        LocalStorageManager.setState('dropdown_state', content.id, 'close');
        CollapseEffectManager.collapse(content);
    }
    ;
}
