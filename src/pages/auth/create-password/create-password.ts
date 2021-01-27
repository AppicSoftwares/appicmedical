import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SigninPage } from '../signin/signin';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { AuthenticationPage } from '../authentication/authentication';

@Component({
    selector: 'page-create-password',
    templateUrl: 'create-password.html',
})
export class CreatePasswordPage {
    passwordForm: any;
    showSpinner: any;
    displayError: any;
    userid: any;
    constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private deliveryService: DeliveryServiceProvider) {
        this.showSpinner = false;
        this.displayError = false;
        this.userid = this.navParams.get('user_id');
        this.passwordForm = this.formBuilder.group({
            userid: [this.userid],
            password: ["", Validators.required],
            confirmpassword: ["", Validators.required]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreatePasswordPage');
    }
    ionViewWillLeave(){
        let backAction = this.androidplatform.registerBackButtonAction(() => {
          this.navCtrl.pop();
        });
      }
    createPassword() {
        console.log(this.passwordForm.value);
        if (!this.passwordForm.valid) {
            this.displayError = true;
            return false;
        }
        if (this.passwordForm.value.password != this.passwordForm.value.confirmpassword) {
            this.deliveryService.mobiToast("Password does not match!", "danger");;
            return false;
        }
        this.showSpinner = true;
        let postData: any = {};
        postData.password = this.passwordForm.value.password,

            this.deliveryService.updateProfileInfo(postData, this.passwordForm.value.userid).then((result) => {
                // this.deliveryService.generatePassword(postData).then((result) => { 
                let resultData: any;
                resultData = result;

                console.log(resultData);
                this.showSpinner = false;
                if (resultData.data !== undefined) {
                    this.deliveryService.mobiToast("Password has been sent, redirecting...", "success").then(() => {
                        this.navCtrl.setRoot(AuthenticationPage, {});
                    });

                } else {
                    this.deliveryService.mobiToast("Technical issue!!!", "danger").then(() => {

                    });
                }
            }).catch(error => {
                console.log('Error initialization is', error);
            });;
    }

}
