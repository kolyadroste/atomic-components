export default class AtomicCookieConsent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    get expiringDays(){
        return this.hasAttribute("expiringDays") ? this.getAttribute("expiringDays") : 365;
    }

    get cookieStorage(){
        return this.hasAttribute("cookieStorage") ? this.getAttribute("cookieStorage") : 'document.cookie';
    }

    get cookieIdentifier(){
        return this.hasAttribute("cookieIdentifier") ? this.getAttribute("cookieIdentifier") : 'cookie_consent';
    }

    get identifier(){
        return this.hasAttribute("identifier") ? this.getAttribute("identifier") : '';
    }

    get embedType(){
        return this.hasAttribute("embedType") ? this.getAttribute("embedType") : 'iframe';
    }

    get contentName(){
        return this.hasAttribute("contentName") ? this.getAttribute("contentName") : 'Nicht gesetzt';
    }

    get contentProtector(){
        return this.hasAttribute("contentProtector") ? this.getAttribute("contentProtector") : 'Nicht gesetzt';
    }

    get linkPrivacyPolicy(){
        return this.hasAttribute("linkPrivacyPolicy") ? this.getAttribute("linkPrivacyPolicy") : '#';
    }

    get valuesHTMLencoded(){
        return this.hasAttribute("valuesHTMLencoded") ? true : false;
    }

    get slotConsentedContent(){
        return this.querySelector('[slot="consentedContent"]');
    }

    get allowBt(){
        let allowBt;
        allowBt = this.querySelector('[slot="allowButton"]');
        if(allowBt === null){
            allowBt = this.shadowRoot.querySelector('button[allowBT]');

        }
        return allowBt;
    }

    get allowAllBt(){
        let allowAllBt;
        allowAllBt = this.querySelector('[slot="allowAllButton"]');
        if(allowAllBt === null){
            allowAllBt = this.shadowRoot.querySelector('button[allowAllBT]');
        }
        return allowAllBt;
    }

    get consentCookie(){
        var value = "; " + eval(this.cookieStorage);
        var values = value.split("; " + this.cookieIdentifier + "=");
        if (values.length == 2) {
            values =  values.pop().split(";").shift();
            values = this._decodeOptions(values);
            return JSON.parse(values);
        }else{
            return false;
        };
    }

    _decodeOptions(values){
        values = values.replaceAll("%2C",",");
        values = values.replaceAll("%5B","[");
        values = values.replaceAll("%5D","]");
        values = values.replaceAll("%7B","{");
        values = values.replaceAll("%7D","}");
        values = values.replaceAll("%22",'"');
        return values;
    }

    _encodeOptions(values){
        values = values.replaceAll(",","%2C");
        values = values.replaceAll("[","%5B");
        values = values.replaceAll("]","%5D");
        values = values.replaceAll("{","%7B");
        values = values.replaceAll("}","%7D");
        values = values.replaceAll('"','%22');
        return values;
    }

    get doConsentCookieExist(){
        return this.consentCookie ? true : false;
    }

    get isCookieConsentedGlobally(){
        let consentCookie = this.consentCookie;
        if(consentCookie){
            if(consentCookie.options.includes(this.identifier)){
                return true;
            }else{
                console.log(this.constructor.name + ': cookie:"' + this.identifier +'" isnt consented globally');
            }
        }else{
            console.log(this.constructor.name + ': cookie:"' + this.identifier +'" isnt consented globally');
        }
    }

    _createCookie(){
        console.log(this.cookieIdentifier + ": _createCookie");
        let baseSettings = {"consent":"false","options":[]};
        var d = new Date();
        d.setTime(d.getTime() + (this.expiringDays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = this.cookieIdentifier + "=" + JSON.stringify(baseSettings) + ";" + expires + ";path=/" + ";SameSite=Strict";
    }

    updateCookieConsent(){
        if(this.consentCookie){
            let consentCookie = this.consentCookie;
            if(consentCookie.options.includes(this.identifier)) return;

            let baseSettings = {"consent":"true","options":[]};
            baseSettings.options = consentCookie.options;
            baseSettings.options.push(this.identifier);
            if(this.valuesHTMLencoded){
                baseSettings = this._encodeOptions(JSON.stringify(baseSettings));
            }

            var d = new Date();
            d.setTime(d.getTime() + (this.expiringDays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = this.cookieIdentifier + "=" + baseSettings + ";" + expires + ";path=/" + ";SameSite=Strict";

        }else{
            console.error(this.constructor.name + ': cookie couldnt be updated');
        }
    }

    connectedCallback () {
        this.render();

        this.allowBt.addEventListener('click',(e)=>{
            this._onClickAllow();
        })
        this.allowAllBt.addEventListener('click',(e)=>{
            this._onClickAllowGlobally();
        });

        if(this.isCookieConsentedGlobally){
            this.showConsentContent();
        }else{
            this.hideConsentContent();
        }

        document.addEventListener('atomic-cookie-consent-' + this.identifier, ()=>{
            console.log("addEventListener");
            this.showConsentContent();
        }, false);

    }

    _onClickAllow(){
        this.showConsentContent();
    }

    _onClickAllowGlobally(){
        if(!this.doConsentCookieExist){
            this._createCookie();
        }
        this.updateCookieConsent();

        document.dispatchEvent(new CustomEvent('atomic-cookie-consent-' + this.identifier));
    }

    showConsentContent(){
        this.setAttribute('loaded','');
        let protectedContent = this.querySelector('script[type="text/x-gdpr-protected"]');
        if(protectedContent){
            let replace = protectedContent.innerHTML;
            if(!this.slotConsentedContent){
                const visibleContentSlot = document.createElement("div");
                visibleContentSlot.setAttribute("slot","consentedContent");
                this.appendChild(visibleContentSlot);
                visibleContentSlot.innerHTML = replace;

            }else{
                this.slotConsentedContent.innerHTML = replace;
            }

            protectedContent.innerHTML = '';
        }

    }

    hideConsentContent(){
        if(!this.hasAttribute("loaded")){
            return;
        }
        this.removeAttribute('loaded');
        let content = this.querySelector('script[type="text/x-gdpr-protected"]');
        if(content){
            let replace = this.slotConsentedContent.innerHTML;
            content.innerHTML = replace;
        }
    }


    render(){
        this.shadowRoot.innerHTML = `
        <style>
          :host{         
             --atomic-cookie-consent--button-color: #008227;
             --atomic-cookie-consent--button-background-color: #fff;
             --atomic-cookie-consent--button-all-background-color: #008227;
             --atomic-cookie-consent--min-height: 350px;
             --atomic-cookie-consent--border-color: rgba(255,255,255,0.5);
             --atomic-cookie-consent--background: rgba(0,0,0,.1);
             
             position:relative;
             display:block;
             min-height: var(--atomic-cookie-consent--min-height);
          }
          :host .overlay{
            z-index:10;
            background:var(--atomic-cookie-consent--background);
            position:absolute;
            left:0;
            top:0;
            height: calc(100% - 40px);
            width:calc(100% - 40px);
            display:flex;
            align-items: center;
            justify-content: center;
            padding:20px;
            border:solid 1px var(--atomic-cookie-consent--border-color);
          }        
          :host .overlay{
            text-align:center;
          }
          
          .intro-text{
            display:block;
          }
          
          :host([loaded]) .overlay{
            display:none;
            
          }
          :host button{
            display:inline-flex;
            padding:7px 15px;
            cursor:pointer;
            border:2px solid var(--atomic-cookie-consent--button-color);
            border-color:var(--atomic-cookie-consent--button-background-color);
            color: var(--atomic-cookie-consent--button-color);
            margin-bottom:10px;
          }
          :host button[allowAllBT]{
            display:inline-flex;
            padding:7px 15px;
            border:2px solid var(--atomic-cookie-consent--button-color);
            background: var(--atomic-cookie-consent--button-all-background-color);
            color: white;
            margin-bottom:10px;
          }
          :host button:hover{
            opacity:0.8;
          }
        </style>
        <div class="overlay">
            <div class="centered">
                <div part="intro-text">
                    <slot name="introtext">
                        <p>Mit dem Laden von \"${this.contentName}\" akzeptieren Sie die
                        <br><a href=\"${this.linkPrivacyPolicy}\" target=\"blank\">Datenschutzerklärung</a> von ${this.contentProtector}.</p>                
                    </slot>                
                </div>
                <div part="buttons">
                    <slot name="allowButton">
                        <button allowBT class="button-allow" part="allowButton">
                            ${this.contentName} laden
                        </button>    
                    </slot>
                    <slot name="allowAllButton">
                        <button allowAllBT class="button-allow" part="allowAllButton">
                            ${this.contentName} "immer" laden
                        </button>
                    </slot>            
                </div>            
            </div>


        </div>
        <slot></slot>
        <slot name="consentedContent"></slot>
    `
    }
}

if (customElements.get('atomic-cookie-consent') === undefined) {
    customElements.define('atomic-cookie-consent', AtomicCookieConsent);
}
