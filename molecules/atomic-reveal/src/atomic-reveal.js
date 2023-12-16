class AtomicReveal extends HTMLElement {
    constructor() {
        super();
        // Attach shadow root and clone template content into it
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
                /* Lightbox styling */
                .lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--atomic-reveal--content-background,rgba(70,150,153,0.8));
                    display: none;
                    justify-content: center;
                    align-items: center;
                }
                .lightbox-content {
                    position: relative;
                    background: var(--atomic-reveal--content-background,rgba(255,255,255,0.9));
                    color: black;
                    width:800px;
                    height:600px;
                    max-width: var(--atomic-reveal--lb-maxw,80%);
                    max-height: var(--atomic-reveal--lb-maxh,80%);
                    overflow: auto;
                    padding: var(--atomic-reveal--content-padding,40px 60px 40px 40px);
                    
                }
                .close-button {
                    position: absolute;
                    color:#333;
                    padding: 10px;
                    background-color: #eeee;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 20px;
                }
            </style>
            <slot name="button">
                <button>Open lightbox</button>
            </slot>
            <div class="lightbox" part="lightbox">
                <div class="lightbox-content" part="lightbox-content">
                    <slot></slot>
                    <div class="close-button" part="close-button" slot="close-bt">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                          <path fill="currentColor" d="M15.3 14.7c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L8 9.4 2.1 15.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L6.6 8 .7 2.1c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 6.6l5.9-5.9c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L9.4 8l5.9 5.9z"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        // Bind event handlers
        this._onButtonClick = this._onButtonClick.bind(this);
        this._onCloseClick = this._onCloseClick.bind(this);
        this._onOutsideClick = this._onOutsideClick.bind(this);
    }

    connectedCallback() {
        // Find button slot and add click listener
        const buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
        buttonSlot.addEventListener('click', this._onButtonClick);

        // Find close button and add click listener
        const closeButton = this.shadowRoot.querySelector('.close-button');
        closeButton.addEventListener('click', this._onCloseClick);

        // Add click listener to the lightbox to close it when clicking outside of it
        const lightbox = this.shadowRoot.querySelector('.lightbox');
        lightbox.addEventListener('mousedown', this._onOutsideClick);
    }

    disconnectedCallback() {
        // Remove event listeners
        const buttonSlot = this.querySelector('slot[name="button"]');
        buttonSlot.removeEventListener('click', this._onButtonClick);

        const closeButton = this.shadowRoot.querySelector('.close-button');
        closeButton.removeEventListener('click', this._onCloseClick);

        const lightbox = this.shadowRoot.querySelector('.lightbox');
        lightbox.removeEventListener('click', this._onOutsideClick);
    }

    _onButtonClick() {
        // Show lightbox
        const lightbox = this.shadowRoot.querySelector('.lightbox');
        lightbox.style.display = 'flex';
    }

    _onCloseClick() {
        // Hide lightbox
        const lightbox = this.shadowRoot.querySelector('.lightbox');
        lightbox.style.display = 'none';
    }

    _onOutsideClick(event) {
        // Hide lightbox if clicked outside of it
        if (event.target.classList.contains('lightbox')) {
            const lightbox = this.shadowRoot.querySelector('.lightbox');
            lightbox.style.display = 'none';
        }
    }
}

customElements.define('atomic-reveal', AtomicReveal);
