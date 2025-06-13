export default class TextContrastManager {

    static variableColors: Record<string, string> = {
        primary: '--primary-color',
        secondary: '--secondary-color',
        tertiary: '--tertiary-color',
        success: '--success-color',
        info: '--info-color',
        warning: '--warning-color',
        danger: '--danger-color',
        neutral: '--neutral-color',
        light: '--light-color',
        dark: '--dark-color',
    };

    init(): void {
        this.setTextContrast();
        window.addEventListener('themeChange', () => {
            this.setTextContrast();
        });
    };

    private getClassSelectors(key: string): string[] {
        return [
            `.bg-${key}`,
            `.btn-${key}`,
            `.badge-${key}`,
            `.table-${key}`,
        ];
    };

    private setTextContrast(): void {
        for (const key in TextContrastManager.variableColors) {
            const cssVar = TextContrastManager.variableColors[key];
            const colorValue = this.getCssVarColor(cssVar);

            if (!colorValue) continue;

            const textColor = this.getContrastYIQ(colorValue);
            const selectors = this.getClassSelectors(key);

            selectors.forEach(selector => {
                this.setColorText(selector, textColor);
            });
        }
    };

    private setColorText(selector: string, textColor: string): void {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        if (!elements.length) return;

        elements.forEach(element => {
            element.style.color = textColor;
        });
    };

    private getContrastYIQ(hexColor: string): string {
        const cleanHex = hexColor.replace('#', '');

        if (cleanHex.length !== 6) {
            console.warn(`Couleur hex invalide : ${hexColor}`);
            return '#000000';
        }

        const red = parseInt(cleanHex.slice(0, 2), 16);
        const green = parseInt(cleanHex.slice(2, 4), 16);
        const blue = parseInt(cleanHex.slice(4, 6), 16);

        // Calcul YIQ : pondération perceptuelle de la luminosité
        const yiq = (red * 299 + green * 587 + blue * 114) / 1000;

        // Retourne une couleur contrastée
        return yiq >= 128 ? '#000000' : '#ffffff';
    };

    private getCssVarColor(varName: string, element: Element = document.documentElement): string | null {
        if (!varName.startsWith('--')) {
            console.warn(`Nom de variable CSS invalide : ${varName}`);
            return null;
        }

        const value = getComputedStyle(element).getPropertyValue(varName).trim();
        return value || null;
    };
}
