export default class ToggleManager {

    static iconShow: string =
        `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 8l-4 4l4 4" />
    <path d="M17 8l4 4l-4 4" />
    <path d="M14 4l-4 16" />
</svg>`;

    static iconHide: string =
        `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 8l-4 4l4 4" />
    <path d="M17 8l4 4l-2.5 2.5" />
    <path d="M14 4l-1.201 4.805m-.802 3.207l-2 7.988" />
    <path d="M3 3l18 18" />
</svg>`;

    init(): void {
        this.initToggleDisplay();
        this.initIconDisplay();
    };

    private initToggleDisplay(): void {
        const toggleButtons = document.querySelectorAll<HTMLElement>('[data-action="toggle-display"]');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;
                const target = document.querySelector<HTMLElement>(targetSelector);
                if (!target) return;

                target.classList.toggle('d-none');
                this.handleIconDisplay(button);
            });
        });
    };

    private initIconDisplay(): void {
        const toggleButtons = document.querySelectorAll<HTMLElement>('[data-action="toggle-display"]');
        toggleButtons.forEach(button => {
            this.handleIconDisplay(button);
        });
    };

    private  handleIconDisplay(button: HTMLElement): void {
        const targetSelector = button.getAttribute('data-target');
        if (!targetSelector) return;
        const target = document.querySelector<HTMLElement>(targetSelector);
        if (!target) return;

        if (target.classList.contains('d-none')) {
            button.innerHTML = ToggleManager.iconShow;
        } else {
            button.innerHTML = ToggleManager.iconHide;
        }
    };
}
