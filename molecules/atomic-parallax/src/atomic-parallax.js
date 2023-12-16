/**
 * @license
 * @Author Kolya von Droste zu Vischering
 * @slot - This element has a slot
 */
class AtomicParalaxElement{
  constructor(domElement,container,config) {
    this.domElement = domElement;
    this.container = container;
    this.elementState = 0;
    this.config = config;
    this.fromYPos = this.domElement.hasAttribute("fromY") ? this.domElement.getAttribute("fromY") : "";
    this.toYPos = this.domElement.hasAttribute("toY") ? this.domElement.getAttribute("toY") : "";
    this.fromXPos = this.domElement.hasAttribute("fromX") ? this.domElement.getAttribute("fromX") : "";
    this.toXPos = this.domElement.hasAttribute("toX") ? this.domElement.getAttribute("toX") : "";
    this.typeY = this.hasPercentageVal([this.fromYPos, this.toYPos]) ? '%' : 'px';
    this.typeX = this.hasPercentageVal([this.fromXPos,this.toXPos]) ? '%' : 'px';
    this.cleanFromYPos = this.removeUnit(this.fromYPos);
    this.cleanToYPos = this.removeUnit(this.toYPos);
    this.cleanFromXPos = this.removeUnit(this.fromXPos);
    this.cleanToXPos = this.removeUnit(this.toXPos);
    this.rangeY = this.getRange(this.cleanFromYPos, this.cleanToYPos);
    this.rangeX = this.getRange(this.cleanFromXPos, this.cleanToXPos);
    this.stopAtBottom = this.domElement.hasAttribute("stopAtBottom");
    this.corrBeginPercentage = this.container.hasAttribute("corrBeginPercentage") ? this.container.getAttribute("corrBeginPercentage") : 0;
    this.yPos = this._calculatePosition(this.cleanFromYPos, this.cleanToYPos, this.typeY);

    if(this.typeY  === '%' || this.typeX === '%'){
      const positionWrapper = document.createElement("div");
      positionWrapper.style.position = "absolute";
      positionWrapper.style.width = "100%";
      positionWrapper.style.height = "100%";
      positionWrapper.setAttribute("positionWrapper","");
      positionWrapper.appendChild(this.domElement);
      this.container.appendChild(positionWrapper);
      this.positionWrapper = positionWrapper;
    }
  }

  set state(state){
    this.elementState = state;
  }

  get viewHeight(){
    return window.innerHeight;
  }

  get containerHeight(){
    return this.container.clientHeight;
  }

  get windowHeight(){
    return document.body.clientHeight;
  }

  removeUnit(val){
    val = val.replace("px","");
    val = val.replace("%","");
    val = val.replace("em","");
    val = val.replace("vh","");
    val = val.replace("vw","");
    return val;
  }

  hasPercentageVal(arr){
    let state = false;
    arr.forEach((val)=>{
      val = val.split("%");
      if(val.length === 2){
        state = true;
      }
    });
    return state;
  }

  _makePositive(val){
    val = parseInt(val);
    if(val < 0){
      val = val * -1;
      return val;
    }
    return val;
  }

  getRange(fromPos=0, toPos=0){
    let fromPosPositive = this._makePositive(fromPos);
    let toPosPositive = this._makePositive(toPos);
    // the distance between fromPos and toPos
    let range = fromPosPositive + toPosPositive;
    return range;
  }

  _calculatePosition(fromPos = 0, toPos= 0, type = 'px'){
    fromPos = parseInt(fromPos);
    toPos = parseInt(toPos);
    let fromPosPositive = this._makePositive(fromPos);
    let toPosPositive = this._makePositive(toPos);
    // the distance between fromPos and toPos
    let rangeConfig = fromPosPositive + toPosPositive;
    if(rangeConfig <= 0) return false;
    // current scroll-position in px
    this.scrollPos = this.getScrollPosition()[0];
    // the total height of the scrollable page
    this.totalScrollHeight = this.windowHeight;
    // percentage of the overall scrollingHeight
    this.scrollPercent = this.scrollPos / this.totalScrollHeight;
    // the position where the scrolling of the element should begin
    this.initialYPos = this.container.offsetTop - this.viewHeight;
    // when the scrollpos is near the to the initialpos has to be set to zero
    this.initialYPos = this.initialYPos < 0 ? 0 : this.initialYPos;
    // defines the position in px from where the scrolling should start
    this.relScrollYPos = this.getScrollPosition()[0] - this.initialYPos;
    // the total height of the scrollable area relative to the Elements-Container
    this.relTotalHeight = this.viewHeight + this.containerHeight;
    //when scroll is neat the top the total height has to be calculated differently
    if(this.initialYPos <= 0){
      this.relTotalHeight =  this.container.offsetTop+ this.containerHeight;
    }else{
      this.relTotalHeight = this.viewHeight+ this.containerHeight;
    }
    // relative scrollPercent of the relTotalHeight
    this.relScrollPercent = this.relScrollYPos / this.relTotalHeight;
    // calculated Position of the moving BaseParallaxElement based on the config
    let calcPos = this.relScrollPercent * rangeConfig;
    // if fromPos is smaller than zero the position should begin negative
    if(fromPos <= 0){
      //console.log("fromPos <= 0");
      calcPos = calcPos + fromPos;
    }
    //console.log("calcPos1: " +calcPos );
    // if the fromPos is greater than the toPos we have to calculate the position in reverse order
    if(fromPos > toPos) {
      //console.log("fromPos > toPos");
      calcPos = this.reverseCalcPos(calcPos, type, rangeConfig);
    }
    // console.log("this.fromPos: " +fromPos );
    // console.log("this.relScrollPercent: " +this.relScrollPercent );
    // console.log("rangeConfig: " +rangeConfig );
    // console.log("calcPos: " +calcPos );
    return calcPos;
  }

  reverseCalcPos(calcPos, type, rangeConfig){
    let pos;
    if(type === 'px'){
      pos = rangeConfig - calcPos;
    }else{
      pos = rangeConfig - calcPos;
    }
    return pos;
  }

  aRangeIsDefined(range = 0){
    return range > 0;
  }

  update(){
    if(this.elementState){
      if(this.aRangeIsDefined(this.rangeY)){
        this.yPos = this._calculatePosition(this.cleanFromYPos, this.cleanToYPos, this.typeY);
        if(this.stopAtBottom && this.yPos > this.containerHeight){
          this.yPos = this.containerHeight;
        }
      }
      if(this.aRangeIsDefined(this.rangeX)){
        this.xPos = this._calculatePosition(this.cleanFromXPos, this.cleanToXPos, this.typeX);
      }
      this.applyStyle(this._getFlattenStyles(this.yPos,this.xPos));
    }
  }

  getScrollPosition() {
    const supportScrollX = window.scrollX !== undefined
    const x = supportScrollX ? window.scrollX : window.pageXOffset;
    const y = supportScrollX ? window.scrollY : window.pageYOffset;
    return [y, x]
  }

  _getFlattenStyles(yPos,xPos){
    let flattened = "";
    if(yPos){
      flattened = `translateY(${yPos}${this.typeY}) `;
    }
    if(xPos){
      flattened += `translateX(${xPos}${this.typeX}) `;
    }
    return flattened;
  }

  applyStyle = (flattened) => {
    if(this.positionWrapper){
      this.positionWrapper.style.setProperty("transform",flattened);
    }else{
      this.domElement.style.setProperty("transform",flattened);
    }

  }
}

export default class AtomicParallax extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.innerWidth = 0;
    this.innerHeight = 0;
    this.frame = 0;
    this.elements = [];
    this.autoSelect = this.getAttribute("autoSelect") ? true : false;
  }

  _inViewObjection(){
    this.setAttribute("begin","");
    let root = this;
    var intersectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          root.elementState = 1;
          root.setAttribute("begin","");
        }else{
          root.elementState = 0;
          root.removeAttribute("begin");
        }
      })
    });
    // start observing
    intersectionObserver.observe(this);
  }

  set elementState(state){
    this.elements.forEach((domElement) => {
      domElement.state = state;
    })
  }

  onWindowResize = () => {
    const changed = document.body.clientWidth !== this.windowWidth ||
        document.body.clientHeight !== this.windowHeight
    if (changed) {
      this.windowWidth = document.body.clientWidth;
      this.windowHeight = document.body.clientHeight;
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.elements.forEach(el => {
        el.windowWidth = this.windowWidth;
        el.setWindowHeight = this.windowHeight;
        el.innerWidth = this.innerWidth;
        el.setInnerHeight = this.innerHeight;
      });
    }
  }

  findAndAddElements = () => {
    this.elements = []
    const elements = this.querySelectorAll(":scope > .parallax");
    elements.forEach((domElement) => {
      let config = {'from':'','to':''};
      config.from = domElement.getAttribute("from");
      config.to = domElement.getAttribute("to");
      this.elements.push(new AtomicParalaxElement( domElement, this, config, {}))
    })
  }

  onAnimationFrame = (e) => {
    this.elements.forEach((element) => {
      element.update(this.frame)
    })
    this.frame ++;
    window.requestAnimationFrame(this.onAnimationFrame)
  }

  connectedCallback () {
    this.onWindowResize();
    this._inViewObjection();
    window.requestAnimationFrame(this.onAnimationFrame)
    this.windowWidth = document.body.clientWidth;
    this.windowHeight = document.body.clientHeight;
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    window.onresize = this.onWindowResize;
    this.render();
    this.findAndAddElements();
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{
            --base-parallax--height-panorama:40;
            --base-parallax--height-portrait:150;
            --base-parallax--transition-time: .5s;
            position: relative;
            width:100%;
            display:block;
            padding-top: calc(var(--base-parallax--height-panorama) * 1%);
            overflow: hidden;
        }
        ::slotted(.parallax),
        ::slotted([positionWrapper]){
            transition: transform var(--base-parallax--transition-time);
        }
        ::slotted(.parallax){
            position: absolute;
            inset:0 auto auto 0;
            width:100%;
        }
        :host([noSmoothness]) ::slotted(.parallax),
        :host([noSmoothness]) ::slotted([positionWrapper]){
            transition: unset;
        }
        @media (orientation: portrait) {
            :host{
                padding-top: calc(var(--base-parallax--height-portrait) * 1%);
            }
            ::slotted(img.parallax){
                object-fit: cover;
                width:100%;
                height:120%;
            }
        }
      </style>
      <slot></slot>
        `
  }
}
if (customElements.get('atomic-parallax') === undefined) {
  customElements.define('atomic-parallax', AtomicParallax);
}

