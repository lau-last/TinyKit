export default class CollapseEffectManager {
    // height en pixels
    static getAnimationDuration(height) {
        const durationPerPixel = 0.5;
        const min = 150;
        const max = 600;
        return Math.max(min, Math.min(max, height * durationPerPixel));
    }
    ;
    static expand(content, animate = true, callback) {
        const endHeight = content.scrollHeight;
        content.setAttribute('data-expanded', 'true');
        if (!animate) {
            content.style.height = 'auto';
            if (callback)
                callback();
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
            if (callback)
                callback();
        };
    }
    ;
    static collapse(content, animate = true, resetToCssDefaultAfterAnimation = false, callback) {
        const startHeight = content.scrollHeight;
        content.style.height = `${startHeight}px`;
        const finalHeight = resetToCssDefaultAfterAnimation ? '' : '0px';
        if (!animate) {
            content.setAttribute('data-expanded', 'false');
            content.style.height = finalHeight;
            if (callback)
                callback();
            return;
        }
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
            content.style.height = finalHeight;
            if (callback)
                callback();
        };
    }
    ;
}
