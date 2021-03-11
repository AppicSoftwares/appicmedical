import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  PopoverController,
} from "ionic-angular";
import { InviteFamilyPopupPage } from "../invite-family-popup/invite-family-popup";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { FileUploadProvider } from "../../../providers/file-upload/file-upload";
import { TempStorageProvider } from "../../../providers/temp-storage/temp-storage";

import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "page-view-family",
  templateUrl: "view-family.html",
})
export class ViewFamilyPage {
  memberList = [];
  name: string;
  patientData: any;
  loadUserImageParam:string='';
  userImageURL:any ="https://medipocket-upload-file.s3.amazonaws.com/";
  user_id: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popOverCtrl: PopoverController,
    private apiCall: DeliveryServiceProvider,
    private androidplatform: Platform,
    private fileUpload: FileUploadProvider,
    public tempStorage: TempStorageProvider,
    private http: HttpClient,
  ) {
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    //upload image
    this.fileUpload.getDownloadImageSubject().subscribe(data =>{
      this.loadUserImageParam = '?random='+Math.random();
     console.log("random"+ this.loadUserImageParam);
   });
    this.getFamily();
  }

  ionViewDidEnter() {
    this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    console.log("test");
    this.patientData = JSON.parse(localStorage.getItem('patientData'));
    this.name = this.patientData.profileData.name ? this.patientData.profileData.name :  localStorage.getItem('name');
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  getfamilyApi(id): Observable<any>{
    return this.http.get('http://13.234.88.229/tb/global/raxiona/'+id);
    
  }
  getFamily(){
   
     
  // if(localStorage.getItem('updatePopup') != 'true'){ 
  
    this.getfamilyApi(this.user_id).subscribe(res => {
        
      if (res.status == 0) {
        // const data = JSON.parse(res.body)
           
        
      }else{
         
        this.memberList = res;
         
        console.log("memberList is", this.memberList);
      }
  
  }, error => {
      console.error('Error in fetching home offer : ' + error);
     
    });
  // }
  }
  getFamily1() {
    const url = "get-family-request";
    const data = {
      
      user_id: localStorage.getItem("userId"),
    };
     
    this.apiCall
      .postData(url, data)
      .then((res: any) => {
         
        if (res.status == 0) {
          // const data = JSON.parse(res.body)
             
          
        }else{
           
          this.memberList = res;
           
          console.log("memberList is", this.memberList);
        }

      })
      .catch((error) => {
        console.error("Error initialization is", error);
      });
  }
  inviteFamily() {
    const popOver = this.popOverCtrl.create(
      InviteFamilyPopupPage,
      {},
      { cssClass: "invite-family-popup" }
    );
    popOver.present();
  }
}
