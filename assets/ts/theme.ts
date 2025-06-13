export default class ThemeManager {

    init(): void {
        this.initTheme();
        this.initCheckbox();
        this.toggleTheme();
        this.handleClickButtonTheme();
    };

    private initCheckbox(): void {
        const checkbox = document.getElementById('switch-theme') as HTMLInputElement | null;
        if (!checkbox) return;

        let theme = localStorage.getItem('theme');
        if (theme === null) {
            theme = this.getSystemTheme();
        }
        checkbox.checked = theme === 'dark';
    };

    private getSystemTheme(): 'dark' | 'light' {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    private applyTheme(theme: 'dark' | 'light'): void {
        document.documentElement.setAttribute('prefers-color-scheme', theme);
    };

    private initTheme(): void {
        const savedTheme = localStorage.getItem('theme') as ('dark' | 'light' | null);
        const theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : this.getSystemTheme();
        this.applyTheme(theme);
    };

    private toggleTheme(): void {
        const checkbox = document.getElementById('switch-theme') as HTMLInputElement | null;
        if (!checkbox) return;

        checkbox.addEventListener('change', () => {
            const theme: 'dark' | 'light' = checkbox.checked ? 'dark' : 'light';
            this.handleTransition();
            this.applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    };

    private handleTransition(): void {
        document.documentElement.classList.add('transition-theme');
        setTimeout(() => {
            document.documentElement.classList.remove('transition-theme');
        }, 400);
    };

    private handleClickButtonTheme(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-btn-theme]');
        if (!buttons.length) return;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const desiredTheme = button.getAttribute('data-btn-theme');
                if (desiredTheme !== 'dark' && desiredTheme !== 'light') return;

                const targetSelector = button.getAttribute('data-target');
                if (targetSelector) {
                    const target = document.querySelector(targetSelector) as HTMLInputElement | null;
                    if (target && target.type === 'checkbox') {
                        target.checked = (desiredTheme === 'dark');
                    }
                }

                this.handleTransition();
                this.applyTheme(desiredTheme);
                localStorage.setItem('theme', desiredTheme);
            });
        });
    };
}
