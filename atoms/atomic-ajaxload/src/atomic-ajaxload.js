export default class AtomicAjaxload extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <style>
                :host{
                    display: block;
                }
            </style>
            <slot></slot> 
        `;
    }

    get src() {
        return this.getAttribute('src');
    }

    get slot() {
        return this.shadowRoot.getAttribute('slot');
    }

    get callback() {
        return this.getAttribute("callback");
    }

    connectedCallback() {
        // load content provided by the src attribute with fetch method
        if(this.hasAttribute('inViewStart')){
            this._inViewObjection();
        }else{
            this._loadContent(this.src);
        }
    }

    _callCallBack(callbackString){
        let [fnName, ...args] = callbackString.split("(");
        args = args.join("").replace(/[()']/g, "").split(",");
        let fn = window[fnName];
        if (typeof fn === 'function') {
            try {
                fn(...args);
            }
            catch(ex) {
                console.error('atomic-ajaxload: callback function is not valid');
                return;
            }
        }else{
            console.error('atomic-ajaxload: callback function is not valid');
            console.error(fn);
            console.error(callbackString);
        }
    }

    _loadContent(src) {
        fetch(src)
            .then(response => response.text())
            .then(data => {
                this.innerHTML = data;
                this.callback ? this._callCallBack(this.callback) : null;
            }).catch(error => {
                console.log(error);
            });
    }

    _inViewObjection(){
        let root = this;
        var intersectionObserver = new IntersectionObserver(function(entries) {
            if (entries[0].intersectionRatio <= 0) return;
            root._loadContent(root.src);
            this.disconnect();
        });
        // start observing
        intersectionObserver.observe(this);
    }
}

if (customElements.get('atomic-ajaxload') === undefined) {
    customElements.define('atomic-ajaxload', AtomicAjaxload);
}
