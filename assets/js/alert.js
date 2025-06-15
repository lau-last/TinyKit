export default class AlertManager {
    constructor() {
        this.buttons = [];
    }
    init() {
        this.initDismiss();
    }
    initDismiss() {
        this.buttons = Array.from(document.querySelectorAll('[data-action="dismiss-alert"]'));
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.dismiss(button);
            });
        });
    }
    dismiss(button) {
        const container = document.querySelector('.container-alert');
        const parent = button.closest('.alert');
        if (!container || !parent)
            return;
        const height = parent.offsetHeight;
        const gapPx = parseInt(getComputedStyle(container).getPropertyValue('gap')) || 0;
        const moveDistance = height + gapPx;
        const alerts = Array.from(container.querySelectorAll('.alert'));
        const index = alerts.indexOf(parent);
        const alertsBelow = alerts.slice(index + 1);
        parent.classList.add('fade-out');
        const numberOfAlertsBelow = alertsBelow.length;
        const fadeOutDuration = 0.3; // secondes
        let moveUpDuration = getComputedStyle(document.documentElement).getPropertyValue('--alert-move-duration').trim() || '.3s';
        moveUpDuration = moveUpDuration.replace('s', '');
        let delayStep = getComputedStyle(document.documentElement).getPropertyValue('--alert-step-delay').trim() || '0.05s';
        delayStep = delayStep.replace('s', '');
        const totalTransitionTime = Math.round((fadeOutDuration + (numberOfAlertsBelow - 1) * parseFloat(delayStep) + parseFloat(moveUpDuration)) * 1000);
        parent.addEventListener('transitionend', () => {
            alertsBelow.forEach((alert, i) => {
                alert.style.setProperty('--alert-move-up', `-${moveDistance}px`);
                alert.style.setProperty('--alert-move-delay', `${i * parseFloat(delayStep)}s`);
                alert.classList.add('move-up');
                this.disableButtons();
            });
            this.afterAnimation(parent, alertsBelow, totalTransitionTime);
        }, { once: true });
    }
    afterAnimation(parent, alertsBelow, delay) {
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
    disableButtons() {
        this.buttons.forEach(button => {
            button.disabled = true;
        });
    }
    enableButtons() {
        this.buttons.forEach(button => {
            button.disabled = false;
        });
    }
}
