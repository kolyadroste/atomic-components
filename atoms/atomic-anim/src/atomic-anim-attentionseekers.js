import AtomicAnimBase from './atomic-anim-base.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    @keyframes bounce {
        from,
        20%,
        53%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            transform: translate3d(0, 0, 0);
        }
    
        40%,
        43% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -30px, 0) scaleY(1.1);
        }
    
        70% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            transform: translate3d(0, -15px, 0) scaleY(1.05);
        }
    
        80% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            transform: translate3d(0, 0, 0) scaleY(0.95);
        }
    
        90% {
            transform: translate3d(0, -4px, 0) scaleY(1.02);
        }
    }
    @keyframes flash {
        from,
        50%,
        to {
            opacity: 1;
        }
    
        25%,
        75% {
            opacity: 0;
        }
    }
    @keyframes headShake {
        0% {
            transform: translateX(0);
        }
    
        6.5% {
            transform: translateX(-6px) rotateY(-9deg);
        }
    
        18.5% {
            transform: translateX(5px) rotateY(7deg);
        }
    
        31.5% {
            transform: translateX(-3px) rotateY(-5deg);
        }
    
        43.5% {
            transform: translateX(2px) rotateY(3deg);
        }
    
        50% {
            transform: translateX(0);
        }
    }
    @keyframes heartBeat {
        0% {
            transform: scale(1);
        }
    
        14% {
            transform: scale(1.3);
        }
    
        28% {
            transform: scale(1);
        }
    
        42% {
            transform: scale(1.3);
        }
    
        70% {
            transform: scale(1);
        }
    }
    
    @keyframes pulse {
        from {
            transform: scale3d(1, 1, 1);
        }
    
        50% {
            transform: scale3d(1.05, 1.05, 1.05);
        }
    
        to {
            transform: scale3d(1, 1, 1);
        }
    }
    
    
    @keyframes shake {
        from,
        to {
            transform: translate3d(0, 0, 0);
        }
    
        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translate3d(-10px, 0, 0);
        }
    
        20%,
        40%,
        60%,
        80% {
            transform: translate3d(10px, 0, 0);
        }
    }
    
    
    @keyframes shakeX {
        from,
        to {
            transform: translate3d(0, 0, 0);
        }
    
        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translate3d(-10px, 0, 0);
        }
    
        20%,
        40%,
        60%,
        80% {
            transform: translate3d(10px, 0, 0);
        }
    }
    @keyframes shakeY {
        from,
        to {
            transform: translate3d(0, 0, 0);
        }
    
        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translate3d(0, -10px, 0);
        }
    
        20%,
        40%,
        60%,
        80% {
            transform: translate3d(0, 10px, 0);
        }
    }
    
    @keyframes wobble {
        from {
            transform: translate3d(0, 0, 0);
        }
    
        15% {
            transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }
    
        30% {
            transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
        }
    
        45% {
            transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }
    
        60% {
            transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
        }
    
        75% {
            transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
        }
    
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    :host([begin]) {
        animation-name: bounce;
        transform-origin: center bottom;
    }
    :host([begin][flash]) {
        animation-name: flash;
    }
    :host([begin][headShake]) {
        animation-timing-function: ease-in-out;
        animation-name: headShake;
    }
    :host([begin][pulse]) {
        animation-name: pulse;
        animation-timing-function: ease-in-out;
    }
    :host([begin][shake]) {
        animation-name: shake;
    }
    :host([begin][shakeX]) {
        animation-name: shakeX;
    }
    :host([begin][shakeY]) {
        animation-name: shakeY;
    }
    :host([begin][wobble]) {
        animation-name: wobble;
    }
    :host([begin][heartBeat]) {
        animation-name: heartBeat;
        animation-duration: calc(var(--animate-duration) * 1.3);
        animation-timing-function: ease-in-out;
    }

</style>
`
export default class AtomicAnimAttentionseekers extends AtomicAnimBase {
    constructor() {
        super();
        this.shadowDom.appendChild(template.content.cloneNode(true));
    }
}

if (customElements.get("atomic-anim-attentionseekers") === undefined) {
    customElements.define("atomic-anim-attentionseekers", AtomicAnimAttentionseekers);
}
