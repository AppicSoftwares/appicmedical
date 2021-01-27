import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { AuthenticationPage } from "../auth/authentication/authentication";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html",
})
export class WelcomePage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private androidplatform: Platform) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad WelcomePage");
  }

  auth() {
    this.navCtrl.push(AuthenticationPage);
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }

}
