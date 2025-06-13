export default class CarouselManager {
    private readonly slideIndexes: Record<string, number>;
    private interval: number;

    constructor() {
        this.slideIndexes = {};
        this.interval = 5000;
    };

    init(): void {
        this.activeFirstSlideAndDot();
        this.initAutoPlay();
        this.initNextButtons();
        this.initPrevButtons();
        this.initDotControls();
    };

    private initAutoPlay(): void {
        const carousels = document.querySelectorAll<HTMLElement>('[data-carousel="slide"]');
        for (const carousel of carousels) {
            const autoPlay = carousel.getAttribute('data-auto-play');
            const intervalAttr = carousel.getAttribute('data-interval');

            if (intervalAttr) {
                const parsedInterval = parseInt(intervalAttr, 10);
                if (!isNaN(parsedInterval)) {
                    this.interval = parsedInterval;
                }
            }

            if (autoPlay === 'true') {
                setInterval(() => {
                    const target = `#${carousel.id}`;
                    this.changeSlide(target, 1);
                }, this.interval);
            }
        }
    };

    private activeFirstSlideAndDot(): void {
        const carousels = document.querySelectorAll<HTMLElement>('[data-carousel="slide"]');
        for (const carousel of carousels) {
            const slides = carousel.getElementsByClassName('slide');
            const targetSelector = carousel.id;
            const containerDot = document.querySelector<HTMLElement>(`[data-dot-target="#${targetSelector}"]`);

            if (!containerDot) continue;

            const dots = containerDot.getElementsByClassName('dot');

            let indexWithActiveSlide = 0;
            let alreadyActive = false;
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('show-slide')) {
                    alreadyActive = true;
                    indexWithActiveSlide = i;
                    break;
                }
            }

            if (!alreadyActive && slides.length > 0) {
                slides[0].classList.add('show-slide');
                if (dots.length > 0) {
                    dots[0].classList.add('active');
                }
            }

            this.slideIndexes[`#${targetSelector}`] = indexWithActiveSlide;
            this.updateIndicators(`#${targetSelector}`, indexWithActiveSlide);
        }
    };

    private initNextButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-control="next"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (target) {
                    this.changeSlide(target, 1);
                }
            });
        });
    };

    private initPrevButtons(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-control="prev"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (target) {
                    this.changeSlide(target, -1);
                }
            });
        });
    };

    private initDotControls(): void {
        const containers = document.querySelectorAll<HTMLElement>('[data-dot-target]');
        containers.forEach(container => {
            const dots = container.getElementsByClassName('dot');
            Array.from(dots).forEach(dot => {
                dot.addEventListener('click', () => {
                    const target = container.getAttribute('data-dot-target');
                    const indexStr = dot.getAttribute('data-index');
                    if (target && indexStr) {
                        const index = parseInt(indexStr, 10);
                        if (!isNaN(index)) {
                            this.goToSlide(target, index);
                        }
                    }
                });
            });
        });
    };

    private changeSlide(target: string, direction: number): void {
        const content = document.querySelector<HTMLElement>(target);
        if (!content) return;

        const slides = content.getElementsByClassName('slide');
        if (slides.length === 0) return;

        if (!(target in this.slideIndexes)) this.slideIndexes[target] = 0;

        let newIndex = this.slideIndexes[target] + direction;
        if (newIndex >= slides.length) newIndex = 0;
        if (newIndex < 0) newIndex = slides.length - 1;

        this.updateDisplay(target, slides, newIndex);
    };

    private goToSlide(target: string, index: number): void {
        const content = document.querySelector<HTMLElement>(target);
        if (!content) return;

        const slides = content.getElementsByClassName('slide');
        if (index < 0 || index >= slides.length) return;

        this.slideIndexes[target] = index;
        this.updateDisplay(target, slides, index);
    };

    private updateDisplay(target: string, slides: HTMLCollectionOf<Element>, index: number): void {
        this.hideAll(slides);
        this.show(slides, index);
        this.updateIndicators(target, index);
        this.slideIndexes[target] = index;
    };

    private show(slides: HTMLCollectionOf<Element>, index: number): void {
        slides[index].classList.add('show-slide');
    };

    private hideAll(slides: HTMLCollectionOf<Element>): void {
        Array.from(slides).forEach(slide => {
            slide.classList.remove('show-slide');
        });
    };

    private updateIndicators(target: string, index: number): void {
        const container = document.querySelector<HTMLElement>(`[data-dot-target="${target}"]`);
        if (!container) return;

        const dots = container.getElementsByClassName('dot');
        Array.from(dots).forEach(dot => dot.classList.remove('active'));

        if (dots.length > index) {
            dots[index].classList.add('active');
        }
    };
}
