export default class InputManager {
    init() {
        this.handleSwitchLabelClick();
    }
    ;
    handleSwitchLabelClick() {
        const containersSwitch = document.querySelectorAll('.switch');
        containersSwitch.forEach(container => {
            const input = container.querySelector('input');
            if (!input || !input.id)
                return;
            const labelsSelector = document.querySelectorAll(`[data-label="${input.id}"]`);
            labelsSelector.forEach(label => {
                label.addEventListener('click', () => {
                    input.click();
                });
            });
        });
    }
    ;
}
