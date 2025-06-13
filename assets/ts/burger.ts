export default class BurgerManager {
    init(): void {
        this.initAnimateBurgerNavbar();
        this.initAnimateBurgerNavbarSide();
    };

    private toggleBurger(button: HTMLElement): void {
        const shouldAnimate = button.getAttribute('data-animated') === 'true';
        if (shouldAnimate) {
            button.classList.toggle('animate-burger');
        }
    };

    private initAnimateBurgerNavbar(): void {
        document.querySelectorAll<HTMLElement>('[data-action="toggle-navbar"]')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    this.toggleBurger(button);
                });
            });
    };

    private initAnimateBurgerNavbarSide(): void {
        document.querySelectorAll<HTMLElement>('[data-action="toggle-sidebar"]')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    this.toggleBurger(button);
                });

                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;

                document.querySelectorAll<HTMLElement>(`[data-target="${targetSelector}"]`)
                    .forEach((otherButton) => {
                        const isCloseFunction = otherButton.getAttribute('data-action') === 'close-sidebar';
                        if (isCloseFunction) {
                            otherButton.addEventListener('click', () => {
                                this.toggleBurger(button);
                            });
                        }
                    });
            });
    };

    static updateBurger(target: string, type: 'navbar' | 'sidebar'): void {
        const button = document.querySelector<HTMLElement>(`[data-action="toggle-${type}"][data-target="#${target}"]`);
        if (!button) return;

        if (button.getAttribute('data-animated') !== 'true') return;

        const bars = button.querySelectorAll<HTMLElement>('.bar1, .bar2, .bar3');
        if (bars.length === 0) return;

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
    };
}
