export default class ScrollIndicatorManager {


    public init(): void {
        this.injectProgressBars();
        this.updateProgressBars();
        this.bindScrollEvent();
    }


    private injectProgressBars(): void {
        const scrollIndicatorsX: NodeListOf<HTMLElement> = document.querySelectorAll('[data-component="scroll-indicator-x"]');
        const scrollIndicatorsY: NodeListOf<HTMLElement> = document.querySelectorAll('[data-component="scroll-indicator-y"]');

        const scrollIndicators = [...scrollIndicatorsX, ...scrollIndicatorsY];

        scrollIndicators.forEach((element: HTMLElement) => {
            const containerProgressBar = document.createElement('div');
            const progressBar = document.createElement('div');

            containerProgressBar.classList.add('container-progress-bar');
            progressBar.classList.add('progress-bar');

            containerProgressBar.appendChild(progressBar);
            element.appendChild(containerProgressBar);
        });
    }

    private bindScrollEvent(): void {
        window.addEventListener('scroll', this.updateProgressBars.bind(this));
    }

    private updateProgressBars(): void {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercent = (scrollTop / scrollHeight) * 100;

        const scrollIndicatorsX: NodeListOf<HTMLElement> = document.querySelectorAll('[data-component="scroll-indicator-x"]');

        scrollIndicatorsX.forEach((element: HTMLElement) => {
            const progressBar = element.querySelector('.progress-bar') as HTMLElement | null;
            if (progressBar) {
                progressBar.style.width = `${scrolledPercent}%`;
            }
        });

        const scrollIndicatorsY: NodeListOf<HTMLElement> = document.querySelectorAll('[data-component="scroll-indicator-y"]');

        scrollIndicatorsY.forEach((element: HTMLElement) => {
            const progressBar = element.querySelector('.progress-bar') as HTMLElement | null;
            if (progressBar) {
                progressBar.style.height = `${scrolledPercent}%`;
            }
        });
    }
}