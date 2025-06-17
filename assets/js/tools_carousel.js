export default class toolsCarousel {
    initAutoPlay() {
        const carousels = document.querySelectorAll('[data-component="carousel"][data-effect="slide"]');
        const carousels, forEach;
        (carousel => {
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
}
