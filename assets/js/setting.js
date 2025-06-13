export default class SettingManager {
    init() {
        this.initColors();
        this.initFontSize();
        this.initFontWeight();
    }
    initColors() {
        const inputsColors = document.querySelectorAll('input[type="color"][data-action="setting"]');
        inputsColors.forEach((input) => {
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
    initFontSize() {
        const rangeInput = document.getElementById('font-size');
        const valueDisplay = document.getElementById('font-size-value');
        if (rangeInput && valueDisplay) {
            valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = parseFloat(rangeInput.value).toFixed(2);
                document.documentElement.style.setProperty('--font-size-base', `${rangeInput.value}rem`);
            });
        }
    }
    initFontWeight() {
        const rangeInput = document.getElementById('font-weight');
        const valueDisplay = document.getElementById('font-weight-value');
        if (rangeInput && valueDisplay) {
            valueDisplay.textContent = rangeInput.value;
            rangeInput.addEventListener('input', () => {
                valueDisplay.textContent = rangeInput.value;
                document.documentElement.style.setProperty('--font-weight-base', `${rangeInput.value}`);
            });
        }
    }
}
