const productsApiHost = `${process.env.REACT_APP_PRODUCTS_API}`;
const subProductsApiHost = `${process.env.REACT_APP_SUB_PRODUCTS_API}`;

export default class ProductsSrv {
  auth;

  constructor(auth) {
    this.auth = auth;
    this.getAll = this.getAll.bind(this);
    this.add = this.add.bind(this);
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

    let myRequest = new Request(productsApiHost, myInit);

    return fetch(myRequest);
  }

  add(product) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
    product.userProductId = product.userProductId.toUpperCase();
    let myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(product),
    };

    let myRequest = new Request(productsApiHost, myInit);

    return fetch(myRequest);
  }
  update(product) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let myInit = {
      method: "PUT",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(product),
    };

    let myRequest = new Request(productsApiHost, myInit);

    return fetch(myRequest);
  }

  getByUserProductId(userProductId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = productsApiHost + "?userProductId=" + userProductId.toUpperCase();

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getAllSub() {
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

    let myRequest = new Request(subProductsApiHost, myInit);

    return fetch(myRequest);
  }

  getSub(subId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = subProductsApiHost + "/" + subId;

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  deleteSub(subId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = subProductsApiHost + "/" + subId;

    let myInit = {
      method: "DELETE",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getSubByCode(code) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = subProductsApiHost + "?code=" + code;

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  addSub(subProduct) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(subProduct),
    };
    let myRequest = new Request(subProductsApiHost, myInit);

    return fetch(myRequest);
  }

  getAllAssociations(productId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = productsApiHost + "/" + productId + "/sub-products";

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  addSubAssociation(productId, subProduct) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    let url = productsApiHost + "/" + productId + "/sub-products";

    let myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      body: JSON.stringify(subProduct),
    };
    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  removeAssociation(productId, subId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = productsApiHost + "/" + productId + "/sub-products/" + subId;

    let myInit = {
      method: "DELETE",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }

  getProductHistory(productId) {
    let token = this.auth.getAccessToken();

    let myHeaders = new Headers({
      Authorization: "Bearer " + token,
    });

    let url = productsApiHost + "/" + productId + "/history";

    let myInit = {
      method: "GET",
      headers: myHeaders,
      mode: "cors",
      cache: "no-cache",
    };

    let myRequest = new Request(url, myInit);

    return fetch(myRequest);
  }
}
