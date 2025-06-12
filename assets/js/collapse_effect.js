export default class CollapseEffectManager {


    static getAnimationDuration(height) {
        const durationPerPixel = 0.5;
        const min = 150;
        const max = 600;
        return Math.max(min, Math.min(max, height * durationPerPixel));
    }

    static expand(content, animate = true, callback) {
        const endHeight = content.scrollHeight;
        content.setAttribute('data-expanded', 'true');

        if (!animate) {
            if (typeof callback === 'function') callback();
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
        };
    }

    static collapse(content) {
        const startHeight = content.scrollHeight;
        content.style.height = `${startHeight}px`;
        content.offsetHeight; // force reflow

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
        };
    };

}