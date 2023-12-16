export default class AtomicAutocomplete extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.render();
    }

    get inputField(){
        const input = this.shadowRoot.querySelector("#autocomplete");
        const slottedInput = this.querySelector("input");
        if(slottedInput){
            return slottedInput;
        }
        if(input === null){
            console.error("atomic-autocompletion: no input found. Please check the attribute 'inputSelector'");
            return false;
        }
        return input;
    }

    get resultContainer(){
        return this.shadowRoot.querySelector("#resultWrapper");
    }
    get resultList(){
        return this.shadowRoot.querySelector("#results");
    }

    get data(){
        console.log("get data");
        let data = this.directData;
        if(!data){
            console.log("fetch");
            this.fetchData().then((data)=>{
                this.fetchedData = data;
                console.log(this.fetchedData);
                this.render();
            });
        }
        return data;
    }

    get dataSlot(){
        return this.querySelector("[slot=data]");
    }
    get querySlot(){
        return this.querySelector("[slot=query]");
    }

    get directData(){
        let data = this.dataSlot ? this.dataSlot.innerText : this.getAttribute("data");
        if(data){
            return JSON.parse(data);
        }else if(!this.querySlot){
            console.error("atomic-autocompletion: no data and no query definition found.");
            return false;
        }
    }

    async fetchData(){
        if(this.querySlot === null){
            console.error("atomic-autocompletion: no query found. Please check the attribute 'query' or the slot 'query'");
            return false;
        }
        let query = this.querySlot.innerText;
        try{
            query = JSON.parse(query);
        } catch(e){
            console.error("atomic-autocompletion: query is not a valid json");
        }
        let form = new FormData();
        if(query.method === 'POST' && typeof query.postData  === 'object'){
            forEach(query.postData, (value, key) => {
                form.append(key, value);
            });
        }
        // fetch data and the return the result
        const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "GET"
        }).then((data)=>{
            return data.json();
        });
        return response;

    }

    connectedCallback () {
        console.log("connectedCallback");
        this.inputField.oninput = this._oninput.bind(this);
        this.resultContainer.onclick = (e) => {
            this.inputField.value = e.target.innerText;
            this.resultContainer.style.display = "none";
        }
    }

    _oninput() {
        console.log("oninput");
        let results = [];
        const userInput = this.inputField.value.toLocaleLowerCase();
        this.resultList.innerHTML = "";
        if (userInput.length > 0) {
            results = this._getResults(userInput);
            this.resultContainer.style.display = "block";
            for (let i = 0; i < results.length; i++) {
                this.resultList.innerHTML += "<li class='list-entry'>" + results[i] + "</li>";
            }
            if(results.length === 0){
                this.resultContainer.style.display = "block";
                this.resultList.innerHTML += "<li class='list-entry'>" + "nothing found" + "</li>";
            }
        }
    }

    _getResults(input) {
        const results = [];
        console.log(this.data);
        for (let i = 0; i < this.data.length; i++) {
            if (input === this.data[i].slice(0, input.length).toLocaleLowerCase()) {
                results.push(this.data[i]);
            }
        }
        return results;
    }

    render(){
        this.shadowRoot.innerHTML = `
        <style>
            :host{
                display:inline-block;
            }
            #resultWrapper{
                display:none;
                box-sizing: border-box;
                background: #fff;
                border: 1px solid #ccc;
                padding: 20px;
            }
            #results{
                margin: 0;
                padding: 0;
                border: ;
            }
            .list-entry{
                list-style: none;
                text-align: left; ;
            }
          </style>
          <slot name="default"><input type="text" id="autocomplete" placeholder="Select a color"></input></slot>
          <div id="resultWrapper"><ul id="results"></ul></div>
        `
    }
}

if (customElements.get('atomic-autocomplete') === undefined) {
    customElements.define('atomic-autocomplete', AtomicAutocomplete);
}
