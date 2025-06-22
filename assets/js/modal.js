export default class ModalManager {
    init() {
        this.initOpenButtons();
        this.initCloseButtons();
    }
    ;
    // initialize modal buttons with event listeners
    initOpenButtons() {
        const buttons = document.querySelectorAll('[data-action="toggle-modal"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector)
                    return;
                const modal = document.querySelector(targetSelector);
                if (!modal)
                    return;
                modal.style.display = 'flex';
                this.disableScroll();
                this.handleImageModal(button);
            });
        });
    }
    ;
    // initialize close buttons with event listeners
    initCloseButtons() {
        const closeButtons = document.querySelectorAll('[data-action="close-modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector)
                    return;
                const modal = document.querySelector(targetSelector);
                if (!modal)
                    return;
                modal.style.display = 'none';
                this.enableScroll();
            });
        });
    }
    ;
    // handle image modal
    handleImageModal(button) {
        if (!(button instanceof HTMLImageElement))
            return;
        const imgTargetSelector = button.getAttribute('data-img');
        if (!imgTargetSelector)
            return;
        const modalImg = document.querySelector(imgTargetSelector);
        if (modalImg) {
            modalImg.src = button.src;
        }
    }
    ;
    // disable scroll
    disableScroll() {
        document.documentElement.classList.add('no-scroll');
    }
    ;
    // enable scroll
    enableScroll() {
        document.documentElement.classList.remove('no-scroll');
    }
    ;
}
