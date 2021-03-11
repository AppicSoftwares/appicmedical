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
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


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
    private androidplatform: Platform,
    private http: HttpClient,
  ) {
    this.formGroup = this.formbuilder.group({
      fname:['',Validators.required],
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
    addfamilymemeber(data): Observable<any>{
      return this.http.post('http://13.234.88.229/tb/add/member',data);
      
    }
    onSend(){
      const email = this.formGroup.get("email").value;
       const formdata = new FormData();
       formdata.append('user_id',localStorage.getItem('userId'));
       formdata.append('to',email);
       formdata.append('relationWithMe',this.formGroup.get("relationWithMe").value);
       formdata.append('relationWithThem',this.formGroup.get("relationWithThem").value);
       formdata.append('fname',this.formGroup.get("fname").value);
      this.addfamilymemeber(formdata).subscribe(res => {
          
        if (res) {
          const data = res.body;
          // const data = JSON.parse(res.body);
          let message = '';
          
          if(!data.error){
             
          // message = data.data.msg
          message='Submitted! Your family member will be added once he or she accepts the invitation.'
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
    
    }, error => {
        console.error('Error in fetching home offer : ' + error);
       
      });
 
    }
  onSend1() {

    const email = this.formGroup.get("email").value;
    const url = "add-family-member";
    const data = {
      user_id: localStorage.getItem('userId'),
      to: email,
      relationWithMe:this.formGroup.get("relationWithMe").value,
      relationWithThem:this.formGroup.get("relationWithThem").value,
      fname:this.formGroup.get("fname").value
    };
    this.viewCtrl.dismiss();
    this.apiCall
      .postData(url, data)
      .then((res:any) => {
        
        if (res) {
          const data = res.body;
          // const data = JSON.parse(res.body);
          let message = '';
          
          if(!data.error){
             
          // message = data.data.msg
          message='Submitted! Your family member will be added once he or she accepts the invitation.'
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
