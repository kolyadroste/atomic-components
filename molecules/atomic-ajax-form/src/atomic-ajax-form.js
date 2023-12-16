/**
 * @license
 * @author Kolya von Droste zu Vischering
 * @slot - This element has slots
 */
export class AtomicAjaxForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.requestUrl = this.hasAttribute("url") ? this.getAttribute("url") : this.form.getAttribute("action");
        this.delay= this.hasAttribute("delay") ? this.getAttribute("delay") : 50;
    }

    get resultSelector(){
      return this.getAttribute("resultSelector");
    }

    get form(){
        let form = this.querySelector('form');

        if(form === null){
            console.error('base-ajax-form: no form found. Please check the attribute "formSelector"');
            return false;
        }
        return form;
    }


    get loaderSelector(){
        return this.getAttribute("loaderSelector");
    }

    get loaderClass(){
        return this.getAttribute("loaderClass");
    }

    get loaderAttribute(){
        return this.getAttribute("loaderAttribute");
    }

    get loaderOpenMethod(){
        return this.getAttribute("loaderOpenMethod");
    }

    get loaderCloseMethod(){
        return this.getAttribute("loaderCloseMethod");
    }

    get loader(){
        let loader;
        let selector = this.getAttribute("loaderSelector");
        if(selector){
            loader = document.querySelector(selector);
        }
        if(!loader && selector){
            console.error('base-ajax-form: no loader found. Please check the attribute "loaderSelector"');
            return false;
        }
        return loader;
    }

    get resultContainer(){
        let selector = this.getAttribute("resultSelector");
        let target = document.querySelector(selector);
        if(!target){
            target = this;
        }
        if(target === null){
            console.error('base-ajax-form: no resultContainer not found. Please check the attribute "resultSelector"');
            return false;
        }
        return target;
    }

    get callback() {
        const callback = this.getAttribute("callback");

    }

    _callCallBackTask(content){
        const configSlot = this.shadowRoot.querySelector('slot[name="callback"]');
        const config = configSlot.assignedNodes();
        if(config.length > 0){
            var data;
            try {
                data = config[0].innerHTML;
            }
            catch(ex) {
                this._throwError();
                return;
            }
            let callBackTask = eval(data);
            callBackTask(content);
        }
    }

    connectedCallback() {
        this.render();
        this._addSubmitEvent();
    }

    _addSubmitEvent(){
        if(this.form === null){
            console.error('base-ajax-form: no form found. Please check the attribute "formSelector"');
            return false;
        }
        this.form.addEventListener('submit',(event)=>{
            event.preventDefault();
            this._xhr(this.form, this.requestUrl);
        });
    };

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position:relative;
                }
                :host .filterTree {
                    list-style-type:none;
                }
            </style>
            <slot></slot>
            <slot name="callback"></slot>
        `;
    }

    _xhr(form, requestUrl){
        let root = this;
        let formData = new FormData(form);
        var xhr = new XMLHttpRequest()
        if(this.loaderSelector){
            this._setLoader("open");
        }
        xhr.onload = (oEvent) => {
            if(xhr.status >= 200 && xhr.status <= 300){
                setTimeout(()=>{
                    if(this.delay > 50){
                        console.log("base-ajax-form: the attribute delay was set for demo purposes");
                    }
                    let content;
                    if(this.resultContainer){
                        content = xhr.responseText;
                        root._callCallBackTask(this);
                        this.resultContainer.innerHTML = content;
                    } else{
                        content = xhr.responseText;
                        root._callCallBackTask(this);
                        this.innerHTML = content;
                    }
                    this._setLoader("close");
                }, this.delay);
            }else{
                console.log('failed with xhr-status: ' +xhr.status);
            }
        }
        xhr.open('POST', requestUrl, true);
        //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(formData);
    }

    serialize (data) {
        let obj = {};
        for (let [key, value] of data) {
            if (obj[key] !== undefined) {
                if (!Array.isArray(obj[key])) {
                    obj[key] = [obj[key]];
                }
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
        }
        return obj;
    }

    _setLoader(mode){
        let loader = this.loader;
        if(!this.loaderSelector){
            return false;
        }
        if(!loader){
            console.error("base-ajax-form: loader was set but could not be found");
            return false;
        }
        if(this.loaderAttribute){

            if(mode==="open"){
                loader.setAttribute(this.loaderAttribute,"");
            }else if(mode==="close"){
                loader.removeAttribute(this.loaderAttribute);
            }
        }else if(this.loaderOpenMethod){
            if(typeof loader[method] === 'function'){
                if(mode==="open") {
                    let method = eval(this.loaderOpenMethod);
                    loader[method];
                }else{
                    let method = eval(this.loaderCloseMethod);
                    loader[method];
                }
            }else{
                console.error("base-ajax-form: the loaderOpenMethod was set but does not exist");
            }
        }else if(this.loaderClass){
            if(mode==="open") {
                loader.classList.add(this.loaderClass);
            }else{
                loader.classList.remove(this.loaderClass);
            }
        }else{
            console.error("base-ajax-form: loaderSelector was set but config is missing");
        }
    };
}


window.customElements.define('atomic-ajax-form', AtomicAjaxForm);
