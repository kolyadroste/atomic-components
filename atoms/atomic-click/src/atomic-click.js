export default class AtomicClick extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <style>
                :host{
                    display:inline-block;
                    cursor:pointer;
                }       
            </style>
            <slot></slot>    
        `;
    }
    get clickTarget(){
        let target = this.hasAttribute("target") ? this.getAttribute("target") : null;
        if(target) {
            target = document.querySelector(target);
            if(!target){
                console.error("atomic-click: target couldnt be found");
            }
            return target;
        }else{
            return this;
        }
    }

    connectedCallback(){
        let root = this;
        this.addEventListener("click",()=>{
            root.onPress();
        });
    }

    onPress(){
        if(this.hasAttribute("addAttribute")){
            let attr = this.getAttribute("addAttribute");
            let val= this.hasAttribute("attributeValue") ? this.getAttribute("attributeValue") : "";
            this.clickTarget.setAttribute(attr,val)
        }else if(this.hasAttribute("method")){
            let method = this.getAttribute("method");
            this.clickTarget[method]();
        }
    }
}

if (customElements.get('atomic-click') === undefined) {
    customElements.define('atomic-click', AtomicClick);
}
