import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LowestPricePage } from '../lowest-price/lowest-price';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-rx-discount',
  templateUrl: 'rx-discount.html',
})
export class RxDiscountPage {

  segement = 'family';
  smallbanner:boolean=true;
  bigImageBanner: boolean;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private socialSharing:SocialSharing, private androidplatform: Platform) {
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  lowPrice(){
    this.navCtrl.push(LowestPricePage)
  }
  shareMpCard(toWhom) {
    let msg =
      "Show this with your prescription at the pharmacy counter and receive the instant savings.";
    let shareImageUrl = {
      family: "http://mymedipocket.com/assets/save-80.jpg",
      pet:
        "assets/imgs/banner-img.png",
    };
     
    //console.log(this.httpurl +"assets/pdf/" +this.PoDetail.po_ref +".pdf");
    this.socialSharing
      .shareWithOptions({
        message: msg,
        url: "https://mymedipocket.com/",
        files:['http://mymedipocket.com/assets/save-80.jpg'],
        chooserTitle: "MediPocket Pharmacy Discount Card",
      })
      .then((result) => {
        // this.analytics.trackEvent("Share Success" , result.app);
      })
      .catch((err) => {
        /// this.analytics.trackEvent("Share Fail" , JSON.stringify(err));
      });
  }
  showBigImage(){
    if(this.bigImageBanner==true){
      this.smallbanner=true;
      this.bigImageBanner=false;
    }
    else{
      this.smallbanner=false;
      this.bigImageBanner=true;
    }
   
  }
}
