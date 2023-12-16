import AtomicAnimBase from './atomic-anim-base.js';
const template = document.createElement('template');
template.innerHTML = `
<style>
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
      }
    }
    
    @keyframes fadeOutBottomLeft {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      to {
        opacity: 0;
        transform: translate3d(-100%, 100%, 0);
      }
    }

    @keyframes fadeOutBottomRight {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      to {
        opacity: 0;
        transform: translate3d(100%, 100%, 0);
      }
    }

    @keyframes fadeOutDown {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }
    }
    
    @keyframes fadeOutDownBig {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(0, 2000px, 0);
      }
    }

    @keyframes fadeOutLeft {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
      }
    }

    @keyframes fadeOutLeftBig {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(-2000px, 0, 0);
      }
    }

    @keyframes fadeOutRight {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
      }
    }

    @keyframes fadeOutRightBig {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(2000px, 0, 0);
      }
    }
    
    @keyframes fadeOutTopLeft {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      to {
        opacity: 0;
        transform: translate3d(-100%, -100%, 0);
      }
    }
    
    @keyframes fadeOutTopRight {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      to {
        opacity: 0;
        transform: translate3d(100%, -100%, 0);
      }
    }
      
    @keyframes fadeOutUp {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(0, -100%, 0);
      }
    }
    
    @keyframes fadeOutUpBig {
      from {
        opacity: 1;
      }
    
      to {
        opacity: 0;
        transform: translate3d(0, -2000px, 0);
      }
    }

    :host([begin]) {
        animation-name: fadeOut;
    }
    :host([begin][fadeOutBottomLeft]) {
        animation-name: fadeOutBottomLeft;
    }
    :host([begin][fadeOutBottomRight]) {
        animation-name: fadeOutBottomRight;
    }
    :host([begin][fadeOutDown]) {
        animation-name: fadeOutDown;
    }
    :host([begin][fadeOutDownBig]) {
        animation-name: fadeOutDownBig;
    }
    :host([begin][fadeOutLeft]) {
        animation-name: fadeOutLeft;
    }
    :host([begin][fadeOutLeftBig]) {
        animation-name: fadeOutLeftBig;
    }
    :host([begin][fadeOutRight]) {
        animation-name: fadeOutRight;
    }
    :host([begin][fadeOutRightBig]) {
        animation-name: fadeOutRightBig;
    }
    :host([begin][fadeOutTopLeft]) {
        animation-name: fadeOutTopLeft;
    }
    :host([begin][fadeOutTopRight]) {
        animation-name: fadeOutTopRight;
    }
    :host([begin][fadeOutUp]) {
        animation-name: fadeOutUp;
    }
    :host([begin][fadeOutUpBig]) {
        animation-name: fadeOutUpBig;
    }
     :host([ended]) {
        display:none;
    }  
    
</style>
`

export default class AtomicAnimFadeout extends AtomicAnimBase {
    constructor() {
        super();
        this.shadowDom.appendChild(template.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-fadeout") === undefined) {
    customElements.define("atomic-anim-fadeout", AtomicAnimFadeout);
}
