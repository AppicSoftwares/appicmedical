import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Toast,
  ToastController,
  ViewController,
} from "ionic-angular";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiCallProvider } from "../../../providers/api-call/api-call";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";


@Component({
  selector: "page-invite-family-popup",
  templateUrl: "invite-family-popup.html",
})
export class InviteFamilyPopupPage {
  formGroup: FormGroup;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private apiCall: DeliveryServiceProvider,
    private toastCtrl: ToastController,
    private formbuilder:FormBuilder,
    private androidplatform: Platform
  ) {
    this.formGroup = this.formbuilder.group({
      email:['', [Validators.required,Validators.pattern(/\S+@\S+\.\S+/)]],
      relationWithMe:[''],
      relationWithThem:['']
    });
    
  }
  ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
 
  onSend() {
     
    const email = this.formGroup.get("email").value;
    const url = "add-family-member";
    const data = {
      user_id: localStorage.getItem('userId'),
      to: email,
      relationWithMe:this.formGroup.get("relationWithMe").value,
      relationWithThem:this.formGroup.get("relationWithThem").value,
    };
    this.viewCtrl.dismiss();
    this.apiCall
      .postData(url, data)
      .then((res:any) => {
        if (res) {
           
          const data = JSON.parse(res.body);
          let message = '';
          if(!data.error){
             
          message = data.data.msg
          }  else{
            message = data.error
          }
           
          this.toastCtrl
          .create({
            message: message,
            duration: 5000,
            position: "bottom",
            dismissOnPageChange: true,
          })
          .present();
          console.log("res data is", data);
        }
      })
      .catch((error) => {
        console.error("Error initialization is", error);
      });
  }
  onCancel() {
    this.viewCtrl.dismiss();
  }
}
