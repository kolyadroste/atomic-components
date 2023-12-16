class AtomicStickystate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: -webkit-sticky;
          position: sticky;
        }
      </style>
      <slot></slot>
    `;
        this.scrollCorrHeight = 0;
        this.isStuck = false;
        this.scrollThreshold = parseInt(this.getAttribute('scrollThreshold')) || 0;
        this.updateStickyStatus = this.updateStickyStatus.bind(this);
    }

    connectedCallback() {
        window.addEventListener('scroll', this.updateStickyStatus);
        window.addEventListener('resize', this.updateStickyStatus);
        this.updateStickyStatus();
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.debounce);
        window.removeEventListener('resize', this.updateStickyStatus);
    }

    updateStickyStatus(e) {
        const newStuckStatus = window.scrollY > this.scrollThreshold;
        if (newStuckStatus !== this.isStuck) {
            this.isStuck = newStuckStatus;

            if (this.isStuck) {
                this.dispatchEvent(new Event('stuck'));
                this.setAttribute('stuck', '');
            } else {
                this.dispatchEvent(new Event('unstuck'));
                this.removeAttribute('stuck');
            }
        }
    }
}

customElements.define('atomic-stickystate', AtomicStickystate);
