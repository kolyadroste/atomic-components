import {presets} from './lax-presets';
export default class LaxElement {
    domElement
    transformsData
    styles = {}
    selector = ''

    groupIndex = 0
    laxInstance

    onUpdate

    constructor(selector, laxInstance, domElement, transformsData, groupIndex = 0, options = {}) {
        this.selector = selector
        this.laxInstance = laxInstance
        this.domElement = domElement
        this.transformsData = transformsData
        this.groupIndex = groupIndex
        this.presets = presets;

        this.transformKeys = ["perspective", "scaleX", "scaleY", "scale", "skewX", "skewY", "skew", "rotateX", "rotateY", "rotate"];
        this.filterKeys = ["blur", "hue-rotate", "brightness"];
        this.translate3dKeys = ["translateX", "translateY", "translateZ"];

        this.pxUnits = ["perspective", "border-radius", "blur", "translateX", "translateY", "translateZ"];
        this.degUnits = ["hue-rotate", "rotate", "rotateX", "rotateY", "skew", "skewX", "skewY"];

        const { style = {}, onUpdate } = options

        Object.keys(style).forEach(key => {
            domElement.style.setProperty(key, style[key])
        })

        if (onUpdate) this.onUpdate = onUpdate

        this.calculateTransforms()
    }

    easings = {
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

    lerp(start, end, t) {
        return start * (1 - t) + end * t
    }

    invlerp(a, b, v) {
        return (v - a) / (b - a)
    }

    interpolate(arrA, arrB, v, easingFn) {
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

        let vector = this.invlerp(arrA[j], arrA[k], v)
        if (easingFn) vector = easingFn(vector)
        const lerpVal = this.lerp(arrB[j], arrB[k], vector)
        return lerpVal
    }

    update = (driverValues, frame) => {
        const { transforms } = this

        const styles = {}

        for (let driverName in transforms) {
            const styleBindings = transforms[driverName]

            if (!driverValues[driverName]) {
                console.error("No lax driver with name: ", driverName)
            }

            const [value, inertiaValue] = driverValues[driverName]

            for (let key in styleBindings) {
                const [arr1, arr2, options = {}] = styleBindings[key]
                const { modValue, frameStep = 1, easing, inertia, inertiaMode, cssFn, cssUnit = '' } = options

                const easingFn = this.easings[easing]

                if (frame % frameStep === 0) {
                    const v = modValue ? value % modValue : value

                    let interpolatedValue = this.interpolate(arr1, arr2, v, easingFn)

                    if (inertia) {
                        let inertiaExtra = inertiaValue * inertia
                        if (inertiaMode === 'absolute') inertiaExtra = Math.abs((inertiaExtra))
                        interpolatedValue += inertiaExtra
                    }

                    const unit = cssUnit || this.pxUnits.includes(key) ? 'px' : (this.degUnits.includes(key) ? 'deg' : '')
                    const dp = unit === 'px' ? 0 : 3
                    const val = interpolatedValue.toFixed(dp)
                    styles[key] = cssFn ? cssFn(val, this.domElement) : val + cssUnit
                }
            }
        }

        this.applyStyles(styles)
        if (this.onUpdate) this.onUpdate(driverValues, this.domElement)
    }


    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    getScrollPosition() {
        const supportPageOffset = window.pageXOffset !== undefined
        const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')

        const x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft
        const y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop

        return [y, x]
    }

    parseValue(val, { width, height, x, y }, index) {
        if (typeof val === 'number') {
            return val
        }

        const pageHeight = document.body.scrollHeight
        const pageWidth = document.body.scrollWidth
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const [scrollTop, scrollLeft] = this.getScrollPosition()

        const left = x + scrollLeft
        const right = left + width
        const top = y + scrollTop
        const bottom = top + height

        return Function(`return ${val
            .replace(/screenWidth/g, screenWidth)
            .replace(/screenHeight/g, screenHeight)
            .replace(/pageHeight/g, pageHeight)
            .replace(/pageWidth/g, pageWidth)
            .replace(/elWidth/g, width)
            .replace(/elHeight/g, height)
            .replace(/elInY/g, top - screenHeight)
            .replace(/elOutY/g, bottom)
            .replace(/elCenterY/g, top + (height / 2) - (screenHeight / 2))
            .replace(/elInX/g, left - screenWidth)
            .replace(/elOutX/g, right)
            .replace(/elCenterX/g, left + (width / 2) - (screenWidth / 2))
            .replace(/index/g, index)
        }`)()
    }

    getArrayValues(arr, windowWidth) {
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

    calculateTransforms = () => {
        this.transforms = {}
        const windowWidth = this.laxInstance.windowWidth

        for (let driverName in this.transformsData) {
            let styleBindings = this.transformsData[driverName]

            const parsedStyleBindings = {}

            const { presets = [] } = styleBindings
            presets.forEach((presetString) => {

                const [presetName, y, str] = presetString.split(":")

                const presetFn = this.presets[presetName]

                if (!presetFn) {
                    console.error("Lax preset cannot be found with name: ", presetName)
                } else {
                    const preset = presetFn(y, str)

                    Object.keys(preset).forEach((key) => {
                        styleBindings[key] = preset[key]
                    })
                }
            })

            delete styleBindings.presets

            for (let key in styleBindings) {
                let [arr1 = [-1e9, 1e9], arr2 = [-1e9, 1e9], options = {}] = styleBindings[key]

                const saveTransform = this.domElement.style.transform
                this.domElement.style.removeProperty("transform")
                const bounds = this.domElement.getBoundingClientRect()
                this.domElement.style.transform = saveTransform

                const parsedArr1 = this.getArrayValues(arr1, windowWidth).map(i => this.parseValue(i, bounds, this.groupIndex))
                const parsedArr2 = this.getArrayValues(arr2, windowWidth).map(i => this.parseValue(i, bounds, this.groupIndex))

                parsedStyleBindings[key] = [parsedArr1, parsedArr2, options]
            }

            this.transforms[driverName] = parsedStyleBindings
        }
    }

    flattenStyles(styles) {
        const flattenedStyles = {
            transform: '',
            filter: ''
        }

        const translate3dValues = {
            translateX: 0.00001,
            translateY: 0.00001,
            translateZ: 0.00001
        }

        Object.keys(styles).forEach((key) => {
            const val = styles[key]
            const unit = this.pxUnits.includes(key) ? 'px' : (this.degUnits.includes(key) ? 'deg' : '')

            if (this.translate3dKeys.includes(key)) {
                translate3dValues[key] = val
            } else if (this.transformKeys.includes(key)) {
                flattenedStyles.transform += `${key}(${val}${unit}) `
            } else if (this.filterKeys.includes(key)) {
                flattenedStyles.filter += `${key}(${val}${unit}) `
            } else {
                flattenedStyles[key] = `${val}${unit} `
            }
        })

        flattenedStyles.transform = `translate3d(${translate3dValues.translateX}px, ${translate3dValues.translateY}px, ${translate3dValues.translateZ}px) ${flattenedStyles.transform}`

        return flattenedStyles
    }

    applyStyles = (styles) => {
        const mergedStyles = this.flattenStyles(styles)

        Object.keys(mergedStyles).forEach((key) => {
            this.domElement.style.setProperty(key, mergedStyles[key])
        })
    }
}