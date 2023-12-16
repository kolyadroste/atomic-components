/**
 * @license
 * @Author Kolya von Droste zu Vischering
 *
 * @slot - This element has a slot
 */
export default class BaseLoadingOverlay extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.label = this.hasAttribute("label") ? this.getAttribute("label") : '';
        this.posHorizontal = this.hasAttribute("posHorizontal") ? this.getAttribute("posHorizontal") : 'centered';
        this.posVertical = this.hasAttribute("posVertical") ? this.getAttribute("posVertical") : 'centered';
    }

    firstUpdated () {
        if(this.posHorizontal === 'centered'){}
        else{
            this.classList.add(this.posHorizontal);
        }
        if(this.posVertical === 'centered'){}
        else{
            this.classList.add(this.posVertical);
        }
    }

    // fires each time an custom-Element is added into a document-connected element
    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
<style>
   :host{
        --base-loading-overlay-zindex:1000;
        --base-loading-overlay-background-color:0,0,0;
        --base-loading-overlay-background--color-alpha:0.2;
        display:none;
        align-items:center;
        justify-content:center;
        position:fixed;
        left:0;
        width:100vw;
        top:0;
        height:100vh;
        z-index:var(--base-loading-overlay-zindex);
        background-color:rgba(var(--base-loading-overlay-background-color),var(--base-loading-overlay-background--color-alpha));
    }
    :host([transparent]){
        background-color:transparent;
    }
    :host([open]){
        display:flex;
    }
    :host([top]){
        align-items:baseline;
    }
    :host([bottom]){
        align-items:flex-end;
    }
    :host([left]){
        justify-content:flex-start;
    }
    :host([right]){
        justify-content:flex-end;
    }
    :host p {
        padding:0;
        margin:0 0 10px 0;
        text-align:center;
    }
</style>
            
<div class="loadingContent">
   <slot name="svg">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(30 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(60 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(90 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(120 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(150 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(180 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(210 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(240 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(270 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(300 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(330 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#85a2b6">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
          </rect>
        </g>
        </svg>
    </slot>
    ${this.label ? `<p>${this.label}</p>`: ''}
    <slot></slot>
</div>
           
        `;
    }
}

if(customElements.get("base-loading-overlay") === undefined){
    customElements.define('base-loading-overlay', BaseLoadingOverlay);
}
