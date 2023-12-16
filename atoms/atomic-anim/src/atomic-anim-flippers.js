import AtomicAnimBase from './atomic-anim-base.js';
const template = document.createElement('template');
template.innerHTML = `
<style>
    @keyframes flip {
        from {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
            animation-timing-function: ease-out;
        }
    
        40% {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
            rotate3d(0, 1, 0, -190deg);
            animation-timing-function: ease-out;
        }
    
        50% {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
            rotate3d(0, 1, 0, -170deg);
            animation-timing-function: ease-in;
        }
    
        80% {
            transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
            rotate3d(0, 1, 0, 0deg);
            animation-timing-function: ease-in;
        }
    
        to {
            transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
            animation-timing-function: ease-in;
        }
    }
    @keyframes flipInX {
        from {
            transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
            animation-timing-function: ease-in;
            opacity: 0;
        }
    
        40% {
            transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
            animation-timing-function: ease-in;
        }
    
        60% {
            transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
            opacity: 1;
        }
    
        80% {
            transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
        }
    
        to {
            transform: perspective(400px);
        }
    }
    
    @keyframes flipInY {
        from {
            transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
            animation-timing-function: ease-in;
            opacity: 0;
        }
    
        40% {
            transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
            animation-timing-function: ease-in;
        }
    
        60% {
            transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
            opacity: 1;
        }
    
        80% {
            transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
        }
    
        to {
            transform: perspective(400px);
        }
    }
    
    
    @keyframes flipOutX {
        from {
            transform: perspective(400px);
        }
    
        30% {
            transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
            opacity: 1;
        }
    
        to {
            transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
            opacity: 0;
        }
    }
    @keyframes flipOutY {
        from {
            transform: perspective(400px);
        }
    
        30% {
            transform: perspective(400px) rotate3d(0, 1, 0, -15deg);
            opacity: 1;
        }
    
        to {
            transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
            opacity: 0;
        }
    }
    
    
    :host([begin]) {
        backface-visibility: visible;
        animation-name: flip;
    }
    :host([begin][flip]) {
        backface-visibility: visible;
        animation-name: flip;
    }
    :host([begin][flipOutX]) {
        animation-duration: calc(var(--animate-duration) * 0.75);
        animation-name: flipOutX;
        backface-visibility: visible !important;
    }
    :host([begin][flipOutY]) {
        animation-duration: calc(var(--animate-duration) * 0.75);
        backface-visibility: visible !important;
        animation-name: flipOutY;
    }
    :host([begin][flipInX]) {
        animation-duration: calc(var(--animate-duration) * 0.75);
        backface-visibility: visible !important;
        animation-name: flipInX;
    }
    :host([begin][flipInY]) {
        animation-duration: calc(var(--animate-duration) * 0.75);
        backface-visibility: visible !important;
        animation-name: flipInY;
    }
</style>
`
export default class AtomicAnimFlippers extends AtomicAnimBase {
    constructor() {
        super();
        this.shadowDom.appendChild(template.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-flippers") === undefined) {
    customElements.define("atomic-anim-flippers", AtomicAnimFlippers);
}
