export default class AtomicContainerQuery extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <slot></slot>
        `;

        this.count = 0;
        new ResizeObserver((entries) => {
            this.changeTargetAttributesOrClass(this.target.offsetWidth,this.target.offsetHeight);
        }).observe(this.target);
        this.changeTargetAttributesOrClass(this.target.offsetWidth,this.target.offsetHeight);

    }

    static get observedAttributes() {
        return ['target', 'config'];
    }

    get config() {
        return this.getAttribute('config').toString();
    }

    get target() {
        let manualTarget = this.getAttribute('target').toString();
        if (manualTarget) return document.querySelector(manualTarget);
        if (this.shadowDom.childNodes.length >= 1) return this.querySelector(':scope > *');
    }

    // change classes or Attribute for targetnode
    changeTargetAttributesOrClass(width,height) {
        if (!this.config || this.config === "") {
            console.error("atomic-container-query: no config provided");
            return;
        }

        let commands = this.config.split(',');
        commands.forEach((command) => {
            command = command.split('::');
            let breakpoint = command[0];
            let action = command[1];
            let actionType = action.includes('add') ? 'add' : 'remove';
            let changeType = action.includes('[attr:') ? 'attribute' : 'class';
            let value = action.split(':')[1].slice(0, -1);

            // set class
            if(width >= breakpoint && changeType === 'class'){
                this.target.classList[actionType](value);
            }else if(changeType === 'class'){
                // if class was added it should be removed again when width is below breakpoint
                actionType === 'add' ? this.target.classList['remove'](value) : null;
            }
            // set attribute
            if(changeType === 'attribute'){
                let attr = value.split('=');
                if(width >= breakpoint){
                    actionType === 'add' ? this.target.setAttribute(attr[0],attr[1]) : null;
                }else{
                    actionType === 'add' ? this.target.removeAttribute(attr[0]) : null;
                }

            }
        })
    }


}

if (customElements.get('atomic-container-query') === undefined) {
    customElements.define('atomic-container-query', AtomicContainerQuery);
}
