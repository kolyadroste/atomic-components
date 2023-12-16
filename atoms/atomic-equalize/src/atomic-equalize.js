export default class AtomicEqualize extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <slot></slot>
        `;
        this.initialized = false;
        this.count = 0;
        document.addEventListener('DOMContentLoaded', this.init(true), {
            once: true,
            passive: true,
        });
    }

    init(bool){
        this.initialized = bool;
        this.equalize(this.targets,this.type);
        if(!this.targets){
            console.log("atomic-euqalize: couldnt find any targets");
            return;
        }
        this.targets.forEach((target)=>{
            new ResizeObserver((entries) => {
                this.equalize(this.targets,this.type);
            }).observe(target);
        })

    }


    static get observedAttributes() {
        return ['target', 'config'];
    }

    get type() {
        const type = this.hasAttribute('type') ? this.getAttribute('type').toString() : 'height';
        return type;
    }

    get selector() {
        return this.getAttribute('selector').toString();
    }

    get targets(){
        const targets = this.querySelectorAll(this.selector);
        if(!targets){
            console.error("atomic-equalizer cant find any targets");
        }
        return targets;
    }

    equalize(targets, dimension){
        // enable/disable if breakpoint is set
        // todo: this should by refactored, by enabling/disabling resizeObserver
        console.log(window.innerWidth);
        console.log(this.parsedBreakpoints);
        //
        if(this.state !== 'on'){
            return;
        }

        // reset heights
        targets.forEach((target) => {
            target.style[dimension] = "auto";
        });
        // equalize heights
        let max = this.getMaxVal(targets,dimension);
        targets.forEach((target) => {
            let elDim = target.offsetHeight;
            if(elDim == max){
                return;
            }
            if(elDim < max){
                target.style[dimension] = max + "px";
            }

        });
        this.count++;
    }
    get breakpoints(){
        return this.hasAttribute("breakpoints") ? this.getAttribute("breakpoints") : null;
    }

    get state(){
        let state = 'on';
        if(this.parsedBreakpoints){
            state = 'off';
            this.parsedBreakpoints.forEach((bp)=>{
                if(bp[0] < window.innerWidth && bp[1] === 'on'){
                    state = 'on';
                }
                if(bp[0] < window.innerWidth && bp[1] === 'off'){
                    state = 'off';
                }
            });

        };
        return state;
    }

    get parsedBreakpoints(){
        if (!this.breakpoints || this.breakpoints === "") {
            return;
        }

        const breakpoints = this.breakpoints.split(',');
        const object = [];
        breakpoints.forEach((command) => {
            command = command.split('::');
            const breakpoint = command[0];
            const action = command[1];
            const actionType = action.includes('on') ? 'on' : 'off';
            object.push([breakpoint,actionType]);
        });
        return object;

    }

    getMaxVal(targets,dimension){
        let maxDim = 0;
        targets.forEach((target)=>{
            const dim = target.offsetHeight;
            if(dim > maxDim){
                maxDim = dim;
            }
        })
        return maxDim;
    }
}

if (customElements.get('atomic-equalize') === undefined) {
    customElements.define('atomic-equalize', AtomicEqualize);
}
