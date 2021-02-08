import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeliveredPage } from '../../delivery/delivered/delivered';

/**
 * Generated class for the PricePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-price-popup',
  templateUrl: 'price-popup.html',
})
export class PricePopupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PricePopupPage');
  }
  deliverd() {
    this.navCtrl.push(DeliveredPage)
  }
}
