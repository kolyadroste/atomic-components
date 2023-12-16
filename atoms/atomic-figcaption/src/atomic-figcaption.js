export default class AtomicFigcaption extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback () {
        this.render();
    }

    render(){
        this.shadowRoot.innerHTML = `
      <style>
            :host{
                align-items:center;
                position:absolute !important;
                left:0%;
                bottom:0;
                box-sizing:border-box;
                z-index:var(--atomic-figcaption-z-index,1);
                background-color:rgba(var(--atomic-figcaption-background-color,0,0,0),var(--atomic-figcaption-background--color-alpha,0.2));
                color:var(--atomic-figcaption-color,white);
                padding:var(--stahgl-figcaption-padding,20px);
            }
            ::slotted(p:last-child){
                margin:0 0 0 0;
                margin-bottom:0 !important;
            }
            :host([top]){
               top:0
               bottom:auto;
            }
            :host([hidden]){
                visibility:hidden;
                opacity:0;
            }
            :host([visible]){
                visibility:visible;
                opacity:1;
            }
            :host([bottom]){
                bottom:0;
                top:auto;
            }
            :host([left]){
                left:0;
                right:auto;
            }
            :host([h-center]),
            :host(.center){
                left:var(--pp-figcaption-hcenter-left-pos,50%);
                transform:translateX(-50%);
            }
            :host([v-center][h-center]),
            :host(.center){
                left:var(--pp-figcaption-hcenter-left-pos,50%);
                transform:translateX(-50%) translateY(-50%);
            }
            
            :host([v-center]),
            :host(.middle){
                top:var(--pp-figcaption-vcenter-top-pos,50%);
                bottom:auto;
                transform:translateY(-50%);
            }
            
            :host([right]){
                right:0;
                left:auto;
            }
            :host([outside]){
                position:relative !important;
                display: inline-block;
                background-color:rgba(var(--pp-figcaption-background-color,0,0,0),var(--pp-figcaption-background--color-alpha,0.1));
                color:var(--pp-figcaption-outsiide-color,black);
            }

            :host([fullwidth]){
                display:block;
                width:100%;
                transform:none;
            }
            :host([v-center][container-size="medium"]){
              top:auto;
              width:100%;
              left:0;
              transform:none;
              bottom:0;
            }
            :host([container-size="medium"]){
              width:100%;
              bottom:0;
              left:0;
              transform:none;
            }
            :host([top][container-size="medium"]){
              top:0;
              bottom:auto;
            }

            :host([container-size="xs"]),
            :host([container-size="small"]),
            :host([container-size="small"]:not([mobile-above])){
              display:block;
              top:auto!important;
              transform:none !important;
              bottom:auto!important;
              left:auto !important;
              right:auto !important;
              position:relative !important;
              color:var(--figcaption-outside-color,black);
              background-color:rgba(var(--pp-figcaption-background-color,0,0,0),var(--pp-figcaption-background--color-alpha,0.1));
            }

            :host([nowrap]){
                background-color:transparent;
                padding:var(--pp-figcaption-nowrap-padding,10px 0 0 0);
            }
      </style>
    <figcaption class="flex">
        <slot></slot>
    </figcaption>
    `
    }
}

if (customElements.get('atomic-figcaption') === undefined) {
    customElements.define('atomic-figcaption', AtomicFigcaption);
}
