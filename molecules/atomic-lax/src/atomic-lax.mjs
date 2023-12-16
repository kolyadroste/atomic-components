/**
 * @license
 * @Author Kolya von Droste zu Vischering
 * @slot - This element has a slot
 */

const template = document.createElement('template');
template.innerHTML = `
      <style>
          :host{
              display:block;
          }
      </style>
      <slot name="config"></slot>
      <slot></slot>   
`

import LaxElement from './lax-element';
import LaxDriver from './lax-driver';
import Lax from './lax';
export default class AtomicLax extends HTMLElement {

  constructor() {
    super();
    this.shadowDom = this.attachShadow({mode: "closed"});
    this.shadowDom.appendChild(template.content.cloneNode(true));

  }

  drivers = []
  elements = []
  frame = 0

  debug = false

  windowWidth = 0
  windowHeight = 0
  presets = this.laxPresets

  debugData = {
    frameLengths: []
  }


  onWindowResize = () => {
    const changed = document.body.clientWidth !== this.windowWidth ||
        document.body.clientHeight !== this.windowHeight

    if (changed) {
      this.windowWidth = document.body.clientWidth
      this.windowHeight = document.body.clientHeight
      this.elements.forEach(el => el.calculateTransforms())
    }
  }

  onAnimationFrame = (e) => {
    if (this.debug) {
      this.debugData.frameStart = Date.now()
    }

    const driverValues = {}

    this.drivers.forEach((driver) => {
      driverValues[driver.name] = driver.getValue(this.frame)
    })

    this.elements.forEach((element) => {
      element.update(driverValues, this.frame)
    })

    if (this.debug) {
      this.debugData.frameLengths.push(Date.now() - this.debugData.frameStart)
    }

    if (this.frame % 60 === 0 && this.debug) {
      const averageFrameTime = Math.ceil((this.debugData.frameLengths.reduce((a, b) => a + b, 0) / 60))
      console.log(`Average frame calculation time: ${averageFrameTime}ms`)
      this.debugData.frameLengths = []
    }

    this.frame++

    window.requestAnimationFrame(this.onAnimationFrame)
  }

  addDriver = (name, getValueFn, options = {}) => {
    this.drivers.push(
        new LaxDriver(name, getValueFn, options)
    )
  }

  removeDriver = (name) => {
    this.drivers = this.drivers.filter(driver => driver.name !== name)
  }

  laxInstance = (() => {
    const transformKeys = ["perspective", "scaleX", "scaleY", "scale", "skewX", "skewY", "skew", "rotateX", "rotateY", "rotate"]
    const filterKeys = ["blur", "hue-rotate", "brightness"]
    const translate3dKeys = ["translateX", "translateY", "translateZ"]

    const pxUnits = ["perspective", "border-radius", "blur", "translateX", "translateY", "translateZ"]
    const degUnits = ["hue-rotate", "rotate", "rotateX", "rotateY", "skew", "skewX", "skewY"]

    function getArrayValues(arr, windowWidth) {
      if (Array.isArray(arr)) return arr

      const keys = Object.keys(arr).map(x => parseInt(x)).sort((a, b) => a > b ? 1 : -1)

      let retKey = keys[keys.length - 1]
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (windowWidth < key) {
          retKey = key
          break
        }
      }

      return arr[retKey]
    }

    function lerp(start, end, t) {
      return start * (1 - t) + end * t
    }

    function invlerp(a, b, v) {
      return (v - a) / (b - a)
    }

    function interpolate(arrA, arrB, v, easingFn) {
      let k = 0

      arrA.forEach((a) => {
        if (a < v) k++
      })

      if (k <= 0) {
        return arrB[0]
      }

      if (k >= arrA.length) {
        return arrB[arrA.length - 1]
      }

      const j = k - 1

      let vector = invlerp(arrA[j], arrA[k], v)
      if (easingFn) vector = easingFn(vector)
      const lerpVal = lerp(arrB[j], arrB[k], vector)
      return lerpVal
    }

    const easings = {
      easeInQuad: t => t * t,
      easeOutQuad: t => t * (2 - t),
      easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeInCubic: t => t * t * t,
      easeOutCubic: t => (--t) * t * t + 1,
      easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      easeInQuart: t => t * t * t * t,
      easeOutQuart: t => 1 - (--t) * t * t * t,
      easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
      easeInQuint: t => t * t * t * t * t,
      easeOutQuint: t => 1 + (--t) * t * t * t * t,
      easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
      easeOutBounce: t => {
        const n1 = 7.5625
        const d1 = 2.75

        if (t < 1 / d1) {
          return n1 * t * t
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375
        }
      },
      easeInBounce: t => {
        return 1 - easings.easeOutBounce(1 - t)
      },
      easeOutBack: t => {
        const c1 = 1.70158
        const c3 = c1 + 1

        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
      },
      easeInBack: t => {
        const c1 = 1.70158
        const c3 = c1 + 1

        return c3 * t * t * t - c1 * t * t
      },
    }
  });

  findAndAddElements = () => {
    this.elements = []
    const elements = this.querySelectorAll(".lax")
    elements.forEach((domElement) => {
      const driverName = "scrollY"
      const presets = []

      domElement.classList.forEach((className) => {
        if (className.includes("lax_preset")) {
          const preset = className.replace("lax_preset_", "")
          presets.push(preset)
        }
      })

      const transforms = {
        [driverName]: {
          presets
        }
      }

      this.elements.push(new LaxElement('.lax', this, domElement, transforms, 0, {}))
    })
  }

  addElements = (selector, transforms, options = {}) => {
    const domElements = options.domElements || document.querySelectorAll(selector)

    domElements.forEach((domElement, i) => {
      this.elements.push(new LaxElement(selector, this, domElement, transforms, i, options))
    })
  }

  removeElements = (selector) => {
    this.elements = this.elements.filter(element => element.selector !== selector)
  }

  addElement = (domElement, transforms, options) => {
    this.elements.push(new LaxElement('', this, domElement, transforms, 0, options, this.presets))
  }

  removeElement = (domElement) => {
    this.elements = this.elements.filter(element => element.domElement !== domElement)
  }


  _getSlotConfig(){
    const configSlot = this.shadowDom.querySelector('slot[name="config"]');
    const config = configSlot.assignedNodes();
    console.log(config);
    if(config.length > 0){
      var data;
      try {
        data = config[0].innerHTML;
      }
      catch(ex) {
        this._throwError();
        return;
      }
      return data;
    }
  }

  connectedCallback () {
    let lax = new Lax();
    lax.init();
    lax = eval(this._getSlotConfig());

    this.addDriver(
        "scrollY",
        function () {
          return document.documentElement.scrollTop;
        },
        { frameStep: 1 }
    );
    this.findAndAddElements()

    window.requestAnimationFrame(this.onAnimationFrame)
    this.windowWidth = document.body.clientWidth
    this.windowHeight = document.body.clientHeight

    window.onresize = this.onWindowResize;

  }

}




if (customElements.get('atomic-lax') === undefined) {
  customElements.define('atomic-lax', AtomicLax);
}

