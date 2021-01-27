import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Generated class for the ImageSlidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-image-slide',
  templateUrl: 'image-slide.html',
})
export class ImageSlidePage {
	currentImage 						: any;
	template								: any;
	templateTitle						: any;
	constructor(private androidplatform: Platform,private sanitization: DomSanitizer, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		console.log(this.navParams.get('url'));
		if (this.navParams.get('template') !== undefined && this.navParams.get('template') !== null) {
			this.template = this.navParams.get('template');
		}else{
			this.template = "";
		}
		if (this.navParams.get('templateTitle') !== undefined && this.navParams.get('templateTitle') !== null) {
			this.templateTitle = this.navParams.get('templateTitle');
		} else {
			this.templateTitle = "Uploaded RX";
		}
		if(this.navParams.get('url') !== null) {
			this.currentImage 				= this.sanitization.bypassSecurityTrustStyle("url(" + this.navParams.get('url') + ")")
		}
		console.log(this.currentImage);
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ImageSlidePage');
	}

	dismiss() {
        this.viewCtrl.dismiss();
    }
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
