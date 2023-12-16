const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
        --animate-duration:1s;
        --animate-repeat:1;
        animation-play-state:initial;
        }
        :host {
            display:block;
            animation-duration: var(--animate-duration);
            animation-fill-mode: both;
        }
        :host([inline]){
            display:inline-block;
        }
        :host([hideBeforeStart]) {
            display:none;
        }
        :host([begin]){
            display:block !important;
        }
        :host([inline][begin]) {
            display:inline-block !important;
        }
        :host([invinite]) {
            animation-iteration-count: infinite;
        }
        :host([repeat-1])  {
            animation-iteration-count: var(--animate-repeat);
        }
        :host([repeat-2]){
            animation-iteration-count: calc(var(--animate-repeat) * 2);
        }
        :host([repeat-3])  {
            animation-iteration-count: calc(var(--animate-repeat) * 3);
        }

    </style>
    <div anim-wrapper>
        <slot></slot>
    </div>
    <slot name="events"></slot>
`
/**
 * Base Anim
 *
 * provides event chaining by using an eventslot and a config like this:
 *
 * <script slot="events" type="application/json">
 *   [{"event":{
 *       "name": "anim.started",    // event on the trigger element that starts the event chain
 *       "delay": "2000",           // delay in ms for the event start
 *       "target": "#next1",        // an ID should be placed here
 *       "method": "play"           // method that should be called on the target element
 *        }}
 *   ]
 *   </script>
 */

export default class AtomicAnimBase extends HTMLElement {

    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: "closed"});
        this.shadowDom.appendChild(template.content.cloneNode(true));
        if(this.hasAttribute('duration')){
            this.style.setProperty('--animate-duration', this.getAttribute('duration'));
        }
        if(this.hasAttribute('repeat')){
            this.style.setProperty('--animate-repeat', this.getAttribute('repeat'));
        }
        this.timeOut = null;
    }

    connectedCallback() {
        if(this.hasAttribute('inViewStart')){
            this._inViewObjection();
        }

        let body = document.querySelector("body");
        if(body.length === 0){console.error("the html document is invalid. Body-tag is missing"); return}

        this.addEventListener('animationstart', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if(body.hasAttribute("baseAnimIsPlaying") === false){
                body.setAttribute("baseAnimIsPlaying","");
            }
            this.dispatchEvent(new CustomEvent('anim.started', {cancelable: false}, false));
        });
        this.addEventListener('animationend', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            this.removeAttribute("begin");
            body.removeAttribute("baseAnimIsPlaying");
            this.setAttribute("ended","");
            this.dispatchEvent(new CustomEvent('before.anim.ended', {cancelable: false}, false));
            setTimeout(()=>{
                this.dispatchEvent(new CustomEvent('anim.ended', {cancelable: false}, false));
            },50);



        });

        let data = this._getEventConfig();
        this._listenEvents(data);
    }

    _getEventConfig(){
        const configSlot = this.shadowDom.querySelector('slot[name="events"]');
        const config = configSlot.assignedNodes();
        if(config.length > 0){
            var data;
            try {
                data = JSON.parse(config[0].innerHTML);
            }
            catch(ex) {
                this._throwError();
                return;
            }
            return data;
        }
    }

    _listenEvents(data){
        if(typeof data === "object"){
            data.forEach(conf =>{
                if(conf["event"]){
                    this._listenEvent(conf);
                }else{
                    this._throwError();
                }

            });
        }
    }
    _listenEvent(conf){
        if(conf.event.name === null || conf.event.target === null || conf.event.method === null) {
            console.error("ERROR: Event config isn't wellformed");
            return;
        }
        let targets = document.querySelectorAll(conf.event.target);

        if(targets === null || targets.length === 0){
            console.error("ERROR: Event target config cant find an object");
            console.log(conf);
            return;
        }

        this.addEventListener(conf.event.name, (event)=>{
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            let delay = conf.event.delay ? conf.event.delay : 50;
            let method = conf.event.method;
            if(conf.event.consoleMessage){
                console.info("message: " +conf.event.consoleMessage +", target: "+ conf.event.target);
            }
            targets.forEach((target,index)=>{
                if(typeof target[method] !== "undefined"){
                    if(method === "reset"){
                        target[conf.event.method]();
                    }else{
                        this.timeOut = setTimeout(function(){
                            target[conf.event.method]();
                        },eval(delay));
                    }

                }else{
                    console.error("Error: cant execute method" +conf.event.method + " on " + conf.event.target)
                    console.log(target);
                }
            });
        })
    };


    _throwError(){
        console.error("base-anim component has no valid config");
    }
    _inViewObjection(){
        let root = this;
        var intersectionObserver = new IntersectionObserver(function(entries) {
            if (entries[0].intersectionRatio <= 0) return;
            root.setAttribute("begin","");
            this.disconnect();
        });
        // start observing
        intersectionObserver.observe(this);
    }

    play(caller = null){
        this.setAttribute("begin","");
    }
    reset(caller = null){
        clearTimeout(this.timeOut);
        this.removeAttribute("ended");
        this.removeAttribute("begin");
    }

}
