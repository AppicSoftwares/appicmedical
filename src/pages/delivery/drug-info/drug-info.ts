import { Component } from '@angular/core';
import { NavController, NavParams, ModalController,Platform } from 'ionic-angular';
import { CheckoutPage } from '../../delivery/checkout/checkout';
import { RequestPxPage } from '../../delivery/request-px/request-px';
import { customAutoComplete } from '../../../components/auto-complete/auto-complete';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { UploadRxPage } from '../../../pages/upload-rx/upload-rx';
import { PatientProfilePage } from '../../../pages/delivery/patient-profile/patient-profile';
import { DomSanitizer } from "@angular/platform-browser";
import { ImageSlidePage } from '../../../pages/image-slide/image-slide';
import { MembershipPlanPage } from '../../membership/membership-plan/membership-plan';
import { mobiscroll, MbscPopupOptions, MbscListviewOptions } from '../../../lib/mobiscroll-package';


import * as moment from 'moment';
import { SearchMedicinesPage } from '../search-medicines/search-medicines';



@Component({
  selector: 'page-drug-info',
  templateUrl: 'drug-info.html',
})
export class DrugInfoPage {
	cartDrugs 										: any;
	cartDrugsKey 									: any;
	cartPharmacy 									: any;
    cartMembership                                  : any;
	otcdrugs 										: any;
	rxdrugs 										: any;
    orderTotal                                      : any;
    cartOrders                                      : any;
    uploadedRXimages                                : any;
    user_id                                         : any;
    submitted : any = false;
    addingInProgress : any;

    selectedDeliverySlot: any;
    rxPickUpLocation : any;
    cartHasControlledMedicine : any;

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
            // update temp stoarge
            this.tempStorage.cart.rxPickup.timeSlot = this.selectedDeliverySlot;
            /*	mobiscroll.toast({
                    message: event.target.innerText + ' clicked'
                }); */
        }
    };
    deliverySlots: any = [];
     
    customSettings: MbscPopupOptions = {
        display: 'center',
        cssClass: 'customer-option',
        buttons: [
            {
                text: 'Insurance Card',
                handler: (event, inst)=>{
                    inst.hide();
                    if (this.tempStorage.authsession.userdata.profileData.uploadedInsurance !== undefined && this.tempStorage.authsession.userdata.profileData.uploadedInsurance.length > 0){
                        this.pay("insuranceCard");
                    }else{
                        this.deliveryService.mobiToast("You dont have insurance card in your profile, Add in your profile", "danger");
                    }
                    
                    //this.pay("insuranceCard");
                    
                }
            },
            {
                text: 'MediPocket Pharmacy Discount Card',
                handler:(event, inst)=>{
                       inst.hide(); 
                    
                        this.pay("MPcard");
                     
                }
            },
            {
                text: 'Close', 
                handler: function (event, inst) {
                    inst.hide();
                    
                    
                }
            }
          /*  {
                text: 'Retail Price', 
                handler: function (event, inst) {
                    inst.hide();
                    mobiscroll.toast({
                        message: 'This features will be coming soon'
                    });
                    
                }
            }*/
        ]
    };

	constructor(private androidplatform: Platform,public tempStorage: TempStorageProvider, public modalCtrl: ModalController, private sanitization: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider) {
        this.user_id =  this.tempStorage.authsession.userdata.user_id;
        this.submitted = false;
        this.addingInProgress = false;
        
        this.uploadedRXimages                         = [];
        this.rxPickUpLocation                           = {};
        this.setuploadRX();
        this.getCart();
        //this.cartOrders assgined in getcart function
        this.cartHasControlledMedicine = this.cartOrders.cartHasControlledMedicine;
        if (this.cartOrders.rxPickup.address.text == undefined){
            this.rxPickUpLocation = this.cartOrders.deliveryInfo.address;
            this.tempStorage.cart.rxPickup.address = this.rxPickUpLocation;
        }else{
            this.rxPickUpLocation = this.cartOrders.rxPickup.address;
        }
       
        if (this.cartOrders.rxPickup.timeSlot != undefined) {
            this.selectedDeliverySlot = this.cartOrders.rxPickup.timeSlot;
        }else{
            this.selectedDeliverySlot = "";
        }

        
        
        this.deliverySlots = this.deliveryService.getDeliverySlots()
      //  let currentObj = this;

        
	}
    ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	ionViewDidLoad() {
        console.log('ionViewDidLoad DrugInfoPage');
        // check if mobile number verified 
        this.checkIfPhoneVerifed();
    }

    updateValue(){
        console.log("check if trigged");
        console.log(this.cartHasControlledMedicine);
        this.tempStorage.cart.cartHasControlledMedicine = this.cartHasControlledMedicine;
        console.log(this.tempStorage.cart.cartHasControlledMedicine);
    }
    
    checkIfPhoneVerifed(){
 
        let profileData = { ...this.tempStorage.authsession.userdata.profileData };
        console.log(profileData);
          
        if (profileData.phone_verified !== undefined && profileData.phone_verified == true) {
            // good
            return true;
        } else {
             
            this.deliveryService.mobiconfirm("Please verify your phone number to proceed with order?","", "Yes, Please", "No").then(value => {
                if (value) {
                     
                    this.navCtrl.push(PatientProfilePage)
                } else {

                }
            });
            return false;
            // bad
        }

    }

    getCart() {
           
        this.addingInProgress = true;
        this.cartOrders= this.deliveryService.cartOrders();
 
        console.log("Card orders"+JSON.stringify(this.cartOrders));
        if(this.cartOrders.cartPharmacy !== undefined && this.cartOrders.cartPharmacy.pricing !== undefined && this.cartOrders.cartPharmacy.pricing.length > 0 && this.cartOrders.medications !== undefined && this.cartOrders.medications !== undefined ){

            // split drugs by otpc and rx 
            // loop through medications
          //  let medicationsArray = Object.keys(this.cartOrders.medications).map(key => this.cartOrders.medications[key]);
          
            this.cartOrders.cartPharmacy.pricing.map(medicationsPrice=>{

                
              //if(this.cartOrders.otcdrugs.length !== 0){ 
                 
                if(this.cartOrders.medications[medicationsPrice.ndc].OTC){ // if OTC true
                    this.cartOrders.otcdrugs.push(medicationsPrice);
                }
                else{
                    this.cartOrders.rxdrugs.push(medicationsPrice); 
                }
            // }else{
            //     this.cartOrders.rxdrugs.push(medicationsPrice); 
            // }
                

            });

            

        }

        this.cartMembership                        = this.tempStorage.cart.membership;
        this.addingInProgress = false;
       // console.log(this.cartOrders);


                /* updating db 
          //      this.cartOrders = this.deliveryService.cartOrders();
        
                let orderData: any = {};
                orderData.user_id = this.user_id;
                orderData.items = {
                    otcdrugs: this.cartOrders.otcdrugs,
                    rxdrugs: this.cartOrders.rxdrugs
                };
                orderData.total_amount = this.cartOrders.cartvalue
                orderData.payment_status = "not-paid";
                orderData.payment_id = "";
                orderData.order_status = "order-in-cart";
                
                //orderData.rx = this.uploadedRXimages;
                orderData.payment_type = "";
                
               this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId ).then((result : any) => {
                    
                    if (result.insertedId !== undefined){
                        
                        this.tempStorage.cart.remoteId = result.insertedId;
                        
                    }
                    
                    this.addingInProgress = false;
                    
        
        
                });*/
        
                /* updating db end */
    }
    ionViewDidEnter() {
    	
        this.setuploadRX();
        this.getCart();
        
    }

  
    pay(payOption="MPcard") {
        // console.log(this.cartOrders.rxdrugs);
       // console.log(this.cartOrders.rxdrugs.length);
       // console.log(this.uploadedRXimages);
       //  console.log(this.uploadedRXimages.length);
        if (this.checkIfPhoneVerifed()) {
            this.getCart(); // get latest data; in this.cartODers
        } else {
            return false;
        }

       let discount_option   = "";
       let insurance_card    = [];
       if(payOption == "MPcard"){
        discount_option = "mpcard";
           insurance_card = [];
       }else{
        discount_option = "insurance_card";  
           insurance_card = this.tempStorage.authsession.userdata.profileData.uploadedInsurance;
       }

        if(this.cartOrders.rxdrugs.length > 0 && (this.uploadedRXimages.length == 0 && this.cartOrders.fillpxFormData.doctor_name == undefined)) {
            this.deliveryService.mobiToast('Please add your prescription by clicking upload RX', 'danger');
            return false;
        } 

        this.submitted = true;
        let orderData : any = {};
            orderData.user_id = this.user_id;
            orderData.items   = {
                otcdrugs : [],//this.cartOrders.otcdrugs,
                rxdrugs : []//this.cartOrders.rxdrugs
            };
            orderData.medications  = this.cartOrders.medications; //by NDC
            orderData.pharmacy     = this.cartOrders.cartPharmacy;
        orderData.pharmacy_id = this.cartOrders.pharmacy_id;
            orderData.total_amount = this.cartOrders.cartvalue;
            orderData.total_saving = this.cartOrders.pricediff;
            
            orderData.activities      = this.cartOrders.activities;
            if(orderData.activities === undefined || orderData.activities == null){
                orderData.activities  = [];
            }else{
                if (this.tempStorage.cart.isEdit){

                    orderData.activities.push(
                        { msg: "order updated", created_at: moment().format("X"), by: this.user_id }
                    );

                }else{

                    orderData.activities.push(
                        { msg: "order initiated", created_at: moment().format("X"), by: this.user_id }
                    );

                    orderData.payment_status = "not-paid";
                   // orderData.payment_id = "";
                    orderData.order_status = "order-initiated";
                    orderData.order_type = "order";
                    
                }
                

            }
             
            orderData.discount_option = discount_option;
            orderData.fillpxFormData  = this.cartOrders.fillpxFormData;
            orderData.deliveryInfo = this.cartOrders.deliveryInfo;

            orderData.rx             = this.uploadedRXimages;
            orderData.payment_type   = "";
            if (this.uploadedRXimages.length > 0){
                orderData.rxPickup = this.cartOrders.rxPickup;
            }
            orderData.cartHasControlledMedicine = this.cartOrders.cartHasControlledMedicine;
            orderData.insurance_card = insurance_card;
           // console.log(this.cartOrders);
           //  console.log(orderData);
           // console.log(this.tempStorage.cart);
            this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId).then((result)=>{
                
                let resultData : any =  result;
                if(resultData.insertedId !== undefined){
                    this.deliveryService.mobiToast("Confirming your order", "success").then((result) => {
                        this.submitted = false;   
                        this.navCtrl.push(CheckoutPage, { createdOrderId: resultData.insertedId, payOption:payOption});
                    });
                }else if(resultData.updatedId !== undefined){
                    this.deliveryService.mobiToast("Confirming your order", "success").then((result) => {
                        this.submitted = false;   
                        this.navCtrl.push(CheckoutPage, { createdOrderId: resultData.updatedId, payOption:payOption});
                    });
                }else{
                    this.submitted = false;   
                    this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
                }
            })
        //  console.log(this.cartOrders.otcdrugs);
        //  console.log(this.cartOrders.rxdrugs);
        
        // this.navCtrl.push(CheckoutPage);
    }
    requestRX(isItFill = false) {
        
        if (this.checkIfPhoneVerifed()){

        }else{
            return false;
        }

        if(this.cartOrders.rxdrugs.length > 0){

            // at this point order was already stored in db in with order order-in-cart status, for somereason if order not stored
            // store with order-in-cart staus, untill rx request has been sent, we sont have to make the order type as rx
            this.navCtrl.push(RequestPxPage, {actionId: this.tempStorage.cart.remoteId, isItFill: isItFill});
            if(1 === 1){
                // skipping storing 
                return false;
            }
            this.submitted = true;
          //  this.deliveryService.mobiToast("please wait, storing your cart...", "success");
        //  console.log(this.cartOrders.otcdrugs);
        //  console.log(this.cartOrders.rxdrugs);
        let orderData : any = {};
            orderData.user_id = this.user_id;
            orderData.items   = {
                otcdrugs : [],//this.cartOrders.otcdrugs,
                rxdrugs : []//this.cartOrders.rxdrugs
            };
            orderData.medications  = this.cartOrders.medications; //by NDC
            orderData.pharmacy     = this.cartOrders.cartPharmacy;
            orderData.pharmacy_id = this.cartOrders.pharmacy_id;
            orderData.total_amount = this.cartOrders.cartvalue;
            orderData.total_saving = this.cartOrders.pricediff;
          //  orderData.payment_status = "not-paid";
          //  orderData.payment_id     = "";
            orderData.order_status   = "rx-requested";
            orderData.order_type   = "rx";
            orderData.activities = this.cartOrders.activities;
            if (orderData.activities === undefined || orderData.activities == null) {
                orderData.activities = [];
            } else {
            orderData.activities.push({msg: "rx-requested", created_at: moment().format("X")});
            }
            orderData.deliveryInfo = this.cartOrders.deliveryInfo;
            orderData.cartHasControlledMedicine = this.cartOrders.cartHasControlledMedicine;

            orderData.rx             = [];
          //  orderData.payment_type   = "";

        this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId).then((result)=>{
            this.submitted = false;   
            let resultData : any =  result;
                if(resultData.updatedId !== undefined){ // || resultData.updatedId !== undefined
                    this.navCtrl.push(RequestPxPage, {actionId: resultData.updatedId});
                }else{
                    this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
                }
        })

        }else{
            //this.navCtrl.push(RequestPxPage); // if no otc drug
            this.deliveryService.mobiToast("there is no Rx drugs in your cart...", "danger");

        }
    }

    uploadRX() {
        if (this.checkIfPhoneVerifed()) {

        } else {
            return false;
        }
        //
        this.navCtrl.push(UploadRxPage);
    }

    setuploadRX() {
        this.uploadedRXimages                         = [];
        let getImages                               : any = [];
            getImages                         = this.tempStorage.uploadrx;
            if(getImages === undefined){
                getImages = [];
                this.tempStorage.uploadrx = [];

            }
            console.log(getImages);
            for(var i = 0; i <= getImages.length -1; i++) {
                let item = {
                    originalpath: getImages[i].originalpath,
                    path: this.sanitization.bypassSecurityTrustStyle("url(" + getImages[i].originalpath + ")")
                }
                this.uploadedRXimages.push(item);
            }
          //  console.log(this.uploadedRXimages);       
    }

    removeImage(image: any, index: any) {
        this.deliveryService.mobiconfirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.uploadedRXimages.splice(index, 1);
                this.tempStorage.uploadrx         = this.uploadedRXimages;
            }
        });
    }

    zoomImage(image: any) {
        let searchModal = this.modalCtrl.create(ImageSlidePage, {url: image.originalpath});
        searchModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
            }                
        });
        searchModal.present();
    }

    removeDrug(cartsingle: any, index: any) {
        console.log(cartsingle);
        console.log(this.cartOrders);
        console.log(this.tempStorage.cart);
       

        let mediName = this.cartOrders.medications[cartsingle.ndc].BN || this.cartOrders.medications[cartsingle.ndc].AN
        let alertmsg : any = "Are you sure to remove " + mediName + "?";
        this.deliveryService.mobiconfirm(alertmsg).then(value => {
            if (value) {
 
                // should be rmeoved from temp storage this.tempStorage.cart medications.byNdc, medications.drugs, pharmacy.pricing
                let currIndex = -1;
                for(var i = 0; i < this.tempStorage.cart.medications.drugs.length; i++ ){
                    if(this.tempStorage.cart.medications.drugs[i].NDC == cartsingle.ndc){
                        currIndex = i;        
                        break;
                    }
                }

                let pharCurrIndex = -1;
                for(var j = 0; j < this.tempStorage.cart.pharmacy.pricing.length; j++ ){
                    if(this.tempStorage.cart.pharmacy.pricing[j].ndc == cartsingle.ndc){
                        pharCurrIndex = j;        
                        break;
                    }
                }

                
                console.log(currIndex);
                if (currIndex !== -1) {
                     
                    this.tempStorage.cart.medications.drugs.splice(currIndex, 1);
                    this.tempStorage.cart.pharmacy.pricing.splice(pharCurrIndex, 1);
                    this.tempStorage.cart.medications.byNdc[cartsingle.ndc] = null;
                    delete  this.tempStorage.cart.medications.byNdc[cartsingle.ndc];
                    //this.tempStorage.cart.keys.splice(currIndex, 1);

                }
                
                this.getCart();
            }
        });
        
    }
    removeMembership() {
        let alertmsg : any = "Are you sure to remove membership" + "?";
        this.deliveryService.mobiconfirm(alertmsg).then(value => {
            if (value) {
                this.tempStorage.clearCartMembership();
                this.getCart();
            }
        });
    }
    removeFilledRx(){
        let alertmsg: any = "Are you sure to remove Rx detail" + "?";
        this.deliveryService.mobiconfirm(alertmsg).then(value => {
            if (value) {
                this.tempStorage.cart.fillpxFormData = {};
                this.getCart();
            }
        });
    }

    membership() {
        this.navCtrl.push(MembershipPlanPage);
    }

    changeLocation() {

        //  this.pharmacySelected = "";

        const modal = this.modalCtrl.create(customAutoComplete, { ismodel: true, myLocationObj: {}, template: "change_location", placeHolder: "Search Pharmacy", templateBasedData: {} });
        modal.onDidDismiss(data => {
            //console.log(data);
            if (data && data !== undefined && data.address !== undefined && data.cords !== undefined) {
                //this.currentLocation = data.address;
                //this.myLocationObj = data.cords;
                this.rxPickUpLocation.text = data.address;
                this.rxPickUpLocation.latitude = data.cords.latitude;
                this.rxPickUpLocation.longitude = data.cords.longitude;
                this.tempStorage.cart.rxPickup.address = this.rxPickUpLocation;
                console.log(data);
             //   this.tempStorage.cart.deliveryInfo.address.text = this.currentLocation;
              //  this.tempStorage.cart.deliveryInfo.address.latitude = this.myLocationObj.latitude;
              //  this.tempStorage.cart.deliveryInfo.address.longitude = this.myLocationObj.longitude;
            }
            // this.pharmacySelected = data;

        });
        modal.present();

    }

    takeToSearch(){
        this.navCtrl.setRoot(SearchMedicinesPage);        
    }

}
