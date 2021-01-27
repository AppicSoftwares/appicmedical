import { Component } from '@angular/core';
import { NavController, NavParams, App, ViewController, MenuController, Menu, Platform } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
// import { ConfirmationMessagePage } from '../delivery/confirmation-message/confirmation-message';
import { FeedbackPage } from '../feedback/feedback';

import * as moment from 'moment';

/**
 * Generated class for the OrderVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-verify',
  templateUrl: 'order-verify.html',
})
export class OrderVerifyPage {
	pageTitle 						: any;
	currentOrder					: any;
	currentOrderId 					: any;
	pageAction 						: any;
	deliveryFormData 				: FormGroup;
	displayError 					: any;
	codeError 						: any;
	errorMsg						: any;
	codeSuccess 					: any;
	successMsg 						: any;
	user_id								: any;
	filteredData          : any;
	showspinner          : any;
	orderVerified 				: any;
	amountToPay  : any;
	patientInfo : any;
	patientVerified : any;
	constructor(private androidplatform :Platform,public appCtrl: App, public menuCtrl: MenuController, public viewCtrl: ViewController, public deliveryService: DeliveryServiceProvider, private formBuilder: FormBuilder, public tempService: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.patientInfo = this.tempService.authsession.userdata.profileData;
		 //console.log(this.tempService.authsession);
		//console.log(this.patientInfo);
		this.pageAction							= this.navParams.get('fromPage');
		this.displayError 						= false;
		this.codeError							= false;
		this.patientVerified       = false;
		this.filteredData            = [];
		this.errorMsg							= "";
		this.successMsg							= "";
		this.amountToPay						= {};
		this.currentOrder                       = this.navParams.get('orderDetail');
		this.currentOrderId = this.currentOrder._id;
		
		if (this.pageAction == 'orderStatus') {
			this.pageTitle						= "Verify & Get Package";
			this.orderVerified = false;
			this.amountToPay          = this.deliveryService.calculateTotalFromPriceArray(this.currentOrder.pharmacy.pricing);
			
			
		}
		else{

			this.patientInfo = {};//this.tempService.patientInfo;
			this.amountToPay = {};
			this.amountToPay.totalPrice =  this.currentOrder.total_amount  
				

			 
		}
		
		
		console.log(this.currentOrder);
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderVerifyPage');
	}
	ionViewWillLeave(){
        let backAction = this.androidplatform.registerBackButtonAction(() => {
          this.navCtrl.pop();
        });
      }
	getPatientInfo(){

		

}


	verifyWithPharmacy(){
		
		let params : any = {};
			params.message = "Your order has been delivered successfully !!!";
				params.nextpage = 'home';
				params.nextpagelabel = 'Done';
	     // this.navCtrl.setRoot(ConfirmationMessagePage, params);
		//this.viewCtrl.dismiss();
		//this.menuCtrl.enable(false);
		setTimeout(() => {
			this.navCtrl.setRoot(FeedbackPage, { orderDetail: this.currentOrder });
		}, 500);
		//this.viewCtrl.dismiss();
		//this.appCtrl.getRootNav().push(FeedbackPage, { orderDetail: this.currentOrder });
		//console.log("in");
			

	}

	goto(action: any = null) {
		let log 			: any = {status: "picked-package", datetime: moment().format('X')};
		if(action == 'delivery') {
			// this.tempService.activeOrders[this.currentOrderId].status = "picked";
			// this.tempService.activeOrders[this.currentOrderId].log.unshift(log);
		
			
		}
		else{
			log.status 							= 'delivered';
		//	this.tempService.activeOrders[this.currentOrderId].status = "delivered";
		//	this.tempService.activeOrders[this.currentOrderId].log.unshift(log);



		}
		
		
	}

	verifyDeliveryCode() {
		this.displayError 						= false;
		this.codeError							= false;
		this.errorMsg							= "";
		this.successMsg							= "";
		console.log(this.deliveryFormData.value);
		if(!this.deliveryFormData.valid) {
				this.displayError             	= true;
				return false;
		}

		if(this.currentOrder.verify_patient_code != this.deliveryFormData.value.code) {
			this.codeError						= true;
			this.patientVerified   = false;
			this.errorMsg 						= "Invalid code!!!";
			console.log("Invalid code");
			return false;
		}
		this.patientVerified   = true;
		this.codeSuccess						= true;
		this.successMsg							= "Code Verified Successfully";
	}

}
