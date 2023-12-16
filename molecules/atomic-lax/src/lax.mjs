import {presets} from './lax-presets';
import LaxDriver from './lax-driver';
import LaxElement from './lax-element';
export default class Lax {
    drivers = []
    elements = []
    frame = 0

    debug = false

    windowWidth = 0
    windowHeight = 0
    presets = presets

    debugData = {
        frameLengths: []
    }

    init = () => {
        this.findAndAddElements()

        window.requestAnimationFrame(this.onAnimationFrame)
        this.windowWidth = document.body.clientWidth
        this.windowHeight = document.body.clientHeight

        window.onresize = this.onWindowResize
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

    findAndAddElements = () => {
        this.elements = []
        const elements = document.querySelectorAll(".lax")

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
        this.elements.push(new LaxElement('', this, domElement, transforms, 0, options))
    }

    removeElement = (domElement) => {
        this.elements = this.elements.filter(element => element.domElement !== domElement)
    }
}
