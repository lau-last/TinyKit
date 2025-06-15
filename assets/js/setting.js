import LocalStorageManager from "./local_storage.js";
export default class SettingManager {
    init() {
        this.initStates();
        this.initColors();
        this.initFontSize();
        this.initFontWeight();
        this.saveState();
        this.initReset();
    }
    initStates() {
        const states = LocalStorageManager.getStates('tiny_kit_setting');
        for (const key of Object.keys(states)) {
            let value = LocalStorageManager.getState('tiny_kit_setting', key);
            if (value === null) {
                continue;
            }
            if (key === '--font-size-base') {
                value = value + 'rem';
            }
            document.documentElement.style.setProperty(key, value);
        }
    }
    initColors() {
        const inputsColors = document.querySelectorAll('input[type="color"][data-action="setting"]');
        inputsColors.forEach((input) => {
            this.setColors(input);
            input.addEventListener('input', (event) => {
                const target = event.target;
                const variable = target.dataset.variable;
                if (variable) {
                    document.documentElement.style.setProperty(variable, target.value);
                }
            });
        });
    }
    ;
    setColors(input) {
        const variable = input.dataset.variable;
        if (!variable)
            return;
        input.value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }
    saveState() {
        const allInputs = [];
        const inputsColors = document.querySelectorAll('input[type="color"][data-action="setting"]');
        const inputFontSize = document.getElementById('font-size');
        const inputFontWeight = document.getElementById('font-weight');
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
                }
                else {
                    LocalStorageManager.setState('tiny_kit_setting', dataVariable, value);
                }
            });
        });
    }
    ;
    initFontSize() {
        const rangeInput = document.getElementById('font-size');
        const valueDisplay = document.getElementById('font-size-value');
        if (rangeInput && valueDisplay) {
            this.setFontSize(rangeInput);
            valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
                document.documentElement.style.setProperty('--font-size-base', `${rangeInput.value}rem`);
            });
        }
    }
    setFontSize(input) {
        const variable = input.dataset.variable;
        if (!variable)
            return;
        let value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        value = value.replace('rem', '');
        input.value = value;
    }
    initFontWeight() {
        const rangeInput = document.getElementById('font-weight');
        const valueDisplay = document.getElementById('font-weight-value');
        if (rangeInput && valueDisplay) {
            this.setFontWeight(rangeInput);
            valueDisplay.textContent = rangeInput.value;
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = rangeInput.value;
                document.documentElement.style.setProperty('--font-weight-base', `${rangeInput.value}`);
            });
        }
    }
    setFontWeight(input) {
        const variable = input.dataset.variable;
        if (!variable)
            return;
        input.value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }
    initReset() {
        const buttonReset = document.getElementById('reset');
        if (buttonReset) {
            buttonReset.addEventListener('click', () => {
                LocalStorageManager.clearPrefix("tiny_kit_setting");
                location.reload();
            });
        }
    }
    ;
}
