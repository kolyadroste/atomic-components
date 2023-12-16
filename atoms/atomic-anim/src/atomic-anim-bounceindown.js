import AtomicAnimBase from './atomic-anim-base.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    @keyframes bounceInDown {
        from,
        60%,
        75%,
        90%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
    
        0% {
            opacity: 0;
            transform: translate3d(0, -3000px, 0) scaleY(3);
        }
    
        60% {
            opacity: 1;
            transform: translate3d(0, 25px, 0) scaleY(0.9);
        }
    
        75% {
            transform: translate3d(0, -10px, 0) scaleY(0.95);
        }
    
        90% {
            transform: translate3d(0, 5px, 0) scaleY(0.985);
        }
    
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    :host([begin]) {
        animation-name: bounceInDown;
    }
    :host([ended]) {
        display:block !important;
    }
    :host([inline][ended]) {
        display:inline-block !important;
    }

</style>
`
export default class AtomicAnimBounceindown extends AtomicAnimBase {

    constructor() {
        super();
        this.shadowDom.appendChild(template.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-bounceindown") === undefined) {
    customElements.define("atomic-anim-bounceindown", AtomicAnimBounceindown);
}
