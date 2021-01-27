import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { HomePage } from '../../delivery/home/home';
import { RegisterOtpVerifyPage } from '../register-otp-verify/register-otp-verify';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// import { GooglePlus } from '@ionic-native/google-plus';

// import { e } from '@angular/core/src/render3';
import * as moment from 'moment';
import { TabPage } from '../../tab/tab';
import { EverytimePasswordPage } from '../everytime-password/everytime-password';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-signin',
	templateUrl: 'signin.html'
})
export class SigninPage {
	logintype: any;
	loginForm: any;
	passwordLogin: any;
	defaultPasswordBtnColor: any;
	defaultOtpBtnColor: any;
	passwordInputtype: any;
	passwordInputPH: any;
	displayError: any;
	loginSpinner: any;
	ionInputType: any;
	isSubmitted: any = false;
	//private googlePlus: GooglePlus,
	constructor(
		public events: Events,
		public navCtrl: NavController,
		public fb: Facebook,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		private deliveryService: DeliveryServiceProvider,
		private tempStorage: TempStorageProvider,
		private androidplatform: Platform
	) {
		this.logintype = this.navParams.get('logintype');
		this.isSubmitted = false;
		/* #40525a */
		this.passwordLogin = true;
		this.defaultOtpBtnColor = 'redinput';
		this.defaultPasswordBtnColor = 'dark';
		this.passwordInputtype = 'password';
		this.ionInputType = 'password';
		this.passwordInputPH = '********';
		this.loginSpinner = false;
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required], //munipatient@mailinator.com
			password: ['', Validators.required] //7890
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SigninPage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	doRegister(type) {
		// console.log(type);
		this.navCtrl.push(RegisterPage, { registertype: type });
	}

	loginAction(mediaType) {
		// Login with permissions
		//console.log(this.fb);
		if (mediaType == 1) {
			this.fb
				.login(['public_profile'])
				.then((res: FacebookLoginResponse) => {
					// The connection was successful
					if (res.status == 'connected') {
						// Get user ID and Token
						var fb_id = res.authResponse.userID;
						var fb_token = res.authResponse.accessToken;

						// Get user infos from the API
						this.fb.api('/me?fields=name,email', []).then(user => {
							//	console.log(user);
							// Get the connected user details
							//	var gender = user.gender;
							//	var birthday = user.birthday;
							var name = user.name;
							var email = user.email;

							//	console.log("=== USER INFOS ===");
							//	console.log("Gender : " + gender);
							//	console.log("Birthday : " + birthday);
							console.log('Name : ' + name);
							console.log('Email : ' + email);

							// => Open user session and redirect to the next page
						});
					}
					// An error occurred while loging-in
					else {
						console.log('An error occurred...');
					}
				})
				.catch(e => {
					console.log('Error logging into Facebook', e);
				});
		} else if (mediaType == 2) {
		}
	}

	takeToRegister() {
		this.navCtrl.push(RegisterPage, {});
	}
	takeToHome() {
		// this.navCtrl.setRoot(HomePage);
		this.navCtrl.setRoot(TabPage);
	}
	takeToForget() {
		//console.log(this.loginForm.value.username);
		//console.log(this.loginForm.value);
		this.navCtrl.push(ForgetPasswordPage, {
			email: this.loginForm.value.username
		});
	}
	takeToOtpVerify() {
		this.navCtrl.push(RegisterOtpVerifyPage);
	}
	doSignin() {
		//console.log(this.loginForm.value);
		//console.log(this.passwordInputtype);

		console.log('asdasd', this.loginForm.value);
		if (!this.loginForm.valid) {
			this.displayError = true;
			return false;
		}

		console.log('this.loginForm.value', this.loginForm.value);

		this.isSubmitted = true;
		this.loginSpinner = true;
		let postData = this.loginForm.value;
		postData.user_type = 'patient';

		this.deliveryService.login(postData).then(
			result => {
				let resultData: any;
				resultData = result;
				this.loginSpinner = false;
				// console.log(resultData);
				if (typeof resultData.user_id !== 'undefined') {
					console.log(resultData.user_id);
					localStorage.setItem('userId', resultData.user_id);
					localStorage.setItem('patientData', JSON.stringify(resultData));
					let userData: any;
					setTimeout(() => {
						//<<<---    using ()=> syntax
						this.tempStorage.setAuthSession(resultData);
						// set member ship
						if (resultData.membership !== undefined) {
							let currentTime = moment().format('X');
							if (
								resultData.membership.membership_end !== undefined &&
								currentTime <= resultData.membership.membership_end
							) {
								this.tempStorage.setProfileMembership('active', 'premium');
							} else {
								this.tempStorage.setProfileMembership('active', 'free');
							}
						} else {
							this.tempStorage.setProfileMembership('active', 'free');
						}
						// end
						let filterObj: any = {};
						filterObj.is_cart = true;
						filterObj.user_id = resultData.user_id;

						this.deliveryService
							.checkUserCart(filterObj)
							.then((result: any) => {
								this.isSubmitted = false;

								if (result.data !== undefined && result.data.length > 0) {
									let cartData = result.data[0]; // should be always one latest
									let drugs = [];
									let keys = [];
									let pharmacy = '';
									let pharmacy_id = '';
									let remoteId = '';

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
											key => cartData.medications[key]
										);

										let commaJoinedValues = values;
										// console.log(commaJoinedValues);
										this.tempStorage.cart.medications = {
											drugs: commaJoinedValues,
											byNdc: cartData.medications
										};
									} else {
										this.tempStorage.cart.medications = {
											drugs: [],
											byNdc: {}
										};
									}

									// add actvity array
									if (
										cartData.activities !== undefined &&
										cartData.activities
									) {
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
								filterObj.case = 'admin-config';
								filterObj.postData = {};
								this.isSubmitted = true;
								this.deliveryService
									.commonUsecase(filterObj)
									.then((result: any) => {
										//console.log(result.data);//service_able_zip
										this.isSubmitted = true;
										if (result !== undefined && result.data !== undefined) {
											this.tempStorage.setAdminConfig(result.data);
										} else {
											this.tempStorage.setAdminConfig({});
										}

										this.events.publish(
											'user:loggedin',
											resultData,
											Date.now()
										);
									});
							});
					}, 1000);
				} else {
					this.isSubmitted = false;
					if (resultData) {
						let errorData = JSON.parse(resultData);
						console.log(errorData);
						if (errorData.error !== undefined) {
							this.deliveryService.mobiToast(
								'Invalid credentials !!!',
								'danger'
							);
						}
					}
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	forgotPassword() {}

	resendOTP() {
		let postData = this.loginForm.value;
		postData.type = this.logintype;
		postData.resend = true;

		/* this.deliveryService.signinGetOTP(postData).then((result) => { 
            let resultData                : any;
                resultData                = result;
            this.loginSpinner              = false;
            if(resultData.status == "success")
            {
                setTimeout(()=>{    //<<<---    using ()=> syntax
                    
                }, 2000);
                
            }
        }); */
	}
	everytimepassword() {
		this.navCtrl.push(EverytimePasswordPage);
	}

	validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
}
