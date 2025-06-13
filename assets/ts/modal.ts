export default class ModalManager {
    init(): void {
        this.initOpenButtons();
        this.initCloseButtons();
    };

    private initOpenButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-toggle="modal"]');
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

    private initCloseButtons(): void {
        const closeButtons = document.querySelectorAll<HTMLElement>('[data-function="close-modal"]');
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

    private handleImageModal(button: HTMLElement): void {
        if (!(button instanceof HTMLImageElement)) return;

        const imgTargetSelector = button.getAttribute('data-img');
        if (!imgTargetSelector) return;

        const modalImg = document.querySelector<HTMLImageElement>(imgTargetSelector);
        if (modalImg) {
            modalImg.src = button.src;
        }
    };

    private disableScroll(): void {
        document.documentElement.classList.add('no-scroll');
    };

    private enableScroll(): void {
        document.documentElement.classList.remove('no-scroll');
    };
}
