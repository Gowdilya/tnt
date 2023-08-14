import auth0 from 'auth0-js';
import history from '../components/Shared/components/history';

export default class Auth {
    accessToken;
    idToken;
    expiresAt;
    userProfile;
    tokenRenewalTimeout;

    auth0 = new auth0.WebAuth({
        domain: `${process.env.REACT_APP_AUTH_CONFIG_DOMAIN}`,
        clientID: `${process.env.REACT_APP_AUTH_CONFIG_CLIENTID}`,
        redirectUri: `${process.env.REACT_APP_AUTH_CONFIG_CALLBACK_URL}`,
        audience: `${process.env.REACT_APP_AUTH_CONFIG_AUDIENCE}`,
        responseType: 'token id_token',
        scope: 'openid profile read:messages'
    });

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getIdToken = this.getIdToken.bind(this);
        this.renewSession = this.renewSession.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.scheduleRenewal = this.scheduleRenewal.bind(this);
        this.getExpiryDate = this.getExpiryDate.bind(this);        

        let loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true')
        {            
            this.accessToken = localStorage.getItem('accessToken');
            this.idToken = localStorage.getItem('idToken');
            this.expiresAt = +localStorage.getItem('expiresAt', this.expiresAt); 
            this.scheduleRenewal();           
        }

    }
    
    scheduleRenewal() {
        let expiresAt = this.expiresAt;
        const timeout = expiresAt - Date.now();
        if (timeout > 0) {
          this.tokenRenewalTimeout = setTimeout(() => {
            this.renewSession();
          }, timeout);
        }
      }
    
    getExpiryDate() {
        return JSON.stringify(new Date(this.expiresAt));
      }

    login() {
        this.auth0.authorize();
    }

    handleAuthentication() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.setSession(authResult);
                    resolve(authResult);
                } else if (err) {
                    history.replace('/');
                    console.log(err);
                    reject(err);
                    //alert(`Error: ${err.error}. Check the console for further details.`);
                }
            });
        });
    }

    getAccessToken() {
        return this.accessToken;
    }

    getIdToken() {
        return this.idToken;
    }

    setSession(authResult) {
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');

        // Set the time that the access token will expire at
        let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
        this.accessToken = authResult.accessToken;
        localStorage.setItem('accessToken', this.accessToken);
        this.idToken = authResult.idToken;
        localStorage.setItem('idToken', this.idToken);
        this.expiresAt = expiresAt;
        localStorage.setItem('expiresAt', this.expiresAt);

        this.scheduleRenewal();

        // navigate to the home route
        history.replace('/');
    }

    renewSession() {
        return new Promise((resolve, reject) => {
            this.auth0.checkSession({}, (err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.setSession(authResult);
                    return resolve(authResult);
                } else if (err) {
                    this.logout();
                    console.log(err);
                    //alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
                    return reject(err);
                }
            });
        });
    }

    getProfile(cb) {
        this.auth0.client.userInfo(this.accessToken, (err, profile) => {
            if (profile) {
                this.userProfile = profile;
            }
            cb(err, profile);
        });
    }

    logout() {
        // Remove tokens and expiry time
        this.accessToken = null;
        this.idToken = null;
        this.expiresAt = 0;

        // Remove user profile
        this.userProfile = null;

        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresAt');
        
        clearTimeout(this.tokenRenewalTimeout);

        this.auth0.logout({
            returnTo: window.location.protocol + "//" + window.location.host
        });

        // navigate to the home route
        history.replace('/');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = this.expiresAt;
        return new Date().getTime() < expiresAt;
    }
}