import { Component } from '@angular/core';
import {  NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationPage } from '../confirmation/confirmation';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { AppSettings } from '../../../app/settings';
/**
 * Generated class for the RegisterOtpVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register-otp-verify',
  templateUrl: 'register-otp-verify.html',
})
export class RegisterOtpVerifyPage {
	verifyOTPtype									: any;
	verifyOTPForm 									: any;
	verifySpinner 									: any;
	toNumber 										: any;
	loggedData										: any;
	displayError 									: any;
	isSubmitted       :any = false;
	usertype                            : any = AppSettings.usertype;
	tempOtp : any;
	constructor(private androidplatform: Platform,public events: Events, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private auth: DeliveryServiceProvider) {
		this.toNumber 									= this.navParams.get('to');
		this.loggedData									= this.navParams.get('loggedData');
		this.tempOtp									= this.navParams.get('otp');
		this.isSubmitted        = false;
		this.verifyOTPForm 								= this.formBuilder.group({
			otp									: ["", Validators.required],
				
            });
		this.verifySpinner							= false;
		this.displayError = false;
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad RegisterOtpVerifyPage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	verifyAndCreate()
	{
		this.isSubmitted        = false;
		if (!this.verifyOTPForm.valid) {
            this.displayError = true;
            return false;   
		}
		this.isSubmitted        = true;
		// if(type == 'trainer')
		// {
			this.verifySpinner             	  = true;
	        let postData                      = {...this.verifyOTPForm.value};
				postData.to			  = this.toNumber;
				postData.source 					= "email";
				postData.user_id 					= this.loggedData._id ;
	        	postData.action       = "signup";
	       // console.log(type); 
	         this.auth.registerVerifyOTP(postData).then((result) => { 
	            let resultData                : any;
	                resultData                = result;
	                this.verifySpinner        = false;
	            if(resultData.data !== undefined && resultData.data.success)
	            {
					let userData			  : any;
					var otpRand 						= Math.random().toString(36).substr(2, 5);
					//Math.floor(1000 + Math.random() * 9000);
					userData 				  = {phone: postData.to, password: otpRand, user_type: 'patient'};
					this.isSubmitted        = false;
					let Objs  : any = {};
					Objs.email_verified= true;
					this.auth.updateProfileInfo(Objs, postData.user_id).then((result)=>{
						
						this.navCtrl.setRoot(ConfirmationPage, {loggedData: {_id : postData.user_id, password: this.loggedData.password, to: postData.to}});

					});
					
					/*this.auth.createProfile(userData).then((result) => { 
						this.isSubmitted        = false;
						let resultDatas                : any;
						resultDatas                = result;
						if(resultDatas.insertedId !== undefined && resultDatas.insertedId)
	                   {
						 this.navCtrl.setRoot(ConfirmationPage, {loggedData: {_id : resultDatas.insertedId, password: otpRand, to: postData.to}});
					   }


					}); */
					
	            }
	            else{
					this.isSubmitted        = false;
					this.auth.mobiToast("Invalid OTP, unable to verify you.", "danger");
					
	            }
	        });  
			
		// }
		//console.log();
	}

	resendOTP() {

		//this.loggedData
		let postData: any = {};
		postData.msg = "will be replaced";
		postData.action = "signup";
		postData.purpose = "otp";
		// postData.source 					= "email";
		postData.exist_check_field = "email";
		postData.exist_check_value = "";
		postData.exist_check = false;
		postData.subject = "Otp to verify registration";
		postData.to = this.toNumber,
			postData.user_id = this.loggedData._id,
			//postData.resend                     = false
			postData.user_type = this.usertype;

		this.isSubmitted = true;
		//console.log(this.loggedData._id);
		this.auth.getEmailOTP(postData).then((result) => {
			let resultData: any;
			resultData = result;
			this.isSubmitted = false;
			if (resultData.data !== undefined && resultData.data.success) {

				this.auth.mobiToast("OTP sent to your email", "success");
			} else {
				this.auth.mobiToast("Error: Some technical issue", "danger");
			}
		}); 
	}
	/*resendOTP() {
	
		let postData                      :any = {};
		postData.to                 = this.toNumber;
		postData.msg                 = "will be replaced";
            postData.action               = "signup";
            postData.purpose               = "otp";
        this.auth.registerGetOTP(postData).then((result) => { 
            let resultData                : any;
                resultData                = result;
            //this.registerSpinner              = false;
            if(resultData.data !== undefined && resultData.data.success)
            {
                
                this.auth.mobiToast("OTP sent to your phone", "success");
            }else{
				this.auth.mobiToast("Error: Some technical issue", "danger");
			}
		});  
		
	}*/

	takeTo(){

		this.navCtrl.setRoot(ConfirmationPage);
    }

}
