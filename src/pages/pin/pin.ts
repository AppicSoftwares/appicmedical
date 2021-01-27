import { Component, OnInit } from '@angular/core';
import { Events, NavParams, NavController, Platform } from 'ionic-angular';
import { LandingPage } from '../auth/landing/landing';
import { TabPage } from '../tab/tab';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import * as moment from 'moment';
import { HomePage } from '../delivery/home/home';

@Component({
	selector: 'page-pin',
	templateUrl: 'pin.html'
})
export class PinComponent implements OnInit {
	_showLockScreen: boolean;
	passcodeWrong: boolean;
	passcodeAttempts: number = 0;

	enteredPasscode: string = '';
	passcode: string;
	passcodeLabel: string;
	touchLabel: string;

	selected: any;
	finalDigit: any;
	sessionData: any;
	spinner: boolean;
	constructor(
		public events: Events,
		private navCtrl: NavController,
		private navParams: NavParams,
		public tempStorage: TempStorageProvider,
		public deliveryService: DeliveryServiceProvider,
		private androidplatform: Platform
	) {
		this.spinner = false;
		this._showLockScreen = true;
		// this.passcode          = navParams.data.code;
		this.passcodeLabel = navParams.data.passcodeLabel || 'Enter PIN Code';
		// this.touchLabel        = navParams.data.passcodeLabel || 'Verify Passcode';
		this.finalDigit = localStorage.getItem('localpin');
		if (localStorage.getItem('patientData') !== null) {
			this.sessionData = JSON.parse(localStorage.getItem('patientData'));
		} else {
			this.sessionData = null;
		}
	}

	ngOnInit() {}

	allClear(): void {
		this.enteredPasscode = '';
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	remove(): void {
		this.enteredPasscode = this.enteredPasscode.slice(0, -1);
	}

	digit(digit: any): void {
		
		this.selected = +digit;
		this.enteredPasscode += '' + digit;
		if (this.enteredPasscode.length >= 3) {
			if (this.enteredPasscode === this.finalDigit) {
				this.doLogin(this.sessionData);
				setTimeout(() => {
					 
					 this.navCtrl.setRoot(TabPage);
					//this.navCtrl.setRoot(HomePage);
				}, 1000);
			} else {
				this.passcodeWrong = true;
				setTimeout(() => {
					this.enteredPasscode = '';
					this.passcodeWrong = false;
				}, 800);
			}
		}
	}

	doLogin(resultData) {
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

		this.deliveryService.checkUserCart(filterObj).then((result: any) => {
			if (result.data !== undefined && result.data.length > 0) {
				let cartData = result.data[0]; // should be always one latest
				let drugs = [];
				let keys = [];
				let pharmacy = '';
				let pharmacy_id = '';
				let remoteId = '';

				remoteId = cartData._id;
				this.tempStorage.cart.drugs = drugs;
				this.tempStorage.cart.keys = keys;

				this.tempStorage.cart.pharmacy = cartData.pharmacy;
				this.tempStorage.cart.pharmacy_id = cartData.pharmacy_id;
				this.tempStorage.cart.cartHasControlledMedicine =
					cartData.cartHasControlledMedicine;

				if (cartData.medications !== undefined && cartData.medications) {
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
					this.tempStorage.cart.medications = { drugs: [], byNdc: {} };
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
					this.tempStorage.cart.fillpxFormData = cartData.fillpxFormData;
				}

				if (cartData.rxPickup !== undefined) {
					this.tempStorage.cart.rxPickup = cartData.rxPickup;
					if (this.tempStorage.cart.rxPickup.address == undefined) {
						this.tempStorage.cart.rxPickup.address = {};
					}
				}

				this.tempStorage.cart.remoteId = remoteId;
			} else {
			}

			let filterObj: any = {};
			filterObj.case = 'admin-config';
			filterObj.postData = {};
			this.deliveryService.commonUsecase(filterObj).then((result: any) => {
				//console.log(result.data);//service_able_zip
				if (result !== undefined && result.data !== undefined) {
					this.tempStorage.setAdminConfig(result.data);
				} else {
					this.tempStorage.setAdminConfig({});
				}

				this.events.publish('user:loggedin', resultData, Date.now());
			});
		});
	}
}
