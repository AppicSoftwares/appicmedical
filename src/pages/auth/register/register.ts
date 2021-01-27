import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { AppSettings } from '../../../app/settings';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ConfirmationPage } from '../confirmation/confirmation';
import { LoginProvider } from '../../../providers/login/login';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    @ViewChild(Content) content: Content;
    registertype: any;
    registerForm: any;
    registerSpinner: any;
    displayError: any;
    isSubmitted: any = false;
    usertype: any = AppSettings.usertype;
    constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private auth: DeliveryServiceProvider, private fb: Facebook, private loginProvider:LoginProvider) {
        this.registertype = this.navParams.get('registertype');
        this.isSubmitted = false;
        this.registerForm = this.formBuilder.group({
            to: [""],
            email: ["", Validators.compose([Validators.required, Validators.email])],
            password: ["", Validators.required]
        });
        this.registerSpinner = false;
        this.displayError = false;
    }

    ionViewDidLoad() {
        this.content.resize();
        // console.log('ionViewDidLoad RegisterPage'); 
    }
    ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
    takeTo() {

        if (!this.registerForm.valid) {
            this.displayError = true;
            return false;
        }


        this.navCtrl.push(RegisterOtpVerifyPage);
    }

    sendOTP(type = "") {
        //console.log("in");
        this.isSubmitted = false;
        if (!this.registerForm.valid) {
            //  console.log("in"); 
            this.displayError = true;
            // this.auth.mobiToast("Error: Please enter valid email & Password", "danger");
            return false;
        }
        this.isSubmitted = true;
        this.registerSpinner = true;
        let postData = { ...this.registerForm.value };

        let userData = { email: postData.email, password: postData.password, user_type: AppSettings.usertype, email_verified: false };

        this.auth.createProfile(userData).then((result) => {
            this.isSubmitted = false;
            let resultDatas: any;
            resultDatas = result;
            if (resultDatas.insertedId !== undefined && resultDatas.insertedId) {
                this.triggerOtp({ loggedData: { _id: resultDatas.insertedId, password: postData.password, email: postData.email } });
                //this.navCtrl.setRoot(ConfirmationPage, {loggedData: {_id : resultDatas.insertedId, password: postData.password, email: postData.email}});

            } else {
                //  console.log(resultDatas._body);
                resultDatas = JSON.parse(resultDatas);
                console.log(resultDatas);
                if (resultDatas.errorData !== undefined) {
                    // let result
                    this.auth.mobiToast("Error: Email already exists", "danger");
                } else {
                    this.auth.mobiToast(resultDatas.error, "danger");
                }

            }


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
        postData.to = this.registerForm.value.email,
            postData.user_id = data.loggedData._id,
            //postData.resend                     = false
            postData.user_type = this.usertype;

        this.isSubmitted = true;

        this.auth.getEmailOTP(postData).then((result) => {
            let resultData: any;
            resultData = result;
            this.registerSpinner = false;
            this.isSubmitted = false;
            if (resultData.data !== undefined && resultData.data.success) {
                setTimeout(() => {    //<<<---    using ()=> syntax

                    this.navCtrl.push(RegisterOtpVerifyPage, { otp: resultData.data.tempObj.otp, to: postData.to, loggedData: data.loggedData });
                }, 500);

            }
        });

    }

    sendOTP_hold() {
        this.isSubmitted = false;
        if (!this.registerForm.valid) {
            this.displayError = true;
            return false;
        }
        //this.showSpinner 						= true;
        this.isSubmitted = true;
        let postData: any = {};
        postData.msg = "will be replaced";
        postData.action = "register";
        postData.purpose = "otp";
        // postData.source 					= "email";
        postData.exist_check_field = "email";
        postData.exist_check_value = this.registerForm.value.email;
        postData.exist_check = false;
        postData.subject = "Otp to verify registration";
        postData.to = this.registerForm.value.email,
            //postData.user_id                     = "",
            //postData.resend                     = false
            postData.user_type = this.usertype;
        this.auth.getEmailOTP(postData).then((result) => {
            let resultData: any;
            resultData = result;
            this.isSubmitted = false;

            console.log(resultData);
            // this.showSpinner              = false;
            if (resultData.data !== undefined) {
                this.auth.mobiToast(resultData.data.msg, "success").then(() => {
                    this.navCtrl.push(RegisterOtpVerifyPage, { forgetPassData: { to: postData.to, source: "email", user_id: resultData.data.user_id, otp: resultData.data.tempObj.otp } });
                });

            }
            else {
                this.auth.mobiToast(resultData.msg, "danger");
            }
        });
    }

    loginWithFacebook() {
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
            .catch(e => console.log('Error logging into Facebook', e));
    }

    loginWithGoogle() {
        this.loginProvider.googleLogin().then(data => {
            console.log(data);
            if (data) {
                if (data.token) {
                    localStorage.setItem('authData', data.token);
                    localStorage.setItem('loginFrom', "cordovaGoogle");
                } console.log(data);
            }
        }).catch(error => {
          console.log(error);
        });
    }
}
