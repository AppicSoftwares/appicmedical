import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { AlertController, ToastController } from "ionic-angular";
import { AppSettings } from "../../app/settings";
import { mobiscroll } from "../../lib/mobiscroll-package";
import { TempStorageProvider } from "../temp-storage/temp-storage";
import "rxjs/add/operator/map";
import moment from 'moment';
import { UtilsProvider } from "../utils/utils";

/*
  Generated class for the DeliveryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeliveryServiceProvider {
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  http_headers: any;
  rxapi_headers: any;
  options: any;
  authToken: any;
  listdata: any;
  httpurl: any = AppSettings.API_ENDPOINT;
  rxApiUrl: any = AppSettings.rxapiurl;
  localurl: any = AppSettings.localurl;
  liveurl2: any = AppSettings.liveurl2;
  subscription: any;
  nodeserverurl: any = AppSettings.nodeserverurl;
  constructor(
    public tempStorage: TempStorageProvider,
    public http: Http,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private util: UtilsProvider,
  ) {
    this.http_headers = new Headers();
    this.http_headers.append("Accept", "application/json");
    this.http_headers.append("Content-Type", "application/json");
    console.log("enviroment", AppSettings.ENV);
    // this.http_headers.append("Access-Control-Allow-Origin", "*");
    // this.http_headers.append("Access-Control-Allow-Headers", "X-Requested-With");
    // this.http_headers.append("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
    this.http_headers.append("X-Amz-Date", "");
    this.http_headers.append("X-Api-Key", true);
    this.http_headers.append("X-Amz-Security-Token", "");
    this.options = new RequestOptions({ headers: this.http_headers });
    this.setHeaders();

    this.rxapi_headers = new Headers();
    this.rxapi_headers.append("Accept", "application/json");
    this.rxapi_headers.append("Content-Type", "application/json");
    /* this.rxapi_headers.append("Access-Control-Allow-Origin", "*");
        this.rxapi_headers.append("Access-Control-Allow-Headers", "X-Requested-With");
        this.rxapi_headers.append("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE"); */

    console.log("Hello DeliveryServiceProvider Provider");
    this.subscription = [];
  }
  setHeaders(token = null) {
    this.authToken = token;
    if (this.http_headers.get("Authorization")) {
      this.http_headers.delete("Authorization");
    }
    if (token) {
      this.http_headers.append("Authorization", "Bearer " + token);
    } else {
      this.http_headers.append("Authorization", "");
      /* this.storage.get('id_token').then((token) => {
				this.http_headers.append('Authorization', 'Bearer ' + token);
		    }); */
    }
  }

  async profileInfo(type: any, id: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(this.httpurl + "profile/" + type + "/?id=" + id, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async updateProfileInfo(updateObj: any, id: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "users/" + id, updateObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async updateMembership(updateObj: any, id: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "membership/" + id, updateObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(JSON.parse(error._body));
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async getEmailOTP(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      //  this.http.post(this.localurl + 'getotp/', params, options)
      this.http
        .post(this.httpurl + "email/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(JSON.parse(error._body));
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async createProfile(createObj: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "users/", createObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async checkUserCart(filterObj: any) {
  
    let options = new RequestOptions({ headers: this.http_headers });
    console.log("option is:- 228", options);
  
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "check-user-cart", filterObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(JSON.parse(error._body));
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async getEprescriptions(filterObj: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "e-prescriptions", filterObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(JSON.parse(error._body));
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async commonUsecase(filterObj: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "common-usecase", filterObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(JSON.parse(error._body));
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async createOrder(addObj: any, updateId = "") {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "orders/" + updateId, addObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async updateOrder(updateObj: any, id: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "orders/" + id, updateObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(JSON.parse(error._body));
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async createRequest(addObj: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "request/", addObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async createMememberShip(addObj: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "membership/", addObj, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }
  async getMememberShip(user_id: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(this.httpurl + "membership/" + user_id + "/", options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            //console.log("test");
            //console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            } else {
              resolve(error._body);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async drugList(term) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "getdrugs", { term: term }, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            console.log("test");
            console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async pharmacyList(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      // this.http.post(this.httpurl + 'pharmacies', params, options)
      // this.http.get(this.httpurl + 'pharmacy', options)
      this.http
        .post(this.httpurl + "pharmacy/" + params.value, params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            console.log("test");
            console.log(data);
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }
  async ajaxDrugs(params) {
    // console.log(this.http_headers)
    if (
      typeof this.subscription["ajaxdrugs"] !== "undefined" &&
      this.subscription["ajaxdrugs"]
    ) {
      this.subscription["ajaxdrugs"].unsubscribe();
    }
    let url: any = this.httpurl + "drugs";
    let options = new RequestOptions({ headers: this.http_headers });

    /*  if(AppSettings.userxapi) {
          // url             = "/rxapiendpoint/GetGPI10s?uid="+ AppSettings.rxapi_uid +"&search=" + params.term+"&alias=MS1";
          url               = this.rxApiUrl + "/GetGPI10s?uid="+ AppSettings.rxapi_uid +"&search=" + params.term+"&alias=MS1";
           options         = new RequestOptions({ headers: this.rxapi_headers });
       }*/

    this.listdata = {};
    let postData = {
      reqPath: encodeURI(
        "GetGPI10s?search=" + params.term.trim() + "&alias=MS1"
      ),
      postData: {},
      method: "GET",
    };
    return await new Promise((resolve) => {
      // this.http.post(this.httpurl + 'getdrugs', {term: term}, options)
      this.subscription["ajaxdrugs"] = this.http
        .post(this.httpurl + "rx-api", postData, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
            /* if(resultData.drugs.length > 0) {
                    let gpi10s_array: any = resultData.drugs[0].GPI10s;
                    let gpi10s: any = gpi10s_array.join()
                    // resultData.drugs[0].GPI10s;
                    let formatDrugs: any = this.formatDrugs(gpi10s).then((result) => {
                        let formatResult     : any;
                            formatResult     = result;
                        console.log(result);
                        resolve({parent: resultData.drugs[0], drugs: formatResult.drugs, status: "success"});
                    });
                    
                }
                else{
                    resolve({parent: null, drugs: [], status: "success"});
                } */
          },
          (error) => {
            if (error.status == "error") {
              resolve({ parent: null, drugs: [], status: "error" });
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async formatDrugs(params) {
    //  console.log("formatdrugs");
    if (
      typeof this.subscription["formatdrugs"] !== "undefined" &&
      this.subscription["formatdrugs"]
    ) {
      this.subscription["formatdrugs"].unsubscribe();
    }
    let url: any = this.httpurl + "drugs";
    /* if(AppSettings.userxapi) {
           url             = "/rxapiendpoint/GetGPI12s?uid="+ AppSettings.rxapi_uid +"&GPI10=" + params.gpi10;
       } */

    let options = new RequestOptions({ headers: this.http_headers });

    let postData = {
      reqPath: "GetGPI12s?GPI10=" + params.gpi10,
      postData: {},
      method: "GET",
    };

    this.listdata = {};
    return await new Promise((resolve) => {
      // this.subscription['rxapi_strength'] = this.http.get(url, {})
      this.subscription["formatdrugs"] = this.http
        .post(this.httpurl + "rx-api", postData, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //     console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async rxapi_strength(params) {
    //   console.log("strength");
    if (
      typeof this.subscription["rxapi_strength"] !== "undefined" &&
      this.subscription["rxapi_strength"]
    ) {
      this.subscription["rxapi_strength"].unsubscribe();
    }
    //let url : any = "/rxapiendpoint/GetGPI14s?uid="+ AppSettings.rxapi_uid +"&alias=MS1&prediction=20&predictqty=true&predictqtyflat=false";
    let options = new RequestOptions({ headers: this.http_headers });

    let postData = {
      reqPath:
        "GetGPI14s?GPI10=" +
        params.gpi10 +
        "&alias=MS1&prediction=20&predictqty=true&predictqtyflat=false",
      postData: {},
      method: "GET",
    };

    this.listdata = {};
    return await new Promise((resolve) => {
      // this.subscription['rxapi_strength'] = this.http.get(url, {})
      this.subscription["ajaxdrugs"] = this.http
        .post(this.httpurl + "rx-api", postData, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //    console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async rxapi_price(params) {
    //   console.log("strength");
    if (
      typeof this.subscription["rxapi_price"] !== "undefined" &&
      this.subscription["rxapi_price"]
    ) {
      this.subscription["rxapi_price"].unsubscribe();
    }
    // let url : any = "/rxapiendpoint/GetPrices?uid="+ AppSettings.rxapi_uid;//"&alias=MS1&prediction=20&predictqty=true&predictqtyflat=false";

    let options = new RequestOptions({ headers: this.http_headers });

    let postData = {
      reqPath: "GetPrices",
      postData: params,
      method: "POST",
    };

    this.listdata = {};
    return await new Promise((resolve) => {
      //    this.subscription['rxapi_price'] = this.http.post(url, params)
      this.subscription["rxapi_price"] = this.http
        .post(this.httpurl + "rx-api", postData, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //    console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async rxapi_package(params) {
    //  console.log("package");
    if (
      typeof this.subscription["package"] !== "undefined" &&
      this.subscription["package"]
    ) {
      this.subscription["package"].unsubscribe();
    }
    let url: any =
      "/rxapiendpoint/GetPackagesFromGPI?uid=" +
      AppSettings.rxapi_uid +
      "&GPI14=" +
      params.gpi14;

    this.listdata = {};
    return await new Promise((resolve) => {
      // this.http.get(this.httpurl + 'drugs/' + params.term, options)
      this.subscription["formatdrugs"] = this.http
        .get(url, {})
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            //  console.log(resultData);
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async getAddress(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(
          this.httpurl +
            "address-by-lat-lng/" +
            params.latitude +
            "/" +
            params.longitude,
          options
        )
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  cartOrders() {
      
    /* let cartDrugs             : any = JSON.parse(localStorage.getItem('cartdrugs'));
        let cartDrugsKey          : any = JSON.parse(localStorage.getItem('cartdrugskey'));
        let cartPharmacy          : any = JSON.parse(localStorage.getItem('cartpharmacy')); */
    let cartDrugs: any = this.tempStorage.cart.drugs; // not needed
    let cartDrugsKey: any = this.tempStorage.cart.keys; // not needed
    let cartPharmacy: any = this.tempStorage.cart.pharmacy; // has price and pharma info
    let pharmacy_id: any = this.tempStorage.cart.pharmacy_id; // has price and pharma info
    let medications: any = this.tempStorage.cart.medications; // has price and pharma info has 2 obj drugs, byNdc
    let deliveryInfo: any = this.tempStorage.cart.deliveryInfo;
    let fillpxFormData: any = this.tempStorage.cart.fillpxFormData;
    let rxPickup: any = this.tempStorage.cart.rxPickup;
    let cartHasControlledMedicine: any = this.tempStorage.cart
      .cartHasControlledMedicine;
    //this.tempStorage.cart.cartHasControlledMedicine

    // console.log(medications);

    let cartMembership: any = this.tempStorage.cart.membership;
    let otcdrugs: any = [];
    let rxdrugs: any = [];
    let orderTotal: any = 0;
    let priceDiff: any = 0;
    let activities: any = [];
    let memberPrice: any = false;
    let ismember: any = false;

    if (
      this.tempStorage.cart.activities !== undefined &&
      this.tempStorage.cart.activities
    ) {
      activities = this.tempStorage.cart.activities;
    }

    let profileMembershipStatus: any = this.tempStorage.getMembershipStatus();

    if (profileMembershipStatus == "premiumactive") {
      memberPrice = true;
    } else if (this.tempStorage.cart.membership.plan == "premium") {
      memberPrice = true;
    }
    //  console.log(memberPrice);
      
    if (cartPharmacy === null || cartPharmacy === undefined) {
      // here not to be executed
      cartPharmacy = {};
      cartDrugs = [];
      cartDrugsKey = [];
      orderTotal = 0; //parseFloat(orderTotal) + parseFloat(cartMembership.price);
    } else {
      otcdrugs = [];
      rxdrugs = [];
      orderTotal = 0; // wantedly commented to key otc and rx drugs empty as it calucalted in loop in actual page
      /* for(var i = 0; i <= cartDrugs.length -1; i++) {
                let item                               : any = cartDrugs[i];
                if(memberPrice)
                {
                    item.price                       = parseFloat(cartDrugs[i].membership_price);
                }
                else {
                    priceDiff                        = priceDiff + Math.abs(parseFloat(cartDrugs[i].retail_price) - parseFloat(cartDrugs[i].membership_price));
                    item.price                       = parseFloat(cartDrugs[i].retail_price);
                }
                orderTotal                      = parseFloat(orderTotal) + parseFloat(item.price);
                if(cartDrugs[i].drugtype == 'rx') {
                    rxdrugs.push(item);
                }
                else if(cartDrugs[i].drugtype == 'otc') {
                    otcdrugs.push(item);
                }
            }*/ let totalCalcualted = this.calculateTotalFromPriceArray(
        cartPharmacy.pricing
      );
      orderTotal = totalCalcualted["totalPrice"];
      priceDiff = totalCalcualted["totSaving"];
    }
    this.tempStorage.cart.total = orderTotal;
    this.tempStorage.cart.priceDiff = priceDiff;

    return {
      cartvalue: orderTotal,
      otcdrugs: otcdrugs,
      rxdrugs: rxdrugs,
      pricediff: priceDiff,
      cartPharmacy: cartPharmacy,
      pharmacy_id: pharmacy_id,
      medications: medications.byNdc,
      deliveryInfo: deliveryInfo,
      activities: activities,
      fillpxFormData: fillpxFormData,
      rxPickup: rxPickup,
      cartHasControlledMedicine: cartHasControlledMedicine,
    };
  }
  //APP_ENV=development ionic serve -b
  calculateTotalFromPriceArray(priceArray) {
    // console.log(priceArray);
    if (priceArray !== undefined && priceArray && priceArray.length > 0) {
      let totalPrice: any = 0;
      let totsaving: any = 0;
      for (var i = 0; i < priceArray.length; i++) {
        //  if(priceArray[i]['unc'] !== undefined){
        //      totalPrice = parseFloat(totalPrice) + parseFloat(priceArray[i]['unc']);

        //  }else
        if (priceArray[i]["price"] !== undefined) {
          totalPrice =
            parseFloat(totalPrice) + parseFloat(priceArray[i]["price"]);
        } else {
          totalPrice = totalPrice + 0;
        }

        if (
          priceArray[i]["price"] !== undefined &&
          priceArray[i]["unc"] !== undefined &&
          priceArray[i]["unc"] > priceArray[i]["price"]
        ) {
          totsaving =
            totsaving +
            (parseFloat(priceArray[i]["unc"]) -
              parseFloat(priceArray[i]["price"]));
        } else {
          totsaving = parseFloat(totsaving) + 0;
        }
      }
      // console.log(totsaving);
      return { totalPrice: totalPrice, totSaving: totsaving };
    } else {
      return { totalPrice: 0, totSaving: 0 };
    }
  }

  applyDeliveryCharge(isMedicardUsed = true) {
    let deliveryCharge = 5.85;
    let twoPercentage = (5.85 * 20) / 100;
    if (isMedicardUsed) {
      deliveryCharge = deliveryCharge - twoPercentage;
    }
    // update cart total

    return deliveryCharge;
  }
  getDeliverySlots(validate = false) {
    if (validate) {
      // this to validate if selected delivery slot is valid while placing order
      return [];
    } else {
      
      let currentTimePST = moment("2014-12-01T12:00:00Z").date();
      console.log(currentTimePST);
      let returnObj  = [];

      if (currentTimePST < 11){
          returnObj  = [
              { text:"Today 11AM-12PM"},
              { text:"Today 5PM-7PM"},
          ]
      } else if (currentTimePST >= 11 && currentTimePST < 17){
          returnObj = [
              { text:"Today 5PM-7PM"},
          ]
      } else if (currentTimePST >= 17) {
          returnObj = [
              {text:"Tomorrow 11AM-12PM"},
              { text:"Tomorrow 5PM-7PM"},
          ]
      }

      return returnObj;
    }
  }
  parseUTCTime(utcTimeStamp, holder = false) {
    if (holder) {
      //console.log(utcTimeStamp);
      //console.log(Number(utcTimeStamp));
      //console.log( moment.unix(utcTimeStamp).toDate());
      //console.log(moment.unix(utcTimeStamp));
    }
    //console.log(moment.utc(utcTimeStamp).local());
    //console.log(moment.utc(utcTimeStamp).local().toDate());

    if (utcTimeStamp && utcTimeStamp > 0) {
      // return moment.unix(utcTimeStamp).toDate();
      // return moment.unix(Number(utcTimeStamp)).format('Mo MMM YYYY HH:mm');
      //    return moment.unix(utcTimeStamp).format('MMMM Do, YYYY h:mm A');
    } else {
      return utcTimeStamp;
    }
  }

  async requestRX(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "request", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async processPayment(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "payment-log", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async login(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "auth/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(error._body);
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async registerGetOTP(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "sms/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(error._body);
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async registerVerifyOTP(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "verify-otp/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(error._body);
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async getOTP(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.localurl + "getotp/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(error._body);
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async generatePassword(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.localurl + "generatepassword/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(error._body);
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  async getCountryText(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(this.nodeserverurl + "countrytext/" + params.country, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async getStateText(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(
          this.nodeserverurl +
            "statetext/" +
            params.country +
            "/" +
            params.state,
          options
        )
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async getCityText(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .get(
          this.nodeserverurl +
            "citytext/" +
            params.country +
            "/" +
            params.state +
            "/" +
            params.city,
          options
        )
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
              resolve(0);
            }
            console.log(error); // Error getting the data
          }
        );
    });
  }

  async verifyOTP(params) {
    let options = new RequestOptions({ headers: this.http_headers });
    this.listdata = {};
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + "verify-otp/", params, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            let resultData: any;
            resultData = data;
            if (resultData.status == "error") {
            } else {
            }
            resolve(resultData);
          },
          (error) => {
            if (error.status == "error") {
            }
            resolve(JSON.parse(error._body));
            //console.log(error);// Error getting the data
          }
        );
    });
  }

  setLocalStorage(key: any = null, value: any = null) {
    let string = JSON.stringify(value);
    localStorage.setItem(key, string);
  }

  getLocalStorage(key: any = null) {
    let value = localStorage.getItem(key);
    return JSON.parse(value);
  }

  removeLocalStorage(key: any = null) {
    localStorage.removeItem(key);
  }

  public confirm(text: string) {
    return new Promise((resolve) => {
      this.alertCtrl
        .create({
          message: text,
          buttons: [
            {
              text: "No",
              role: "cancel",
              handler: () => {
                resolve(false);
              },
            },
            {
              text: "Yes",
              handler: () => {
                resolve(true);
              },
            },
          ],
        })
        .present();
    });
  }

  public mobiconfirm(text, title = "", yes = "Yes", no = "No") {
    return new Promise((resolve) => {
      mobiscroll.confirm({
        title: title,
        message: text,
        okText: yes,
        cancelText: no,
        callback: function (res) {
          if (res) {
            resolve(true);
          } else {
            resolve(false);
          }
          /* mobiscroll.toast({
                            message: res ? 'Getting membership details' : 'Placing non membership order',
                            duration: 1000
                        }); */
        },
      });
    });
  }
  public mobiAlert(title = "", msg = "") {
    return new Promise((resolve) => {
      mobiscroll.alert({
        title: title,
        message: msg,
        callback: function () {
          resolve(true);
        },
      });
    });
  }

  public sortArrayObj(key, parentKey = "", order = "asc") {
    return function (a, b) {
      var varA, varB;

      if (parentKey) {
        // console.log(a);
        // console.log(b);

        if (!a.hasOwnProperty(parentKey) || !b.hasOwnProperty(parentKey)) {
          // property doesn't exist on either object
          // console.log('fails');
          return 0;
        }

        if (
          !a[parentKey].hasOwnProperty(key) ||
          !b[parentKey].hasOwnProperty(key)
        ) {
          // property doesn't exist on either object
          // console.log('fails');
          return 0;
        }

        varA =
          typeof a[parentKey][key] === "string"
            ? a[parentKey][key].toUpperCase()
            : a[parentKey][key];
        varB =
          typeof b[parentKey][key] === "string"
            ? b[parentKey][key].toUpperCase()
            : b[parentKey][key];
      } else {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }

        varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      }

      //    console.log(varA);
      //   console.log(varB);
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == "desc" ? comparison * -1 : comparison;
    };
  }

  public mobiToast(text: string, color: string) {
    return new Promise((resolve) => {
      mobiscroll.toast({
        message: text,
        duration: 3000,
        color: color,
        display: "bottom",
        callback: function () {
          console.log("mobitoast");
          resolve(true);
        },
      });
    });
  }

  public showToast(text: string) {
    this.toastCtrl
      .create({
        message: text,
        duration: 5000,
        position: "bottom",
        dismissOnPageChange: true,
      })
      .present();
  }

  public contains(a, value, obj = "", retunIndex = false) {
    if (a != undefined) {
      for (var i = 0; i < a.length; i++) {
        if (obj) {
          if (a[i][obj] === value) {
            if (retunIndex) {
              return i;
            } else {
              return true;
            }
          } else {
          }
        } else {
          if (a[i] === value) {
            if (retunIndex) {
              return i;
            } else {
              return true;
            }
          } else {
          }
        }
      }
      if (retunIndex) {
        return -1;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isCancelable(orderStatus) {
    //"order-in-cart", "order-initiated"
    let cancelAbleStatus = [
      "rx-requested",
      "ready-to-pharmacy",
      "pending-pharmacy",
    ];
    return this.contains(cancelAbleStatus, orderStatus);
    /*if (this.contains(cancelAbleStatus, orderStatus)) {

        }*/
  }

  checkDeliveryAvailale(curentZip) {
    let serviceAvailableZips = this.tempStorage.Adminconfig.service_able_zip;
    console.log(serviceAvailableZips);
    return this.contains(serviceAvailableZips, curentZip);
  }

  isEditable(orderStatus) {
    //"order-in-cart", "order-initiated",
    let editAbleStatus = []; //"ready-to-pharmacy" "rx-requested",
    return this.contains(editAbleStatus, orderStatus);
    // console.log(this.contains(cancelAbleStatus, orderStatus))
    /*if (this.contains(cancelAbleStatus, orderStatus)){

        }*/
  }
  async postData(subUrl, data: any) {
    let options = new RequestOptions({ headers: this.http_headers });
    return await new Promise((resolve) => {
      this.http
        .post(this.httpurl + subUrl, data, options)
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            resolve(error);
          }
        );
    });
  }
}
