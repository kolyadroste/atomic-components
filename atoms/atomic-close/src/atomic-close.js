export default class AtomicClose extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <style>
                :host{
                  --atomic-close--margin:20px;
                  --atomic-close--bt-size:20px;
                  --atomic-close--bt-color-x:black;
                  --atomic-close--bt-background:white;
                  --atomic-close--bt-border-radius:30px;
                  --atomic-close--bt-padding: 10px;
                  --atomic-close--hover-margin: 10px 0 0 10px;
                  --atomic-close--max-height: 500px;
                  opacity: 1;
                  display:inline-block;
                  position: relative;
                  min-height:calc(var(--atomic-close--bt-size) + var(--atomic-close--bt-padding));
                }
                :host([hidden]){
                display:none;
                }
                .open-close-bt:hover{
                  opacity: 0.9;
                }
                .hover-wrapper{
                    visibility:hidden;
                    position: absolute;
                    top:0;
                    left:100%;
                    margin:var(--atomic-close--hover-margin);
                    width:120px;
                }
                .open-close-bt{
                    position: absolute;
                    right:var(--atomic-close--margin);
                    top:var(--atomic-close--margin);
                    z-index:100;
                    cursor:pointer;
                    padding:var(--atomic-close--bt-padding);
                    box-sizing: border-box;
                    width: calc(var(--atomic-close--bt-size) + var(--atomic-close--bt-padding));
                    border-radius: var(--atomic-close--bt-border-radius);
                    background:var(--atomic-close--bt-background);
                    fill:var(--atomic-close--bt-color-x);
                    align-items: center;
                    justify-content: center;
                }
                svg{
                    width:calc(var(--atomic-close--bt-size) / 2);
                }
                .open-close-bt:hover .hover-wrapper{
                    visibility: visible;
                }
                slot[name="open-icon"]{
                    display: none;
                }
                :host([closed]) slot[name="hover-close-bt"]{
                    display: none;
                }
                :host([closed]) slot[name="close-icon"]{
                    display: none;
                }
                :host([closed]) slot[name="open-icon"]{
                    display: block;
                }
                svg{
                display:block;
                }
                .content-container{
                    transition: max-height 0.5s ease-in-out;
                    overflow: hidden;
                    max-height:var(--atomic-close--max-height);  
                    position: relative;
                }
                .content-container[closed]{
                    max-height:0;  
                }
                
            </style>
            <div class="open-close-bt" part="close-bt">
                <slot name="close-icon">
                    <svg version="1.1" id="close" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    \t viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                    \tc-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                    \tc-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                    \tc-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                    \tl171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                    \tc6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                </slot>
                 <slot name="open-icon">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    \t viewBox="0 0 242.133 242.133" style="enable-background:new 0 0 242.133 242.133;" xml:space="preserve">
                    <g id="XMLID_25_">
                    \t<path id="XMLID_26_" d="M89.247,131.673l-47.732,47.73l-15.909-15.91c-4.29-4.291-10.742-5.572-16.347-3.252
                    \t\tC3.654,162.563,0,168.033,0,174.1v53.032c0,8.284,6.716,15,15,15l53.033,0.001c0.007-0.001,0.012-0.001,0.019,0
                    \t\tc8.285,0,15-6.716,15-15c0-4.377-1.875-8.316-4.865-11.059l-15.458-15.458l47.73-47.729c5.858-5.858,5.858-15.355,0-21.213
                    \t\tC104.603,125.815,95.104,125.816,89.247,131.673z"/>
                    \t<path id="XMLID_28_" d="M227.133,0H174.1c-6.067,0-11.536,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l15.911,15.911
                    \t\tl-47.729,47.73c-5.858,5.858-5.858,15.355,0,21.213c2.929,2.929,6.768,4.393,10.606,4.393c3.839,0,7.678-1.464,10.606-4.394
                    \t\tl47.73-47.73l15.909,15.91c2.869,2.87,6.706,4.394,10.609,4.394c1.933,0,3.882-0.373,5.737-1.142
                    \t\tc5.605-2.322,9.26-7.792,9.26-13.858V15C242.133,6.716,235.417,0,227.133,0z"/>
                    </g>
                    </svg>
                </slot>
                <div class="hover-wrapper">
                    <slot name="hover-open-bt"></slot>   
                    <slot name="hover-close-bt"></slot>   
                </div>
            </div>

            <div class="content-container">
                 <slot></slot>         
            </div>

        `;
    }
    get closeTarget(){
        let target = this.hasAttribute("target") ? this.getAttribute("target") : null;
        if(target) {
            target = document.querySelector(target);
        }else{
            console.error("atomic-close: target not found");
        }
        return target;
    }
    get contentContainer(){
        return this.shadowRoot.querySelector(".content-container");
    }
    get button(){
        return this.shadowRoot.querySelector(".open-close-bt");
    }
    connectedCallback(){
        this.button.addEventListener("click",()=>{
            this.onPress();
        });
    }
    toggleButton(){
        console.log("toggleButton");
        if(this.button.hasAttribute("closes")){
            this.button.removeAttribute('closed');
        }else{
            this.button.setAttribute("closed","");
        }
    }
    toggleContent(){
        console.log("toggleContent");
        if(this.contentContainer.hasAttribute("closed")){
            this.contentContainer.removeAttribute("closed");
            this.removeAttribute("closed");
        }else{
            this.contentContainer.setAttribute("closed","");
            this.setAttribute("closed","");
        }

    }
    onPress(){
        if(this.hasAttribute("toggleInnerContent")){
            this.toggleContent();
            this.toggleButton();
        }else{
            this.setAttribute("hidden","")
        }
    }
}

if (customElements.get('atomic-close') === undefined) {
    customElements.define('atomic-close', AtomicClose);
}
