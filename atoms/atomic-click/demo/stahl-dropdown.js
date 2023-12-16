export default class StahlDropdown extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.setAttribute("closed","");
        this.openByHover = this.hasAttribute("openByHover");
    }

    get clickElement(){
        return this.querySelector("[slot='click-element']");
    }

    get animation(){
        this.getAttribute("animation");
    }

    openDropdown(){
        this.removeAttribute("closed");
        this.setAttribute("opening","");
    }

    closeDropdown(){
        this.removeAttribute("opened");
        this.setAttribute("closing","");
    }

    get isOpenedByHover(){
        return this.hasAttribute("openByHover");
    }

    get isDropdownOpen(){
        return this.hasAttribute("opened") || this.hasAttribute("opening");
    }

    get getLinkInClickElement(){
        console.log(this.clickElement.querySelector("a"));
        return this.clickElement.querySelector("a");
    }

    get slideContent(){
        return this.shadowRoot.querySelector(".slide-content");
    }


    connectedCallback() {
        this.render();
        this._setClickEvent();
        this._setTransitionEvents();
    }

    disableDefaultClickBehaviour(){
        console.log("disableClickElement");
        console.log(this.clickElement);
        if(this.clickElement.hasAttribute("href")){
            this.clickElement.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        }
        if(!this.getLinkInClickElement) return;
        this.getLinkInClickElement.style.pointerEvents = "none";
        this.getLinkInClickElement.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
    }

    _setClickEvent(){
        let root = this;
        if(this.isOpenedByHover) return;
        root.disableDefaultClickBehaviour();
        console.log("this.clickElement");
        console.log(this.clickElement);
        this.clickElement.addEventListener('click', function(event) {
            console.log("asdasd");
            root.disableDefaultClickBehaviour();
            event.stopPropagation();
            if(root.isDropdownOpen){
                root.closeDropdown();
            }else{
                root.openDropdown();
                root._activateClickOutside();
            }

        },false);
    }

    _setTransitionEvents(){
        this.slideContent.addEventListener('transitionend', () => {
            if(this.hasAttribute("opening")){
                this.removeAttribute("opening");
                this.setAttribute("opened","");
            }else if(this.hasAttribute("closing")){
                this.removeAttribute("closing");
                this.setAttribute("closed","");
            }
        });
    }

    _activateClickOutside(){
        let root = this;
        let handleClick = function(event) {
            if (event.target) {
                root.closeDropdown();
            }
            this.removeEventListener('click', handleClick);
        }
        document.addEventListener('click', handleClick, false);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host{
                   --atomic-dropdown--width: auto;
                   --atomic-dropdown--border: solid 1px gray;
                   --atomic-dropdown--padding:20px;
                   position: relative;
                   display:block;
                   width:var(--atomic-dropdown--width);
                }
                :host(:hover){
                    z-index:100;
                }
                
                ::slotted([slot="click-element"]){
                    cursor:pointer;
                    user-select: none;
                    z-index: 10;
                    position: relative;
                }

                .slide-wrapper{
                    position: absolute;
                    top:0;
                    height: 100%;
                    transform: translateY(100%);
                }
                :host([closed]) .slide-wrapper{
                    overflow: hidden;
                }
                :host([opening]) .slide-wrapper,
                :host([opened]) .slide-wrapper{
                    overflow: visible;
                }
                .slide{
                    position: absolute;
                    top:0;
                    box-sizing: border-box;
                    display:block;
                    overflow: hidden;
                }

                .slide-content{
                    transition-timing-function: var(--atomic-dropdown--animation-function,ease-in-out);
                    transition:var(--atomic-dropdown--animation-time,0.5s);
                    transform: translateY(-100%);
                    width:var(--atomic-dropdown--width);
                    box-sizing: border-box;
                    background:white;
                    padding:var(--atomic-dropdown--padding);
                    border:var(--atomic-dropdown--border);
                }

                :host([animation="ease-in-out"]) .slide{
                    transition: height 1s ease-in-out;
                }
                :host([opening]) .slide-content,
                :host([opened]) .slide-content{
                    transform: translateY(0%);
                }
                
                :host([animation="ease-in-out"][opened]) .slide{

                }
                :host([relative][opening]) .slide-wrapper,
                :host([relative][opened]) .slide-wrapper{
                   transform: translateY(0%);
                }
                :host([relative][opening]) .slide,
                :host([relative][opened]) .slide{
                    display: inline-block;
                }
                :host([relative][opening]) .slide-wrapper,
                :host([relative][opening]) .slide,
                :host([relative][opening]) .slide-content,
                :host([relative][opened]) .slide-wrapper,
                :host([relative][opened]) .slide,
                :host([relative][opened]) .slide-content{
                     position: relative;
                }
            </style>
            <slot name="click-element" part="click-element"></slot>
            <div class="slide-wrapper">
                <div class="slide" part="list">
                    <div class="slide-content" part="list-inner"><slot></slot></div>
                </div>                
            </div>
        `;
    }
}

if (customElements.get('atomic-dropdown') === undefined) {
    customElements.define('atomic-dropdown', StahlDropdown);
}
