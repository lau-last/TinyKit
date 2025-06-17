export default class ConverterManager {
    static convertToPx(value, context = document.documentElement) {
        var _a;
        const unit = (_a = value.match(/[a-z%]+$/i)) === null || _a === void 0 ? void 0 : _a[0];
        const numeric = parseFloat(value);
        if (!unit || isNaN(numeric))
            return 0;
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
