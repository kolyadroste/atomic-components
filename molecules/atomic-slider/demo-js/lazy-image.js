/**
 * @license
 * @Author Kolya von Droste zu Vischering
 *
 */
import {LitElement, html, css} from 'lit-element';

/**
 * Can Load html content from a given url
 *
 * @slot - This element has a slot
 */
export default class LazyImage extends LitElement {
    static get styles() {
        return css`
            :host{
                display:block;
                padding: 0;
            }
            ::slotted(img){
                width:100%;
                height:auto;
            }
            ::slotted(*){
                display:none;
            }
            :host(.initialized) ::slotted(*){
                display:block;
            }
            
        `;
    }

    static get properties() {
        return {
            lazyImage: {type: String},
            passive: {type:Boolean},
            imageObj: {type: Object},
            imageObjects: {type: Object},
            imageDefinition: {type: Object},
            loadInitiatorSelector: {type: String},
        };
    }

    constructor() {
        super();
        this.lazyImage = '';
        this.passive = false;
        // based on Container Width !! not the window size
        // OR simply: ".../img/img.jpg"
        this.imageDefinition = {};
        this.imageObjects = null;
        this.loadInitiatorSelector = null;
    }

    firstUpdated () {
        console.log(this.passive);
        if(this.loadInitiatorSelector){
            let loadInitiator;
            loadInitiator = document.querySelector(this.loadInitiatorSelector);
            if(loadInitiator===null){
                loadInitiator = this.closest(this.loadInitiatorSelector);
            }
            if(loadInitiator===null){
                console.error('lazy-image: loadInitiator Selector seems to be wrong');
            }
            loadInitiator.addEventListener('status', (e) =>{
                this.init();
            });
        }else{
            if(!this.passive){
                this.init();
            }
        }
    }

    init(){
        this.classList.add('initialized');
        this._startImageObjection();
        this._handleResize();
        window.addEventListener('resize', (e) =>{
            this._handleResize();
        });
    }
    // fires each time an custom-Element is added into a document-connected element
    connectedCallback() {
        super.connectedCallback();
        if(this.loadInitiatorSelector){
            let loadInitiator;
            loadInitiator = document.querySelector(this.loadInitiatorSelector);
            if(loadInitiator===null){
                loadInitiator = this.closest(this.loadInitiatorSelector);
            }
            if(loadInitiator===null){
                console.error('a.lazy-image: loadInitiator Selector seems to be wrong');
            }
            loadInitiator.addEventListener('init', (e) =>{
                this.init();
            });

        }else{
            this._startImageObjection();
        }

    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    _startImageObjection(){
        let root = this;
        var intersectionObserver = new IntersectionObserver(function(entries) {
            // If intersectionRatio is 0, the target is out of view
            // and we do not need to do anything.
            if (entries[0].intersectionRatio <= 0) return;
            root._setCorrectedMediaDefinitions();
            this.disconnect();
        });
        // start observing
        intersectionObserver.observe(this);
    }


    _setCorrectedMediaDefinitions(){
        this.imageObjects = this.querySelectorAll('source');
        let container = this;
        for (const [key,value] of Object.entries(this.imageObjects)){
            let minW = value.getAttribute("data-minwidth");
            if((container.clientWidth > minW)){
                value.setAttribute("media","(min-width:" +  document.body.clientWidth +  "px)");
            }
        }
    }
    _extround(zahl,n_stelle) {
        zahl = (Math.round(zahl * n_stelle) / n_stelle);
        return zahl;
    }


    _handleResize() {
        //if(timeout) clearTimeout(timeout);
        let timeout = setTimeout(()=>{
            this._setCorrectedMediaDefinitions();
            this.requestUpdate();
        },500);

    }

    render() {
        return html`
           <slot></slot>
        `;
    }
}


window.customElements.define('lazy-image', LazyImage);
