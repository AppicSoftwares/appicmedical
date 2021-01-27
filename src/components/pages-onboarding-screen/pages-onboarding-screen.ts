import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActionSheetController, AlertController, NavController, Platform, ToastController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import { Base64 } from '@ionic-native/base64';
/**
 * Generated class for the PagesOnboardingScreenComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pages-onboarding-screen',
  templateUrl: 'pages-onboarding-screen.html'
})
export class PagesOnboardingScreenComponent {

  text: string;

  constructor(private navCtrl : NavController,private androidplatform: Platform,private base64: Base64, private sanitization: DomSanitizer, private actionSheetCtrl: ActionSheetController, private camera: Camera, private file: File, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    
    console.log('Hello PagesOnboardingScreenComponent Component');
    this.text = 'Hello World';
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
