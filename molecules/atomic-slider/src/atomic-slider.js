/**
 * @customElement AtomicSlider
 *
 */
export default class AtomicSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();

    this.onSwipeStart = this.onSwipeStart.bind(this);
    this.onSwipeEnd = this.onSwipeEnd.bind(this);
    this.onDrag = this.onDrag.bind(this);

    this.time = this.getAttribute("time") ? this.getAttribute("time") : '3s';
    this.currentSlideNum = 0;
    this.latestSelectedSlide = null;
    this.timeMs = this._parseTimeStringToMilliSeconds(this.time);
    this.dotNavState = false;

    this.addEventListener('mousedown', this.onSwipeStart, { passive: true });
    this.addEventListener('touchstart', this.onSwipeStart, { passive: true });

    this.addEventListener('mousemove', this.onDrag, { passive: true });
    this.addEventListener('touchmove', this.onDrag, { passive: true });

    this.addEventListener('mouseup', this.onSwipeEnd, { passive: true });
    this.addEventListener('touchend', this.onSwipeEnd, { passive: true });
    this.slideChange = new CustomEvent('atomic-slider-slided', {
      detail: { message: 'atomic-slider has slided' },
      bubbles: true,
      composed: true });
  }

  connectedCallback () {
    this.render();
    this.initPrevNextButtons();
    this.shadowRoot.querySelector('.slides slot').addEventListener('slotchange', (e) => {
      this.initSlider();
      this._goToSlide(0);
      this.initNavDots();
    });
    this.loadingAnim = this.loadingbar;
    this.startInterval();
  }

  get disablePrevNext(){
    return this.getAttribute('disablePrevNext');
  }


  get totalAmountOfSlides(){
    return this.slides.length;
  }
  get prevBt(){
    return this.querySelector('atomic-slider-prevnext-button[data-action="move-backwards"]');
  }
  get nextBt(){
    return this.querySelector('atomic-slider-prevnext-button[data-action="move-forward"]');
  }
  get slides(){
    return this.defaultSlot.assignedElements();
  }
  get loadingbar(){
    return this.shadowRoot.querySelector("atomic-loadingbar");
  }
  get navDots(){
    return this.shadowRoot.querySelectorAll('atomic-slider-dotnav-button');
  }

  get defaultSlot(){
    return this.shadowRoot.querySelector('.slides > slot');
  }

  get currentSlide(){
    let num = this.currentSlideNum ? this.currentSlideNum : 0;
    let curr = this.querySelector(":scope > *[data-num='" + num + "']");
    return curr;
  }

  get targetNavDots(){
    return this.getAttribute('targetNavDots');
  }

  get disableNavDots(){
    return this.hasAttribute('disableNavDots');
  }

  get predefinedNavDots(){
    if(!this.targetNavDots) return [];
    let dots;
    dots = document.querySelectorAll(this.targetNavDots + "> *");
    if(dots.length === 0){
      console.error("Atomic-Slider: targetNavDots is set, but can't find the element. Please check if the element exists.");
    }
    return dots;
  }

  get swipeMode(){
    return this.getAttribute('swipeMode');
  }

  startDragging(){
    this.dragging = true;
  }
  preventDragging(){
    this.dragging = false;
  }


  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'time':
        break;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  _parseTimeStringToMilliSeconds(timeString) {
    if (timeString === null || timeString === "") {
      return 10000;
    }
    var time;
    if (timeString.includes("ms") === true) {
      time = timeString.replace('ms', '');
      return time;
    } else if (timeString.includes("s") === true) {
      time = timeString.replace('s', '');
      return time * 1000;
    } else {
      return 10000;
    }
  }

  _dispatchSlideChange() {
    let slideChange = new CustomEvent('atomic-slider-slided', {
      detail: { message: 'atomic-slider has slided' },
      bubbles: true,
      composed: true });
    this.dispatchEvent(slideChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('mousedown', this.onSwipeStart);
    this.removeEventListener('touchstart', this.onSwipeStart);

    this.removeEventListener('mousemove', this.onDrag);
    this.removeEventListener('touchmove', this.onDrag);

    this.removeEventListener('mouseup', this.onSwipeEnd);
    this.removeEventListener('touchend', this.onSwipeEnd);
  }

  initPrevNextButtons(){
    if(!this.disablePrevNext && this.prevBt && this.nextBt){
      this.prevBt.removeEventListener("click", ()=>{});
      this.prevBt.addEventListener('click',()=>{
        this.goToPreviousSlide();
      });
      this.prevBt.addEventListener('mouseover',()=>{
        this.preventDragging()
      });
      this.prevBt.addEventListener('mouseout',()=>{
        this.startDragging()
      });

      this.nextBt.removeEventListener("click", ()=>{});
      this.nextBt.addEventListener('click',()=>{
        this.goToNextSlide();
      });
      this.nextBt.addEventListener('mouseover',()=>{
        this.preventDragging()
      });
      this.nextBt.addEventListener('mouseout',()=>{
        this.startDragging()
      });
    }
  }

  resetInterval(){
    clearInterval(this.interval);
    this.startInterval();
    if(this.loadingAnim !== undefined){
      this._startLoadingAnim();
    }
  }
  startInterval(){
    this.interval = setInterval(()=>{
      this.goToNextSlide();
    }, this.timeMs);
  }

  initNavDots(){
    if(!this.disableNavDots && !this.targetNavDots){
      this.uuid = this.create_UUID();
      const slides = this.slides;

      var navDotsWrapper = this.shadowRoot.querySelector('.nav-dots');
      navDotsWrapper.innerHTML = "";

      if(slides.length > 1){
        this.dotNavState = true;
      }else{
        return;
      }

      slides.forEach((slide,index)=>{
        this.uuid = this.create_UUID();
        var li = document.createElement("li");
        li.setAttribute('data-num',index);
        var dot = document.createElement("atomic-slider-dotnav-button");
        dot.setAttribute('data-num',index);
        dot.setAttribute('aria-selected',false);
        dot.setAttribute('role','tab');
        dot.setAttribute('aria-controls',this.uuid + index);
        dot.addEventListener('click',()=>{
          this._goToSlide(index);

        });
        if(index === 0){
          dot.setAttribute('aria-selected',true);
          dot.classList.add('active');
        }
        li.appendChild(dot);

        navDotsWrapper.appendChild(li);

      });
    }else if(this.predefinedNavDots){
      this.predefinedNavDots.forEach((dot,index)=>{
        let targetslide = dot.getAttribute('data-num');
        dot.setAttribute('aria-selected',true);
        dot.classList.add('active');
        dot.setAttribute('role','tab');
        dot.setAttribute('aria-controls',this.uuid + index);
        dot.addEventListener('click',()=>{
          this._goToSlide(parseInt(targetslide));
        });
      });
    }else{
      var navDotsWrapper = this.shadowRoot.querySelector('.nav-dots');
      navDotsWrapper.setAttribute('hidden',1);
    }
  }

  create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  onSwipeStart(e) {
    this.dragInit = e.clientX || e.changedTouches[0].clientX;
  }

  onDrag(e) {
    if (this.dragInit && this.dragging && this.swipeMode === 'swipe') {
      this.pauseSlider();
      //const slides = this.querySelectorAll('atomic-slider-slide[previous="true"], atomic-slider-slide[next="true"], atomic-slider-slide[selected="true"]');
      const movement = (e.clientX || e.changedTouches[0].clientX) - this.dragInit;
      this.slides.forEach((slide) => {
        slide.style.transition = 'none';
        switch ('true') {
          case slide.getAttribute('next'):
            slide.style.left = `${slide.offsetWidth + movement}px`;
            break;
          case slide.getAttribute('previous'):
            slide.style.left = `${-slide.offsetWidth + movement}px`;
            break;
          default:
            slide.style.left = `${movement}px`;
            break;
        }
      });
    }
  }

  onSwipeEnd(e) {
    if(e.changedTouches == null && !e.clientX && this.swipeMode !== 'swipe') {
      return false;
    }

    this.dragEnd = e.clientX || e.changedTouches[0].clientX;

    if (this.dragInit - this.dragEnd > 10 ) {
      this.goToNextSlide();
    } else if (this.dragEnd - this.dragInit > 10) {
      this.goToPreviousSlide();
    }

    this.slides.forEach((slide) => {
      slide.style.left = 0;
      slide.style.transition = null;
    });

    [this.dragInit, this.dragEnd] = [0, 0];

    this.initSlider();
  }

  /**
   * Starts the sliding behavior
   */
  initSlider() {
    this.slides.forEach((slide, index) => {
      slide.setAttribute('data-num',index);
    });
    this.setAttribute("initialized","");
  }

  /**
   * Stops the sliding behavior
   */
  pauseSlider() {
    clearTimeout(this.interval);
    this.interval = null;
  }

  /**
   * Selects the next slide. If it's called from last slide, selects the first.
   */
  goToNextSlide() {
    const targetSlide = this.totalAmountOfSlides - 1 === this.currentSlideNum
        ? 0
        : this.currentSlideNum + 1;
    this._goToSlide(targetSlide);
  }

  _onSlotchange(){
    this.initSlider();
  }

  _startLoadingAnim(){
    if(this.predefinedNavDots.length !== 0) return;
    if(this.loadingAnim && typeof this.loadingAnim.restart === 'function') this.loadingAnim.restart();
  }

  /**
   * Selects the previous slide. If it's called from first slide, selects the last.
   */
  goToPreviousSlide() {
    const targetSlide = this.currentSlideNum === 0
        ? this.totalAmountOfSlides - 1
        : this.currentSlideNum - 1;
    this._goToSlide(targetSlide);
  }

  /**
   * Sets the latestSelectedSlide and selects the currentSlide
   * @param targetSlide number
   */
  _goToSlide(targetSlide)  {
    this._setIndividualTime(targetSlide);
    this.resetInterval();
    this.selectSlide(targetSlide);
    this.dispatchEvent(this.slideChange);
  }

  _setIndividualTime(targetSlideNum){
    // possibility to set individual time for each slide
    let currentTime = this.currentSlide.getAttribute("time");
    if(currentTime === null || currentTime === ""){
      this.timeMs = this._parseTimeStringToMilliSeconds(this.time);
    }else{
      this.timeMs = this._parseTimeStringToMilliSeconds(currentTime);
    }
  }

  _onAnimEnd(){
    this.currentSlide.removeAttribute('before');
    this.currentSlide.removeEventListener('animationend', this.onAnimEnd.bind(this));
  }

  /**
   * Selects the currentSlide
   * @param slideToSelect
   */
  selectSlide(slideToSelect) {
    this.slides.forEach((slide, index) => {
      slide.removeAttribute('before');
    });
    this.currentSlide.setAttribute('before', true);
    this.slides.forEach((slide, index) => {

      slide.setAttribute('selected', index === slideToSelect);
      slide.setAttribute('previous', index === (slideToSelect === 0
          ? this.totalAmountOfSlides - 1
          : slideToSelect - 1));
      slide.setAttribute('next', index === (this.totalAmountOfSlides - 1 === slideToSelect
          ? 0
          : slideToSelect + 1));
      if(index === slideToSelect) {
        slide.addEventListener('animationend', this._onAnimEnd.bind(this));
      }
      if(this.navDots != undefined){
        this.navDots.forEach((dot, index) => {
          dot.setAttribute("aria-selected", "false");
          dot.classList.remove('active');
          if(index === slideToSelect){
            dot.setAttribute("aria-selected", "true");
            dot.classList.add('active');
          }
        });
      }
    });
    this.currentSlideNum = slideToSelect;
  }

  render() {
    this.shadowRoot.innerHTML = `  
        <slot name="previous-next" class='${this.disablePrevNext === true ? "hidden" :""} '></slot>
        
        <div class="slides">
            <slot @slotchange="${this._onSlotchange}"></slot>        
        </div>
        ${this.predefinedNavDots}
        <div class="nav-dot-wrapper ${this.disableNavDots === true || this.predefinedNavDots.length > 0 ? `hidden` : ""}">
            <ul class="nav-dots">Dot-Navigation: no slides found</ul>
            <atomic-loadingbar time="${this.timeMs}" begin></atomic-loadingbar>
        </div>
        
        <style>
        :host {
          box-sizing: content-box;
          transition: all .5s ease-in-out;
          position: relative;
          overflow: hidden;
          display:none;
          padding-bottom: var(--atomic-slider-bottom-spacing,0px);
          background-color:var(--atomic-slider-background-color,transparent);
        }
        :host([initialized]){
          display:block;
        }
        .nav-dot-wrapper{
          position:absolute;
          z-index:1;
          bottom: var(--atomic-slider-navdots-bottom,0px);
          margin:0;
          padding:10px 0px;
          left:50%;
          transform:translateX(-50%);
        }
        .nav-dots{
          margin:0;
          padding:0;
          display:flex;
          align-items: center;
          list-style-type:none;
        }
        
        atomic-loadingtime{
          position:absolute;
          top:60px;
        }
        
        :host([nav-dots-top]) .nav-dot-wrapper{
           bottom:auto;
           top:0;
        }
        .nav-dots li atomic-slider-dotnav-button{
          position:relative;
        }
        .nav-dots li:last-child atomic-slider-dotnav-button{
          --atomic-slider-dotnav-button-margin:0;
        }
        atomic-loadingbar{
          margin-top:10px;
        }
        
        :host .slides{
          position: relative;
          z-index: 0;
          margin: 0 var(--atomic-slider-marginleftright,0px);
        }
        :host{
          margin: var(--atomic-slider-margin,0px);
        }
  
        atomic-slider-prevnext-button[data-action="move-forward"] {
          transform: rotate(180deg);
          left: calc(100% - var(--atomic-slider-marginleftright,40px));
        }
        .hidden{
          display:none;
        }
        ::slotted(*:not([slot])) {
            display:block;
            top:0;
            left:0;
            width:100%;
            height:100%;
            opacity: 0;
            transition: opacity var(--atomic-slider-transition-time, 1s) var(--atomic-slider-transition, ease-in-out), left var(--atomic-slider-transition-time, 1s) var(--atomic-slider-transition, ease-in-out);
            position:absolute;
        }

        :host([slideMode="slide"]) ::slotted(*[next="true"]) {
          left: 100% !important;
        }

        :host([slideMode="slide"]) ::slotted(*[previous="true"]) {
          left: -100% !important;
        }
        
        ::slotted([selected="true"]) {
            position: relative !important;
            z-index: 1;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
      </style>
      `;
  }

}

if (!customElements.get('atomic-slider')) {
  customElements.define('atomic-slider', AtomicSlider);
}