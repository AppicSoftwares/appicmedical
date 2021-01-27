import { Component } from "@angular/core";
import { NavController, NavParams, Events, Platform } from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { OtpVerifyPage } from "../otp-verify/otp-verify";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { AppSettings } from "../../../app/settings";

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-forget-password",
  templateUrl: "forget-password.html",
})
export class ForgetPasswordPage {
  forgetForm: any;
  showSpinner: any;
  displayError: any;
  usertype: any = AppSettings.usertype;
  loginEmail: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private deliveryService: DeliveryServiceProvider,
    private androidplatform: Platform
  ) {
    this.showSpinner = false;
    this.displayError = false;
    this.loginEmail = this.navParams.get("email");
    console.log(this.loginEmail);
    this.forgetForm = this.formBuilder.group({
      email: [this.loginEmail, Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForgetPasswordPage");
  }
  
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  sendEmailOTP() {
    this.showSpinner = true;
  }

  sendOTP() {
    if (!this.forgetForm.valid) {
      this.displayError = true;
      return false;
    }
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
    this.deliveryService.getEmailOTP(postData).then((result) => {
      let resultData: any;
      resultData = result;

      console.log(resultData);
      this.showSpinner = false;
      if (resultData.data !== undefined) {
        this.deliveryService
          .mobiToast(resultData.data.msg, "success")
          .then(() => {
            this.navCtrl.push(OtpVerifyPage, {
              forgetPassData: {
                to: postData.to,
                source: "email",
                user_id: resultData.data.user_id,
                otp: resultData.data.tempObj.otp,
              },
            });
          });
      } else {
        this.deliveryService.mobiToast(resultData.msg, "danger");
      }
    }).catch(error=>{
      console.log('Error initialization is',error);
    });
  }
}
