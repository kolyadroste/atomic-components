export default class AtomicSlide extends HTMLElement {
  constructor() {
    super();

    if(this.hasAttribute("inViewObjection")){
      this._inViewObjection();
    }
    this.attachShadow({mode:"open"});
    this.windowResizeObserver = new ResizeObserver(() => {
      this.updateClassBasedOnWindowWidth();
    });
  }

  connectedCallback () {
    this.render();
    this.windowResizeObserver.observe(document.body);
  }
  disconnectedCallback() {
    this.windowResizeObserver.unobserve(document.body);
  }
  _inViewObjection(){
    let root = this;
    var intersectionObserver = new IntersectionObserver(function(entries) {
      if (entries[0].intersectionRatio <= 0) return;
      root.setAttribute("gotIntoView","true");
      root.dispatchEvent(new CustomEvent('atomic-slide.isInView', {cancelable: false}, false));
      this.disconnect();
    });
    intersectionObserver.observe(this);
  }

  updateClassBasedOnWindowWidth() {
    const tolerance = 40;

    // Wenn die Breite des Elements gleich der Breite des Fensters ist, fügen Sie die Klasse "full" hinzu
    if (-1 * (this.getBoundingClientRect().width - window.innerWidth) <= tolerance) {
      this.setAttribute("full-window", "");
      this.removeAttribute("containered");
    } else {
      this.removeAttribute("full-window");
      this.setAttribute("containered", "");
    }
  }


  render(){
    this.shadowRoot.innerHTML = `
      <style>

        :host{
            position: var(--atomic-slide--position, relative);
            display: var(--atomic-slide--display, block);
            transition: opacity 1.5s ease-in-out;
            top: 0;
            left:0;
            width: 100%;
        }
        :host([previus="true"]),
        :host([next="true"]){
            position: absolute;
            opacity: 1;
            left: 0px;
            width: 100%;
        }

        :host([selected="true"]){
          position: relative;
          width: 100%;
          height: auto;
          display: block;
          visibility: visible;
          opacity: 1;
          left: 0;
        }

        :host([mode="slide"][next="true"]) {
          left: 100%;
        }

        :host([mode="slide"][previous="true"]) {
          left: -100%;
        }
        
        figure{
          position: relative;
          display:block;
          margin:0;
          inset: 0;
          min-height: var(--atomic-slide--min-height, 100px);
        }
    
        .imageOverlay{
            position: absolute;
            width:100%;
            height:100%;
            z-index:1;
        }

        ::slotted([slot="image"]){
            position: absolute;
            width:100% !important;
            height: 100% !important;
            object-fit: cover;
        }
        :host([imageOverlay]) .imageOverlay{
            background-color: var(--atomic-slide--image-overlay-color, black);
            opacity: var(--atomic-slide--image-overlay-alpha,  0.3);
        }
  
      </style>
    <figure>
        ${this.hasAttribute("imageOverlay") ? '<div class="imageOverlay"></div>' : ''}
        <slot name="image"></slot>
        <slot></slot>
    </figure>
    `
  }
}

if (customElements.get('atomic-slide') === undefined) {
  customElements.define('atomic-slide', AtomicSlide);
}
