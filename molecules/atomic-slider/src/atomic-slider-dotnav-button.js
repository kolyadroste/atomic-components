class AtomicSliderDotnavButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: inline-block;
              z-index: 100;
            }
            
            button {
                display:block;
                background:var(--base-slider-dotnav-button-background,white);
                height: var(--base-slider-dotnav-button-height,12px);  
                border-radius:100%;
                margin: var(--base-slider-dotnav-button-margin,0 10px 0 0);
                width: var(--base-slider-dotnav-button-width,12px);  
                outline:none; 
                  border: solid 2px white;
                padding:0;
                box-shadow: 0px 0px 3px 2px rgba(0,0,0,.4);
            
            }
            :host([active]) button{
                background:var(--base-slider-dotnav-button-background-active,#90cbff);
            }
            
            
            button:focus {
                border: solid 2px white;
                box-shadow: 0 0 10px #9ecaed;
                background:var(--base-slider-dotnav-button-background-active,#90cbff);
            }
          </style>
          <button><slot></slot></button>
        `;
        this._button = this.shadowRoot.querySelector('button');
    }

    connectedCallback() {
        this._button.addEventListener('click', this._handleClick.bind(this));
    }

    disconnectedCallback() {
        this._button.removeEventListener('click', this._handleClick.bind(this));
    }

    get label() {
        return this.getAttribute('label');
    }

    _handleClick() {
        const action = this.getAttribute('action');
        if (action) {
            this.dispatchEvent(new CustomEvent(action));
        }
    }
}

customElements.define('atomic-slider-dotnav-button', AtomicSliderDotnavButton);
