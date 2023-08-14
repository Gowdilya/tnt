const mlApi = `${process.env.REACT_APP_ML_API}`;
const transformationsApi = mlApi + "/transformations";
const filesApi = mlApi + "/files";

export default class mlSrv {

    auth;

    constructor(auth) {
        this.auth = auth;
        this.getAllFiles = this.getAllFiles.bind(this);
        this.getFile = this.getFile.bind(this);
        this.addFile = this.addFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.deleteTransformation = this.deleteTransformation.bind(this);
        this.getTransformation = this.getTransformation.bind(this);
        this.getAllTransformation = this.getAllTransformation.bind(this);
        this.addTransformation = this.addTransformation.bind(this);
        this.updateTransformation = this.updateTransformation.bind(this);
     
    }

    getAllFiles() {
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
    
        let myRequest = new Request( filesApi, myInit);
    
        return fetch(myRequest);
    }
    
    addFile(file, directory) {
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
        formData.append("directory", directory);
        //formData.append("image", file);
        console.log(formData);
        let url = filesApi;

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

    getFile(fileId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = filesApi + "/" + fileId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    deleteFile(fileId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = filesApi + "/" + fileId;

        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',

        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    deleteTransformation(fileId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = filesApi + "/" + fileId;

        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',

        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    getAllTransformation() {
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
    
        let myRequest = new Request( transformationsApi, myInit);
    
        return fetch(myRequest);
    }

    getTransformation(transformationSetId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = transformationsApi + "/" + transformationSetId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }


    deleteTransformation(transformationSetId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let url = transformationsApi + "/" + transformationSetId;

        let myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',

        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    addTransformation(transformation) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(transformation)
        };
    
        let myRequest = new Request(transformationsApi, myInit);
    
        return fetch(myRequest);
    }

    updateTransformation(transformation)
    {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });

        let myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify(transformation)
        };
    
        let myRequest = new Request(transformationsApi, myInit);
    
        return fetch(myRequest);
    }
  
    getPreview(transformationSetId, fileId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = transformationsApi + "/" + transformationSetId + "/preview?fileId=" + fileId;
    
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
    
        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    createBulkTransformation(transformationSetId, directory) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        });
    
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify({"directory": directory})
        };
        let url = transformationsApi + "/" + transformationSetId + "/bulk";

        let myRequest = new Request(url, myInit);
    
        return fetch(myRequest);
    }

    getBulkTransformationStatus(transformationSetId, bulkTransformationId) {
        let token = this.auth.getAccessToken();

        let myHeaders = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
        let url = transformationsApi + "/" + transformationSetId + "/bulk/" + bulkTransformationId;
    
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