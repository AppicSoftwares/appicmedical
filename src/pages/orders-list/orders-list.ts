import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { OrderStatusPage } from '../order-status/order-status';
import { OrderVerifyPage } from '../order-verify/order-verify';
import { DrugInfoPage } from '../delivery/drug-info/drug-info';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '../../lib/mobiscroll-package';
import * as moment from 'moment';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let now = new Date();


@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html',
})
export class OrdersListPage {
	notify 								: any;
	filteredData						: any;
	user_id                                         : any;
	showspinner    : any;

	rangeSettings: MbscRangeOptions = {
        showSelector: false
    };
	filters: any = {
        range: 'today',
        calls: true,
        meetings: true,
        customRange: [
            new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
        ]
    }
    filters1:any={
        range: 'MediCabinet',
       
    };
   
    listviewSettings: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        striped: true
    };
    listviewSettings1: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        striped: true
    };
    listviewSettings2: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        striped: true
    };
	OrderHistory:boolean=false;
    MediCabinetData: boolean=true;
    RecentSearchData: boolean;
    MediCabinetlocal: any;
    RecentSearchlocal: any;
	constructor(private androidplatform:Platform,public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider, private tempStorage: TempStorageProvider) {
		if(localStorage.getItem('socialLogin') == 'true'){
            this.user_id =  localStorage.getItem('userId');
          }
      else{
        this.user_id = this.tempStorage.authsession.userdata.user_id;
      } 
        // this.user_id =  this.tempStorage.authsession.userdata.user_id;
		this.showspinner = false;
		this.notify 					= {
			ordered: {time: moment().format('MMM DD, YYYY HH:mm'), message: "Your order has been placed"},
			process: {time: moment().format('x'), message: "Your order has been processed"},
			out: {time: moment().format('x'), message: "Out for delivery"}
        };
        this.filteredData = [];

		 this.getLocalStorageData();

        
       // this.filter();
	}

    ionViewWillLeave(){
        let backAction = this.androidplatform.registerBackButtonAction(() => {
          this.navCtrl.pop();
        });
      }
    filter() {
        var i,
            item,
            start,
            end,
            range,
            filteredData = [];
			this.filteredData = [];
			this.showspinner = true;

        switch (this.filters.range) {

            case 'today':
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
               // console.log(start);
               // console.log(end);
                break;
            case 'week':
                start = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - (6 - now.getDay()), 0, 0, 0, 0
                    );
                end = new Date(
                    now.setHours(23, 59, 59, 999)
                );
                break;
            default:
                range = this.filters.customRange;
                start = range[0];
                end = range[1];
                end = moment(end).hours(23);
                end = moment(end).minutes(59);
                end = moment(end).seconds(59);
                
        }

      /* for (i = 0; i < this.data.length; i++) {
            item = this.data[i];
            if ((
                    (item.type == 'call' && this.filters.calls) ||
                    (item.type == 'meeting' && this.filters.meetings)
                ) && (item.date >= start) && (item.date <= end)) {
                filteredData.push(item);
            }
		}*/
		                let filterObj :any = {};
						filterObj.is_cart  = false;
						filterObj.user_id  = this.user_id;
						filterObj.start_time  = Number(moment(start).format('X'));
						filterObj.end_time  = Number(moment(end).format('X'));
						filterObj.limit  = 20;
						this.filteredData = [];
						this.deliveryService.checkUserCart(filterObj).then((result: any) => { 

							this.showspinner = false;
						
							if(result !== undefined && result.data !== undefined){
                               
								this.filteredData = result.data;
							}else{
								this.filteredData = [];
							}
							
						
						});	

		//this.filteredData = filteredData;
		console.log(this.filteredData);
    }
    parseUTCTime(utcTimeStamp){
        //console.log( moment.unix(utcTimeStamp).toDate());
        //console.log(moment.unix(utcTimeStamp));
        //console.log(moment.utc(utcTimeStamp).local());
        //console.log(moment.utc(utcTimeStamp).local().toDate());

        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}
    onChange() {
        setTimeout(() => {
            console.log("isnt");
            this.filter();
        });
    }
    
    showOrderView(item){
        let orderDetailModal = this.modalCtrl.create(OrderStatusPage, {orderDetail: item, fromPage: 'orderList'});
        orderDetailModal.onDidDismiss(data => {
           // console.log('page > modal dismissed > data > ', data);
            if (data.toPage !== undefined && data.toPage){

                if (data.toPage == "OrderVerifyPage"){
                    //console.log(data.pagaData);
                    this.navCtrl.push(OrderVerifyPage, data.pagaData);
                } else if (data.toPage == "OrdersListPage"){
                    this.navCtrl.setRoot(OrdersListPage);
                    
                } else if (data.toPage == "DrugInfoPage") {
                    this.navCtrl.push(DrugInfoPage);

                }
            }                
        });
        orderDetailModal.present();
    }
    ionViewDidEnter() {
        console.log("test");
       this.filter();
        // this.activeorders 				= this.tempStorage.activeOrders;
        // this.getActiveOrders();
        // this.activeorders 						= this.tempStorage.activeOrders;
    }

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderStatusPage');
    }
    
    OrderHistoryData(){
          
        this.getLocalStorageData();
       const data= this.filters1.range;
       if(data == 'MediCabinet' ){
        this.MediCabinetData=true;
        this.OrderHistory=false;
        this.RecentSearchData=false;
       }
       else if(data == 'RecentSearch'){
        this.MediCabinetData=false;
        this.OrderHistory=false;
        this.RecentSearchData=true;
       }
       else if(data == 'OrderHistory'){
        this.MediCabinetData=false;
        this.OrderHistory=true;
        this.RecentSearchData=false;
       }
    }

    getLocalStorageData(){
        this.showspinner = false;
        
        this.MediCabinetlocal = this.tempStorage.getMedicabinetData();
        this.RecentSearchlocal = this.tempStorage.getRecentSearchData();
    }
    removeDrug(item1,i){
          
        this.MediCabinetlocal = this.MediCabinetlocal.filter(item => item.NDC !== item1.NDC);
          
       this.tempStorage.setMedicabinetData(this.MediCabinetlocal);
      
    }
    removeRecentSearch(item1,i){
        this.RecentSearchlocal = this.RecentSearchlocal.filter(item => item.NDC !== item1.NDC);
          
        this.tempStorage.setRecentSearchData(this.RecentSearchlocal);  
    }
}
