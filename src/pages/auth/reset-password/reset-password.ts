import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { AppSettings } from "../../../app/settings";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { OtpVerifyPage } from "../otp-verify/otp-verify";
import { OtpVerificationPage } from "../otp-verification/otp-verification";
import { UtilsProvider } from "../../../providers/utils/utils";

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html",
})
export class ResetPasswordPage {
  showSpinner: any;
  displayError: any;
  usertype: any = AppSettings.usertype;
  loginEmail: any;
  forgetForm = new FormGroup({
    email: new FormControl("", Validators.required),
  });
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryService: DeliveryServiceProvider,
    private util: UtilsProvider,
    private androidplatform: Platform
  ) { }
  sendOTP() {
    const email = this.forgetForm.value.email;
    const valid = this.validateEmail(email);
    if (!valid) {
      this.deliveryService.mobiToast("Email is not valid", "danger");
    } else {
      if (!this.forgetForm.valid) {
        this.displayError = true;
        return false;
      }
      this.util.presentLoading();
      this.showSpinner = true;
      let postData: any = {};
      postData.msg = "will be replaced";
      postData.action = "forgetpassword";
      postData.purpose = "otp";
      // postData.source 					= "email";
      postData.exist_check_field = "email";
      postData.exist_check_value = this.forgetForm.value.email;
      postData.exist_check = true;
      postData.subject = "Otp to rest password";
      (postData.to = this.forgetForm.value.email),
        //postData.user_id                     = "",
        //postData.resend                     = false
        (postData.user_type = this.usertype);
      const loggedData = {
        email: this.forgetForm.value.email
      }
      this.deliveryService.getEmailOTP(postData).then((result) => {
        let resultData: any;
        resultData = result;

        console.log(resultData);
        this.showSpinner = false;
        if (resultData.data !== undefined) {
          this.deliveryService
            .mobiToast(resultData.data.msg, "success")
            .then(() => {
              this.util.dismissLoading();
              console.log('resultData', resultData);
              this.navCtrl.push(OtpVerificationPage, {
                forgetPassData: {
                  to: postData.to,
                  source: "email",
                  user_id: resultData.data.user_id,
                  otp: resultData.data.tempObj.otp,
                },
                type: 'reset',
                loggedData: loggedData
              });
            });
        } else {
          this.util.dismissLoading();
          this.deliveryService.mobiToast(resultData.msg, "danger");
        }
      });
    }
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
