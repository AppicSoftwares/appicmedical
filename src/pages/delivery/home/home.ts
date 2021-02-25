import { Component, NgZone, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  Content,
  PopoverController,
  Platform,
  Slides,
} from "ionic-angular";
import { SearchMedicinesPage } from "../search-medicines/search-medicines";
// import { MembershipPlanPage } from '../../membership/membership-plan/membership-plan';
import { MembershipCardPage } from "../../membership-card/membership-card";
import { PatientProfilePage } from "../../delivery/patient-profile/patient-profile";
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { TempStorageProvider } from "../../../providers/temp-storage/temp-storage";
import { DrugInfoPage } from "../drug-info/drug-info";
import { TabPage } from "../../tab/tab";
import { SigninPage } from "../../auth/signin/signin";
// import * as moment from 'moment';
import { App } from "ionic-angular";
import { ModalPage } from "../modal-page-popup/model-page";
import { SocialSharing } from "@ionic-native/social-sharing";
import { MbscPopupOptions } from "../../../lib/mobiscroll-package";
import { AlertController } from "ionic-angular";
import { RxDiscountPage } from "../../RX-Discount/rx-discount/rx-discount";
import { DeliveredPage } from  "../delivered/delivered";
import { LowestPricePage } from "../../RX-Discount/lowest-price/lowest-price";
import { HealthInfoPopupPage } from "../../health-info-popup/health-info-popup";
import { RxDeliveryPopupPage } from "../../rx-delivery-popup/rx-delivery-popup";
import { DraiPopupPage } from "../../drai-popup/drai-popup";
import { DiscountCardPage } from "../../discount-card/discount-card";
import { PagesOnboardingScreenPage } from "../../pages-onboarding-screen/pages-onboarding-screen";
import { AppSettings } from "../../../app/settings";
import moment from "moment";
import { FileUploadProvider } from "../../../providers/file-upload/file-upload";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
// import { FCM } from '@ionic-native/fcm/ngx';
// import { Market } from '@ionic-native/market/ngx';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var FCMPlugin: any;
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  
  @ViewChild('updateVersion') updateVersion: any;
  updateVersionSettings: MbscPopupOptions = {
    display: "center",
    buttons: [
      {
        text: "Update",
        
        handler: (event, inst) => {
          if(this.androidplatform.is('android')){
            window.open("https://play.google.com/store/apps/details?id=com.medipocket.newpatient.app","_system")
          }
          else if(this.androidplatform.is('ios')){
            window.open("https://apps.apple.com/us/app/medipocket-rx-saving-on-demand/id1468232750","_system")
          }
          
          /*if (youWantoCloseIt) {
						inst.hide();
					} else {
						// do other things
					}*/
        },
      },
    ],

    onSet: (event, inst) => {
      // Your custom event handler goes here
    },
    onClose: (event, inst) => {
      // Your custom event handler goes here
    },
  };


  userloggedin: boolean;
  toWhom: any = "family";
  fromPage: any;
  pincode: number;
  pincodeMatch = false;
  public zone: NgZone;
  skipMsg: boolean=false;
  state: string = 'x';
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  
  popupsettings: MbscPopupOptions = {
    display: "center",
    anchor: "#showVariation",
    //buttons: [],
    cssClass: "my-btn",
  };
  patientData;
  name: string;
  user_id: any;
  profileInfo: any;
  userImageURL:any ="https://medipocket-upload-file.s3.amazonaws.com/";
  showAddDrugFab: boolean;
  cartDrugs: any;
  cartDrugsKey: any;
  cartPharmacy: any;
  medications: any;
  pharmacySelected: string;
  currentLocation: any;
  myLocationObj: { latitude: any; longitude: any; zip: any; };
  TotalCartValue: any;
  loadUserImageParam:string='';
  cartOrders: { cartvalue: any; otcdrugs: any; rxdrugs: any; pricediff: any; cartPharmacy: any; pharmacy_id: any; medications: any; deliveryInfo: any; activities: any; fillpxFormData: any; rxPickup: any; cartHasControlledMedicine: any; };
  AppVersion: any;
  ApiAppVersion: any;
  mobileType: string;
  name1: any;
  constructor(
    public deliveryService: DeliveryServiceProvider,
    private app: App,
    public tempStorage: TempStorageProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    private popOverCtrl:PopoverController,
    private androidplatform: Platform,
    private fileUpload: FileUploadProvider,
    private http: HttpClient,
    private inappbrowser:InAppBrowser,
    // private fcm: FCM,
    // private market: Market
  ) {
     this.getApiVersion();
    
  
    console.log(this.userloggedin);
    this.patientData = JSON.parse(localStorage.getItem('patientData'));
   
    //this.name =this.patientData.profileData.name;
    this.getProfileInfo();
    // if(this.name == "" || this.name == undefined){
    //   this.navCtrl.push(PatientProfilePage);
    // }
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    
    console.log('patientData',this.patientData)
    this.tempStorage.setCartMembership();
    this.fileUpload.getDownloadImageSubject().subscribe(data =>{
      this.getProfileInfo();
      this.loadUserImageParam = '?random='+Math.random();
      console.log("random"+ this.loadUserImageParam);
    });
    this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    //this.tempStorage.setProfileMembership();
    /*  this.deliveryService.getMememberShip(this.tempStorage.authsession.userdata.user_id).then((result) => {
          let resultData                           : any;
              resultData                           = result;
          //this.tempStorage.profile                 = resultData;
        console.log(resultData.data);
        //console.log(resultData.data.membership_end);
          if(resultData.data !== undefined){
              let currentTime = moment().format("X");
            if (currentTime <= resultData.data.membership_end){
                this.tempStorage.setProfileMembership('active', "premium");
              }else{
                this.tempStorage.setProfileMembership('active', "free");
              }
        }else{
            this.tempStorage.setProfileMembership('active', "free");
        }
          
         // console.log(this.tempStorage.profile);

      })*/
    //console.log(this.tempStorage.authsession.userdata);
    
   //this.navCtrl.push(PagesOnboardingScreenPage);
    if (!this.tempStorage && !this.tempStorage.authsession.userdata.profileIncompelete) {    
  
      //this.navCtrl.setRoot(HomePage);
      this.navCtrl.push(PatientProfilePage);
    }
    
    this.fromPage = this.navParams.get("fromPage");
  }

  ionViewDidLoad() {
    this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    console.log("ionViewDidLoad HomePage");
    this.content.resize();
  }
  
  searchMedicines() {
    //this.navCtrl.push(SearchMedicinesPage);
    this.navCtrl.push(LowestPricePage);
 
    /* let searchModal = this.modalCtrl.create(SearchMedicinesPage);
      searchModal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){
          }                
      });
      searchModal.present(); */
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  ionViewWillEnter() {
    this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
}
  ionViewDidEnter() {
    this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
   this.getCart();
    console.log("test");
    console.log(this.patientData.profileData.name);
    
     this.name1 = this.patientData.profileData.name ? this.patientData.profileData.name :  localStorage.getItem('name');
      if(this.name1 == null ||  this.name1 == undefined){
        this.name ="";
      }
      else{
        this.name =this.name1;
      }
    }

  cartcount() {
    this.cartOrders = this.deliveryService.cartOrders();
    if(this.cartOrders.cartPharmacy.pricing == undefined){
      this.TotalCartValue ='0';
    }
    else{
      this.TotalCartValue= this.cartOrders.cartPharmacy.pricing.length;
    }
   
   // this.TotalCartValue = this.tempStorage.cart.medications.drugs.length;
    return this.tempStorage.cart.medications.drugs.length;
  }

  showUpcoming() {
    this.deliveryService.mobiAlert("", "This feature is coming soon");
  }
  goto(action: any) {
    this.navCtrl.push(DrugInfoPage);
    // if (action == "druginfo") {
    //   // this.searchDataForm.patchValue({ term: "" });
    //   // console.log(this.tempStorage.cart);
    //   if (
    //     this.tempStorage.cart.pharmacy !== undefined &&
    //     this.tempStorage.cart.pharmacy !== null &&
    //     this.tempStorage.cart.pharmacy.pricing !== undefined &&
    //     this.tempStorage.cart.pharmacy.pricing.length > 0
    //   ) {
    //     this.navCtrl.push(DrugInfoPage);
    //   } else {
    //     this.deliveryService.mobiToast(
    //       "Please choose price & pharmacy",
    //       "danger"
    //     );
      //}
   // }

  }

  onLogout() {
    console.log(this.tempStorage);
    this.tempStorage.clearAuthSession();
    this.tempStorage.clearCart();
    this.navCtrl.setRoot(SigninPage);
    this.app.getRootNavs()[0].setRoot(SigninPage);
  }

  chooseMembership() {
    this.navCtrl.setRoot(TabPage);
  }

  presentModal() {
    const myModel = this.modalCtrl.create("ModalPage");
    myModel.present();
  }

  discount() {
    const modal = this.navCtrl.push(RxDiscountPage);
  }

  shareMpCard() {
    let msg =
      "Show this with your prescription at the pharmacy counter and receive the instant savings.";
    let shareImageUrl = {
      family: "https://mymedipocket.com/qa/img/pharmacy-savings-card-front.png",
      pet:
        "https://mymedipocket.com/qa/img/pharmacy-savings-card-front-pet.png",
    };
    //console.log(this.httpurl +"assets/pdf/" +this.PoDetail.po_ref +".pdf");
    this.socialSharing
      .shareWithOptions({
        message: msg,
        url: "https://mymedipocket.com/",
        files: [shareImageUrl[this.toWhom]],
        /////data/user/0/techbee.otpc/753025443.pdf"
        chooserTitle: "MediPocket Pharmacy Discount Card",
      })
      .then((result) => {
        // this.analytics.trackEvent("Share Success" , result.app);
      })
      .catch((err) => {
        /// this.analytics.trackEvent("Share Fail" , JSON.stringify(err));
      });
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: "Check Availability",
      message: "",
      inputs: [
        {
          name: "pincode",
          placeholder: "Enter your zipcode here",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          cssClass: "danger",
        },
        {
          text: "Continue",
          handler: (data) => {
            console.log(JSON.stringify(data)); //to see the object
            console.log(data.pincode);
            this.pincode = data.pincode;
            this.checkAvailbility();
          },
          cssClass: "primary",
        },
      ],
      cssClass: "check-availability-alert-box",
    });
    prompt.present();
  }

  showPromptTwo() {
    if (this.pincodeMatch) {
      const prompt = this.alertCtrl.create({
        title: "Great!",
        message: "MediDelivery service is available in your area",
        buttons: [
          {
            text: "Not Now",
            handler: (data) => {
              console.log("Cancel clicked");
            },
            cssClass: "danger",
          },
          {
            text: "Continue", // Rx Lowest Price search
            handler: (data) => {
              this.goToSearchMedicinesPage();
            },
            cssClass: "primary",
          },
        ],
        cssClass: "check-availability-alert-box",
      });
      prompt.present();
    } else {
      const prompt = this.alertCtrl.create({
        title: "Sorry!",
        message: "MediDelivery service is not available in your zip code yet ",
        buttons: [
          {
            text: "CONTINUE RX LOWEST PRICE SEARCH", // Rx Lowest Price search
            handler: (data) => {
              console.log("Saved clicked");
              this.goToSearchMedicinesPage();
            },
            cssClass: "primary",
          },
        ],
        cssClass: "check-availability-alert-box",
      });
      prompt.present();
    }
  }

  checkAvailbility() {
    console.log(this.pincode);
    const availablePincodes = [
      91406,
      91423,
      91324,
      91325,
      91326,
      91327,
      90024,
      90210,
      90077,
      91316,
    ];
    for (const item of availablePincodes) {
      if (item == this.pincode) {
        this.pincodeMatch = true;
        break;
      } else {
        this.pincodeMatch = false;
      }
    }
    this.showPromptTwo();
  }

  goToSearchMedicinesPage() {
    this.navCtrl.push(SearchMedicinesPage);
  }
  rxDiscount() {
    this.navCtrl.push(RxDiscountPage);
  }
  rxDilivery(){
    this.navCtrl.push(DeliveredPage);
  }
  lowPrice(){
    this.navCtrl.push(LowestPricePage)
  }
  healthInfo() {
    const popOver = this.popOverCtrl.create(HealthInfoPopupPage);
    popOver.present();
  }
  drAiInfo(){
    const popOver = this.popOverCtrl.create(DraiPopupPage);
    popOver.present();
  }
  deliveryPopup(){
    const popOver = this.popOverCtrl.create(RxDeliveryPopupPage);
    popOver.present();
  }
  // get user info
  getProfileInfo() {
     
    this.deliveryService
      .profileInfo(AppSettings.usertype, this.user_id)
      .then((result) => {
        console.log('result of profile is', result);
         
        let resultData: any = {};
        resultData = result;
        
        if (resultData.data !== undefined) {
          //this.zone.run(() => {
            this.profileInfo = resultData.data;
             
            if(resultData.data.firstName !== undefined){
              localStorage.setItem('name',resultData.data.firstName);
              //this.name= this.profileInfo.firstName;
            }
             else{
              this.name= '';
             }
          //  this.name = this.profileInfo.name;
          
           
            //});
        }
         else {
        }
      }).catch(error => {
        console.log('Error initialization is', error);
      });
  }
 
  
  slideChanged() {
    if (this.slides.isEnd()){
      this.skipMsg = true;
    }
     else{
      this.skipMsg = false; 
     }
  }
  

  slideMoved() {
    
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) {
      this.state = 'rightSwipe';
    
   if(this.slides.getActiveIndex() <= 1 || this.slides.getPreviousIndex() <= 1){
    
   }
  
    }
     
    else {
       
      this.state = 'leftSwipe';
      // if( this.state = 'leftSwipe'){
      //   this.skipMsg = false;
      // }
    }
     
  }

  animationDone() {
    this.state = 'x';
  }
  getCart() {
    this.showAddDrugFab = false;
    this.cartDrugs = this.tempStorage.cart.drugs; // not used
    this.cartDrugsKey = this.tempStorage.cart.keys; // not used
    this.cartPharmacy = this.tempStorage.cart.pharmacy;
    this.medications = this.tempStorage.cart.medications.drugs;


    if (this.cartPharmacy === null) {
        this.cartPharmacy = null;
        this.cartDrugs = [];
        this.cartDrugsKey = [];
        this.medications = [];
        this.pharmacySelected = "";
    } else {
        this.pharmacySelected = this.cartPharmacy;
    }
    this.cartcount();
    this.currentLocation = this.tempStorage.cart.deliveryInfo.address.text;
    this.myLocationObj = { latitude: this.tempStorage.cart.deliveryInfo.address.latitude, longitude: this.tempStorage.cart.deliveryInfo.address.longitude, zip: this.tempStorage.cart.deliveryInfo.address.zip };

    // console.log(this.cartDrugs);
    // console.log(this.cartPharmacy);
}
ApiForForceVersion(data): Observable<any>{
  return this.http.get('https://kstrdw6014.execute-api.us-east-1.amazonaws.com/beta/force-update?app_type='+data);
  
}
getApiVersion(){
   if(this.androidplatform.is('android')){
     this.mobileType = 'android';
   }
   else if(this.androidplatform.is('ios')){
    this.mobileType = 'ios';
   }

  this.ApiForForceVersion(this.mobileType).subscribe(res => {
 
  if(res.status == 200){
    this.ApiAppVersion = res.app_version;
    this.AppVersion = '1.7';
    if(this.ApiAppVersion != this.AppVersion){
      this.updateVersion.instance.show();
     // this.market.open('com.medipocket.newpatient.app');
    //  window.open("https://play.google.com/store/apps/details?id=com.medipocket.newpatient.app","_system")
    }
  }
  
}, error => {
    console.error('Error in fetching home offer : ' + error);
   
  });
}
openCovidUrl() {
  this.inappbrowser.create("https://www.cdc.gov/vaccines/covid-19/index.html",'_blank','location=no,toolbar=yes');
}  
}
