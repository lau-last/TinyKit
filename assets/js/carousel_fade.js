export default class CarouselFadeManager {
    constructor() {
        this.slideIndexes = {};
        this.interval = 5000;
    }
    init() {
        this.activateFirstSlides();
        this.initAutoPlay();
        this.initNavigationButtons();
        this.initDotControls();
    }
    // Active la première slide visible et synchronise les dots
    activateFirstSlides() {
        const carousels = document.querySelectorAll('[data-carousel="slide"][data-effect="fade"]');
        carousels.forEach(carousel => {
            var _a, _b, _c;
            const slides = carousel.getElementsByClassName('slide');
            const dotContainer = document.querySelector(`[data-dot-target="#${carousel.id}"]`);
            const dots = (_a = dotContainer === null || dotContainer === void 0 ? void 0 : dotContainer.getElementsByClassName('dot')) !== null && _a !== void 0 ? _a : [];
            let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('show-slide'));
            if (activeIndex === -1) {
                (_b = slides[0]) === null || _b === void 0 ? void 0 : _b.classList.add('show-slide');
                (_c = dots[0]) === null || _c === void 0 ? void 0 : _c.classList.add('active');
                activeIndex = 0;
            }
            const target = `#${carousel.id}`;
            this.slideIndexes[target] = activeIndex;
            this.updateIndicators(target, activeIndex);
        });
    }
    initAutoPlay() {
        const carousels = document.querySelectorAll('[data-carousel="slide"][data-effect="fade"]');
        carousels.forEach(carousel => {
            const autoPlay = carousel.getAttribute('data-autoplay') === 'true';
            const intervalAttr = parseInt(carousel.getAttribute('data-interval') || '', 10);
            if (!isNaN(intervalAttr)) {
                this.interval = intervalAttr;
            }
            if (autoPlay) {
                setInterval(() => {
                    const target = `#${carousel.id}`;
                    this.changeSlide(target, 1);
                }, this.interval);
            }
        });
    }
    initNavigationButtons() {
        const nextButtons = document.querySelectorAll('[data-control="next"]');
        const prevButtons = document.querySelectorAll('[data-control="prev"]');
        nextButtons.forEach(button => button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            if (target)
                this.changeSlide(target, 1);
        }));
        prevButtons.forEach(button => button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            if (target)
                this.changeSlide(target, -1);
        }));
    }
    initDotControls() {
        const containers = document.querySelectorAll('[data-dot-target]');
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
    changeSlide(target, direction) {
        var _a;
        const carousel = document.querySelector(target);
        if (!carousel)
            return;
        const slides = carousel.getElementsByClassName('slide');
        if (slides.length === 0)
            return;
        const currentIndex = (_a = this.slideIndexes[target]) !== null && _a !== void 0 ? _a : 0;
        const newIndex = (currentIndex + direction + slides.length) % slides.length;
        this.updateDisplay(target, slides, newIndex);
    }
    goToSlide(target, index) {
        const carousel = document.querySelector(target);
        if (!carousel)
            return;
        const slides = carousel.getElementsByClassName('slide');
        if (index < 0 || index >= slides.length)
            return;
        this.updateDisplay(target, slides, index);
    }
    updateDisplay(target, slides, index) {
        this.hideAll(slides);
        this.show(slides, index);
        this.updateIndicators(target, index);
        this.slideIndexes[target] = index;
    }
    hideAll(slides) {
        Array.from(slides).forEach(slide => slide.classList.remove('show-slide'));
    }
    show(slides, index) {
        var _a;
        (_a = slides[index]) === null || _a === void 0 ? void 0 : _a.classList.add('show-slide');
    }
    updateIndicators(target, index) {
        var _a;
        const container = document.querySelector(`[data-dot-target="${target}"]`);
        if (!container)
            return;
        const dots = container.getElementsByClassName('dot');
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        (_a = dots[index]) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    }
}
