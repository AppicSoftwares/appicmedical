import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
/**
 * Generated class for the DraiPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-drai-popup',
  templateUrl: 'drai-popup.html',
})
export class DraiPopupPage {

  constructor(private androidplatform: Platform,public platform: Platform, public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,private inappbrowser:InAppBrowser) {
    
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  ok(){
    this.viewCtrl.dismiss();
  }
  openUrl() {
    this.inappbrowser.create("https://covid19.infermedica.com/en/#0-99990",'_blank','location=no,toolbar=yes');
  }  
}
