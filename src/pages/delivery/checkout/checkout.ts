import { Component } from '@angular/core';
import {
	NavController,
	NavParams,
	ModalController,
	AlertController
} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';
import { OrderStatusPage } from '../../order-status/order-status';
import { ConfirmationMessagePage } from '../confirmation-message/confirmation-message';
import { customAutoComplete } from '../../../components/auto-complete/auto-complete';

import { Platform } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { DrugInfoPage } from '../drug-info/drug-info';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import {
	mobiscroll,
	MbscPopupOptions,
	MbscListviewOptions,
	MbscOptionlistOptions
} from '../../../lib/mobiscroll-package';
import * as moment from 'moment';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-checkout',
	templateUrl: 'checkout.html'
})
export class CheckoutPage {
	checkoutFormData: FormGroup;
	minYear: any;
	maxYear: any;
	minMonth: any;
	maxMonth: any;
	cartValue: any;
	displayError: any;
	deliveryAddrSettings: MbscPopupOptions;
	deliveryNotesSettings: MbscPopupOptions;
	deliveryAddress: any;
	user_id: any;
	profileInfo: any;
	showSpinner: any;
	checkouttrigger: any;
	hideDelveryOption: any = false;
	membershipCreatedId: any = '';
	createdOrderId: any = '';
	cartOrders: any;
	deliveryCharge: any;
	payOption: any;
	selectedDeliverySlot: any;
	deliveryNotesModel: any;
	isPickupRequired: any;
	payOnDelivery = true;
	//to be rmeoved

	verticalSettings: MbscPopupOptions = {
		display: 'bubble',
		anchor: '#showVertical',
		buttons: [],
		cssClass: 'mbsc-no-padding md-vertical-list'
	};
	lvSettings: MbscListviewOptions = {
		enhance: true,
		swipe: false,
		onItemTap: (event, inst) => {
			this.selectedDeliverySlot = event.target.innerText;
			this.tempStorage.cart.deliveryInfo.timeSlot = this.selectedDeliverySlot;
			/*	mobiscroll.toast({
				message: event.target.innerText + ' clicked'
			}); */
		}
	};
	deliverySlots: any = [];
	TotalCartValue: string;
	// to be removed
	constructor(
		private tempStorage: TempStorageProvider,
		public modalCtrl: ModalController,
		private deliveryService: DeliveryServiceProvider,
		public stripe: Stripe,
		public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public platform: Platform,
		private alertCtrl: AlertController,
		private androidplatform: Platform
	) {
		this.user_id = this.tempStorage.authsession.userdata.user_id;
		if (this.navParams.get('trigger')) {
			this.checkouttrigger = this.navParams.get('trigger');
		}
		this.profileInfo = {};

		this.minYear = moment().toISOString();
		this.maxYear = new Date(
			moment()
				.add(10, 'year')
				.format('YYYY-MM-DD')
		).toISOString();
		this.minMonth = new Date(
			moment()
				.startOf('year')
				.format('YYYY-MM-DD')
		).toISOString();
		this.maxMonth = moment()
			.endOf('year')
			.toISOString();
		this.displayError = false;
		this.showSpinner = false;
		this.selectedDeliverySlot = '';
		//this.deliveryCharge                 = this.deliveryService.applyDeliveryCharge();

		// console.log(this.navParams);
		// console.log(this.tempStorage.cart);
		this.deliveryNotesModel = '';
		this.cartValue = this.tempStorage.cart.total;
		this.isPickupRequired = false;
		if (this.checkouttrigger == 'membershippayment') {
			this.cartValue = this.tempStorage.cart.membership.price;
			this.hideDelveryOption = true;
			this.membershipCreatedId = this.navParams.get('membershipCreatedId');
		} else {
			this.hideDelveryOption = false;
			this.createdOrderId = this.navParams.get('createdOrderId');
			this.payOption = this.navParams.get('payOption');
			//	console.log(this.payOption	);
			console.log('getdelivery');
			console.log(this.deliveryService.getDeliverySlots())
			this.deliverySlots = this.deliveryService.getDeliverySlots();
		}

		this.stripe.setPublishableKey('pk_test_2Fr70nsDAtUaKwlIx73qEw8p');

		this.checkoutFormData = this.formBuilder.group({
			deliveryoption: ['delivery', Validators.required],
			deliveryaddress: [''],
			cartvalue: [this.cartValue, Validators.required],
			paymentmethod: ['card', Validators.required],
			cardholdername: [
				this.tempStorage.authsession.userdata.profileData.name,
				Validators.required
			],
			cardnumber: ['', Validators.required],
			validmonth: [this.minMonth, Validators.required],
			validyear: [this.minYear, Validators.required],
			cvc: ['', Validators.required]
		});

		this.cartOrders = this.deliveryService.cartOrders();
		this.getProfileInfo();
		this.calculateCartTotal();

		let me = this;
		this.deliveryAddress = this.checkoutFormData.value.deliveryaddress;
		this.deliveryAddrSettings = {
			display: 'top',
			theme: 'ios',
			buttons: [
				{
					text: 'Update',
					handler: 'set'
				}
			],
			onSet: function(event, inst) {
				me.checkoutFormData.patchValue({
					deliveryaddress: me.deliveryAddress
				});
			},
			onBeforeShow: function(event, inst) {}
		};
		this.deliveryNotesSettings = {
			display: 'top',
			theme: 'ios',
			buttons: [
				{
					text: 'Update',
					handler: 'set'
				}
			],
			onSet: function(event, inst) {
				//	me.checkoutFormData.patchValue({
				//		deliveryaddress : me.deliveryAddress
				//	})
			},
			onBeforeShow: function(event, inst) {}
		};
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CheckoutPage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	ionViewDidLeave() {
		console.log('payment leave');
		this.tempStorage.clearCartMembership();
	}

	calculateCartTotal(delivery: any = true) {
		//	console.log(this.payOption);
		// doesn to do anyting with pricing, just setting default payment info strat
		//console.log(this.tempStorage.cart.rxPickup);
		if (delivery) {
			this.checkoutFormData.patchValue({
				paymentmethod: 'card'
			});
		} else {
			// if pickup
			this.checkoutFormData.patchValue({
				paymentmethod: 'mpcard'
			});
		}
		// doesn to do anyting with pricing, just setting default payment info end

		let cartvalue = 0;
		this.cartValue = cartvalue;

		if (this.payOption === 'MPcard') {
			this.deliveryCharge = this.deliveryService.applyDeliveryCharge(true);
		} else {
			this.deliveryCharge = this.deliveryService.applyDeliveryCharge(false);
		}

		if (
			this.tempStorage.cart.rxPickup != undefined &&
			this.tempStorage.cart.rxPickup.address != undefined &&
			this.tempStorage.cart.rxPickup.address.latitude != undefined
		) {
			this.deliveryCharge = this.deliveryCharge * 2;
			this.isPickupRequired = true;
		}

		// console.log(this.deliveryCharge);
		if (delivery) {
			cartvalue =
				Number(this.checkoutFormData.value.cartvalue) +
				Number(this.deliveryCharge);
		} else {
			cartvalue =
				Number(this.checkoutFormData.value.cartvalue) -
				Number(this.deliveryCharge);
		}
		this.cartValue = cartvalue;
		  
		if (this.cartValue > '30') {
			this.payOnDelivery = false;
		}
		this.checkoutFormData.patchValue({
			cartvalue: cartvalue
		});
	}

	getProfileInfo() {
		console.log(this.cartOrders);
		console.log(this.tempStorage.authsession);
		console.log(this.cartOrders.deliveryInfo.address.text);
		console.log(this.tempStorage.authsession.userdata.profileData.name);
		this.checkoutFormData.patchValue({
			deliveryaddress: this.cartOrders.deliveryInfo.address.text,
			cardholdername: this.tempStorage.authsession.userdata.profileData.name
		});
		/*this.deliveryService.profileInfo('patient',this.user_id).then((result)=>{
				let resultData : any = {}; 
				resultData    = result;
				if(resultData.data !== undefined){
					 
					   this.profileInfo = resultData.data;
					   this.profileInfo.dob = moment.unix(resultData.data.dob).toISOString();
					 //  console.log(this.profileInfo);
						this.checkoutFormData.patchValue(
							{
								deliveryaddress: this.profileInfo.address+' '+this.profileInfo.address+' '+this.profileInfo.state+' '+this.profileInfo.zip_code+' '+this.profileInfo.country,
								cardholdername:  this.profileInfo.name,
								

							}
							);
						 

				}else{

				} 

		});	*/
	}

	presentAlert(title: string, subTitle: string, cssClass: string) {
		let alert = this.alertCtrl.create({
			title,
			subTitle,
			buttons: ['Dismiss'],
			cssClass
		});
		alert.present();
	}

	validateCard() {
		console.log('this.checkoutFormData.value', this.checkoutFormData.value);
	
	

		this.showSpinner = true;
		let expMonth = parseInt(
			moment(this.checkoutFormData.value.validmonth).format('MM')
		);
		let expYear = parseInt(
			moment(this.checkoutFormData.value.validyear).format('YYYY')
		);
		this.displayError = false;
		//  delivery and cart, cash on dev option start
		if (
			this.checkoutFormData.value.paymentmethod == 'card' &&
			this.checkoutFormData.value.deliveryoption == 'delivery'
		) {
			if (this.checkoutFormData.value.cardnumber.length !== 16) {
				this.presentAlert('Error!', 'Please enter valid 16 digit card number', 'text-center');
				this.showSpinner = false;
				return false;
			} else if (this.checkoutFormData.value.cvc.length !== 3) {
				this.presentAlert('Error!', 'Please enter valid 3 digit cvc number', 'text-center');
				this.showSpinner = false;
				return false;
			}
			if (
				this.tempStorage.cart.deliveryInfo.address.zip ==
				this.tempStorage.cart.pharmacy.zip
			) {
			} else {
				this.deliveryService
					.mobiAlert(
						'',
						'Delivery zip code(' +
							this.tempStorage.cart.deliveryInfo.address.zip +
							') and pharmacy zip code(' +
							this.tempStorage.cart.pharmacy.zip +
							")  can't be different"
					)
					.then(result => {
						return false;
					});
					this.showSpinner=false;
				return false;
			}
			if (!this.checkoutFormData.valid || !this.selectedDeliverySlot) {
				this.displayError = true;
				this.showSpinner = false;
				//		console.log(1);
				if (!this.selectedDeliverySlot) {
					//			console.log(1);
					this.deliveryService.mobiToast(
						'Please choose the delivery slot',
						'danger'
					);
				}
				return false;
			}
		} else {
			// if cash on delivery
			//	console.log(1);

			if (
				!this.selectedDeliverySlot &&
				this.checkoutFormData.value.deliveryoption == 'delivery'
			) {
				//		console.log(1); if cash on delivery and slot missing
				this.displayError = true;
				this.showSpinner = false;
				this.deliveryService.mobiToast(
					'Please choose the delivery slot',
					'danger'
				);

				return false;
			} else if (this.checkoutFormData.value.deliveryoption == 'delivery') {
				// if c ash on delivery and slot is there
				this.showSpinner = false;
				//this.navCtrl.setRoot(OrderStatusPage);
				this.paymentSuccess();
				return false;
			}
			//	console.log(1);
		}
		//  delivery and cart, cash on dev option ends

		if (this.checkoutFormData.value.deliveryoption == 'pickup') {
			this.showSpinner = false;
			//this.navCtrl.setRoot(OrderStatusPage);
			this.paymentSuccess();
			return false;
		}

		if (this.platform.is('cordova')) {
			// this.navCtrl.setRoot(OrderStatusPage);
			let card = {
				number: this.checkoutFormData.value.cardnumber,
				expMonth: expMonth,
				expYear: expYear,
				cvc: this.checkoutFormData.value.cvc,
				currency: 'USD'
			};
			console.log(card);
			this.stripe
				.createCardToken(card)
				.then(token => {
					//this.showSpinner 					= false;
					//console.log(token);
					let triggerPayment = false;
					if (this.checkoutFormData.value.deliveryoption == 'delivery') {
						triggerPayment = false;
					} else {
						triggerPayment = false; // dont creatre if pickup
					}
					let postData: any = {
						triggerPayment: triggerPayment,
						gateway_response: token,
						token: token.id,
						order_id: this.tempStorage.cart.remoteId,
						payment_status: 'auth',
						description: 'Medidelivery Order payment authendication',
						userid: this.user_id,
						amount: this.cartValue
					};
					this.deliveryService.processPayment(postData).then(result => {
						console.log(result);
						this.showSpinner = false;
						let resultData: any = result;
						if (resultData.status == 'success') {
							mobiscroll.toast({
								message: 'Payment successful.',
								color: 'success'
								//callback: this.paymentSuccess(token.id)
							});
							this.paymentSuccess(token.id);
							// this.tempStorage.clearCart();
							// this.navCtrl.setRoot(OrderStatusPage);
						} else {
							mobiscroll.toast({
								message: 'Error! ' + resultData.msg,
								color: 'danger'
							});
						}
					});
				})
				.catch(error => {
					this.showSpinner = false;
					console.error(error);
					mobiscroll.toast({
						message: 'Error! ' + error,
						color: 'danger'
					});
					console.log(error);
				});
		} else {
			this.showSpinner = false;
			//this.navCtrl.setRoot(OrderStatusPage);
			this.paymentSuccess();
		}
	}

	editAddress() {
		console.log('edit address');
	}

	paymentSuccess(tokenId = '') {
		if (this.hideDelveryOption) {
			let params: any = {
				message: 'Your membership has been created and activated successfully.',
				nextpage: 'home',
				nextpagelabel: 'done'
			};
			this.showSpinner = true;
			this.deliveryService
				.updateMembership(
					{ payment_status: 'paid', payment_id: 'df123' },
					this.membershipCreatedId
				)
				.then(data => {
					this.showSpinner = false;
					if (this.tempStorage.cart.keys !== undefined) {
						if (Object.keys(this.tempStorage.cart.keys).length > 0) {
							params = {
								message:
									'Your membership has been created and activated successfully.',
								nextpage: 'druginfo',
								nextpagelabel: 'Go to Cart'
							};
						} else {
							params = {
								message:
									'Your membership has been created and activated successfully.',
								nextpage: 'home',
								nextpagelabel: 'Done'
							};

							// set membership modify
						}

						this.tempStorage.setProfileMembership('active', 'premium');

						this.navCtrl.setRoot(ConfirmationMessagePage, params);
					} else {
						this.navCtrl.setRoot(ConfirmationMessagePage, params);
					}
				});
		} else {
			this.showSpinner = true;

			//	this.deliveryService.updateOrder({ payment_status: "paid", order_status: "paid", payment_id: 'df123' }, this.createdOrderId).then(data => {
			let orderData: any = {};
			orderData.user_id = this.user_id;
			orderData.payment_status = 'paid';
			if (tokenId) {
				orderData.payment_id = tokenId;
			}
			orderData.amount_paid = this.checkoutFormData.value.cartvalue;
			orderData.payment_type = this.checkoutFormData.value.paymentmethod; // card / or cash on delivery
			orderData.order_status = 'ready-to-pharmacy';
			orderData.order_type = 'order';
			//orderData.block_me   = "order";
			console.log(this.cartOrders);
			orderData.activities = this.cartOrders.activities;
			orderData.deliveryInfo = this.cartOrders.deliveryInfo;
			orderData.deliveryInfo.deliveryOption = this.checkoutFormData.value.deliveryoption;
			orderData.deliveryInfo.notes = this.deliveryNotesModel;
			if (orderData.activities === undefined || orderData.activities == null) {
				orderData.activities = [];
			} else {
				orderData.activities.push({
					msg: 'order paid',
					created_at: moment().format('X'),
					by: this.user_id
				});
			}

			orderData.orderCreated = moment().format('X');
debugger;
			this.deliveryService
				.createOrder(orderData, this.tempStorage.cart.remoteId)
				.then(result => {
					this.showSpinner = false;
					// coped from rx ssubmit
					this.tempStorage.clearCart();

					// console.log(this.tempStorage.cart);
					let updatedCart: any = this.deliveryService.cartOrders();

					this.navCtrl.setRoot(OrderStatusPage, {
						orderDetail: orderData,
						fromPage: 'checkout'
					});
				});
		}
	}

	cartcount() {
		//return Object.keys(this.tempStorage.cart.drugs).length;

		this.cartOrders = this.deliveryService.cartOrders();
        if(this.cartOrders.cartPharmacy.pricing == undefined){
          return  this.TotalCartValue ='0';
          }
          else{
           return this.TotalCartValue= this.cartOrders.cartPharmacy.pricing.length;
          }
	//	return this.tempStorage.cart.medications.drugs.length;
	}

	goto(action: any) {
		if (action == 'druginfo') {
			// this.searchDataForm.patchValue({ term: "" });
			this.navCtrl.push(DrugInfoPage);
		}
	}

	changeLocation() {
		//  this.pharmacySelected = "";

		const modal = this.modalCtrl.create(customAutoComplete, {
			ismodel: true,
			myLocationObj: {},
			template: 'change_location',
			placeHolder: 'Search Pharmacy',
			templateBasedData: {}
		});
		modal.onDidDismiss(data => {
			//console.log(data);
			if (
				data &&
				data !== undefined &&
				data.address !== undefined &&
				data.cords !== undefined
			) {
				//this.currentLocation = data.address;
				//this.myLocationObj = data.cords;
				let deliveryAddress: any = {};
				deliveryAddress.text = data.address;
				deliveryAddress.latitude = data.cords.latitude;
				deliveryAddress.longitude = data.cords.longitude;
				this.tempStorage.cart.deliveryInfo.address = deliveryAddress;
				this.tempStorage.cart.deliveryInfo.address.zip = data.cords.zip;
				this.checkoutFormData.patchValue({
					deliveryaddress: deliveryAddress.text
				});
				//console.log(data);
				//   this.tempStorage.cart.deliveryInfo.address.text = this.currentLocation;
				//  this.tempStorage.cart.deliveryInfo.address.latitude = this.myLocationObj.latitude;
				//  this.tempStorage.cart.deliveryInfo.address.longitude = this.myLocationObj.longitude;
			}
			// this.pharmacySelected = data;
		});
		modal.present();
	}
}
