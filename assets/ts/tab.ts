export default class TabsManager {
    init(): void {
        const tabButtons = document.querySelectorAll<HTMLElement>('[data-toggle="tab"]');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSelector = button.getAttribute('data-target');
                if (!targetSelector) return;

                const content = document.querySelector<HTMLElement>(targetSelector);
                if (!content) return;

                this.deactivateTabs();
                this.hideAllContents();
                this.clearActiveData();

                this.activateTab(button);
                this.showContent(content);
            });
        });
    };

    private deactivateTabs(): void {
        const buttons = document.querySelectorAll<HTMLElement>('[data-toggle="tab"]');
        buttons.forEach(button => button.classList.remove('active'));
    };

    private activateTab(button: HTMLElement): void {
        button.classList.add('active');
    };

    private hideAllContents(): void {
        const contents = document.querySelectorAll<HTMLElement>('.tab-content');
        contents.forEach(content => {
            content.style.display = 'none';
        });
    };

    private showContent(content: HTMLElement): void {
        content.style.display = 'block';
    };

    private clearActiveData(): void {
        const activeContents = document.querySelectorAll<HTMLElement>('.tab-content[data-active="true"]');
        activeContents.forEach(content => {
            content.removeAttribute('data-active');
        });
    };
}
