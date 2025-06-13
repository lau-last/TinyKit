export default class InputManager {

    init(): void {
        this.handleSwitchLabelClick();
    };

    private handleSwitchLabelClick(): void {
        const containersSwitch = document.querySelectorAll<HTMLElement>('.switch');
        containersSwitch.forEach(container => {
            const input = container.querySelector<HTMLInputElement>('input');
            if (!input || !input.id) return;

            const labelsSelector = document.querySelectorAll<HTMLElement>(`[data-label="${input.id}"]`);
            labelsSelector.forEach(label => {
                label.addEventListener('click', () => {
                    input.click();
                });
            });
        });
    };

}
