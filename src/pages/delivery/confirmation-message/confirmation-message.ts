import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { DrugInfoPage } from '../drug-info/drug-info';
import { CheckoutPage } from '../checkout/checkout';
import { DrugInfoPage } from '../drug-info/drug-info';

/**
 * Generated class for the ConfirmationMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-confirmation-message',
	templateUrl: 'confirmation-message.html',
})
export class ConfirmationMessagePage {
	message 						: any;
	nextpage 						: any;
	nextpagelabel 					: any;
	constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams) {
		console.log(this.navParams);
		this.navParams.get('message');
		this.message 				= this.navParams.get('message');
		this.nextpage 				= this.navParams.get('nextpage');
		this.nextpagelabel 			= this.navParams.get('nextpagelabel');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ConfirmationMessagePage');
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	goto() {
		if(this.nextpage == 'home')
		{
			this.navCtrl.setRoot(HomePage,{},{ animate: true, direction: 'backward' });
		}
		else if(this.nextpage == 'druginfo') {
			this.navCtrl.setRoot(DrugInfoPage);
		}
	}

}
