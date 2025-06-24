export default class TabsManager {

    init(): void {
        this.initAllTabs();
    };


    private initAllTabs(): void {
        const tabs = document.querySelectorAll<HTMLElement>('[data-component="tabs"]');
        if (!tabs) return;
        tabs.forEach(tab => {
            const tabButtons = tab.querySelectorAll<HTMLElement>('[data-action="toggle-tab"]');
            this.initTab(tab);
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetSelector = button.getAttribute('data-target');
                    if (!targetSelector) return;
                    const content = document.querySelector<HTMLElement>(targetSelector);
                    if (!content) return;
                    this.removeAllClassActive(tab);
                    this.removeAllDataActive(tab);
                    this.addClassActive(button);
                    this.addDataActive(content);
                });
            });
        });
    };

    private initTab(tab: HTMLElement): void {
        const tabContents = tab.querySelectorAll<HTMLElement>('.tab-content');
        if (tabContents.length === 0) return;

        const hasActive = Array.from(tabContents).some(content =>
            content.hasAttribute('data-active')
        );

        if (!hasActive) {
            tabContents[0].setAttribute('data-active', 'true');
            tab.querySelectorAll('[data-action="toggle-tab"]')[0].classList.add('active');
        }
    }

    private removeAllClassActive(tab: HTMLElement): void {
        const buttons = tab.querySelectorAll<HTMLElement>('[data-action="toggle-tab"]');
        buttons.forEach(button => button.classList.remove('active'));
    };

    private addClassActive(button: HTMLElement): void {
        button.classList.add('active');
    };

    private removeAllDataActive(tab: HTMLElement): void {
        const contents = tab.querySelectorAll<HTMLElement>('.tab-content');
        contents.forEach(content => {
            content.removeAttribute('data-active');
        });
    };

    private addDataActive(content: HTMLElement): void {
        content.setAttribute('data-active', 'true');
    };



}
