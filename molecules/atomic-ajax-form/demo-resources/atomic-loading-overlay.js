export default class AtomicLoadingOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    get label(){
        return this.hasAttribute("label") ? this.getAttribute("label") : '';
    }

    get posHoriz(){
        return this.hasAttribute("posHorizontal") ? this.getAttribute("posHorizontal") : 'centered';
    }

    get posVert(){
        return this.hasAttribute("posVertical") ? this.getAttribute("posVertical") : 'centered';
    }

    firstUpdated () {
        if(this.posHoriz === 'centered'){}
        else{
            this.classList.add(this.posHoriz);
        }
        if(this.posVert === 'centered'){}
        else{
            this.classList.add(this.posVert);
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
        --atomic-loading-overlay--zindex:1000;
        --atomic-loading-overlay--background-color:0,0,0;
        --atomic-loading-overlay-background--color-alpha:0.2;
        display:none;
        align-items:center; justify-content:center; position:fixed;
        left:0; width:100vw; top:0;height:100vh;
        z-index:var(--atomic-loading-overlay--zindex);
        background-color:rgba(var(--atomic-loading-overlay--background-color),var(--atomic-loading-overlay-background--color-alpha));
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
   <slot name="icon">
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

if(customElements.get("atomic-loading-overlay") === undefined){
    customElements.define('atomic-loading-overlay', AtomicLoadingOverlay);
}
