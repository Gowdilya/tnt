class Parser {

    static validURL(text) {
        var pattern = new RegExp("((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)",'i'); 
        return !!pattern.test(text);
      }

    static validAlphaNumID(text){
        var pattern = new RegExp('^[a-z0-9]+$', 'i'); 
        return !!pattern.test(text);
    }
    static validEmail(text){
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !!pattern.test(text);
    }

    static validName(text){
        var pattern = /^[A-Za-z]+$/;
        return !!pattern.test(text);
    }

    static validSAN(SAN){
        var pattern = /^(20[0-9]{2})(-|\/|\.)([0-9]{2})(\2)([0-9]{2})(\2)([0-9]{2})$/; 
        return !!pattern.test(SAN);

    }

    static isQR61URL(url){
        var pattern = new RegExp('^http://qr61.cn','i'); // fragment locator
        return !!pattern.test(url);
    }


    static isSera4URL(url) {
        var pattern = new RegExp('^http://www.sera4.com','i'); // fragment locator
      return !!pattern.test(url);
    }

    static getQR61CartonID(url){
        var pattern = new RegExp('[^/]+$'); // fragment locator
        if(url.match(pattern)){
            return url.match(pattern)[0];
        }else{
            return "";
        }
    }

    static getID(url){
        var pattern = new RegExp('[^/]+$'); // fragment locator
        if(url.match(pattern)){
            return url.match(pattern)[0];
        }else{
            return "";
        }
    }

    static getSeraID(url){
        var pattern = new RegExp('[^=]+$'); // fragment locator
        if(url.match(pattern)){
            return url.match(pattern)[0];
        }else{
            return "";
        }
    }

    static getIDFromURL(url){
        var pattern = new RegExp('[^/packing/]+$');
        if(url.match(pattern)){
            return url.match(pattern)[0];
        }else{
            return "";
        }
    }




    static getSera4ArticleID(url){
        var pattern = new RegExp('[^=]+$'); // fragment locator
        if(url.match(pattern)){
            return url.match(pattern)[0];
        }else{
            return "";
        }
    }

    static decimalTohex(decimal){
        return decimal.toString(16).toUpperCase(); // standardize on upper case
    }



    //Used for AccessControl
    static getPermissions (auth) {
        if(auth && auth.accessToken){
        var base64Url = (auth.accessToken).split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var parsedAccess = JSON.parse(window.atob(base64));
        return parsedAccess.permissions;
    }
        else return null;
    }

    static getUserID (auth){
    if(auth && auth.accessToken){
        var base64Url = (auth.accessToken).split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var parsedAccess = JSON.parse(window.atob(base64));
        return parsedAccess.sub;
    }
        else return null;
    }






}
export default Parser;