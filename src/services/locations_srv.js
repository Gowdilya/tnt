const locationsApi = `${process.env.REACT_APP_LOCATIONS_API}`;

export default class LocationsSrv {

    auth;

    constructor(auth) {
        this.auth = auth;
        this.getAll = this.getAll.bind(this);
        this.get = this.get.bind(this);
        this.add = this.add.bind(this);
    }

    getAll() {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(locationsApi, myInit);
    
        return fetch(myRequest);
    }

    get(locationId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = locationsApi + "/" + locationId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    add(location) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(location)
        };
    
        let myRequest = new Request(locationsApi, myInit);
    
        return fetch(myRequest);
    }
} 
