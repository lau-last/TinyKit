export default class CarouselFadeManager {
    private readonly slideIndexes: Record<string, number> = {};
    private interval: number = 5000;

    init(): void {
        this.activateFirstSlides();
        this.initAutoPlay();
        this.initNavigationButtons();
        this.initDotControls();
    }

    // Active la première slide visible et synchronise les dots
    private activateFirstSlides(): void {
        const carousels = document.querySelectorAll<HTMLElement>('[data-carousel="slide"][data-effect="fade"]');

        carousels.forEach(carousel => {
            const slides = carousel.getElementsByClassName('slide') as HTMLCollectionOf<Element>;
            const dotContainer = document.querySelector<HTMLElement>(`[data-dot-target="#${carousel.id}"]`);
            const dots = dotContainer?.getElementsByClassName('dot') ?? [];

            let activeIndex = Array.from(slides).findIndex(slide =>
                slide.classList.contains('show-slide')
            );

            if (activeIndex === -1) {
                slides[0]?.classList.add('show-slide');
                dots[0]?.classList.add('active');
                activeIndex = 0;
            }

            const target = `#${carousel.id}`;
            this.slideIndexes[target] = activeIndex;
            this.updateIndicators(target, activeIndex);
        });
    }

    private initAutoPlay(): void {
        const carousels = document.querySelectorAll<HTMLElement>('[data-carousel="slide"][data-effect="fade"]');

        carousels.forEach(carousel => {
            const autoPlay = carousel.getAttribute('data-autoplay') === 'true';
            const intervalAttr = parseInt(carousel.getAttribute('data-interval') || '', 10);

            if (!isNaN(intervalAttr)) {this.interval = intervalAttr;}

            if (autoPlay) {
                setInterval(() => {
                    const target = `#${carousel.id}`;
                    this.changeSlide(target, 1);
                }, this.interval);
            }
        });
    }

    private initNavigationButtons(): void {
        const nextButtons = document.querySelectorAll<HTMLElement>('[data-control="next"]');
        const prevButtons = document.querySelectorAll<HTMLElement>('[data-control="prev"]');

        nextButtons.forEach(button =>
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (target) this.changeSlide(target, 1);
            })
        );

        prevButtons.forEach(button =>
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (target) this.changeSlide(target, -1);
            })
        );
    }

    private initDotControls(): void {
        const containers = document.querySelectorAll<HTMLElement>('[data-dot-target]');

        containers.forEach(container => {
            const dots = container.getElementsByClassName('dot');

            Array.from(dots).forEach(dot => {
                dot.addEventListener('click', () => {
                    const target = container.getAttribute('data-dot-target');
                    const index = parseInt(dot.getAttribute('data-index') || '', 10);

                    if (target && !isNaN(index)) {
                        this.goToSlide(target, index);
                    }
                });
            });
        });
    }

    private changeSlide(target: string, direction: number): void {
        const carousel = document.querySelector<HTMLElement>(target);
        if (!carousel) return;

        const slides = carousel.getElementsByClassName('slide');
        if (slides.length === 0) return;

        const currentIndex = this.slideIndexes[target] ?? 0;
        const newIndex = (currentIndex + direction + slides.length) % slides.length;

        this.updateDisplay(target, slides, newIndex);
    }

    private goToSlide(target: string, index: number): void {
        const carousel = document.querySelector<HTMLElement>(target);
        if (!carousel) return;

        const slides = carousel.getElementsByClassName('slide');
        if (index < 0 || index >= slides.length) return;

        this.updateDisplay(target, slides, index);
    }

    private updateDisplay(target: string, slides: HTMLCollectionOf<Element>, index: number): void {
        this.hideAll(slides);
        this.show(slides, index);
        this.updateIndicators(target, index);
        this.slideIndexes[target] = index;
    }

    private hideAll(slides: HTMLCollectionOf<Element>): void {
        Array.from(slides).forEach(slide => slide.classList.remove('show-slide'));
    }

    private show(slides: HTMLCollectionOf<Element>, index: number): void {
        slides[index]?.classList.add('show-slide');
    }

    private updateIndicators(target: string, index: number): void {
        const container = document.querySelector<HTMLElement>(`[data-dot-target="${target}"]`);
        if (!container) return;

        const dots = container.getElementsByClassName('dot');
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        dots[index]?.classList.add('active');
    }
}