const returnsApiHost = `${process.env.REACT_APP_RETURNS_API}`

export default class ReturnsSrv{
    auth
    constructor(auth){
        this.auth = auth;
        this.getAll = this.getAll.bind(this);
        this.get = this.get.bind(this);
        this.getByUserProductId = this.getByUserProductId.bind(this);
        this.getAllDiagnosis = this.getAllDiagnosis.bind(this);
        this.getDiagnosisByProductType = this.getDiagnosisByProductType.bind(this);
        this.getFailuresByProductType = this.getFailuresByProductType.bind(this);
        this.updateReturn = this.updateReturn.bind(this);
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
    
        let myRequest = new Request(returnsApiHost, myInit);
    
        return fetch(myRequest);
    }


    get(returnId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + "/" + returnId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    update(returnObject){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = returnsApiHost;

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(returnObject)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    delete(returnId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + "/" + returnId;
    
        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    add(returnObject){

        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost ;

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(returnObject)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
        
    }

    getByUserProductId(userProductId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + "?userProductId=" + userProductId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }
    
    getReturnsByReturnInformationId(returnInformationId)
    {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + "?returnInformationId=" + returnInformationId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest); 
    }

    getAllDiagnosis(){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + '/diagnoses' ;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    
    }

    getDiagnosisByProductType(productTypeId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + '/diagnoses?productTypeId=' + productTypeId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    
    }

    getFailuresByProductType(productTypeId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + '/failure-symptoms?productTypeId=' + productTypeId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    
    }

    getAllFiles(returnId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });

        let url = returnsApiHost + "/" + returnId + "/files";
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);

    }

    getFile(returnId, fileId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });

        let url = returnsApiHost + "/" + returnId + "/files/" + fileId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);

    }

    deleteFile(returnId, fileId){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });

        let url = returnsApiHost + "/" + returnId + "/files/" + fileId;
    
        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);

    }

    addFile(returnId, file) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            //"Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + token,
            //'Disabled':true
        });

        var formData = new FormData();
        // formData.append('key', 'file');
        // formData.append('type', 'file');
        formData.append("file", file);
        //formData.append("image", file);
       
        let url = returnsApiHost + "/" + returnId + "/files";

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: formData
        };
        delete myInit.headers['Content-Type'];
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    updateReturn(returnObject){
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = returnsApiHost;

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(returnObject)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    createReturnsInformation(propertyDescription, menuType, productTypeId, productTypeName, shouldReview)
    {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        var formData = 
        {
            description :   propertyDescription,
            type:  menuType,
            productType :
            {
                id : productTypeId,
                name: productTypeName
            },
            shouldReview: shouldReview

        }

    
        let url = returnsApiHost + "/information";

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(formData)
        };
            
        let myRequest = new Request(url, myInit);    
        return fetch(myRequest);
    }

    updateInformation(infoId, infoType,description, shouldReview,productTypeId, productTypeName)
    {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        var formData = 
        {
            id: infoId,
            type:  infoType,
            description :   description,
            shouldReview : shouldReview,            
            productType :
            {
                id : productTypeId,
                name: productTypeName
            }
        }

    
        let url = returnsApiHost + "/information";

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(formData)
        };
            
        let myRequest = new Request(url, myInit);    
        return fetch(myRequest);
    }
    
    deleteInformation(infoId)
    {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
            
        let url = returnsApiHost + "/information/"+infoId;

        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors'            
        };
            
        let myRequest = new Request(url, myInit);    
        return fetch(myRequest);
    }

    getAllInformation(infoType, productTypeId, shouldReview){

        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + '/information/?returnInformationType='+ infoType +'&productTypeId='+ productTypeId ;
        if (shouldReview === true){
            url = url + '&shouldReview=' + shouldReview;
        }
        else if(shouldReview === false){
            url = url + '&shouldReview=' + shouldReview;
        }
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    addInformation(returnInfo){

        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + '/information' ;

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(returnInfo)
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
        
    }

    getHistory(returnId){

        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = returnsApiHost + "/" + returnId + "/history";
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }
}