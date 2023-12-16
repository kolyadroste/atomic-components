export default class AtomicScrolltotop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.treshold = this.getAttribute('treshold') || 300;
    }

    connectedCallback() {
        this.render();
        console.log("AtomicScrolltotop connected to page");

        // Event Listener für Scroll-Verhalten
        window.addEventListener('scroll', () => this.handleScroll());
        this.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        // Checken, ob der Scroll-Bereich größer ist als der treshold
        if (window.scrollY > this.treshold) {
            this.classList.add('show');

            // is end of page reached?
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
                this.classList.add('endreached');
            } else {
                this.classList.remove('endreached');
            }
        } else {
            this.classList.remove('show');
        }
    }

    scrollToTop() {
        console.log("scrollToTop");
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
            position: fixed;
            z-index: var(--atomic-scrolltotop-zindex,1000);
            inset: var(--atomic-scrolltotop-inset, auto 50px 50px auto);
            background: var(--atomic-scrolltotop-bg, #333);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: var(--atomic-scrolltotop-width, 60px);
            height: var(--atomic-scrolltotop-height, 60px);
            opacity: 0;
            box-sizing: border-box;
            transition: opacity 0.5s ease-in-out;
            
        }
        :host(.show) {
            opacity: 1;
        }
        :host(.endreached){
            border: var(--atomic-scrolltotop-borderatend, 2px solid #999);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        
        .arrow {
            transform: translateY(15%);
        }

        .arrow span {
            display: block;
            width: 20px;
            height: 20px;
            border-bottom: 5px solid white;
            border-right: 5px solid white;
            transform: rotate(-135deg);
        }
      </style>


      <slot>
        <div class="arrow"><span></span></div>
      </slot>

    `
    }
}

if (customElements.get('atomic-scrolltotop') === undefined) {
    customElements.define('atomic-scrolltotop', AtomicScrolltotop);
}
