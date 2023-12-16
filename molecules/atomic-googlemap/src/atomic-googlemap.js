class AtomicGooglemap extends HTMLElement {

    static get observedAttributes() {
        return ['api-key', 'map-center-lon', 'map-center-lat'];
    }
    constructor() {
        super();
        console.log();
        this.attachShadow({ mode: "open" });
        this.setAttribute("closed", "");
        this.map = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'api-key' && newValue) {
            this.loadGoogleMapsApi(newValue);
        } else if ((name === 'map-center-lon' || name === 'map-center-lat') && this.map) {
            const lat = parseFloat(this.getAttribute('map-center-lat') || '0');
            const lon = parseFloat(this.getAttribute('map-center-lon') || '0');
            const center = { lat: lat, lng: lon };
            this.map.setCenter(center);
        }
    }

    get apiKey() {
        return this.getAttribute('api-key');
    }

    connectedCallback() {
        this.render();
        const apiKey = this.apiKey;
        if (apiKey) {
            this.loadGoogleMapsApi(apiKey);
        }
    }

    loadGoogleMapsApiOld(apiKey) {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${this.onApiLoaded.bind(this)}`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        } else {
            this.initMap();
        }
    }
    loadGoogleMapsApi(apiKey) {
        if (!window.google && !window._googleMapsApiLoading) {
            window._googleMapsApiLoading = true;

            const script = document.createElement('script');

            // Erstellen Sie einen eindeutigen Callback-Namen
            const callbackName = `onGoogleMapsApiLoaded_${new Date().getTime()}`;
            window[callbackName] = () => {
                this.onApiLoaded();
                delete window._googleMapsApiLoading;
            };

            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        } else if (window.google) {
            this.initMap();
        }
    }


    onApiLoaded() {
        this.initMap();
    }

    initMap() {
        if (!this.map) {
            const lat = parseFloat(this.getAttribute('map-center-lat') || '0'); // Standardwert ist 0
            const lon = parseFloat(this.getAttribute('map-center-lon') || '0'); // Standardwert ist 0
            const center = { lat: lat, lng: lon };

            this.map = new google.maps.Map(this.shadowRoot.querySelector('#map'), {
                zoom: 8,
                center: center
            });

            const slot = this.shadowRoot.querySelector('slot');
            const nodes = slot.assignedNodes({ flatten: true });
            nodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'template') {
                    const objData = JSON.parse(node.innerHTML);
                    this.addMarker(objData);
                }
            });
        }
    }


    addMarker(data) {
        console.log("addmarker");
        const position = { lat: data.latitude, lng: data.longitude };
        const marker = new google.maps.Marker({
            position: position,
            title: data.name,
            icon: data.svgIconUrl,
            map: this.map
        });

        // Optional: Ein InfoWindow, um mehr Details über den Marker anzuzeigen
        const infoWindow = new google.maps.InfoWindow({
            content: `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            <img src="${data.image}" width="100" />
        `
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Sie können hier weitere CSS-Variablen für das Styling hinzufügen */
                #map {
                    height: var(--atomic-googlemap-mapheight,500px);
                    width: var(--atomic-googlemap-mapwidth,100%);
                }
            </style>
            <div id="map"></div>
            <slot></slot>
        `;
    }
}

if (customElements.get('atomic-googlemap') === undefined) {
    customElements.define('atomic-googlemap', AtomicGooglemap);
}
