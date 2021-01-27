import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { ConfirmationMessagePage } from '../../pages/delivery/confirmation-message/confirmation-message';
import { CheckoutPage } from '../delivery/checkout/checkout';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the MembershipCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-membership-card',
	templateUrl: 'membership-card.html'
})
export class MembershipCardPage {
	memberdetails: any;
	membershipdata: any;
	cartOrders: any;
	membershipCreatedId: any = '';
	toWhom: any = 'family';
	constructor(
		public socialSharing: SocialSharing,
		private deliveryService: DeliveryServiceProvider,
		public tempStorage: TempStorageProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		private androidplatform :Platform
	) {
		this.memberdetails = this.tempStorage.cart.membership;
		this.membershipdata = this.tempStorage.cart.membershipdata;
		this.membershipCreatedId = this.navParams.get('membershipCreatedId');
		this.cartOrders = this.deliveryService.cartOrders();
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	ionViewDidLoad() {
		console.log('ionViewDidLoad MembershipCardPage');

		this.memberdetails = this.tempStorage.cart.membership;
		this.membershipdata = this.tempStorage.cart.membershipdata;
		this.cartOrders = this.deliveryService.cartOrders();
	}
	ionViewDidEnter() {}

	continue() {
		let params: any = {
			message:
				'Your membership has been created will be activated upon successful payment added in cart.',
			nextpage: 'druginfo',
			nextpagelabel: 'Go to Cart'
		};
		console.log(this.memberdetails);
		if (this.memberdetails.plan == 'free') {
			params.message = 'Your membership has been created';
			if (this.cartOrders.cartvalue <= 0) {
				params.nextpage = 'home';
				params.nextpagelabel = 'Done';
			}
			this.navCtrl.push(ConfirmationMessagePage, params);
		} else {
			this.navCtrl.push(CheckoutPage, {
				trigger: 'membershippayment',
				membershipCreatedId: this.membershipCreatedId
			});
		}
	}

	shareMpCard() {
		let msg =
			'Show this with your prescription at the pharmacy counter and receive the instant savings.';
		let shareImageUrl = {
			family:
				'https://www.mymedipocket.com/assets/img/pharmacy-savings-card-front.png',
			pet:
				'https://www.mymedipocket.com/assets/img/pharmacy-savings-card-front-pet.png'
		};
		//console.log(this.httpurl +"assets/pdf/" +this.PoDetail.po_ref +".pdf");
		this.socialSharing
			.shareWithOptions({
				message: msg,
				url: 'https://mymedipocket.com/',
				files: [shareImageUrl[this.toWhom]],
				/////data/user/0/techbee.otpc/753025443.pdf"
				chooserTitle: 'MediPocket Pharmacy Discount Card'
			})
			.then(result => {
				// this.analytics.trackEvent("Share Success" , result.app);
			})
			.catch(err => {
				/// this.analytics.trackEvent("Share Fail" , JSON.stringify(err));
			});
	}
	okay(){
		this.navCtrl.pop();
	}
}
