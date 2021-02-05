import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-health-info-popup',
  templateUrl: 'health-info-popup.html',
})
export class HealthInfoPopupPage {

  constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ok(){
    this.viewCtrl.dismiss();
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
}
