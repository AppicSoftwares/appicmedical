import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmationMessagePage } from '../confirmation-message/confirmation-message';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { AppSettings } from '../../../app/settings';
import * as moment from 'moment';
import { HomePage } from '../home/home';

/**
 * Generated class for the RequestPxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-px',
  templateUrl: 'request-px.html',
})
export class RequestPxPage {
    httpurl                                         : any = AppSettings.API_ENDPOINT;
	cartDrugs 										: any;
	cartDrugsKey 									: any;
	cartPharmacy 									: any;
    cartMembership                                  : any;
	otcdrugs 										: any;
	rxdrugs 										: any;
    ismember                                        : any;
    orderTotal                                      : any;
    requestpxFormData 								: any;
    fillpxFormData                                  : any;
    doctorSettings                                  : any;
    searchOptionData 								: any;
    displayError 									: any;
    currentDoctorData                               : any;
    doctorNotFound                                  : any = false;
    actionId                                        : any;
    cartOrders                                      : any; 
    user_id                                         : any;   
    submitted : any = false;
    isItFill  : any = false;
    pageTitle  : any;


	constructor(private androidplatform: Platform,public deliveryService: DeliveryServiceProvider, public tempStorage: TempStorageProvider, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
        if(localStorage.getItem('socialLogin') == 'true'){
            this.user_id =  localStorage.getItem('userId');
          }
      else{
        this.user_id = this.tempStorage.authsession.userdata.user_id;
      }
        this.cartDrugs                                 = this.tempStorage.cart.drugs;
        this.cartDrugsKey                              = this.tempStorage.cart.keys;
        this.cartPharmacy                              = this.tempStorage.cart.pharmacy;
        this.cartMembership                            = this.tempStorage.cart.membership;
        this.displayError 							   = false;
        this.submitted                                  = false;
        this.actionId  =  this.navParams.get('actionId');
        this.isItFill  =  this.navParams.get('isItFill');  // true is fill form
        if(this.isItFill){

           
            this.fillpxFormData 			= this.formBuilder.group({
                doctor_name: ["", Validators.required],
                clinicalAddress: ["", Validators.required],
                phone:["", Validators.required],
                email:[""],
                pharmacyName:["", Validators.required],
                pharmacyAddress:["", Validators.required],
                pharmacyPhone:["", Validators.required]
               
            });
            console.log(this.tempStorage.cart.fillpxFormData);
            this.fillpxFormData.patchValue(
                {
                    pharmacyName: this.cartPharmacy.name,
                    pharmacyAddress: this.cartPharmacy.street1+" "+this.cartPharmacy.street2+" "+this.cartPharmacy.city+" "+this.cartPharmacy.zip+" "+this.cartPharmacy.state,
                    pharmacyPhone: this.cartPharmacy.phoneNumber,
                    doctor_name: ((this.tempStorage.cart.fillpxFormData.doctor_name) ? this.tempStorage.cart.fillpxFormData.doctor_name:""),
                    clinicalAddress: ((this.tempStorage.cart.fillpxFormData.clinicalAddress) ? this.tempStorage.cart.fillpxFormData.clinicalAddress : ""),
                    phone: ((this.tempStorage.cart.fillpxFormData.phone) ? this.tempStorage.cart.fillpxFormData.phone : ""),
                    email: ((this.tempStorage.cart.fillpxFormData.email) ? this.tempStorage.cart.fillpxFormData.email : ""),
                    
                });


            this.pageTitle = "Fill Prescription Detail";

        }else{

            this.requestpxFormData 			= this.formBuilder.group({
                reason                        	: ["", Validators.required],
                doctor							: ["", Validators.required],
                name: [""],
                clinicalAddress: [""],
                phone:[""],
                email:[""]
            });

            this.pageTitle = "Request Prescription";

            this.currentDoctorData                         = {hospital: "", name: "", address: ""};
        this.searchOptionData 				= [];
        var self = this;
        let myData : any;
        myData = {
            url: this.httpurl + 'doctors/',
            remoteFilter: true,
            dataType: 'json',
            processResponse: function (data) {
                var i,
                    item,
                    ret = [];
                if (data) {
                    for (i = 0; i < data.length; i++) {
                        item = data[i];
                        let obj : any = {
                            value               : item._id,
                            name				: item.name,
                            text                : item.name,
                            phone               : item.phone,
                            hospital        	: item.hospital,
                            address				: item.address
                        }
                        
                        self.searchOptionData[item._id] = obj;
                        ret.push({
                            value: item._id,
                            name: item.name,
                            phone: item.phone,
                            text: "Dr. " + item.name,
                            html: '<div class="pick-doctor-name">Dr. ' + item.name + '</div><div class="pick-doctor-address">' + ((item.address)?item.address:"") + '</div>'
                        });
                    }
                }

                return ret;
            }
        };
        this.doctorSettings = {
            multiline: 2,
            height: 50,
            data: myData,
            filter: true,
            theme: 'ios',
            onSet: function (event, inst) {
                self.setDoctor(inst.getVal());
                
            },
            buttons: [{
                    text: "Add your doctor?",
                    cssClass: 'mbsc-fr-btn custom',
                    handler: function (event, inst) {
                    //    console.log(inst);
                        inst.cancel();
                        
                        self.addNewDoctor();
                    }
                },
                'set',
                'cancel'
            ]
        };

        }
        
        
        
        if(this.cartPharmacy === null) {
            this.cartPharmacy                          = null;
            this.cartDrugs                             = [];
            this.cartDrugsKey                          = [];
            this.otcdrugs 							   = [];
            this.rxdrugs 							   = [];
        }
        else{
            let cartData                               = this.deliveryService.cartOrders();
        	this.otcdrugs 							   = cartData.otcdrugs;
            this.rxdrugs 							   = cartData.rxdrugs;
            this.orderTotal                            = cartData.cartvalue;
        }
	}

    addNewDoctor() {
        this.doctorNotFound = true;
        this.currentDoctorData                         = {};
        this.requestpxFormData.patchValue({doctor: ""});

        // remove control
        this.requestpxFormData.removeControl('doctor',this.formBuilder.control(''));
        this.requestpxFormData.removeControl('reason',this.formBuilder.control(''));

        this.requestpxFormData.removeControl('name',this.formBuilder.control(''));
        this.requestpxFormData.removeControl('clinicalAddress',this.formBuilder.control(''));
        this.requestpxFormData.removeControl('phone',this.formBuilder.control(''));
        this.requestpxFormData.removeControl('email',this.formBuilder.control(''));
       
        // add control
        this.requestpxFormData.addControl('doctor',this.formBuilder.control(''));
        this.requestpxFormData.addControl('reason', this.formBuilder.control('', Validators.required));

        this.requestpxFormData.addControl('name', this.formBuilder.control('',  Validators.required));
        this.requestpxFormData.addControl('clinicalAddress', this.formBuilder.control('',  Validators.required));
        this.requestpxFormData.addControl('phone', this.formBuilder.control('',  Validators.required));
        this.requestpxFormData.addControl('email', this.formBuilder.control('',  Validators.required));
        
        this.requestpxFormData.updateValueAndValidity();
         
         console.log("new doctor");
         console.log(this.requestpxFormData.value);
         console.log(this.requestpxFormData);
    }
	EditDoctor() {
		console.log("edit doctor");
	}
	ionViewDidLoad() {
	console.log('ionViewDidLoad RequestPxPage');
	}

    closeNewDoctor(){
        this.doctorNotFound=false;

         // remove control
         this.requestpxFormData.removeControl('doctor',this.formBuilder.control(''));
         this.requestpxFormData.removeControl('reason',this.formBuilder.control(''));
 
         this.requestpxFormData.removeControl('name',this.formBuilder.control(''));
         this.requestpxFormData.removeControl('clinicalAddress',this.formBuilder.control(''));
         this.requestpxFormData.removeControl('phone',this.formBuilder.control(''));
         this.requestpxFormData.removeControl('email',this.formBuilder.control(''));
        
         // add control
         this.requestpxFormData.addControl('doctor', this.formBuilder.control('',  Validators.required));
         this.requestpxFormData.addControl('reason', this.formBuilder.control('',  Validators.required));
 
         this.requestpxFormData.addControl('name', this.formBuilder.control(''));
         this.requestpxFormData.addControl('clinicalAddress', this.formBuilder.control(''));
         this.requestpxFormData.addControl('phone', this.formBuilder.control(''));
         this.requestpxFormData.addControl('email', this.formBuilder.control(''));

        this.requestpxFormData.updateValueAndValidity();
        
    }

	setDoctor(value: any) {
        console.log(value);
        this.currentDoctorData             = this.searchOptionData[value];
        console.log(this.searchOptionData[value]);
	}
	sendRequest() {
		if (!this.requestpxFormData.valid) {
            this.displayError = true;
            return false;   
        }
       // console.log(this.requestpxFormData.value);
        let request_data                   : any = {drugs: this.rxdrugs, reason: this.requestpxFormData.value.reason}
        let doctor_request                 : any = {
                                            name:   this.requestpxFormData.value.name, 
                                            clinical_address: this.requestpxFormData.value.clinicalAddress,
                                            email:  this.requestpxFormData.value.email, 
                                            phone:  this.requestpxFormData.value.phone
                                        };
        let postParams : any = {};
            postParams.user_id             = this.tempStorage.user_id;
            postParams.request_from        = this.tempStorage.user_id;
            postParams.created_by          = this.tempStorage.user_id;
            postParams.actioned_id         = this.actionId;
            postParams.request_to          = this.requestpxFormData.value.doctor;
            postParams.request_type        = "rx";
            postParams.request_status      = 'initiated';
            postParams.request_data        = request_data;

            postParams.new_doctor           = this.doctorNotFound;
            postParams.new_doctor_requested = doctor_request;
            postParams.created_on          = moment().format('X');

            this.submitted = true;
            
        this.deliveryService.requestRX(postParams).then((result) => {
          //  console.log(result);

          // console.log(this.tempStorage.cart);
       /* for(var x = 0; x <= this.rxdrugs.length - 1; x++) {
            let currValue: any = this.rxdrugs[x].drug.value;
            console.log(this.rxdrugs[x].drug.value);
            let currIndex: any = this.tempStorage.cart.keys.indexOf(currValue);
                if (currIndex !== -1) {
                    this.tempStorage.cart.drugs.splice(currIndex, 1);
                    this.tempStorage.cart.keys.splice(currIndex, 1);
                }
        }
        if(!this.tempStorage.cart.keys.length) {
            this.tempStorage.cart.pharmacy         = null;
        }*/
        this.submitted = false;

        this.updateOrderTable();
        
        

        });
       
    }
    ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
    addRxObj(){
        console.log( this.fillpxFormData.value);
        if (!this.fillpxFormData.valid) {
            this.displayError = true;
            return false;   
        }
        this.tempStorage.cart.fillpxFormData = this.fillpxFormData.value;
        // update doc detail in temp storage 



        this.navCtrl.pop();
    }
    
    updateOrderTable(){
        
        this.cartOrders     = this.deliveryService.cartOrders();

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
           // orderData.payment_status = "not-paid";
           // orderData.payment_id     = "";
            orderData.order_status   = "rx-requested";
            orderData.order_type   = "rx";
            orderData.activities = this.cartOrders.activities;
            if (orderData.activities === undefined || orderData.activities == null) {
                orderData.activities = [];
            } else {
                orderData.activities.push({ msg: "rx-requested", created_at: moment().format("X"), by: this.user_id });
            }
           
            orderData.deliveryInfo = this.cartOrders.deliveryInfo;

            orderData.rx             = [];
           // orderData.payment_type   = "";

            this.submitted = true;   
        this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId).then((result)=>{
            this.submitted = false;   
            let resultData : any =  result;
                if(resultData.updatedId !== undefined){ // || resultData.updatedId !== undefined
                    //this.navCtrl.push(RequestPxPage, {actionId: resultData.updatedId});

                    // coped from rx ssubmit
                    this.tempStorage.clearCart();

                   // console.log(this.tempStorage.cart);
                    let updatedCart: any = this.deliveryService.cartOrders();

                    let params = {
                        message                 : "Your prescription request has been sent to doctor. <br /> We will notify as soon as it is approved.",
                        nextpage                : 'home',
                        nextpagelabel           : 'Done'
                    }
                    if(updatedCart.cartvalue > 0) {
                        params.nextpage         = 'druginfo';
                        params.nextpagelabel    = 'Cart info';
                    }
                // console.log(postParams);
                    let postData: any = {};
                    postData.msg = "New Rx request from MediPocket Patient";
                    postData.action = "rx-request";
                    postData.purpose = "notify";
                    postData.to = this.currentDoctorData.phone; //this.profileInfo.phone,
                    postData.user_id = this.user_id,
                        // this.deliveryService.mobiToast('Sending OTP, Please wait...', 'success');
                        this.deliveryService.registerGetOTP(postData).then((result) => {


                        });

                    this.navCtrl.setRoot(ConfirmationMessagePage, params)


                }else{
                    this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
                }
        })

        


    }

    warningChangePhamracy() {
        this.deliveryService.mobiconfirm("Please contact your doctor to change the phamarcy, Yes, will cancel the order?").then(value => {
            if (value) {

                this.submitted = true;
                this.cartOrders = this.deliveryService.cartOrders();
                
                let orderData: any = {};
                orderData.user_id = this.user_id;
                orderData.order_status = "cancelled";
                
                orderData.activities = this.cartOrders.activities;
                if (orderData.activities === undefined || orderData.activities == null) {
                    orderData.activities = [];
                } else {
                    orderData.activities.push(
                        { msg: "order cancelled, Pharmacy required", created_at: moment().format("X"), by: this.user_id }
                    );
                }
                this.deliveryService.mobiToast("Cancelling your order, Please wait ...", "danger").then((result) => {
                    this.submitted = false;
                    this.tempStorage.clearCart();
                    this.navCtrl.setRoot(HomePage);
                });
                this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId).then((result) => {
                    this.submitted = false;   

                });   
            }
        });
    }

}
