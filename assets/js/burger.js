export default class BurgerManager {
    init() {
        this.initAnimateBurgerNavbar();
        this.initAnimateBurgerNavbarSide();
    }
    ;
    toggleBurger(button) {
        const shouldAnimate = button.getAttribute('data-animated') === 'true';
        if (shouldAnimate) {
            button.classList.toggle('animate-burger');
        }
    }
    ;
    initAnimateBurgerNavbar() {
        document.querySelectorAll('[data-action="toggle-navbar"]')
            .forEach((button) => {
            button.addEventListener('click', () => {
                this.toggleBurger(button);
            });
        });
    }
    ;
    initAnimateBurgerNavbarSide() {
        document.querySelectorAll('[data-action="toggle-sidebar"]')
            .forEach((button) => {
            button.addEventListener('click', () => {
                this.toggleBurger(button);
            });
            const targetSelector = button.getAttribute('data-target');
            if (!targetSelector)
                return;
            document.querySelectorAll(`[data-target="${targetSelector}"]`)
                .forEach((otherButton) => {
                const isCloseFunction = otherButton.getAttribute('data-action') === 'close-sidebar';
                if (isCloseFunction) {
                    otherButton.addEventListener('click', () => {
                        this.toggleBurger(button);
                    });
                }
            });
        });
    }
    ;
    static updateBurger(target, type) {
        const button = document.querySelector(`[data-action="toggle-${type}"][data-target="#${target}"]`);
        if (!button)
            return;
        if (button.getAttribute('data-animated') !== 'true')
            return;
        const bars = button.querySelectorAll('.bar1, .bar2, .bar3');
        if (bars.length === 0)
            return;
        // Remove transitions temporarily
        bars.forEach((bar) => {
            bar.style.transition = 'none';
        });
        button.classList.add('animate-burger');
        // Force reflow to restart animations cleanly
        void button.offsetHeight;
        // Restore transitions
        bars.forEach((bar) => {
            bar.style.transition = '';
        });
    }
    ;
}
