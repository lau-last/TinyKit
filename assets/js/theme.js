import LocalStorageManager from "./local_storage.js";
export default class ThemeManager {
    init() {
        this.initTheme();
        this.initCheckbox();
        this.toggleTheme();
        this.handleClickButtonTheme();
    }
    ;
    initCheckbox() {
        const checkbox = document.getElementById('switch-theme');
        if (!checkbox)
            return;
        let theme = localStorage.getItem('tiny_kit_theme');
        if (theme === null) {
            theme = this.getSystemTheme();
        }
        checkbox.checked = theme === 'dark';
    }
    ;
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    ;
    applyTheme(theme) {
        document.documentElement.setAttribute('prefers-color-scheme', theme);
    }
    ;
    initTheme() {
        const savedTheme = LocalStorageManager.getState('tiny_kit_theme', 'switch-theme');
        const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : this.getSystemTheme();
        this.applyTheme(theme);
    }
    ;
    toggleTheme() {
        const checkbox = document.getElementById('switch-theme');
        if (!checkbox)
            return;
        checkbox.addEventListener('change', () => {
            const theme = checkbox.checked ? 'dark' : 'light';
            this.handleTransition();
            this.applyTheme(theme);
            LocalStorageManager.setState('tiny_kit_theme', 'switch-theme', theme);
        });
    }
    ;
    handleTransition() {
        document.documentElement.classList.add('transition-theme');
        setTimeout(() => {
            document.documentElement.classList.remove('transition-theme');
        }, 400);
    }
    ;
    handleClickButtonTheme() {
        const buttons = document.querySelectorAll('[data-btn-theme]');
        if (!buttons.length)
            return;
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const desiredTheme = button.getAttribute('data-btn-theme');
                if (desiredTheme !== 'dark' && desiredTheme !== 'light')
                    return;
                const targetSelector = button.getAttribute('data-target');
                if (targetSelector) {
                    const target = document.querySelector(targetSelector);
                    if (target && target.type === 'checkbox') {
                        target.checked = (desiredTheme === 'dark');
                    }
                }
                this.handleTransition();
                this.applyTheme(desiredTheme);
                LocalStorageManager.setState('tiny_kit_theme', 'switch-theme', desiredTheme);
            });
        });
    }
    ;
}
