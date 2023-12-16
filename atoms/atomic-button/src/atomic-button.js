export default class AtomicButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback () {
        this.render();
        let root = this;
        if(this.link){
            this.addEventListener("click",()=>{
                window.location.href = root.link;
            });
        }
    }

    get link(){
        let link = this.querySelector("a");
        if(link){
            return link.getAttribute("href");
        }
        return null;
    }

    render(){
        this.shadowRoot.innerHTML = `
      <style>

        :host{
            --atomic-button--background:#22509a;
            --atomic-button--background-hover:#3767b5;
            --atomic-button--color:white;
            --atomic-button--color-hover:white;
            --atomic-button--color-transparent:#22509a;
            --atomic-button--color-transparent-hover:#0f3674;
            --atomic-button--background-success:darkgreen;
            --atomic-button--background-success-hover:#004900;
            --atomic-button--color-success:white;
            --atomic-button--color-success-hover:white;
            --atomic-button--background-alert:darkred;
            --atomic-button--background-alert-hover:#740000;
            --atomic-button--color-alert:white;
            --atomic-button--color-alert-hover:white;
            --atomic-button--padding:10px 20px;
            --atomic-button--padding-big:15px 50px;
            --atomic-button--padding-wide:10px 30px;
            --atomic-button--radius:5px;
            --atomic-button--radius-big:15px;
            --atomic-button--radius-wide:25px;

            background:var(--atomic-button--background);
            color:var(--atomic-button--color);
            padding:var(--atomic-button--padding);
            border-radius:var(--atomic-button--radius);
            display:inline-block;
            cursor:pointer;
        }
        :host(:hover){
            background:var(--atomic-button--background-hover);
            color:var(--atomic-button--color-hover);
            --atomic-button--color-success:darkgreen;
            --atomic-button--color-alert:darkred;
        }
        
        :host([big]){
            padding:var(--atomic-button--padding-big);
            border-radius:var(--atomic-button--radius-big);
        }
        :host([wide]){
            padding:var(--atomic-button--padding-wide);
            border-radius:var(--atomic-button--radius-wide);
        }

        :host([transparent]){
            background:transparent;
            color:var(--atomic-button--color-transparent);
            --atomic-button--color-success:darkgreen;
            --atomic-button--color-alert:darkred;
        }
        :host([transparent]:hover){
            color:var(--atomic-button--color-transparent-hover);
        }
        :host([success]){
            background:var(--atomic-button--background-success);
            color:var(--atomic-button--color-success);
        }
        :host([success]:hover){
            background:var(--atomic-button--background-success-hover);
            color:var(--atomic-button--color-success-hover);
        }
        :host([success]) ::slotted(*){
            color:var(--atomic-button--color-success);
        }
        :host([success]:hover) ::slotted(*){
            color:var(--atomic-button--color-success-hover);
        }
        :host([alert]) ::slotted(*){
            color:var(--atomic-button--color-alert);
        }
        :host([alert]:hover){
            background:var(--atomic-button--background-alert-hover);
            color:var(--atomic-button--color-alert-hover);
        }
        .flex{
            display:flex;
            align-items: center;
        }
  
      </style>
    <div class="flex">
        <slot name="before"></slot>
        <slot></slot>
        <slot name="after"></slot>
    </div>
    `
    }
}

if (customElements.get('atomic-button') === undefined) {
    customElements.define('atomic-button', AtomicButton);
}
