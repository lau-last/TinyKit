import LocalStorageManager from "./local_storage.js";

export default class SettingManager {

    init(): void {
        this.initStates();
        this.initColors();
        this.initFontSize();
        this.initFontWeight();
        this.saveState();
        this.initReset();
    }

    private initStates(): void {
        const states: Record<string, unknown> = LocalStorageManager.getStates('tiny_kit_setting');

        for (const key of Object.keys(states)) {
            let value = LocalStorageManager.getState<string>('tiny_kit_setting', key);
            if (value === null) {continue;}
            if (key === '--font-size-base') {
                value = value + 'rem';
            }
            document.documentElement.style.setProperty(key, value);
        }
    }

    private initColors(): void {
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

    private saveState(): void {
        const allInputs: HTMLInputElement[] = [];
        const inputsColors = document.querySelectorAll<HTMLInputElement>('input[type="color"][data-action="setting"]');
        const inputFontSize = document.getElementById('font-size') as HTMLInputElement | null;
        const inputFontWeight = document.getElementById('font-weight') as HTMLInputElement | null;

        for (const input of inputsColors) {
            allInputs.push(input);
        }
        if (inputFontSize) {
            allInputs.push(inputFontSize);
        }
        if (inputFontWeight) {
            allInputs.push(inputFontWeight);
        }

        allInputs.forEach((input) => {
            input.addEventListener('change', () => {
                const value = input.value;
                const dataVariable = input.getAttribute('data-variable');
                if (!dataVariable) {
                    LocalStorageManager.setState('tiny_kit_setting', input.id, value);
                } else {
                    LocalStorageManager.setState('tiny_kit_setting', dataVariable, value);
                }
            });
        });
    };

    private initFontSize(): void {
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

    private initFontWeight(): void {
        const rangeInput = document.getElementById('font-weight') as HTMLInputElement | null;
        const valueDisplay = document.getElementById('font-weight-value') as HTMLElement | null;

        if (rangeInput && valueDisplay) {
            valueDisplay.textContent = rangeInput.value;
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = rangeInput.value;
                document.documentElement.style.setProperty('--font-weight-base', `${rangeInput.value}`);
            });
        }
    }

    private initReset(): void {
        const buttonReset = document.getElementById('reset') as HTMLButtonElement | null;
        if (buttonReset) {
            buttonReset.addEventListener('click', () => {
                LocalStorageManager.clearPrefix("tiny_kit_");
                location.reload();
            });
        }
    };


}