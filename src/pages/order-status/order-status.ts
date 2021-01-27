import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController,Platform } from 'ionic-angular';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';

import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { OrderVerifyPage } from '../order-verify/order-verify';
//import { HomePage } from '../delivery/home/home';
import { OrdersListPage } from '../orders-list/orders-list';
//import { DrugInfoPage } from '../delivery/drug-info/drug-info';
import * as moment from 'moment';
import { mobiscroll, MbscPopupOptions, MbscNavOptions } from '../../lib/mobiscroll-package';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
})
export class OrderStatusPage {

	notify 								: any;
	orderDetail : any;
	fromPage : any;
	user_id : any;
	progressing : any;
	orderProgressStatus : any;
	chooseToView : any;
	settings: MbscPopupOptions = {
		display: 'center',
		buttons: [
			{
				text: 'Close',
				handler: 'cancel'
			},
			{
				text: 'Yes, Wait',
				handler: 'set'
			}
		],
		onSet: (event, inst) => {
			// Your custom event handler goes here
			this.updateOrderStatusReadyToPharmacy(); // back to read to pahramacy
			 
		},
		onClose: (event, inst) => {
			// Your custom event handler goes here
		}
	};
	drugs : any;
	
	
	
	constructor(private androidplatform :Platform,public viewCtrl: ViewController, public tempStorage: TempStorageProvider, private deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id = this.tempStorage.authsession.userdata.user_id;
		this.drugs   = {
			rxdrugs : [],
			otcdrugs : []
		}
		
		this.progressing = false;
		this.chooseToView = "status";
		if(this.navParams.get('orderDetail') !== undefined){
		this.orderDetail  =  this.navParams.get('orderDetail');
		this.fromPage  =  this.navParams.get('fromPage');

		// magic because after paid key is differnr 
			if (this.orderDetail.pharmacy !== undefined){	
			}else{
				if (this.orderDetail.cartPharmacy !== undefined){
					this.orderDetail.pharmacy = {...this.orderDetail.cartPharmacy};	
					this.orderDetail.cartPharmacy = null;
					delete this.orderDetail.cartPharmacy;
				}else{
					this.orderDetail.pharmacy = {};
					this.orderDetail.pharmacy.pricing = [];
				}
				
			}
			// magic ends 
				this.orderDetail.pharmacy.pricing.map(medicationsPrice => {

						//    console.log(medicationsPrice);
						if (this.orderDetail.medications[medicationsPrice.ndc].OTC) { // if OTC true
							this.drugs.otcdrugs.push(medicationsPrice);
						} else {
							this.drugs.rxdrugs.push(medicationsPrice);
						}

					});
		
         
			
		}else{
			this.orderDetail = {};
			this.orderDetail.pharmacy = {};
			this.orderDetail.pharmacy.pricing = [];
			this.fromPage = "";
		}

		
		this.notify 					= {
			ordered: {time: moment().format('MMM DD, YYYY HH:mm'), message: "Your order has been placed"},
			process: {time: moment().format('x'), message: "Your order has been processed"},
			out: {time: moment().format('x'), message: "Out for delivery"}
		}

		 console.log(this.orderDetail);
	}

	parseUTCTime(utcTimeStamp){
        //console.log( moment.unix(utcTimeStamp).toDate());
        //console.log(moment.unix(utcTimeStamp));
        //console.log(moment.utc(utcTimeStamp).local());
        //console.log(moment.utc(utcTimeStamp).local().toDate());

        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderStatusPage');
		if (this.orderDetail.order_status == "pending-pharmacy") {

				this.promptOptions();

		}
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	promptOptions(){
		//this.register.show()
	}
	closeModel(data){
		console.log("in");
		this.viewCtrl.dismiss(data);
	}

	takeToVerify(){
		this.viewCtrl.dismiss({ pagaData: { orderDetail: this.orderDetail, fromPage: 'orderStatus' }, toPage:"OrderVerifyPage"});
		//this.navCtrl.push(OrderVerifyPage, {orderDetail: this.orderDetail, fromPage: 'orderStatus'});
	}
	isCancelable(){
		return this.deliveryService.isCancelable(this.orderDetail.order_status);
	}
	isEditable(){
		return this.deliveryService.isEditable(this.orderDetail.order_status);
	}

	updateOrderStatusReadyToPharmacy(){
		this.progressing = false;
		//this.cartOrders = this.deliveryService.cartOrders();
		if (this.orderDetail !== undefined && this.orderDetail.order_type !== undefined) {

		} else {
			this.deliveryService.mobiToast("something is not right, please restart the app.", "danger");
			return false;
		}

		let orderData: any = {};
		orderData.user_id = this.user_id;
		orderData.order_status = "ready-to-pharmacy";

		orderData.activities = this.orderDetail.activities;
		if (orderData.activities === undefined || orderData.activities == null) {
			orderData.activities = [];
		} else {
			orderData.activities.push(
				{ msg: "user decided to wait", created_at: moment().format("X"), by: this.user_id }
			);
		}

		this.progressing = true;
		this.deliveryService.mobiToast("Processing your order, Please wait ...", "success").then((result) => {



		});

		this.deliveryService.createOrder(orderData, this.orderDetail._id).then((result) => {
			this.progressing = false;
			//this.viewCtrl.dismiss({});
			this.viewCtrl.dismiss({toPage: "OrdersListPage" });
			//this.navCtrl.setRoot(OrdersListPage);

		});
	}

	cancelOrder(){

		this.deliveryService.mobiconfirm("are you sure want to cancel this order?", "", "Yes", "No").then(value => {
			if (value) {
						 
				this.progressing = false;
				//this.cartOrders = this.deliveryService.cartOrders();
				if (this.orderDetail !== undefined && this.orderDetail.order_type !== undefined) {

				} else {
					this.deliveryService.mobiToast("something is not right, please restart the app.", "danger");
					return false;
				}

				let orderData: any = {};
				orderData.user_id = this.user_id;
				orderData.order_status = "cancelled";

				orderData.activities = this.orderDetail.activities;
				if (orderData.activities === undefined || orderData.activities == null) {
					orderData.activities = [];
				} else {
					orderData.activities.push(
						{ msg: "order cancelled, by user", created_at: moment().format("X"), by: this.user_id }
					);
				}

				this.progressing = true;
				this.deliveryService.mobiToast("Cancelling your order, Please wait ...", "danger").then((result) => {



				});

				this.deliveryService.createOrder(orderData, this.orderDetail._id).then((result) => {
					this.progressing = false;
					//this.viewCtrl.dismiss({});
					//this.navCtrl.setRoot(OrdersListPage);
					this.viewCtrl.dismiss({ toPage: "OrdersListPage" });
			//this.navCtrl.setRoot(OrdersListPage);

				});   

			} else {

			}
		});
		

	}
	updateOrder(){
		
		this.deliveryService.mobiconfirm("are you sure want to Add / Remove item to cart?", "", "Yes", "No").then(value => {
			if (value) {
				// console.log(this.orderDetail);
				this.progressing = false;
				//console.log(this.orderDetail !== undefined + "," + !this.orderDetail + "," + this.orderDetail.order_type !== undefined);
				//console.log(this.orderDetail  + "," + !this.orderDetail + "," + this.orderDetail.order_type );


				if (this.orderDetail !== undefined && this.orderDetail.order_type !== undefined) {

					this.progressing = true;

					let cartData = this.orderDetail;
					let drugs = [];
					let keys = [];
					let pharmacy = "";
					let remoteId = "";


					remoteId = cartData._id;

					this.tempStorage.cart.isEdit = true;

					this.tempStorage.cart.drugs = drugs;
					this.tempStorage.cart.keys = keys;

					this.tempStorage.cart.pharmacy = cartData.pharmacy;

					if (cartData.medications !== undefined && cartData.medications) {
						let values = Object.keys(cartData.medications).map(key => cartData.medications[key]);

						let commaJoinedValues = values;
						// console.log(commaJoinedValues);
						this.tempStorage.cart.medications = { drugs: commaJoinedValues, byNdc: cartData.medications };
					} else {
						this.tempStorage.cart.medications = { drugs: [], byNdc: {} };
					}

					// add actvity array 
					if (cartData.activities !== undefined && cartData.activities) {
						this.tempStorage.cart.activities = cartData.activities;
					}

					// console.log(cartData.rx);
					this.tempStorage.uploadrx = cartData.rx;
					if (cartData.deliveryInfo !== undefined && cartData.deliveryInfo.address !== undefined) {
						this.tempStorage.cart.deliveryInfo.address = cartData.deliveryInfo.address;

					}
					if (cartData.deliveryInfo !== undefined) {
						this.tempStorage.cart.deliveryInfo.deliveryOption = cartData.deliveryInfo.deliveryOption;
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



					this.deliveryService.mobiToast("Loading your cart, Please wait ...", "success").then((result) => {

						this.progressing = false;
						//this.viewCtrl.dismiss({});
						//this.navCtrl.push(DrugInfoPage);
						this.viewCtrl.dismiss({ toPage: "DrugInfoPage" });

					});

					// this.tempStorage.cart.drugs         // drugs detail
					// this.tempStorage.cart.keys          // drug.value
					// this.tempStorage.cart.pharmacy     //pharmacy id
					// remoteId     // _id order if exists

				} else {

					this.deliveryService.mobiToast("something is not right, please restart the app.", "danger");
					return false;
				}


			}else{

			}
		});
		
	}

	progressIndicator(progressStage){
		// console.log(this.orderDetail.status_array);
		if (this.orderDetail.status_array == undefined){
			this.orderDetail.status_array = [];
		}
		return this.deliveryService.contains(this.orderDetail.status_array, progressStage);
		// return true;
		/*if (progressStage == "ordered"){
				
			if(this.orderDetail.status_array){

			}

		} else if (progressStage == "preparing") {
		
		} else if (progressStage == "on-the-way") {

		} else if (progressStage == "delivered") {

		}*/

	}
}
