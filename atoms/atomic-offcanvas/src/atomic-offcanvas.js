

class AtomicOffcanvas extends HTMLElement {
    static get observedAttributes() {
        return [ 'openSelector','pos' ];
    }

    _getAttributes(){
        this.currentButton = null;
        this.uuid = this.uuidv4();
        this.offcanvasContent = null;
        this.pos = this.getAttribute("pos");
        this.pageBody = document.querySelector("body");
        this.openSelector = this.getAttribute("openSelector")
        this.openSelector = this.openSelector ? this.openSelector : "base-open-offcanvas";
        this.eventInitialized = new CustomEvent("initialized");
        this.eventOpen = new CustomEvent("open");
        this.eventClose = new CustomEvent("close");
    }

    constructor() {
        super();
        this._getAttributes();


        const style = `
          :host{
            z-index:var(--atomic-offcanvas-zindex,99999);
          }   
          button {
            width: 64px;
            height: 64px;
            border: none;
            border-radius: 10px;
            background-color: seagreen;
            color: white;
          }
          #offcanvas-content{
            z-index:99999;
            box-sizing: border-box;
            height:auto;
            max-height:var(--atomic-offcanvas-height, 100vh);
            min-height:var(--atomic-offcanvas-height, 100vh);
            width: var(--atomic-offcanvas-width);
            max-width:100%;
            transition: transform 0.5s ease, -webkit-transform 0.5s ease;
            background:var(--atomic-offcanvas-bg-color, white);
            padding:var(--atomic-offcanvas-padding, 20px);
            position: fixed;
            left:0%;
            transform: translateX(-100%);
            top:0;
            border-right:1px solid #eee;
            overflow-x:hidden;
            overflow-y:auto;
            
            box-shadow: 2px 2px 30px 7px rgba(0, 0, 0, 0.2);
          }
          :host([pos="top"]) #offcanvas-content{
            transform: translateY(-100%);
            width:100%;
          }
          :host([pos="top"][state="open"]) #offcanvas-content{
            position: fixed;
            opacity:1;
            left:0;
            top:0;
            transform: translate(0, 0);
          }
          :host([pos="right"]) #offcanvas-content{
            transform: translateX(100%);
            left:auto !important;
            right:0;
            width:var(--atomic-offcanvas-width, 495px);
          }
          :host([pos="bottom"]) #offcanvas-content{
            transform: translateY(100%);
            top:auto;
            bottom:0;
            width:100%;
          }
          
          :host([state="open"]) #offcanvas-content{
            position: fixed;
            opacity:1;
            left:0;
            top:0;
            transform: translate(0, 0);
          }

          #overlay{
            position:fixed;
            z-index:99998;
            top:0;
            left:0;
            opacity:0;
            width:100%;
            height:100%;
            transition: opacity .5s ease-in-out;
            background-color:rgba(0,0,0,0.1);
            visibility:hidden;
            
          }
          :host([state="open"]) #overlay{
            visibility:visible;
            opacity:1;
          }
        `;
        const html = `
          <slot></slot>
          <div id="overlay" part="overlay"></div>
          <div id="offcanvas-content" part="offcanvas-content" aria-hidden="true">
              <slot name="offcanvas-content"></slot>
          </div>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
              ${style}
            </style>
            
            ${html}
        `;
    }


    // then will attibuteChangedCallback will be calles
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal) {
            //console.log(`${name} changed from ${oldVal} to ${newVal}`)
        }
    }

    firstUpdated(){
        this.offcanvasContent = this.shadowRoot.querySelector("#offcanvas-content");
        this.buttons = this.querySelectorAll(this.openSelector);
        this.setAccessibility();

        if(this.dataCloseOnEsc==='true'){
            document.removeEventListener('keydown',this.handleEsc);
        }
        Object.entries(this.buttons).forEach((button)=>{
            button[1].addEventListener("click",(e)=>{
                let button = e.target;
                this._buttonClick.bind(this);
                this._buttonClick(button);

            });
        });
    }

    setAccessibility(){
        this.buttons = this.querySelectorAll(this.openSelector);
        if(this.buttons.length > 0) {
            this.offcanvasContent.setAttribute("aria-labelledby", this.uuid)
        }
        Object.entries(this.buttons).forEach((button)=>{
            button[1].setAttribute("id",this.uuid);
        });

        this.offcanvasContent.setAttribute("aria-hidden","false");

    }

    _handleClickOutside(event) {
        let canvasCheck = event.target;
        if(canvasCheck.getAttribute("id") === "overlay"){
            this.close();
            if(this.currentButton === null){
                return;
            }
            this.currentButton.setAttribute("aria-expanded", "false");
        }
    };

    open(){
        this.dispatchEvent(this.eventOpen);
        this.pageBody.style.overflowY = "hidden";
        this.state = "open";
        // timeout is used to quarantee a smooth transition
        setTimeout(()=>{
            this.setAttribute("state", "open");
        },300);

        this.shadowRoot.addEventListener('click', this._handleClickOutside.bind(this),true);

        // key ESC event
        document.addEventListener('keydown', this._handleEsc.bind(this));
        if(this.currentButton !== null) {
            this.currentButton.setAttribute("aria-expanded", "true");
        }

    }
    close(){
        this.offcanvasContent.setAttribute("aria-hidden","true");
        this.dispatchEvent(this.eventClose);
        this.pageBody.style.overflowY = "initial";
        this.state = "closed";
        // timeout is used to quarantee a smooth transition
        setTimeout(()=> {
            this.setAttribute("state", "closed");
        },300);
        this.shadowRoot.removeEventListener('click', this._handleClickOutside.bind(this),true);

    }

    // Handler for keydown Event
    _handleEsc (e) {
        if(e.key === "Escape") {
            this.close();
            if(this.currentButton !== null){
                this.currentButton.setAttribute("aria-expanded", "false");
            }
        }
    }

    _buttonClick(button){
        this.currentButton = button;
        if(this.state === "closed" || this.state === undefined){
            this.open();
            this.currentButton.setAttribute("aria-expanded", "true");
        }else{
            this.close();
        }
    }

    connectedCallback() {
        this.dispatchEvent(this.eventInitialized);
        // this.buttonInc.addEventListener('click', this.inc);
        this.firstUpdated();
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

customElements.define('atomic-offcanvas', AtomicOffcanvas);


