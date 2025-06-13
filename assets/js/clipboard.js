export default class CopyToClipboardManager {
    init() {
        this.initCopyOnClick();
    }
    initCopyOnClick() {
        const buttonCopyToClipboard = document.querySelectorAll('[data-action="copy"]');
        buttonCopyToClipboard.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector)
                    return;
                const target = document.querySelector(targetSelector);
                if (!target)
                    return;
                const textToCopy = target.innerText;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        this.handleTooltip(button);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
                else {
                    // Fallback for older browsers
                    this.fallbackCopyText(textToCopy, button);
                }
            });
        });
    }
    fallbackCopyText(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // éviter le scroll
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.handleTooltip(button);
            }
            else {
                console.error('Fallback: Copy command was unsuccessful');
            }
        }
        catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
        document.body.removeChild(textarea);
    }
    handleTooltip(button) {
        button.classList.add('tooltip-visible');
        setTimeout(() => {
            button.classList.remove('tooltip-visible');
        }, 1500);
    }
}
