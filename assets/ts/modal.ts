export default class ModalManager {
    init(): void {
        this.initOpenButtons();
        this.initCloseButtons();
    };


    // initialize modal buttons with event listeners
    private initOpenButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-action="toggle-modal"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;
                const modal = document.querySelector<HTMLElement>(targetSelector);
                if (!modal) return;
                modal.style.display = 'flex';
                this.disableScroll();
                this.handleImageModal(button);
            });
        });
    };

    // initialize close buttons with event listeners
    private initCloseButtons(): void {
        const closeButtons = document.querySelectorAll<HTMLElement>('[data-action="close-modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;
                const modal = document.querySelector<HTMLElement>(targetSelector);
                if (!modal) return;
                modal.style.display = 'none';
                this.enableScroll();
            });
        });
    };

    // handle image modal
    private handleImageModal(button: HTMLElement): void {
        if (!(button instanceof HTMLImageElement)) return;
        const imgTargetSelector = button.getAttribute('data-img');
        if (!imgTargetSelector) return;
        const modalImg = document.querySelector<HTMLImageElement>(imgTargetSelector);
        if (modalImg) {
            modalImg.src = button.src;
        }
    };

    // disable scroll
    private disableScroll(): void {
        document.documentElement.classList.add('no-scroll');
    };

    // enable scroll
    private enableScroll(): void {
        document.documentElement.classList.remove('no-scroll');
    };
}
