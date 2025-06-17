export default class ConverterManager {
    static convertToPx(value: string, context: HTMLElement = document.documentElement): number {
        const unit = value.match(/[a-z%]+$/i)?.[0];
        const numeric = parseFloat(value);

        if (!unit || isNaN(numeric)) return 0;

        switch (unit) {
            case 'px':
                return numeric;
            case 'rem':
                return numeric * parseFloat(getComputedStyle(document.documentElement).fontSize);
            case 'em':
                return numeric * parseFloat(getComputedStyle(context).fontSize);
            case 'vw':
                return numeric * window.innerWidth / 100;
            case 'vh':
                return numeric * window.innerHeight / 100;
            case '%':
                return numeric * parseFloat(getComputedStyle(context).width) / 100;
            default:
                console.warn(`Unité inconnue : ${unit}`);
                return numeric;
        }
    }
}