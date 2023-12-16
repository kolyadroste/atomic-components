class AtomicCountup extends HTMLElement {


    constructor() {
        super();
        this._value = 0;
        this._targetValue = 0;
        this._duration = 2000;
        this._lastTime = null;
        this._startTime = null;
        this._precision = 0;
        this._observer = new IntersectionObserver(this._onIntersection.bind(this), {
            threshold: 0.1
        });
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

    connectedCallback() {
        this._targetValue = parseFloat(this.getAttribute('value')) || 0;
        this._duration = parseFloat(this.getAttribute('duration')) || 2000;
        this._precision = parseInt(this.getAttribute('precision'), 10) || this._precision;
        this._easeOut = this.hasAttribute('easeOut');
        this._observer.observe(this);
    }

    _onIntersection(entries) {
        for (let entry of entries) {
            if (entry.isIntersecting) {
                this._observer.disconnect();  // Stoppen der Beobachtung nach dem ersten Auftauchen
                this.animate(this._lastTime);
            }
        }
    }

    easeOutCubic(t) {
        return (--t) * t * t + 1;
    }

    animate(timestamp) {
        if (!this._startTime) {
            this._startTime = timestamp;
        }
        const progress = (timestamp - this._startTime) / this._duration;

        // Hier wird entschieden, welche Funktion verwendet wird
        const easedProgress = this._easeOut ? this.easeOutCubic(progress) : progress;

        this._value = easedProgress * this._targetValue;

        if (progress < 1) {
            this.render();
            window.requestAnimationFrame(this.animate.bind(this));
        } else {
            this._value = this._targetValue;
            this.render();
        }
    }

    render() {
        this.textContent = parseFloat(this._value.toFixed(this._precision));
    }
}

if (customElements.get('atomic-countup') === undefined) {
    customElements.define('atomic-countup', AtomicCountup);
}
