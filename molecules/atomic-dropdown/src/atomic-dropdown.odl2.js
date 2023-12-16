class AtomicDropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.setAttribute("closed","");
    }

    get clickElement(){
        return this.querySelector("[slot='click-element']");
    }

    get animation(){
        return this.getAttribute("animation");
    }

    openDropdown(){
        if(this.isOpen){
            return;
        }else{
            this.removeAttribute("closed");
            this.removeAttribute("closing");
            this.setAttribute("opening","");
        }
    }

    closeDropdown(e){
        // prevend bubble up events to close dropdown
        if(e){
            let related = e.relatedTarget;

            while (related && related !== this && related !== document) {
                related = related.parentNode;
            }
            if (related === this) {
                return;
            }
        }

        if(this.isClosed){
            return;
        }
        this.removeAttribute("opened");
        this.removeAttribute("opening");
        this.setAttribute("closing","");
    }

    get group(){
        return this.getAttribute("group");
    }

    get isOpenedByHover(){
        return this.hasAttribute("openOnHover");
    }

    get isOpen(){
        return this.hasAttribute("opened");
    }

    get isClosed(){
        return this.hasAttribute("closed");
    }

    get getLinkInClickElement(){
        return this.clickElement.querySelector("a");
    }

    get slideContent(){
        return this.shadowRoot.querySelector(".slide-content");
    }

    connectedCallback() {
        this.render();
        this._setClickEvent();
        this._setHoverEvent();
        this._setTransitionEvents();
    }

    disconnectedCallback() {
        // this.clickElement.removeEventListener('click', this.handleClickElementClick);
        // this.slideContent.removeEventListener('transitionend', this.handleTransitionEnd);
    }

    handleClickElementClick(event){
        this.disableDefaultClickBehaviour();
        event.stopPropagation();
        if(this.isOpen){
            this.closeDropdown(event);
        } else {
            this.openDropdown();
            this._activateClickOutside();
        }
        if(this.group){
            this.closeGroupMembers();
        }
    };

    handleClickOutside(event){
        if (event.target) {
            this.closeDropdown(event);
        }
        document.removeEventListener('click', this.handleClickOutside);
    };

    handleTransitionEnd(){
        if(this.hasAttribute("opening")){
            this.removeAttribute("opening");
            this.removeAttribute("closing");
            this.setAttribute("opened","");
        } else if(this.hasAttribute("closing")){
            this.removeAttribute("closing");
            this.removeAttribute("opening");
            this.setAttribute("closed","");
        }
    };

    disableDefaultClickBehaviour(){
        if(this.clickElement.tagName === "A"){
            this.clickElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
        if(!this.getLinkInClickElement) return;
        this.getLinkInClickElement.style.pointerEvents = "none";
        this.getLinkInClickElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    closeGroupMembers(){
        if(!this.group) return;
        const members = document.querySelectorAll(`atomic-dropdown[group="${this.group}"]`);
        if(members.length === 0) return;
        members.forEach((member)=>{
            if(member !== this){
                member.closeDropdown();
            }
        })
    };

    _setClickEvent(){
        if(this.isOpenedByHover) return;
        this.disableDefaultClickBehaviour.bind(this)();
        this.clickElement.addEventListener('click', this.handleClickElementClick.bind(this), false);
    }

    _setTransitionEvents(){
        this.slideContent.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    }

    _setHoverEvent() {
        if(!this.isOpenedByHover) return;
        this.addEventListener('mouseover', this.openDropdown.bind(this));
        this.addEventListener('mouseout', this.closeDropdown.bind(this));
    }

    _activateClickOutside(){
        document.addEventListener('click', this.handleClickOutside.bind(this), false);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host{
                   position: relative;
                   display:inline-block;
                   width:var(--atomic-dropdown-width, auto);
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
                    top:100%;
                    width: 100%;
                    transform: translateY(100%) translateX(var(--atomic-dropdown-slidewrapper-translatex,-0%));
                }
                
                :host([open-left]) .slide-wrapper{
                    right:0;
                }

                :host([closed]) .slide-wrapper{
                    overflow: hidden;
                }
                :host([opening]) .slide-wrapper,
                :host([opened]) .slide-wrapper{
                    overflow: visible;
                    z-index: 200;
                }
                :host([opening]),
                :host([opened]){
                    z-index: 200;
                }
                .slide{
                    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
                    position: absolute;
                    top:0;
                    box-sizing: border-box;
                    display:block;
                    overflow: hidden;
                    max-height: 0px;
                    opacity: 0;
                    padding-top: var(--atomic-dropdown-space-top, 10px);
                }
                :host([openleft]) .slide{
                    right:0;
                }

                .slide-content{
                    transition-timing-function: var(--atomic-dropdown-animation-function,ease-in-out);
                    transition:var(--atomic-dropdown-animation-time,0.5s);
                    transform: translateY(calc(-100% - var(--atomic-dropdown-space-top, 10px)));
                    width:var(--atomic-dropdown-width, auto);
                    box-sizing: border-box;
                    background:var(--atomic-dropdown-content-background, white);
                    padding:var(--atomic-dropdown-padding, 20px);
                    border:var(--atomic-dropdown-border, none);
                    margin-bottom: var(--atomic-dropdown-content-margin-bottom, 10px);
                }

                :host([animation="ease-in-out"]) .slide{
                    transition: max-height 1s ease-in-out;
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
                :host([opening]) .slide,
                :host([opened]) .slide{
                    max-height: 100vh !important;
                    opacity: 1;
                }
                :host([relative][opening]) .slide-wrapper,
                :host([relative][opening]) .slide,
                :host([relative][opening]) .slide-content,
                :host([relative][opened]) .slide-wrapper,
                :host([relative][opened]) .slide,
                :host([relative][opened]) .slide-content{
                     position: relative;
                }
                ::slotted(ul){
                    list-style: none;  
                    margin:0; 
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
    customElements.define('atomic-dropdown', AtomicDropdown);
}
