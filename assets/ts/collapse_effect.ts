export default class CollapseEffectManager {

    // height en pixels
    static getAnimationDuration(height: number): number {
        const durationPerPixel = 0.5;
        const min = 150;
        const max = 600;
        return Math.max(min, Math.min(max, height * durationPerPixel));
    };

    /**
     * Expand l'élément avec animation ou instantanément.
     * @param content L'élément HTML à développer.
     * @param animate Si false, l'animation est désactivée.
     * @param callback Fonction appelée après expansion instantanée (si animate = false).
     */
    static expand(content: HTMLElement, animate = true, callback?: () => void): void {
        const endHeight = content.scrollHeight;
        content.setAttribute('data-expanded', 'true');

        if (!animate) {
            if (callback) callback();
            content.style.height = 'auto';
            return;
        }

        const duration = this.getAnimationDuration(endHeight);

        const animation = content.animate([
            { height: '0px' },
            { height: `${endHeight}px` }
        ], {
            duration,
            easing: 'ease'
        });

        animation.onfinish = () => {
            content.style.height = 'auto';
            if (callback) callback();
        };
    };

    /**
     * Réduit l'élément avec animation.
     * @param content L'élément HTML à réduire.
     */
    static collapse(content: HTMLElement, animate = true, callback?: () => void): void {
        const startHeight = content.scrollHeight;
        content.style.height = `${startHeight}px`;

        if (!animate) {
            content.setAttribute('data-expanded', 'false');
            content.style.height = '0px';
            return;
        }

        // Forcer reflow pour que l'animation soit prise en compte
        void content.offsetHeight;

        const duration = this.getAnimationDuration(startHeight);

        const animation = content.animate([
            { height: `${startHeight}px` },
            { height: '0px' }
        ], {
            duration,
            easing: 'ease'
        });

        animation.onfinish = () => {
            content.setAttribute('data-expanded', 'false');
            content.style.height = '0px';
            if (callback) callback();
        };
    };
}
