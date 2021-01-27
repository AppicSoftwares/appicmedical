import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-delivered',
  templateUrl: 'delivered.html',
})
export class DeliveredPage {

  constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
}
