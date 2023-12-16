export default class LaxDriver {
    getValueFn
    name = ''
    lastValue = 0
    frameStep = 1
    m1 = 0

    m2 = 0
    inertia = 0
    inertiaEnabled = false


    constructor(name, getValueFn, options = {}) {
        this.name = name
        this.getValueFn = getValueFn

        Object.keys(options).forEach((key) => {
            this[key] = options[key]
        })

        this.lastValue = this.getValueFn(0)
    }

    getValue = (frame) => {
        let value = this.lastValue

        if (frame % this.frameStep === 0) {
            value = this.getValueFn(frame)
        }

        if (this.inertiaEnabled) {
            const delta = value - this.lastValue
            const damping = 0.8

            this.m1 = this.m1 * damping + delta * (1 - damping)
            this.m2 = this.m2 * damping + this.m1 * (1 - damping)
            this.inertia = Math.round(this.m2 * 5000) / 15000
        }

        this.lastValue = value
        return [this.lastValue, this.inertia]
    }
}

