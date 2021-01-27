
import {Component, OnInit} from "@angular/core";
import {Events, NavParams, NavController, Platform} from "ionic-angular";
import { TouchID } from '@ionic-native/touch-id';
import { LandingPage } from "../auth/landing/landing";
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TabPage } from '../tab/tab';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import * as moment from 'moment';

@Component({
  selector:'page-pinsetup',
  templateUrl:'pinsetup.html',
})
export class PinSetupComponent implements OnInit {
  _showLockScreen:boolean;
  passcodeWrong:boolean;
  passcodeWrongConfirm: boolean;

  passcodeAttempts:number = 0;

  enteredPasscode:string = '';
  passcode:string;
  passcodeLabel:string;

  selected:any;
  finalDigit: any;

  passcodeLabel2: string;
  confirmSetup: boolean;
  selectedConfirm: any;
  enteredPasscodeConfirm:string = '';

  sessionData: any;
  spinner: boolean;
  constructor(
    public events:Events,
    private navCtrl:NavController,
    private navParams:NavParams,
    private deliveryService: DeliveryServiceProvider,
    public tempStorage: TempStorageProvider,
    private androidplatform: Platform
  ){
    this.spinner = false;
    this._showLockScreen   = true;
    this.passcode          = navParams.data.code;
    this.passcodeLabel     = navParams.data.passcodeLabel || 'Set Pin Number';
    this.passcodeLabel2     = navParams.data.passcodeLabel2 || 'Confirm Pin Number';
    this.finalDigit = '123';

    this.confirmSetup = false;
    if(localStorage.getItem('patientData') !== null) {
      this.sessionData = JSON.parse(localStorage.getItem('patientData'));
    } else {
      this.sessionData = null;
    }
  }

  ngOnInit() {
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  allClear():void {
    this.enteredPasscode = "";
  }

  remove():void {
    this.enteredPasscode = this.enteredPasscode.slice(0, -1);
  }

  digit(digit:any):void {
    this.selected = +digit;
    this.enteredPasscode += ''+digit;
    
    console.log(this.enteredPasscode);
    // if (this.enteredPasscode === this.finalDigit) {
    //   this.navCtrl.setRoot(LandingPage);
    // }
    if (this.enteredPasscode.length >= 3) {
      this.passcodeWrong = true;
      this.confirmSetup = true;
    }
  }

  digitConfirm(digit:any):void {
    this.selectedConfirm = +digit;
    this.enteredPasscodeConfirm += ''+digit;
    console.log(this.enteredPasscodeConfirm);
    if (this.enteredPasscodeConfirm.length >= 3) {
      if (this.enteredPasscodeConfirm === this.enteredPasscode) {
        localStorage.setItem('localpin', this.enteredPasscode);
        this.deliveryService.mobiToast("Your Pin Successfully Generated", "success");
        this.enteredPasscode = '';
        this.enteredPasscodeConfirm = '';
        this.doLogin(this.sessionData);
        setTimeout(() => {
          this.navCtrl.setRoot(TabPage);
        }, 1000);
      } else {
        this.enteredPasscode = '';
        this.enteredPasscodeConfirm = '';
        this.passcodeWrong = true;
        this.confirmSetup = false;
        this.deliveryService.mobiToast("Pin not matches please try again", "danger");
        // return false;
      }
      
    }
  }

  allClear1():void {
    this.enteredPasscodeConfirm = "";
  }

  remove1():void {
    this.enteredPasscodeConfirm = this.enteredPasscodeConfirm.slice(0, -1);
  }

  doLogin(resultData) {
    this.tempStorage.setAuthSession(resultData);
    // set member ship
    if (resultData.membership !== undefined) {
        let currentTime = moment().format("X");
        if (resultData.membership.membership_end !== undefined && currentTime <= resultData.membership.membership_end) {
            this.tempStorage.setProfileMembership('active', "premium");
        } else {
            this.tempStorage.setProfileMembership('active', "free");
        }
    } else {
        this.tempStorage.setProfileMembership('active', "free");
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
            let pharmacy = "";
            let pharmacy_id = "";
            let remoteId = "";

            remoteId = cartData._id;
            this.tempStorage.cart.drugs = drugs;
            this.tempStorage.cart.keys = keys;

            this.tempStorage.cart.pharmacy = cartData.pharmacy;
            this.tempStorage.cart.pharmacy_id = cartData.pharmacy_id;
            this.tempStorage.cart.cartHasControlledMedicine = cartData.cartHasControlledMedicine;

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

        } else {

        }

        let filterObj: any = {};
        filterObj.case = "admin-config";
        filterObj.postData = {

        }
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