const usersApiHost = `${process.env.REACT_APP_USERS_API}`;
const rolesApiHost = `${process.env.REACT_APP_ROLES_API}`;

export default class UsersSrv {
  auth;

  constructor(auth) {
    this.auth = auth;
    this.getUser = this.getUser.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  getAll() {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(usersApiHost, myInit);

    return fetch(myRequest);
  }

  getUser(id) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = usersApiHost + "/" + id;

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  createUser(userObject) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let url = usersApiHost;

    let myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(userObject),
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getAllRoles() {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });
    let url = rolesApiHost;

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getUserRoles(userId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });
    let url = usersApiHost + "/" + userId + "/roles";

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getCurrentUserRoles() {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });
    let url = usersApiHost + "/current/roles";

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  addRoles(userId, roles) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let url = usersApiHost + "/" + userId + "/roles";

    let myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(roles),
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  removeRoles(userId, roles) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let url = usersApiHost + "/" + userId + "/roles";

    let myInit = {
      method: "DELETE",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(roles),
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  // removeRoles(userId, roleId) {
  //     let token = this.auth.getAccessToken();

  //     let myHeaders = new Headers({
  //         'Authorization': 'Bearer ' + token
  //     });

  //     let url = usersApiHost +'/' + userId + '/roles/' + roleId;

  //     let myInit = {
  //         method: 'DELETE',
  //         headers: myHeaders,
  //         mode: 'cors',
  //         cache: 'no-cache'
  //     };

  //     let myRequest = new Request(url, myInit);

  //     return fetch(myRequest);
  // }
}
