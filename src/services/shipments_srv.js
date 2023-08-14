const shipmentsApiHost = `${process.env.REACT_APP_SHIPMENTS_API}`

export default class ShipmentsSrv{
    auth
    constructor(auth){
        this.auth = auth;
        this.getAll = this.getAll.bind(this);
        this.getShipmentByUserShipmentId = this.getShipmentByUserShipmentId.bind(this);
        this.createShipment = this.createShipment.bind(this);
        this.getShipmentsByDates= this.getShipmentsByDates.bind(this);
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
    
        let myRequest = new Request(shipmentsApiHost , myInit);
    
        return fetch(myRequest);
    }

    getShipmentByUserShipmentId(userShipmentId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = shipmentsApiHost + "?userShipmentId=" + userShipmentId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    getShipmentByUserProductId(userProductId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = shipmentsApiHost + "?userProductId=" + userProductId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    createShipment(shipmentObject){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = shipmentsApiHost;

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(shipmentObject)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    updateShipment(shipmentObject){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = shipmentsApiHost;

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(shipmentObject)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    // task.67
    getShipmentsByDates(startDate, endDate)
     {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = shipmentsApiHost + "?startDate=" + startDate + "&endDate=" + endDate;
            
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    getByAuthorizationCode(code){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = shipmentsApiHost + "?authorizationCode=" + code ;
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);

    }

    updateShipmentBulk(updateOptions){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = shipmentsApiHost + "/bulk";

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(updateOptions)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }
}