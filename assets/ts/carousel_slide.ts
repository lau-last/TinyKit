import ConverterManager from "./converter_tool.js";

export default class CarouselSlideManager {
    private transitioningMap: Map<Element, boolean>;
    private realIndexForDots: Map<Element, number>;

    constructor() {
        this.transitioningMap = new Map();
        this.realIndexForDots = new Map();
    }

    init(): void {
        this.initCarousels();
        this.initAutoPlay();
        this.initDotControls();
    }

    private validateSlidesPerView(slidesPerView: number, carousel: Element): number {
        const slides = carousel.querySelectorAll('.slide:not(.cloned)');
        if (slidesPerView < 1 || isNaN(slidesPerView) || slidesPerView % 1 !== 0) {
            return 1;
        }
        return Math.min(slidesPerView, slides.length);
    }

    private initCarousels(): void {
        const carousels = document.querySelectorAll('[data-component="carousel"][data-effect="slide"]');
        carousels.forEach((carousel) => {
            const computedStyle = getComputedStyle(document.documentElement);
            const gapRow = computedStyle.getPropertyValue('--carousel-gap').trim();
            const defaultGapCarousel = ConverterManager.convertToPx(gapRow);

            if (!carousel.hasAttribute('data-current-index')) {
                carousel.setAttribute('data-current-index', '0');
            }
            if (!carousel.hasAttribute('data-view')) {
                carousel.setAttribute('data-view', '1');
            }
            if (!carousel.hasAttribute('data-gap')) {
                carousel.setAttribute('data-gap', parseInt(String(defaultGapCarousel), 10).toString());
            }
            if (!carousel.hasAttribute('data-step')) {
                carousel.setAttribute('data-step', 'single');
            }

            let slidesPerView = parseFloat(carousel.getAttribute('data-view') || '1');
            slidesPerView = this.validateSlidesPerView(slidesPerView, carousel);
            carousel.setAttribute('data-view', slidesPerView.toString());

            const carouselGap = carousel.getAttribute('data-gap') || '0';
            const slides = carousel.querySelectorAll('.slide');

            (carousel as HTMLElement).style.setProperty('--slides-per-view', slidesPerView.toString());
            (carousel as HTMLElement).style.setProperty('--carousel-gap', `${carouselGap}px`);

            if (slides.length < 2) {
                (carousel as HTMLElement).style.setProperty('--slides-per-view', slides.length.toString());
                (carousel as HTMLElement).style.setProperty('--carousel-gap', '0px');
                this.updatePosition(carousel, false);
                return;
            }

            if (slidesPerView < 2) {
                (carousel as HTMLElement).style.setProperty('--carousel-gap', '0px');
            }

            this.cloneSlidesForInfiniteLoop(slidesPerView, carousel);
            this.updatePosition(carousel, false);

            const prevButton = carousel.querySelector('.control-prev');
            const nextButton = carousel.querySelector('.control-next');

            if (prevButton) this.handleButtonPrev(prevButton, carousel);
            if (nextButton) this.handleButtonNext(nextButton, carousel);

            const wrapper = carousel.querySelector('.wrapper-slides');
            const originalSlideCount = slides.length;

            if (wrapper) {
                wrapper.addEventListener('transitionend', () => {
                    let currentIndex = parseInt(carousel.getAttribute('data-current-index') || '0', 10);
                    const slidesToCloneCount = this.getClonesRequired(
                        parseInt(carousel.getAttribute('data-view') || '1', 10),
                        carousel.getAttribute('data-step') || 'single'
                    );

                    if (currentIndex < slidesToCloneCount) {
                        currentIndex = originalSlideCount + currentIndex;
                        carousel.setAttribute('data-current-index', currentIndex.toString());
                        this.updatePosition(carousel, false);
                    } else if (currentIndex >= originalSlideCount + slidesToCloneCount) {
                        currentIndex = currentIndex - originalSlideCount;
                        carousel.setAttribute('data-current-index', currentIndex.toString());
                        this.updatePosition(carousel, false);
                    }
                    this.transitioningMap.set(carousel, false);
                });
            }

            window.addEventListener('resize', () => {
                this.updatePosition(carousel, false);
            });
        });
    }

    private updatePosition(carousel: Element, animation: boolean = true): void {
        if (!carousel.hasAttribute('data-current-index')) {
            carousel.setAttribute('data-current-index', '0');
        }
        if (!carousel.hasAttribute('data-view')) {
            carousel.setAttribute('data-view', '1');
        }

        const slidesPerView = parseInt(carousel.getAttribute('data-view') || '1', 10);
        let currentIndex = parseInt(carousel.getAttribute('data-current-index') || '0', 10);

        const computedStyle = getComputedStyle(carousel as HTMLElement);
        const carouselGapPx = computedStyle.getPropertyValue('--carousel-gap').trim();
        const carouselGap = parseFloat(carouselGapPx);

        const wrapper = carousel.querySelector('.wrapper-slides') as HTMLElement | null;
        if (!wrapper) return;

        const slides = wrapper.querySelectorAll('.slide');

        if (slides.length === 0) {
            console.warn("No slides found in carousel:", carousel);
            return;
        }

        const slideElementWidth = (slides[0] as HTMLElement).offsetWidth;
        const stepWidth = slideElementWidth + carouselGap;
        const visibleContentWidth = (slidesPerView * slideElementWidth) + ((slidesPerView - 1) * carouselGap);
        const containerWidth = (carousel as HTMLElement).offsetWidth;
        const centeringOffset = (containerWidth - visibleContentWidth) / 2;

        let translateXValue = -(currentIndex * stepWidth) + centeringOffset;
        translateXValue = Math.round(translateXValue);

        wrapper.style.transition = animation ? 'transform var(--carousel-effect-duration-slide) ease' : 'none';
        wrapper.style.transform = `translateX(${translateXValue}px)`;

        this.updateDots(carousel);
    }

    private handleButtonClick(
        button: Element,
        carousel: Element,
        direction: 'next' | 'prev'
    ): void {
        button.addEventListener('click', () => {
            if (this.transitioningMap.get(carousel)) return;
            this.transitioningMap.set(carousel, true);

            let currentIndex = parseInt(carousel.getAttribute('data-current-index') || '0', 10);
            const slidesPerView = parseInt(carousel.getAttribute('data-view') || '1', 10);
            const slideBy = carousel.getAttribute('data-step') || 'single';

            const increment = this.validateStep(slideBy, slidesPerView);

            currentIndex = direction === 'next'
                ? currentIndex + increment
                : currentIndex - increment;

            carousel.setAttribute('data-current-index', currentIndex.toString());
            this.updatePosition(carousel);
        });
    }

    private handleButtonPrev(button: Element, carousel: Element): void {
        this.handleButtonClick(button, carousel, 'prev');
    }

    private handleButtonNext(button: Element, carousel: Element): void {
        this.handleButtonClick(button, carousel, 'next');
    }

    private validateStep(step: string, slidesPerView: number): number {
        if (step === 'all') {
            return slidesPerView;
        }
        if (step === 'single') {
            return 1;
        }
        return 1;
    }

    private getClonesRequired(slidesPerView: number, dataStep: string | null): number {
        let step = 1;

        if (dataStep === 'all') {
            step = slidesPerView;
        } else if (dataStep && !isNaN(parseInt(dataStep, 10))) {
            step = parseInt(dataStep, 10);
        }

        return Math.max(slidesPerView, step) + 2;
    }

    private cloneSlidesForInfiniteLoop(slidesPerView: number, carousel: Element): void {
        const wrapper = carousel.querySelector('.wrapper-slides');
        if (!wrapper) return;

        const slides = wrapper.querySelectorAll('.slide:not(.cloned)');
        const slidesArray = Array.from(slides);
        const originalSlideCount = slidesArray.length;

        if (originalSlideCount < 1) {
            console.warn("No slides to clone.");
            return;
        }

        wrapper.querySelectorAll('.slide.cloned').forEach(clone => clone.remove());

        const dataStep = carousel.getAttribute('data-step') || 'single';
        const clonesToCreate = this.getClonesRequired(slidesPerView, dataStep);

        // Clone end to start
        for (let i = 0; i < clonesToCreate; i++) {
            const originalIndex = (originalSlideCount - 1 - (i % originalSlideCount) + originalSlideCount) % originalSlideCount;
            const clone = slidesArray[originalIndex].cloneNode(true) as HTMLElement;
            clone.classList.add('cloned');
            wrapper.insertBefore(clone, wrapper.firstChild);
        }

        // Clone start to end
        for (let i = 0; i < clonesToCreate; i++) {
            const originalIndex = i % originalSlideCount;
            const clone = slidesArray[originalIndex].cloneNode(true) as HTMLElement;
            clone.classList.add('cloned');
            wrapper.appendChild(clone);
        }

        carousel.setAttribute('data-current-index', clonesToCreate.toString());
    }

    private initAutoPlay(): void {
        const carousels = document.querySelectorAll<HTMLElement>('[data-component="carousel"][data-effect="slide"]');

        carousels.forEach(carousel => {
            const autoPlay = carousel.getAttribute('data-autoplay') === 'true';
            if (!autoPlay) return;
            const computedStyle = getComputedStyle(document.documentElement);
            const intervalCssVariable = computedStyle.getPropertyValue('--carousel-interval-slide');
            const intervalAttr = parseInt(carousel.getAttribute('data-interval') || intervalCssVariable, 10);

            if (isNaN(intervalAttr) || intervalAttr < 500) return; // sécurité

            const slidesPerView = parseInt(carousel.getAttribute('data-view') || '1', 10);
            const slideBy = carousel.getAttribute('data-step') || 'single';
            const increment = this.validateStep(slideBy, slidesPerView);

            setInterval(() => {
                if (this.transitioningMap.get(carousel)) return;

                this.transitioningMap.set(carousel, true);

                let currentIndex = parseInt(carousel.getAttribute('data-current-index') || '0', 10);
                currentIndex += increment;

                carousel.setAttribute('data-current-index', currentIndex.toString());
                this.updatePosition(carousel);
            }, intervalAttr);
        });
    }

    private initDotControls(): void {
        const containersDots = document.querySelectorAll<HTMLElement>('[data-dot-target]');

        containersDots.forEach(container => {
            const targetSelector = container.getAttribute('data-dot-target');
            if (!targetSelector) return;

            const carousel = document.querySelector<HTMLElement>(targetSelector);
            if (!carousel) return;

            const slides = carousel.querySelectorAll('.slide:not(.cloned)');
            const numberOfDots = slides.length;

            container.innerHTML = '';

            for (let i = 0; i < numberOfDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');

                const span = document.createElement('span');
                dot.appendChild(span);

                this.bindDotClickEvent(dot, carousel, i);

                container.appendChild(dot);
            }
            this.updateDots(carousel);
        });
    };

    private bindDotClickEvent(dot: Element, carousel: Element, i: number): void {
        dot.addEventListener('click', () => {
            if (this.transitioningMap.get(carousel)) return;

            const slidesPerView = parseInt(carousel.getAttribute('data-view') || '1', 10);
            const dataStep = carousel.getAttribute('data-step') || 'single';
            const clonesToCreate = this.getClonesRequired(slidesPerView, dataStep);

            const targetIndex = i + clonesToCreate;
            carousel.setAttribute('data-current-index', targetIndex.toString());
            this.updatePosition(carousel);
        });
    };


    private updateDots(carousel: Element): void {
        const dotContainerSelector = `[data-dot-target="#${(carousel as HTMLElement).id}"]`;
        const dotContainer = document.querySelector(dotContainerSelector);
        if (!dotContainer) return;

        const dots = dotContainer.querySelectorAll('.dot');
        const totalOriginalSlides = dots.length;

        const slidesPerView = parseInt(carousel.getAttribute('data-view') || '1', 10);
        const clonesToCreate = this.getClonesRequired(
            slidesPerView,
            carousel.getAttribute('data-step') || 'single'
        );
        let currentIndex = parseInt(carousel.getAttribute('data-current-index') || '0', 10);
        let firstVisibleOriginalIndex = (currentIndex - clonesToCreate) % totalOriginalSlides;

        if (firstVisibleOriginalIndex < 0) {
            firstVisibleOriginalIndex += totalOriginalSlides;
        }

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        for (let i = 0; i < slidesPerView; i++) {
            const visibleDotIndex = (firstVisibleOriginalIndex + i) % totalOriginalSlides;
            if (dots[visibleDotIndex]) {
                dots[visibleDotIndex].classList.add('active');
            }
        }
    };
}