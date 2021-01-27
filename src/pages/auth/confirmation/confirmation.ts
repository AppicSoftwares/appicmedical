import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';
import { SigninPage } from '../signin/signin';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-confirmation',
	templateUrl: 'confirmation.html'
})
export class ConfirmationPage {
	registerData: any;
	registerForm: any;
	registerSpinner: any;
	displayError: any;
	constructor(
		public events: Events,
		public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		private auth: DeliveryServiceProvider,
		private androidplatform: Platform
	) {
		this.registerData = this.navParams.get('loggedData');
		console.log(this.registerData);
		this.registerForm = this.formBuilder.group({
			username: ['', Validators.required]
		});
		this.registerSpinner = false;
		this.displayError = false;

		if (this.registerData._id && this.registerData.password) {
			// send welcome msg

			this.registerSpinner = true;
			let postData: any = {};
			postData.msg =
				'Welcome to MediPocket \r\n Your Password to login ' +
				this.registerData.password;
			postData.action = 'welcome';
			postData.to = this.registerData.to;
			postData.purpose = 'welcome';
			/*this.auth.registerGetOTP(postData).then((result) => { 
            let resultData                : any;
                resultData                = result;
            this.registerSpinner              = false;
            if(resultData.data !== undefined && resultData.data.success)
            {
               
                
            }
        }); */
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	takeTo() {
		this.navCtrl.push(RegisterOtpVerifyPage);
	}
	takeToHome() {
		//this.navCtrl.setRoot(SigninPage);
		console.log('takeToHome');
		let resultData: any = this.registerData;
		this.auth.setLocalStorage('user_id', resultData.user_id);
		this.auth.setLocalStorage('logged_in', true);
		setTimeout(() => {
			//<<<---    using ()=> syntax
			this.events.publish('user:loggedin', resultData, Date.now());
		}, 1000);
		this.navCtrl.push(SigninPage);
	}
}
