class AtomicSliderPrevnextButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        @charset "UTF-8";
        :host {
          box-sizing: content-box;
          display: block;
          position: absolute;
          height: 100%;
          z-index: 1;
        }
        
        button {
          appearance: none;
          color: rgba(255, 255, 255, 0);
          display: inline-block;
          border: none;
          height: 100%;
          padding: 0 1rem;
          margin: 0;
          text-decoration: none;
          background: transparent;
          font-family: sans-serif;
          font-size: 1rem;
          line-height: 0;
          cursor: pointer;
          text-align: center;
          transition: background 250ms ease-in-out, transform 150ms ease;
        }

        :host([data-action=move-forward]){
          right:0;
        }
        
        .icon{
          margin: 0;
          display: block;
          vertical-align: middle;
          transform: rotate(var(--atomic-slider-prevnext-button-prevrotation,0deg));
          color:var(--atomic-slider-prevnext-button-color,white);
          text-shadow: 0px 0px 7px black;
          font-weight:var(--atomic-slider-prevnext-button-iconweight,bold);
          font-size:var(--atomic-slider-prevnext-button-iconsize,40px);
        }
        .icon svg{
          stroke: var(--atomic-slider-prevnext-arrow-color,white); 
          stroke-width: var(--atomic-slider-prevnext-arrow-stroke,4px); 
          width: var(--atomic-slider-prevnext-arrow-size,20px); 
        }
        button:focus {
          outline: none;
        }
        
        button:focus {
          background: rgba(255,255,255,0.3);
        }
        button:focus:not(:focus-visible) {
          background: transparent;
        }

        button:active {
          transform: scale(0.99);
        }
        
        :host([data-action=move-forward]) .icon{
          transform:rotate(var(--atomic-slider-prevnext-button-nextrotation,180deg));
        }
        :host{
          -webkit-filter: var(--atomic-slider-prevnext-arrowleft-shadow, drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7)));
          filter: var(--atomic-slider-prevnext-arrowleft-shadow, drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7)));
        } 
        :host(:hover){
          opacity:0.8;
        }
      </style>
      <button>
        <span class="icon" style="font-family:u2800">
          <slot>
            <svg viewBox="0 0 22 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.9688 2.00049L2.99825 18.5843L19.9688 35.168" ></path></svg>
            ${this.getAttribute('message')}
          </slot>
        </span>
      </button>
    `;
    }

    render() {
        return html`
      <button>
        <span class="icon" style="font-family:u2800">
          <slot>
            <svg viewBox="0 0 22 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.9688 2.00049L2.99825 18.5843L19.9688 35.168"></path>
            </svg>
            ${this.message}
          </slot>
        </span>
      </button>
    `;
    }
}

customElements.define('atomic-slider-prevnext-button', AtomicSliderPrevnextButton);
