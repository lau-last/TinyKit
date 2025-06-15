export default class CarouselManager {
    constructor() {
        this.slideIndexes = {};
        this.interval = 5000;
    }
    init() {
        this.activateFirstSlide();
        this.setupAutoplay();
        this.bindControls('[data-control="next"]', 1);
        this.bindControls('[data-control="prev"]', -1);
        this.bindDots();
    }
    setupAutoplay() {
        document.querySelectorAll('[data-carousel="slide"]').forEach(carousel => {
            const interval = parseInt(carousel.getAttribute('data-interval') || '', 10);
            const autoplay = carousel.getAttribute('data-autoplay') === 'true';
            const target = `#${carousel.id}`;
            if (!isNaN(interval))
                this.interval = interval;
            if (autoplay) {
                setInterval(() => this.changeSlide(target, 1), this.interval);
            }
        });
    }
    activateFirstSlide() {
        document.querySelectorAll('[data-carousel="slide"]').forEach(carousel => {
            var _a, _b, _c;
            const slides = carousel.getElementsByClassName('slide');
            const target = `#${carousel.id}`;
            const dotsContainer = document.querySelector(`[data-dot-target="${target}"]`);
            const dots = (_a = dotsContainer === null || dotsContainer === void 0 ? void 0 : dotsContainer.getElementsByClassName('dot')) !== null && _a !== void 0 ? _a : [];
            const effect = carousel.getAttribute('data-effect') || 'fade';
            if (e)
                let index = 0;
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('show-slide')) {
                    index = i;
                    break;
                }
            }
            (_b = slides[index]) === null || _b === void 0 ? void 0 : _b.classList.add('show-slide');
            (_c = dots[index]) === null || _c === void 0 ? void 0 : _c.classList.add('active');
            this.slideIndexes[target] = index;
            this.updateIndicators(target, index);
        });
    }
    bindControls(selector, direction) {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                if (target)
                    this.changeSlide(target, direction);
            });
        });
    }
    bindDots() {
        document.querySelectorAll('[data-dot-target]').forEach(container => {
            Array.from(container.getElementsByClassName('dot')).forEach(dot => {
                dot.addEventListener('click', () => {
                    const target = container.getAttribute('data-dot-target');
                    const index = parseInt(dot.getAttribute('data-index') || '', 10);
                    if (target && !isNaN(index))
                        this.goToSlide(target, index);
                });
            });
        });
    }
    changeSlide(target, direction) {
        var _a, _b;
        const slides = (_a = document.querySelector(target)) === null || _a === void 0 ? void 0 : _a.getElementsByClassName('slide');
        if (!slides || slides.length === 0)
            return;
        const currentIndex = (_b = this.slideIndexes[target]) !== null && _b !== void 0 ? _b : 0;
        let newIndex = (currentIndex + direction + slides.length) % slides.length;
        this.updateDisplay(target, slides, newIndex);
    }
    goToSlide(target, index) {
        var _a;
        const slides = (_a = document.querySelector(target)) === null || _a === void 0 ? void 0 : _a.getElementsByClassName('slide');
        if (!slides || index < 0 || index >= slides.length)
            return;
        this.updateDisplay(target, slides, index);
    }
    updateDisplayFade(target, slides, index) {
        Array.from(slides).forEach(slide => slide.classList.remove('show-slide'));
        slides[index].classList.add('show-slide');
        this.updateIndicators(target, index);
        this.slideIndexes[target] = index;
    }
    updateDisplayTranslation(target, slides, index) {
        const wrapper = document.querySelector(`${target} .wrapper-slides`);
        if (!wrapper)
            return;
        const slideWidth = wrapper.offsetWidth;
        wrapper.style.transform = `translateX(-${index * slideWidth}px)`;
        this.updateIndicators(target, index);
        this.slideIndexes[target] = index;
    }
    updateIndicators(target, index) {
        const container = document.querySelector(`[data-dot-target="${target}"]`);
        const dots = container === null || container === void 0 ? void 0 : container.getElementsByClassName('dot');
        if (!dots)
            return;
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        if (dots.length > index)
            dots[index].classList.add('active');
    }
    updateDisplay(target, slides, index) {
        const carousel = document.querySelector(target);
        const effect = (carousel === null || carousel === void 0 ? void 0 : carousel.getAttribute('data-effect')) || 'fade';
        switch (effect) {
            case 'slide':
                this.updateDisplayTranslation(target, slides, index);
                break;
            case 'fade':
            default:
                this.updateDisplayFade(target, slides, index);
                break;
        }
    }
    cloneSlidesForInfinite(carousel) {
        const wrapper = carousel.querySelector('.slides-wrapper');
        if (!wrapper)
            return;
        const slides = wrapper.querySelectorAll('.slide');
        if (slides.length < 2)
            return;
        const first = slides[0].cloneNode(true);
        const last = slides[slides.length - 1].cloneNode(true);
        wrapper.insertBefore(last, slides[0]);
        wrapper.appendChild(first);
    }
}
