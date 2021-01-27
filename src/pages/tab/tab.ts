import { Component } from '@angular/core';
import { NavController, PopoverController, App, Platform } from 'ionic-angular';
import { HomePage } from '../../pages/delivery/home/home';
import { PatientProfilePage } from '../../pages/delivery/patient-profile/patient-profile';
import { SearchMedicinesPage } from '../../pages/delivery/search-medicines/search-medicines';
import { OrdersListPage } from '../../pages/orders-list/orders-list';
import { MembershipCardPage } from '../../pages/membership-card/membership-card';
import { MoreTabPage } from '../more-tab/more-tab';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { SigninPage } from '../auth/signin/signin';
import { ViewFamilyPage } from '../family-members/view-family/view-family';
import { RxDiscountPage } from '../RX-Discount/rx-discount/rx-discount';

@Component({
	selector: 'page-tab',
	templateUrl: 'tab.html'
})
export class TabPage {
	notifybadge: number = 0;

	tab1Root = HomePage;
	tab2Root = ViewFamilyPage;
	tab3Root = RxDiscountPage;
	tab4Root = OrdersListPage;
	// tab5Root = MoreTabPage;
	//tab6Root = AddNewEventPage;

	constructor(
		public nav: NavController,
		public popoverCtrl: PopoverController,
		public tempStorage: TempStorageProvider,
		public navCtrl: NavController,
		private app: App,
		private androidplatform: Platform
	) {
		// var badge = JSON.parse(localStorage.getItem('badges'));
		// console.log(badge);
		// if(badge) {
		//   this.notifybadge = badge;
		// }
	}
	// ionViewDidEnter(){
	//   this.notify();
	// }

	// notify() {
	//   this.userService.notify_badge().subscribe(res => {
	//     console.log(res);
	//     //this.notify_badge;
	//     var count = 0;
	//     for(let item of res.data){
	//       if(item.isSeen === false || item.isSeen === 'false'){
	//           console.log('count:-',count)
	//           count = count + 1;
	//         this.userService.Badges = count;
	//       }
	//     }
	//   //  console.log(count)
	//     console.log(this.notifybadge);
	//   });
	// }

	viewMore() {
		console.log('more');
		let popover = this.popoverCtrl.create(
			MoreTabPage,
			{},
			{ cssClass: '-popover' }
		);
		popover.present();
		// popover.onDidDismiss(data=>{
		// 	console.log(data);
		// 	if(data == 'patient'){
		// 		this.navCtrl.setRoot(TabPage)
		// 	} else {
		// 		this.navCtrl.setRoot(OrdersListPage)
		// 	}
		// })
	}
	onLogout() {
		console.log(this.tempStorage);
		this.tempStorage.clearAuthSession();
		this.tempStorage.clearCart();
		this.navCtrl.setRoot(SigninPage);
		this.app.getRootNavs()[0].setRoot(SigninPage);
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
}
