import { Component} from '@angular/core';
import {
	NavController,
	NavParams,
	ViewController,
	MenuController,
	App, Config
} from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { PatientProfilePage } from '../delivery/patient-profile/patient-profile';
import { AuthenticationPage } from '../auth/authentication/authentication';
import { OrdersListPage } from '../orders-list/orders-list';


@Component({
	selector: 'page-more-tab',
	templateUrl: 'more-tab.html'
})
export class MoreTabPage {
	constructor(
		public menuCtrl: MenuController,
		public navCtrl: NavController,
		public navParams: NavParams,
		private deliveryService: DeliveryServiceProvider,
		public viewCtrl: ViewController,
		public tempStorage: TempStorageProvider,
		private app: App,
		private config: Config
	) {
		this.config.set('backButtonIcon', 'ios-arrow-back');
	 }

	close() {
		this.viewCtrl.dismiss();
	}

	ionViewDidEnter() { }

	ionViewDidLoad() { }
	onLogout() {
		this.viewCtrl.dismiss();
		this.tempStorage.clearAuthSession();
		this.tempStorage.clearCart();
		localStorage.clear();
		this.app.getRootNavs()[0].setRoot(AuthenticationPage);
	}
	patientProfile() {
		
		this.navCtrl.push(PatientProfilePage)
		this.viewCtrl.dismiss();
	}
	orderHistory(){
	
		this.navCtrl.push(OrdersListPage)
		this.viewCtrl.dismiss();
	}
}
