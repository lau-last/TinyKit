export default class AnimationManager {
    init() {
        this.initAnimation();
    }
    initAnimation() {
        const dataAnimation = document.querySelectorAll('[data-animation]');
        dataAnimation.forEach((element) => {
            const dataListener = element.getAttribute('data-listener');
            if (!dataListener)
                return;
            // Type assertion to ensure the event type is valid
            element.addEventListener(dataListener, () => {
                const animationAttr = element.getAttribute('data-animation');
                if (!animationAttr)
                    return;
                const animationNames = animationAttr.split(' ').filter(Boolean);
                element.classList.remove(...animationNames);
                void element.offsetWidth; // force reflow
                element.classList.add(...animationNames);
                const onAnimationEnd = () => {
                    element.classList.remove(...animationNames);
                };
                element.addEventListener('animationend', onAnimationEnd, { once: true });
            });
        });
    }
}
