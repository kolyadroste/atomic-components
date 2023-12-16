import AtomicAnimBase from './atomic-anim-base.js';
const template = document.createElement('template');
template.innerHTML = `
<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
    
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeInBottomLeft {
        from {
            opacity: 0;
            transform: translate3d(-100%, 100%, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInBottomRight {
        from {
            opacity: 0;
            transform: translate3d(100%, 100%, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInDownBig {
        from {
            opacity: 0;
            transform: translate3d(0, -2000px, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translate3d(-100%, 0, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInLeftBig {
        from {
            opacity: 0;
            transform: translate3d(-2000px, 0, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translate3d(100%, 0, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fadeInRightBig {
        from {
            opacity: 0;
            transform: translate3d(2000px, 0, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes fadeInTopLeft {
        from {
            opacity: 0;
            transform: translate3d(-100%, -100%, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    
    @keyframes fadeInTopRight {
        from {
            opacity: 0;
            transform: translate3d(100%, -100%, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes fadeInUpBig {
        from {
            opacity: 0;
            transform: translate3d(0, 2000px, 0);
        }
    
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    :host([begin]) {
        animation-name: fadeIn;
    }
    :host([begin][fadeInBottomLeft]) {
        animation-name: fadeInBottomLeft;
    }
    :host([begin][fadeInBottomRight]) {
        animation-name: fadeInBottomRight;
    }
    :host([begin][fadeInDown]) {
        animation-name: fadeInDown;
    }
    :host([begin][fadeInDownBig]) {
        animation-name: fadeInDownBig;
    }
    :host([begin][fadeInLeft]) {
        animation-name: fadeInLeft;
    }
    :host([begin][fadeInLeftBig]) {
        animation-name: fadeInLeftBig;
    }
    :host([begin][fadeInRight]) {
        animation-name: fadeInRight;
    }
    :host([begin][fadeInRightBig]) {
        animation-name: fadeInRightBig;
    }
    :host([begin][fadeInTopLeft]) {
        animation-name: fadeInTopLeft;
    }
    :host([begin][fadeInTopRight]) {
        animation-name: fadeInTopRight;
    }
    :host([begin][fadeInUp]) {
        animation-name: fadeInUp;
    }
    :host([begin][fadeInUpBig]) {
        animation-name: fadeInUpBig;
    }
    
    :host([ended]) {
        display:block !important;
    }
    :host([inline][ended]) {
        display:inline-block !important;
    }
    
    

</style>
`
export class AtomicAnimFadein extends AtomicAnimBase {
    constructor() {
        super();
        this.shadowDom.appendChild(template.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-fadein") === undefined) {
    customElements.define("atomic-anim-fadein", AtomicAnimFadein);
}
