import { Component, trigger, transition, style, state, animate, keyframes, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the PagesOnboardingScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-pages-onboarding-screen',
  templateUrl: 'pages-onboarding-screen.html', 
})

export class PagesOnboardingScreenPage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: boolean=false;
  state: string = 'x';
  SkipBtn: boolean=true;
  constructor(private androidplatform: Platform,public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesOnboardingScreenPage');
  }
skip() {
    this.navCtrl.push(WelcomePage);
  }
  slideChanged() {
    if (this.slides.isEnd()){
      this.skipMsg = true;
      this.SkipBtn=false;
    }
     else{
      this.skipMsg = false;
      this.SkipBtn=true; 
     }
  }
  

  slideMoved() {
    
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) {
      this.state = 'rightSwipe';
    
   if(this.slides.getActiveIndex() <= 1 || this.slides.getPreviousIndex() <= 1){
    this.skipMsg = false;
    this.SkipBtn=false;
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
}
