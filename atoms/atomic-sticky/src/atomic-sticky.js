/**
 * @license
 * @Author Kolya von Droste zu Vischering
 * @slot - This element has a slot
 */
export default class AtomicSticky extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode:"open"});
    let root = this;
    this.state = 'inActive';
    // removeEventListener wont work without this way of binding
    this.scrollListener = this.scrollListener.bind(this);
    this._doElementMove = this._doElementMove.bind(this);

    var intersectionObserver = new IntersectionObserver(function(entries) {
      // If intersectionRatio is 0, the target is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0){
        if(root.getState === 'visible'){
          root.setState('inVisible');
        }
        return;
      };
      root.setState('visible');
    });

    // start observing
    intersectionObserver.observe(this.stuckToElement);
  }

  get customStuckToTarget(){
    let target = this.getAttribute("stuckTo");
    if(target){
      target = document.querySelector(target);
    }
  }

  get stuckToElement(){
    let target = this.closest("[atomic-sticky-container]");
    if(!target){
      console.error("atomic-sticky: cant find parent with atomic-sticky-container");
    }
    return target;
  }

  get stuckToElementTopPos(){
    let topPos = this.stuckToElement.offsetTop;
    return topPos;
  }

  get getState(){
    return this.state;
  }

  addScrollListener(){
    document.addEventListener('scroll',this.scrollListener);
  }

  removeScrollListener(){
    document.removeEventListener("scroll",this.scrollListener);
  }

  scrollListener(){
    let lastKnownScrollPosition = 0;
    let ticking = false;
    let root = this;
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        ticking = false;
      });
      root._doElementMove(lastKnownScrollPosition);
      ticking = true;
    }
  }

  _setElementWidth(){
    console.log("resize");
    this.style.maxWidth = this.offsetWidth + "px";
  }

  _doElementMove(scrollPos){
    if(scrollPos > this.stuckToElementTopPos && scrollPos + this.offsetHeight < this.stuckToElementTopPos + this.stuckToElement.offsetHeight){
      this.setAttribute("isStuck", "");
    }else{
      this.removeAttribute("isStuck");
    }
  }

  setState(state){
    this.state = state;
    if(state === 'visible'){
      this.removeAttribute("inVisible");
      this.setAttribute("visible", "");
      this.addScrollListener();
    }else{
      this.removeAttribute("visible");
      this.setAttribute("inVisible", "");
      this.removeScrollListener();
    }
  }

  connectedCallback () {
    this.stuckToElement;
    this.render();
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{
            --atomic-sticky-top-pos: 0;
            
            display: block;
            position: sticky;
            top: var(--atomic-sticky-top-pos, 0);
        }
      </style>
      <slot></slot>
    `
    this._setElementWidth();
  }
}
if (customElements.get('atomic-sticky') === undefined) {
  customElements.define('atomic-sticky', AtomicSticky);
}
