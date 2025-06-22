export default class ScrollIndicatorManager {
    init() {
        this.injectProgressBars();
        this.updateProgressBars();
        this.bindScrollEvent();
    }
    injectProgressBars() {
        const scrollIndicatorsX = document.querySelectorAll('[data-component="scroll-indicator-x"]');
        const scrollIndicatorsY = document.querySelectorAll('[data-component="scroll-indicator-y"]');
        const scrollIndicators = [...scrollIndicatorsX, ...scrollIndicatorsY];
        scrollIndicators.forEach((element) => {
            const containerProgressBar = document.createElement('div');
            const progressBar = document.createElement('div');
            containerProgressBar.classList.add('container-progress-bar');
            progressBar.classList.add('progress-bar');
            containerProgressBar.appendChild(progressBar);
            element.appendChild(containerProgressBar);
        });
    }
    bindScrollEvent() {
        window.addEventListener('scroll', this.updateProgressBars.bind(this));
    }
    updateProgressBars() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercent = (scrollTop / scrollHeight) * 100;
        const scrollIndicatorsX = document.querySelectorAll('[data-component="scroll-indicator-x"]');
        scrollIndicatorsX.forEach((element) => {
            const progressBar = element.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${scrolledPercent}%`;
            }
        });
        const scrollIndicatorsY = document.querySelectorAll('[data-component="scroll-indicator-y"]');
        scrollIndicatorsY.forEach((element) => {
            const progressBar = element.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.height = `${scrolledPercent}%`;
            }
        });
    }
}
