const styles =`
     :host{
        --base-loadingbar--height:1px;
        --base-loadingbar--target-width:100%;
        position:relative;
        display:block;
        box-sizing: border-box;
     }
          
     #line{
        width: var(--base-loadingbar--target-width);
        height: var(--base-loadingbar--height);
        display:block;
        background-color: white;
     }
     
     @keyframes growWidth {
          0% {
              width: 0px;
              visibility: visible;
          }
          100% {
              width: var(--base-loadingbar--target-width);
          }
     }

     :host([begin]) #line{
        animation-duration: 1s;
        animation-fill-mode: both;
        animation-name: growWidth;
        animation-timing-function: linear;
        animation-iteration-count: 1;
     }     
     #timer{
        display:none;
     }
     
     :host([showTimer]){
         padding-right:30px;
     }
     :host([showTimer]) #timer{
        position: absolute;
        right:0;
        border:solid 1px white;
        height:10px;
        width:10px;
        display:flex;
        align-content:center;
        justify-content: center;
        align-items: center;
        font-family:arial;
        font-size: 12px;
        line-height:6px;
        border-radius: 50%;
        transform: translateY(-50%);

        padding:5px;
     }
`;

export default class AtomicLoadingbar extends HTMLElement {

    constructor() {
        super();

        this.shadowDom = this.attachShadow({mode: "open"});

        this.time = this.getAttribute("time") || "5000";
        this.seconds = null;
        this.timerInterval = null;
        this.timer = null;
        this.countHidden = "";

    }

    template() {
        return `
            <style>${styles}</style>
            <style>
                :host([begin]) #line{
                    animation-duration: ${this.time ? this.time + 'ms' : '5s'};
                }
            </style>
            <div id="line"></div>
            <div id="timer">${this.count}</div>
        `;
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['time'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'time':
                this.time = newValue;
                this.restart();
                break;
        }
    }

    render() {
        this.shadowDom.innerHTML = this.template({});
        let line = this.shadowDom.querySelector("#line");
        line.addEventListener('animationstart', this.beginTimer.bind(this));
        this.timer = this.shadowDom.querySelector("#timer");
    }

    _parseTimeStringToMilliSeconds(timeString){
        var time = 1000;
        if(this.time.search("ms") === 1){
            time = timeString.substring(0, timeString.length - 2);
            time = time / 1000;
        }
        if(this.time.search("s") === 1){
            time = timeString.substring(0, timeString.length - 1);
        }
        return time;
    }

    beginTimer(){
        this.endTimer();
        var time = this._parseTimeStringToMilliSeconds(this.time);

        this.count = time -1;
        this.timer.innerText = this.count;
        this.timerInterval = setInterval(()=>{
            this.count -= 1;
            if(this.count === 0){
                this.endTimer();
            }
            this.timer.innerText = this.count;
        },1000);
    }

    restart(){
        this.render();
        this.beginTimer();
    }

    endTimer(){
        clearInterval(this.timerInterval);
        this.count = 0;
    }
}

if (customElements.get('atomic-loadingbar') === undefined) {
    customElements.define('atomic-loadingbar', AtomicLoadingbar);
}
