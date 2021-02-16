import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, MenuController, Menu, Platform } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
// import { OrderStatusPage } from '../order-status/order-status';
import { ConfirmationMessagePage } from '../delivery/confirmation-message/confirmation-message';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '../../lib/mobiscroll-package';
import moment from 'moment';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let now = new Date();


@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
	notify 								: any;
	filteredData						: any;
	user_id                                         : any;
    progressing    : any;
 
	feedbackValues = {
        deliveryCondition : 1,
        deliveryDriver :1,
        overallExperience : 1,
        comment            :'' 
    }
    orderDetail: any;
    constructor(private androidplatform: Platform,public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider, private tempStorage: TempStorageProvider) {
		if(localStorage.getItem('socialLogin') == 'true'){
            this.user_id =  localStorage.getItem('userId');
          }
      else{
        this.user_id = this.tempStorage.authsession.userdata.user_id;
      }
        this.progressing = false;
		 
        if (this.navParams.get('orderDetail') !== undefined) {
            
            this.orderDetail = this.navParams.get('orderDetail');
           
        }else{
            this.orderDetail = {};
        }
		 

        
       // this.filter();
	}

    ionViewWillLeave(){
        let backAction = this.androidplatform.registerBackButtonAction(() => {
          this.navCtrl.pop();
        });
      }
     
    parseUTCTime(utcTimeStamp){
        //console.log( moment.unix(utcTimeStamp).toDate());
        //console.log(moment.unix(utcTimeStamp));
        //console.log(moment.utc(utcTimeStamp).local());
        //console.log(moment.utc(utcTimeStamp).local().toDate());

        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}
    
    submitFeedback(){
        
        if (this.orderDetail._id === undefined){
            this.deliveryService.mobiToast("Order Id missing: Tech Error ...", "danger");
            return false;
        }
        let orderData: any = {};
        orderData.user_id = this.user_id;
        orderData.feedback = this.feedbackValues;
        orderData.activities = this.orderDetail.activities;
        if (orderData.activities === undefined || orderData.activities == null) {
            
        } else {
            orderData.activities.push(
                { msg: "Feedback given by user", created_at: moment().format("X"), by: this.user_id }
            );
        }
        this.progressing = true;
                 
        this.deliveryService.createOrder(orderData, this.orderDetail._id).then((result) => {

            this.progressing = false;
            

           // this.navCtrl.setRoot(OrderStatusPage, { orderDetail: orderData, fromPage: 'checkout' });
            let params: any = {};
            params.message = "Your order has been delivered successfully !!!";
            params.nextpage = 'home';
            params.nextpagelabel = 'Done';
            this.navCtrl.setRoot(ConfirmationMessagePage, params);
            
            


        });

    }
    
     togglrMenu(){
         console.log("am i ");
         this.menuCtrl.toggle();
     }

    ionViewDidEnter() {
       // this.menuCtrl.enable(true);
       // this.menuCtrl.toggle();
       // console.log("in");
        // this.activeorders 				= this.tempStorage.activeOrders;
        // this.getActiveOrders();
        // this.activeorders 						= this.tempStorage.activeOrders;
    }

	ionViewDidLoad() {
	 
    }
    

}
