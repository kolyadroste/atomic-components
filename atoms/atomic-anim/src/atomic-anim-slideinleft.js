import AtomicAnimBase from './atomic-anim-base.js';
const fadeInTemplate = document.createElement('template');
fadeInTemplate.innerHTML = `
<style>
    @keyframes slideInLeft {
        from {
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
        }
    
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    :host([begin]) {
        animation-name: slideInLeft;
    }
    
    :host([ended]) {
        display:block !important;
    }
    :host([inline][ended]) {
        display:inline-block !important;
    }
</style>
`

export default class AtomicAnimSlideinleft extends AtomicAnimBase {

    constructor() {
        super();
        this.shadowDom.appendChild(fadeInTemplate.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-slideinleft") === undefined) {
    customElements.define("atomic-anim-slideinleft", AtomicAnimSlideinleft);
}
