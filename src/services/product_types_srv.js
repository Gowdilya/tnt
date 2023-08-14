const productTypesApiHost = `${process.env.REACT_APP_PRODUCT_TYPES_API}`;
//const productTypesApiHost ='https://localhost:5001/api/types/products/'
const subProductTypesApiHost = `${process.env.REACT_APP_SUB_PRODUCT_TYPES_API}`;

export default class ProductTypesSrv {

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
    
        let myRequest = new Request(productTypesApiHost, myInit);
        console.log(myRequest +" is what we sent");
        console.log(productTypesApiHost +" is what we sent");
        return fetch(myRequest);
    }

    get(productTypeId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = productTypesApiHost + "/" + productTypeId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    add(productType) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(productType)
        };
    
        let myRequest = new Request(productTypesApiHost, myInit);
    
        return fetch(myRequest);
    }

    getAllSubType() {
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
    
        let myRequest = new Request(subProductTypesApiHost, myInit);
    
        return fetch(myRequest);
    }

    getAllProdSubType(productTypeId) {
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
    
        let myRequest = new Request(productTypesApiHost + "/" +productTypeId + "/sub-products", myInit);
    
        return fetch(myRequest);
    }

    addSub(subProductType) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(subProductType)
        };
    
        let myRequest = new Request(subProductTypesApiHost, myInit);
    
        return fetch(myRequest);
    }

    addProdTypeSubTypeAssociation(productTypeId, subProductType) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(subProductType)
        };
    
        let myRequest = new Request(productTypesApiHost + "/" + productTypeId + "/sub-products", myInit);
    
        return fetch(myRequest);
    }




} 
