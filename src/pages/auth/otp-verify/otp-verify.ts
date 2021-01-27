import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationPage } from '../confirmation/confirmation';
import { CreatePasswordPage } from '../create-password/create-password';
import { AppSettings } from '../../../app/settings';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';

/**
 * Generated class for the OtpVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-otp-verify',
	templateUrl: 'otp-verify.html',
})
export class OtpVerifyPage {
	verifyOTPForm: any;
	verifySpinner: any;
	forgetPassData: any;
	displayError: any;
	showSpinner: any;
	tempOtp: any;
	usertype: any = AppSettings.usertype;

	constructor(private androidplatform: Platform,public events: Events, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private deliveryService: DeliveryServiceProvider) {
		this.forgetPassData = this.navParams.get('forgetPassData');
		this.tempOtp = this.forgetPassData.otp;
		this.showSpinner = false;
		this.verifyOTPForm = this.formBuilder.group({
			otp: ["", Validators.required],

		});
		this.verifySpinner = false;
		this.displayError = false;

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterOtpVerifyPage');
	}

	verifyAndCreate() {
		this.showSpinner = false;
		if (!this.verifyOTPForm.valid) {
			this.displayError = true;
			return false;
		}
		this.showSpinner = true;
		// if(type == 'trainer')
		// {
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
			let resultData: any;
			resultData = result;
			this.showSpinner = false;
			if (resultData.data !== undefined) {

				this.deliveryService.mobiToast(resultData.data.msg, "success").then(() => {
					this.navCtrl.push(CreatePasswordPage, { user_id: postData.user_id });
				});

			} else {
				this.deliveryService.mobiToast(resultData.msg, "danger");
			}
		});

		// }
		//console.log();
	}

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
		postData.to = this.forgetPassData.to,
			//postData.user_id                     = "",
			//postData.resend                     = false
			postData.user_type = this.usertype;
		this.deliveryService.getEmailOTP(postData).then((result) => {
			let resultData: any;
			resultData = result;

			console.log(resultData);
			this.showSpinner = false;
			if (resultData.data !== undefined) {
				this.deliveryService.mobiToast(resultData.data.msg, "success").then(() => {
					this.tempOtp = resultData.data.tempObj.otp
					//this.navCtrl.push(OtpVerifyPage, {forgetPassData: {to: postData.to, source: "email", user_id: resultData.data.user_id, otp: resultData.data.tempObj.otp}});
				});

			}
			else {
				this.deliveryService.mobiToast(resultData.msg, "danger");
			}
		});
	}

	takeTo() {

		this.navCtrl.setRoot(ConfirmationPage);
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
