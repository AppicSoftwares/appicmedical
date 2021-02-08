import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { ProfilePage } from "../../profile/profile";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { AppSettings } from "../../../app/settings";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CreatePasswordPage } from "../create-password/create-password";
import { UtilsProvider } from "../../../providers/utils/utils";
import { TempStorageProvider } from "../../../providers/temp-storage/temp-storage";


@Component({
  selector: "page-otp-verification",
  templateUrl: "otp-verification.html",
})
export class OtpVerificationPage {
  verifySpinner: any;
  forgetPassData: any;
  displayError: any;
  showSpinner: any;
  tempOtp: any;
  usertype: any = AppSettings.usertype;
  verifyOTPForm: any = new FormGroup({
    otp: new FormControl("", Validators.required),
  });
  pageType: any;
  loggedData: any;
  toNumber: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryService: DeliveryServiceProvider,
    private util: UtilsProvider,
    private tempStorage: TempStorageProvider,
    private androidplatform: Platform
  ) {
    this.forgetPassData = this.navParams.get("forgetPassData");
    this.toNumber = this.navParams.get('to');
    this.pageType = this.navParams.get('type');
    this.loggedData = this.navParams.get('loggedData');
    console.log('33', this.loggedData);
    console.log(this.forgetPassData);
    this.tempOtp = this.navParams.get("otp");
    this.showSpinner = false;
    this.verifySpinner = false;
    this.displayError = false;
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  profile() {
    this.navCtrl.push(ProfilePage);
  }
  // verifyAndCreate() {
  //   this.showSpinner = false;
  //   if (!this.verifyOTPForm.valid) {
  //     this.displayError = true;
  //     return false;
  //   }
  //   this.showSpinner = true;
  //   // if(type == 'trainer')
  //   // {
  //   this.verifySpinner = true;
  //   this.util.presentLoading();

  //   let postData: any = {};
  //   postData.to = this.forgetPassData.to;
  //   postData.action = "signup";
  //   postData.purpose = "otp";
  //   postData.source = "email";
  //   postData.user_id = this.forgetPassData.user_id;
  //   postData.source = "email";
  //   postData.otp = this.verifyOTPForm.value.otp;
  //   console.log(postData);
  //   this.deliveryService.verifyOTP(postData).then((result) => {
  //     let resultData: any;
  //     resultData = result;
  //     this.showSpinner = false;
  //     if (resultData && resultData.data) {
  //       this.deliveryService
  //         .mobiToast(resultData.data.msg, "success")
  //         .then(() => {
  //           this.util.dismissLoading();
  //           this.navCtrl.push(ProfilePage, {
  //             user_id: postData.user_id,
  //           });
  //         });
  //     } else {
  //       this.util.dismissLoading();
  //       this.deliveryService.mobiToast(resultData.msg, "danger");
  //     }
  //   }).catch(error => {
  //     this.util.dismissLoading();
  //     console.log('Error initialization is', error);
  //   });

  //   // }
  //   //console.log();
  // }

  resendOTP() {
    this.showSpinner = true;
    let postData: any = {};
    postData.msg = "will be replaced";
    postData.action = "forgetpassword";
    postData.purpose = "otp";
    // postData.source 					= "email";
    postData.exist_check_field = "email";
    postData.exist_check_value = this.forgetPassData.to;
    postData.exist_check = true;
    postData.subject = "Otp to rest password";
    (postData.to = this.forgetPassData.to),
      //postData.user_id                     = "",
      //postData.resend                     = false
      (postData.user_type = this.usertype);
    this.deliveryService.getEmailOTP(postData).then((result) => {
      let resultData: any;
      resultData = result;

      console.log(resultData);
      this.showSpinner = false;
      if (resultData.data !== undefined) {
        this.deliveryService
          .mobiToast(resultData.data.msg, "success")
          .then(() => {
            this.tempOtp = resultData.data.tempObj.otp;
            //this.navCtrl.push(OtpVerifyPage, {forgetPassData: {to: postData.to, source: "email", user_id: resultData.data.user_id, otp: resultData.data.tempObj.otp}});
          });
      } else {
        this.deliveryService.mobiToast(resultData.msg, "danger");
      }
    });
  }
  forgotPassowrd() {
    console.log('forgot');

    this.showSpinner = false;
    if (!this.verifyOTPForm.valid) {
      this.displayError = true;
      return false;
    }
    this.showSpinner = true;
    // if(type == 'trainer')
    // {
    this.util.presentLoading();
    this.verifySpinner = true;
    let postData: any = {};
    postData.to = this.forgetPassData.to;
    postData.action = "forgetpassword";
    postData.purpose = "otp";
    postData.source = "email";
    postData.user_id = this.forgetPassData.user_id;
    postData.source = "email";
    postData.otp = this.verifyOTPForm.value.otp;
    // console.log(type); 
    this.deliveryService.verifyOTP(postData).then((result) => {
      this.util.dismissLoading();
      let resultData: any;
      resultData = result;
      this.showSpinner = false;
      if (resultData.data !== undefined) {

        this.deliveryService.mobiToast(resultData.data.msg, "success").then(() => {
          this.navCtrl.push(CreatePasswordPage, { user_id: postData.user_id });
        });

      } else {
        this.util.dismissLoading();
        this.deliveryService.mobiToast(resultData.msg, "danger");
      }
    });

    // }
    //console.log();
  }
  verifyAndCreate() {
     
		if (!this.verifyOTPForm.valid) {
			this.displayError = true;
			return false;
    }
     
    this.verifySpinner = true;
    this.util.presentLoading();
		let postData = { ...this.verifyOTPForm.value };
		postData.to = this.toNumber;
		postData.source = "email";
		postData.user_id = this.loggedData._id;
		postData.action = "signup";
		this.deliveryService.registerVerifyOTP(postData).then((result) => {
       
			let resultData: any;
			resultData = result;
     
      
			if (resultData.data !== undefined && resultData.data.success) {
         
				let userData: any;
				var otpRand = Math.random().toString(36).substr(2, 5);
				userData = { phone: postData.to, password: otpRand, user_type: 'patient' };
				let Objs: any = {};
        Objs.email_verified = true;
        
        
				this.deliveryService.updateProfileInfo(Objs, postData.user_id).then((result) => {
          this.verifySpinner = false;
          this.util.dismissLoading();
          this.tempStorage.setAuthSession(postData);
          this.navCtrl.push(ProfilePage, 
            { loggedData: { _id: postData.user_id, password: this.loggedData.password, to: postData.to }
           });
        
         
          //this.navCtrl.push(ProfilePage);
        //  this.navCtrl.remove(this.navCtrl.getViews().length-1);
         
        });
        
       
			}
			else {
        this.verifySpinner = false;
        this.util.dismissLoading();
				this.deliveryService.mobiToast("Invalid OTP, unable to verify you.", "danger");
			}
		});
	}

}
