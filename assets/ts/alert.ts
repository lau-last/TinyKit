export default class AlertManager {
    private buttons: HTMLButtonElement[] = [];

    init(): void {
        this.initDismiss();
    }

    private initDismiss(): void {
        this.buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-action="dismiss-alert"]'));
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.dismiss(button);
            });
        });
    }

    private dismiss(button: HTMLButtonElement): void {
        const container = document.querySelector<HTMLElement>('.container-alert');
        const parent = button.closest('.alert') as HTMLElement | null;

        if (!container || !parent) return;

        const height = parent.offsetHeight;
        const gapPx = parseInt(getComputedStyle(container).getPropertyValue('gap')) || 0;
        const moveDistance = height + gapPx;

        const alerts = Array.from(container.querySelectorAll<HTMLElement>('.alert'));
        const index = alerts.indexOf(parent);
        const alertsBelow = alerts.slice(index + 1);

        parent.classList.add('fade-out');

        const numberOfAlertsBelow = alertsBelow.length;

        const fadeOutDuration = 0.3; // secondes
        let moveUpDuration: string =  getComputedStyle(document.documentElement).getPropertyValue('--alert-move-duration').trim() || '.3s';
        moveUpDuration = moveUpDuration.replace('s', '');
        let delayStep = getComputedStyle(document.documentElement).getPropertyValue('--alert-step-delay').trim() || '0.05s';
        delayStep = delayStep.replace('s', '');

        const totalTransitionTime = Math.round(
            (fadeOutDuration + (numberOfAlertsBelow - 1) * parseFloat(delayStep) + parseFloat(moveUpDuration)) * 1000
        );

        parent.addEventListener('transitionend', () => {
            alertsBelow.forEach((alert, i) => {
                alert.style.setProperty('--alert-move-up', `-${moveDistance}px`);
                alert.style.setProperty('--alert-move-delay', `${i * parseFloat(delayStep)}s`);
                alert.classList.add('move-up');

                this.disableButtons();
            });

            this.afterAnimation(parent, alertsBelow, totalTransitionTime);
        }, {once: true});
    }

    private afterAnimation(parent: HTMLElement, alertsBelow: HTMLElement[], delay: number): void {
        setTimeout(() => {
            parent.remove();
            alertsBelow.forEach(alert => {
                alert.classList.remove('move-up');
                alert.style.removeProperty('--alert-move-up');
                alert.style.removeProperty('--alert-move-delay');

                this.enableButtons();
            });
        }, delay);
    }

    private disableButtons(): void {
        this.buttons.forEach(button => {
            button.disabled = true;
        });
    }

    private enableButtons(): void {
        this.buttons.forEach(button => {
            button.disabled = false;
        });
    }
}