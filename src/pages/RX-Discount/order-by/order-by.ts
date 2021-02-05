import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { PricePopupPage } from '../price-popup/price-popup';

/**
 * Generated class for the OrderByPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-by',
  templateUrl: 'order-by.html',
})
export class OrderByPage {
  segement = 'distance'

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popOverCtrl: PopoverController,private androidplatform: Platform) {
  }

  pricePopUp() {
    const popOver = this.popOverCtrl.create(PricePopupPage,{},{ cssClass:'price-popup'});
    popOver.present();
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
