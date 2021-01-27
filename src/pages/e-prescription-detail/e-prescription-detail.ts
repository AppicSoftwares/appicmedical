import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';

import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { OrderVerifyPage } from '../order-verify/order-verify';
//import { HomePage } from '../delivery/home/home';
import { OrdersListPage } from '../orders-list/orders-list';
import { DrugInfoPage } from '../delivery/drug-info/drug-info';
import * as moment from 'moment';
import { mobiscroll, MbscPopupOptions } from '../../lib/mobiscroll-package';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-e-prescription-detail',
	templateUrl: 'e-prescription-detail.html',
})
export class EPrescriptionDetailPage {
	
	notify 								: any;
	orderDetail : any;
	fromPage : any;
	user_id : any;
	progressing : any;
	orderProgressStatus : any;
 
	constructor(private androidplatform: Platform,public viewCtrl: ViewController, public tempStorage: TempStorageProvider, private deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id = this.tempStorage.authsession.userdata.user_id;
		this.progressing = false;
		if(this.navParams.get('orderDetail') !== undefined){
		this.orderDetail  =  this.navParams.get('orderDetail');
		this.fromPage  =  this.navParams.get('fromPage');

			
		}else{
			this.orderDetail = {};
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
	
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	closeModel(data){
		console.log("in");
		this.viewCtrl.dismiss(data);
	}

	 

 
}
