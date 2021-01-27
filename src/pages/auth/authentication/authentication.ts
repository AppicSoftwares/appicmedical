import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events, Platform } from "ionic-angular";
import { ResetPasswordPage } from "../reset-password/reset-password";
import { ProfilePage } from "../../profile/profile";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { LoginProvider } from "../../../providers/login/login";
import { AppSettings } from "../../../app/settings";
import { TempStorageProvider } from "../../../providers/temp-storage/temp-storage";
import * as moment from "moment";
import { OtpVerificationPage } from "../otp-verification/otp-verification";
import { UtilsProvider } from "../../../providers/utils/utils";


@IonicPage()
@Component({
  selector: "page-authentication",
  templateUrl: "authentication.html",
})
export class AuthenticationPage {
  authType = "signUp";
  registerForm = new FormGroup({
    to: new FormControl(""),
    email: new FormControl("",[Validators.required,Validators.email]),
    password: new FormControl("", Validators.required),
  });
  spinner: any;
  displayError: any;
  isSubmitted: any = false;
  usertype: any = AppSettings.usertype;
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  registerInputType = "password";
  signInputType = "password";
  terms: any = true;
  loading = false;
  submitted: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: DeliveryServiceProvider,
    private loginProvider: LoginProvider,
    private tempStorage: TempStorageProvider,
    public events: Events,
    private util: UtilsProvider,
    private androidplatform:Platform
  ) { }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }
  profile() {
    this.navCtrl.push(ProfilePage);
  }
  signUp() {
    console.log(this.registerForm.value);
  }
  sendOTP(type = "") {
        
    const email = this.registerForm.value.email;
    const valid = this.validateEmail(email);
    this.isSubmitted = false;
    if (this.registerForm.invalid) {
      this.auth.mobiToast("All Fields are required !!!", "danger");
      this.displayError = true;
      return false;
    }
    if(!valid){
      this.auth.mobiToast("Enter Valid Email Id !!!", "danger");
      return false;
    }
    this.util.presentLoading();
    this.isSubmitted = true;
    this.spinner = true;
    let postData = { ...this.registerForm.value };

    let userData = {
      email: postData.email,
      password: postData.password,
      user_type: AppSettings.usertype,
      email_verified: false,
    };

    this.auth.createProfile(userData).then((result) => {
          
      this.isSubmitted = false;
      let resultDatas: any;
      resultDatas = result;
      if (resultDatas && resultDatas.insertedId) {
            
        this.triggerOtp({
          loggedData: {
            _id: resultDatas.insertedId,
            password: postData.password,
            email: postData.email,
          },
        });
      } else {
        if (resultDatas && resultDatas.errorData) {
          this.auth.mobiToast("Error: Email already exists", "danger");
          this.util.dismissLoading();
        } else {
          this.auth.mobiToast(resultDatas.error, "danger");
          this.util.dismissLoading();
        }
      }
    }).catch(error => {
      console.log('Error initialization is', error);
    });
  }
  triggerOtp(data) {
    let postData: any = {};
    postData.msg = "will be replaced";
    postData.action = "signup";
    postData.purpose = "otp";
    // postData.source 					= "email";
    postData.exist_check_field = "email";
    postData.exist_check_value = this.registerForm.value.email;
    postData.exist_check = false;
    postData.subject = "Otp to verify registration";
    (postData.to = this.registerForm.value.email),
      (postData.user_id = data.loggedData._id),
      //postData.resend                     = false
      (postData.user_type = this.usertype);

    this.isSubmitted = true;

    this.auth.getEmailOTP(postData).then((result) => {
      const resultData: any = result;
      
      this.isSubmitted = false;
      if (resultData && resultData.data && resultData.data.success) {

        setTimeout(() => {
          this.util.dismissLoading();
          //<<<---    using ()=> syntax
          console.log(postData);
          this.spinner = false;
          this.navCtrl.push(OtpVerificationPage, {
            otp: resultData.data.tempObj.otp,
            to: postData.to,
            loggedData: data.loggedData,
            forgetPassData: {
              to: postData.to,
              source: "email",
              otp: resultData.data.tempObj.otp,
              user_id: postData.user_id
            },
            type: 'signUp',

          });
        }, 500);
      }
    }).catch(error => {
      console.log('Error initialization is', error);
      this.util.dismissLoading();
    });
  }
  doSignin() {
    if (!this.loginForm.valid) {
      this.auth.mobiToast("All Fields are required !!!", "danger");
      this.displayError = true;
      return false;
    }
    this.util.presentLoading();

    this.isSubmitted = true;
    this.spinner = true;
    let postData = this.loginForm.value;
    postData.user_type = "patient";
  
    this.auth.login(postData).then(
      (result) => {
        let resultData: any;
        resultData = result;
         
        // console.log(resultData);
        if (typeof resultData.user_id !== "undefined") {
           
          console.log(resultData.user_id);
          localStorage.setItem("userId", resultData.user_id);
          localStorage.setItem("patientData", JSON.stringify(resultData));
           
          
          let userData: any;
          setTimeout(() => {
            //<<<---    using ()=> syntax
            
            this.tempStorage.setAuthSession(resultData);
            // set member ship
             
            if (resultData.membership !== undefined) {
              
              let currentTime = moment().format("X");
              if (
                resultData.membership.membership_end !== undefined &&
                currentTime <= resultData.membership.membership_end
              ) {
                this.tempStorage.setProfileMembership("active", "premium");
              } else {
                this.tempStorage.setProfileMembership("active", "free");
              }
            } else {
              
              this.tempStorage.setProfileMembership("active", "free");
            }
            // end
            let filterObj: any = {};
            filterObj.is_cart = true;
            filterObj.user_id = resultData.user_id;

            this.auth.checkUserCart(filterObj).then((result: any) => {
              this.isSubmitted = false;
              console.log("presenting ");
              this.spinner=true;
            
              if (result.data !== undefined && result.data.length > 0) {
                 
               
                let cartData = result.data[0]; // should be always one latest
                let drugs = [];
                let keys = [];
                let pharmacy = "";
                let pharmacy_id = "";
                let remoteId = "";

                //loop to cart times
                /*	for(var i = 0; i < cartData.items.otcdrugs.length; i++){
									drugs.push(cartData.items.otcdrugs[i]);
									keys.push(cartData.items.otcdrugs[i].drug.value);
									pharmacy = cartData.items.otcdrugs[i].pharmacy_id;
								}
								for(var j = 0; j < cartData.items.rxdrugs.length; j++){
									drugs.push(cartData.items.rxdrugs[j]);
									keys.push(cartData.items.rxdrugs[j].drug.value);	
									pharmacy = cartData.items.rxdrugs[j].pharmacy_id;
								}*/
                remoteId = cartData._id;
                this.tempStorage.cart.drugs = drugs;
                this.tempStorage.cart.keys = keys;

                this.tempStorage.cart.pharmacy = cartData.pharmacy;
                this.tempStorage.cart.pharmacy_id = cartData.pharmacy_id;
                this.tempStorage.cart.cartHasControlledMedicine =
                  cartData.cartHasControlledMedicine;

                if (
                  cartData.medications !== undefined &&
                  cartData.medications
                ) {
                
                  let values = Object.keys(cartData.medications).map(
                    (key) => cartData.medications[key]
                  );

                  let commaJoinedValues = values;
                  // console.log(commaJoinedValues);
                  this.tempStorage.cart.medications = {
                    drugs: commaJoinedValues,
                    byNdc: cartData.medications,
                  };
                } else {
                 
                  this.tempStorage.cart.medications = {
                    drugs: [],
                    byNdc: {},
                  };
                }

                // add actvity array
                if (cartData.activities !== undefined && cartData.activities) {
               
                  this.tempStorage.cart.activities = cartData.activities;
                }

                // console.log(cartData.rx);
                this.tempStorage.uploadrx = cartData.rx;
                if (
                  cartData.deliveryInfo !== undefined &&
                  cartData.deliveryInfo.address !== undefined
                ) {
                 
                  this.tempStorage.cart.deliveryInfo.address =
                    cartData.deliveryInfo.address;
                }
                if (cartData.deliveryInfo !== undefined) {
                
                  this.tempStorage.cart.deliveryInfo.deliveryOption =
                    cartData.deliveryInfo.deliveryOption;
                }

                if (cartData.fillpxFormData !== undefined) {
               
                  this.tempStorage.cart.fillpxFormData =
                    cartData.fillpxFormData;
                }

                if (cartData.rxPickup !== undefined) {
                  
                  this.tempStorage.cart.rxPickup = cartData.rxPickup;
                  if (this.tempStorage.cart.rxPickup.address == undefined) {
                    this.tempStorage.cart.rxPickup.address = {};
                  }
                }

                this.tempStorage.cart.remoteId = remoteId;

                // this.tempStorage.cart.drugs         // drugs detail
                // this.tempStorage.cart.keys          // drug.value
                // this.tempStorage.cart.pharmacy     //pharmacy id
                // remoteId     // _id order if exists
              } else {
              }
               
              
              let filterObj: any = {};
              filterObj.case = "admin-config";
              filterObj.postData = {};
              this.isSubmitted = true;
             
              this.auth.commonUsecase(filterObj).then((result: any) => {
                //console.log(result.data);//service_able_zip
                this.isSubmitted = true;
                 
                if (result !== undefined && result.data !== undefined) {
                  
                  this.tempStorage.setAdminConfig(result.data);
                } else {
                  
                  this.tempStorage.setAdminConfig({});
                }
               
                this.util.dismissLoading();
                this.events.publish("user:loggedin", resultData, Date.now());
               
              });
            });
          }, 1000);
        } else {
          this.spinner = false;
          this.util.dismissLoading();
          this.isSubmitted = false;
          if (resultData) {
            let errorData = JSON.parse(resultData);
            console.log(errorData);
            if (errorData.error !== undefined) {
              this.auth.mobiToast("Invalid credentials !!!", "danger");
            }
          }
        }
      },
      (error) => {
        this.util.dismissLoading();
        console.log(error);
      }
    ).catch(error => {
      this.util.dismissLoading();

      console.log('Error initialization is', error);
    });
  }
  onTerm() {
    this.terms = !this.terms;
  }
  otpVerify() {
    this.navCtrl.push(OtpVerificationPage);
  }
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
