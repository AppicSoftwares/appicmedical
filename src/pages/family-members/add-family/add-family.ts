import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the AddFamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-family',
  templateUrl: 'add-family.html',
})
export class AddFamilyPage {

  constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFamilyPage');
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
