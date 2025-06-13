export default class SettingManager {

    init(): void {
        this.initColors();
        this.initFontSize();
        this.initFontWeight();
    }

    private initColors():void {
        const inputsColors = document.querySelectorAll<HTMLInputElement>('input[type="color"][data-action="setting"]')
        inputsColors.forEach((input) => {
            input.addEventListener('input', (event: Event) => {
                const target = event.target as HTMLInputElement;
                const variable = target.dataset.variable;
                if (variable) {
                    document.documentElement.style.setProperty(variable, target.value);
                }
            });
        });
    };

    private initFontSize():void {
        const rangeInput = document.getElementById('font-size') as HTMLInputElement | null;
        const valueDisplay = document.getElementById('font-size-value') as HTMLElement | null;

        if (rangeInput && valueDisplay) {
            valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
                document.documentElement.style.setProperty('--font-size-base', `${rangeInput.value}rem`);
            });
        }
    }

    private initFontWeight():void {
        const rangeInput = document.getElementById('font-weight') as HTMLInputElement | null;
        const valueDisplay = document.getElementById('font-weight-value') as HTMLElement | null;

        if (rangeInput && valueDisplay) {
            valueDisplay.textContent =  rangeInput.value;
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = rangeInput.value;
                document.documentElement.style.setProperty('--font-weight-base', `${rangeInput.value}`);
            });
        }
    }

}