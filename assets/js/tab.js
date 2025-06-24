export default class TabsManager {
    init() {
        this.initAllTabs();
    }
    ;
    initAllTabs() {
        const tabs = document.querySelectorAll('[data-component="tabs"]');
        if (!tabs)
            return;
        tabs.forEach(tab => {
            const tabButtons = tab.querySelectorAll('[data-action="toggle-tab"]');
            this.initTab(tab);
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetSelector = button.getAttribute('data-target');
                    if (!targetSelector)
                        return;
                    const content = document.querySelector(targetSelector);
                    if (!content)
                        return;
                    this.removeAllClassActive(tab);
                    this.removeAllDataActive(tab);
                    this.addClassActive(button);
                    this.addDataActive(content);
                });
            });
        });
    }
    ;
    initTab(tab) {
        const tabContents = tab.querySelectorAll('.tab-content');
        if (tabContents.length === 0)
            return;
        const hasActive = Array.from(tabContents).some(content => content.hasAttribute('data-active'));
        if (!hasActive) {
            tabContents[0].setAttribute('data-active', 'true');
            tab.querySelectorAll('[data-action="toggle-tab"]')[0].classList.add('active');
        }
    }
    removeAllClassActive(tab) {
        const buttons = tab.querySelectorAll('[data-action="toggle-tab"]');
        buttons.forEach(button => button.classList.remove('active'));
    }
    ;
    addClassActive(button) {
        button.classList.add('active');
    }
    ;
    removeAllDataActive(tab) {
        const contents = tab.querySelectorAll('.tab-content');
        contents.forEach(content => {
            content.removeAttribute('data-active');
        });
    }
    ;
    addDataActive(content) {
        content.setAttribute('data-active', 'true');
    }
    ;
}
