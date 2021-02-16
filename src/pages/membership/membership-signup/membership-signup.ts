import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { DrugInfoPage } from '../../../pages/delivery/drug-info/drug-info';
import { ConfirmationMessagePage } from '../../../pages/delivery/confirmation-message/confirmation-message';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { MembershipCardPage } from '../../../pages/membership-card/membership-card';
import * as moment from 'moment';

/**
 * Generated class for the MembershipSignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-membership-signup',
  templateUrl: 'membership-signup.html',
})
export class MembershipSignupPage {
	signupFormData 						: any;
	today 								: any = new Date().toISOString();
	displayError 						: any;
	memberdetails						: any;
	cartOrders 							: any;
	user_id : any;
	profileInfo : any;
	submitted : boolean = false;

	constructor(private androidplatform :Platform,public tempStorage: TempStorageProvider, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, private deliveryService: DeliveryServiceProvider) {
	//	let dob 						= moment(this.tempStorage.profile.dob, 'X').toISOString();
		// console.log(moment(this.tempStorage.profile.dob, 'X').toISOString())
		
		this.signupFormData 			= this.formBuilder.group({
			name: [this.tempStorage.authsession.userdata.profileData.name, Validators.required],
			email: [this.tempStorage.authsession.userdata.profileData.email, Validators.required],
			dob                        		: ["", Validators.required],
			phone							:[""],
            startdate                       : [this.today, Validators.required]
        });
		this.memberdetails 					= this.tempStorage.cart.membership;        
		this.cartOrders						= this.deliveryService.cartOrders();
		if(localStorage.getItem('socialLogin') == 'true'){
            this.user_id =  localStorage.getItem('userId');
          }
      else{
        this.user_id = this.tempStorage.authsession.userdata.user_id;
      }
		this.profileInfo = {};
		this.getProfileInfo();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MembershipSignupPage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	getProfileInfo() {
		
		if (this.tempStorage.authsession.userdata.profileIncompelete == false && this.tempStorage.authsession.userdata.profileData !== undefined){
		       this.profileInfo = {...this.tempStorage.authsession.userdata.profileData};
			     this.profileInfo.dob = moment.unix(this.profileInfo.dob).toISOString();
		    //  console.log(this.profileInfo);
				this.signupFormData.patchValue(
					{
						name: this.profileInfo.name,
						dob: this.profileInfo.dob,
						phone: this.profileInfo.phone,
						email: this.profileInfo.email
					}
				);
		}
		/*
		this.deliveryService.profileInfo('patient',this.user_id).then((result)=>{
				let resultData : any = {}; 
				resultData    = result;
				if(resultData.data !== undefined){
					 
					   this.profileInfo = resultData.data;
					   this.profileInfo.dob = moment.unix(resultData.data.dob).toISOString();
					 //  console.log(this.profileInfo);
						this.signupFormData.patchValue(
							{
								name: this.profileInfo.name,
								dob:  this.profileInfo.dob,
								phone: this.profileInfo.phone,
								email: this.profileInfo.email
							}
							);
						 

				}else{

				} 

		});	*/

	}

	signup() {

		//console.log(this.signupFormData.value);
		//console.log(this.tempStorage.authsession);
		if (!this.signupFormData.valid) {
            this.displayError = true;
            return false;   
		}
		
		let memberShipData : any = {};
        let params: any = {
			message 				: "Your membership has been created will be activated upon successful payment added in cart.",
			nextpage 				: 'druginfo',
            nextpagelabel           : 'Cart info'
		}
		if(this.memberdetails.plan == 'free') {
			params.message 				= "Your membership has been created";
			if(this.cartOrders.cartvalue <= 0) {
				params.nextpage 			= 'home';
				params.nextpagelabel 		= 'done';
			}
			memberShipData.payment_status = "not-required";
		} else {
			memberShipData.payment_status = "initiated";
		}

		this.submitted = true;

		
		memberShipData.plan = this.memberdetails.plan
		memberShipData.plan_id = "1";
		memberShipData.user_id = this.user_id;
		
		this.deliveryService.createMememberShip(memberShipData).then((response)=>{
			let resultData : any = {};
			this.submitted = false;
			resultData = response;
			if(resultData.insertedId !== undefined){
				this.tempStorage.cart.membershipdata = this.signupFormData.value;
				this.navCtrl.setRoot(MembershipCardPage, {membershipCreatedId: resultData.insertedId});
				// this.navCtrl.setRoot(ConfirmationMessagePage, params)	
			}else{
				this.deliveryService.mobiToast("some technicall issue, please contact adminstrator", "danger");
			}

		})
		
		
		// this.navCtrl.push(DrugInfoPage);
	}


}
