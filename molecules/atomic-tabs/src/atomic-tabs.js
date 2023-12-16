class AtomicTabs extends HTMLElement {
    constructor() {
        super();
        //this.attachShadow({mode: 'open'});
        this.tabs = [];
        this.panels = [];
    }

    connectedCallback() {
        // get all the tab panels and save them in an array
        const tabPanels = this.querySelectorAll('[data-tabpanel]');
        tabPanels.forEach(panel => {
            this.panels.push(panel);
            panel.style.display = 'none';
        });

        // get all the tab buttons and save them in an array
        const tabButtons = this.querySelectorAll('[data-tabbutton]');
        tabButtons.forEach((button, index) => {
            this.tabs.push(button);
            button.addEventListener('click', () => this.showPanel(index));
        });

        // show the first panel by default
        this.showPanel(0);
    }

    showPanel(index) {
        // hide all the panels except for the one at the given index
        this.panels.forEach((panel, i) => {
            if (i === index) {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });

        // update the active state of the buttons
        this.tabs.forEach((button, i) => {
            if (i === index) {
                button.setAttribute('aria-selected', 'true');
            } else {
                button.setAttribute('aria-selected', 'false');
            }
        });
    }

}

customElements.define('atomic-tabs', AtomicTabs);
