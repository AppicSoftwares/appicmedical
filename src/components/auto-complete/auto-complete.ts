import { Component, ViewChild, NgZone } from '@angular/core';
import {
	ViewController,
	ActionSheetController,
	AlertController,
	ToastController,
	Searchbar,
	NavController,
	NavParams, ModalController,Platform
} from 'ionic-angular';

import { DomSanitizer } from '@angular/platform-browser';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { FormBuilder, Validators } from '@angular/forms';
import {
	mobiscroll,
	MbscListviewOptions,
	MbscPopupOptions
} from '../../lib/mobiscroll-package';

mobiscroll.settings = {
	theme: 'ios'
};

// import { AppSettings } from '../../app/settings';
import { Keyboard } from '@ionic-native/keyboard';
import { MembershipCardPage } from '../../pages/membership-card/membership-card';
import { SearchMedicinesPage } from '../../pages/delivery/search-medicines/search-medicines';
import { DiscountCardPage } from '../../pages/discount-card/discount-card';
import { RxDiscountPage } from '../../pages/RX-Discount/rx-discount/rx-discount';
import { LowestPricePage } from '../../pages/RX-Discount/lowest-price/lowest-price';

/**
 * Generated class for the SingleImageUploadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var google; /**** See google is declared here ****/

@Component({
	selector: 'auto-complete',
	templateUrl: 'auto-complete.html'
})
export class customAutoComplete {
	@ViewChild('autosearch') autosearch: Searchbar;
    @ViewChild('MedsPrice') MedsPrice : any;
	searchDataForm: any;
	autoCompleteResultShow: any;
	autoCompleteNoResultShow: any;
	searchItemSelected: any;
	drugSelected: any;
	showspinner: any;
	searchOptionData: any;
	ismodel: boolean = false;
	placeHolder: String = '';
	template: String = '';
	templateBasedData: any;
	pharmPriceData: any;
	pharmGroupPriceData: any;
	myLocationObj: any;

	autocompleteItems: any;
	autocomplete: any;
	pincode: number;
	pincodeMatch = false;
	pharmacyData: any;
	latitude: number = 0;
	longitude: number = 0;
	geo: any;
	paddingIonicContent: String;
	BackText: String;
	filterSelected: String;

	MedsPriceSettings: MbscPopupOptions = {
		display: 'center',
		anchor: '#showVariations',
		buttons: [],
		cssClass: 'MedsPriceSettings mbsc-no-padding md-vertical-list',
		
	};

	lvSettings: MbscListviewOptions = {
		enhance: true,
		swipe: false,
		onItemTap: (event, inst) => {
		
			/*mobiscroll.toast({
                message: event.target.innerText + ' clicked'
            });*/
			//this.drugSelected.QtySelected =
		}
	};
	pharmacySelected: any;

	service = new google.maps.places.AutocompleteService();

	listviewSettings: MbscListviewOptions = {
		swipe: false,
		enhance: true,
		onItemTap: (event, inst) => {
			//  console.log(event);
			//  console.log(inst);
			/* if(event.index !== undefined){
                this.dismiss(this.pharmPriceData[event.index]);
			}*/
	
			if (event.target.classList.contains('mbsc-lv-parent')) {
				 console.log("parent element");
				//console.log(this.loadPharmacyFromGroup);
				inst.showLoading();
				//  inst.sortable = true;
				this.loadPharmacyFromGroup(
					inst,
					this.pharmPriceData[event.index].Summary.PharmacyGroup
				);
				this.MedsPrice.instance.show()
				 
				console.log(this.tempStorage.cart.medications.byNdc);
				this.pharmacySelected = this.pharmPriceData[event.index];
			} else {
				// console.log("child element, index: " + event.index);
			 
				this.pharmacySelected = { ...this.pharmGroupPriceData[event.index] };
				console.log(this.pharmacySelected)
			}
         
			// Your custom event handler goes here
		},
		
	};

	constructor(
		public tempStorage: TempStorageProvider,
		public zone: NgZone,
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public deliveryService: DeliveryServiceProvider,
		private keyboard: Keyboard,
		private formBuilder: FormBuilder,
		private sanitization: DomSanitizer,
		private actionSheetCtrl: ActionSheetController,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private modalCtrl : ModalController,
		private androidplatform: Platform
	) {
		this.searchDataForm = this.formBuilder.group({
			term: ['', Validators.required]
		});

		this.searchOptionData = [];
		this.showspinner = false;
		this.pharmPriceData = [];
		this.pharmGroupPriceData = [];

		this.ismodel = this.navParams.get('ismodel');
		this.template = this.navParams.get('template');
		this.placeHolder = this.navParams.get('placeHolder');
		this.myLocationObj = this.navParams.get('myLocationObj');
		//console.log(this.placeHolder);
		// console.log(this.service);
		this.paddingIonicContent = 'padding';
		this.BackText = 'Back';
		this.pharmacySelected = {};
		  
		if (this.template === 'pharmacy_price_list') {
			this.BackText = 'Close';
			this.filterSelected = 'distance';
			this.paddingIonicContent = 'no-padding';
			  
			this.templateBasedData = this.navParams.get('templateBasedData'); // medications
			this.loadPharmaciesPrices();
		} else if (this.template === 'change_location') {
			this.templateBasedData = this.navParams.get('templateBasedData'); // medications

			this.autocompleteItems = [];
			this.autocomplete = {
				query: ''
			};

			//this.loadMap();
		}
	}
	ionViewWillLeave(){
		let backAction = this.androidplatform.registerBackButtonAction(() => {
		  this.navCtrl.pop();
		});
	  }
	chooseItem(item: any) {
		this.geo = item;
		this.geoCode(this.geo); //convert Address to lat and long
	}

	updateSearch() {
		if (this.autocomplete.query == '') {
			this.autocompleteItems = [];
			return;
		}

		let me = this;
		this.service.getPlacePredictions(
			{
				input: this.autocomplete.query,
				types: ['geocode']
				/*componentRestrictions: {
          country: 'US'
        }*/
			},
			(predictions, status) => {
				me.autocompleteItems = [];

				me.zone.run(() => {
					if (predictions != null) {
						predictions.forEach(prediction => {
							me.autocompleteItems.push(prediction.description);
						});
					}
				});
			}
		);
	}

	//convert Address string to lat and long
	geoCode(address: any) {
		let geocoder = new google.maps.Geocoder();
		console.log(address)
		geocoder.geocode({ address: address }, (results, status) => {
			let zipCode = '';
			console.log('results',results);
			
		//	if(results[0]){
				if ( 
					results[0].address_components !== undefined &&
					results[0].address_components.length > 0
				) {
					for (var i = 0; i < results[0].address_components.length; i++) {
						if (
							this.deliveryService.contains(
								results[0].address_components[i].types,
								'postal_code'
							)
						) {
							zipCode = results[0].address_components[i].long_name;
						}
					}
				}
			//}
			if (!zipCode) {
				this.deliveryService
					.mobiAlert(
						'Invalid Address',
						'Zip code/ Postal Code is missing. Please enter full address'
					)
					.then(result => {});

				return false;
			} else {
				if (this.deliveryService.checkDeliveryAvailale(zipCode)) {
				} else {
					if (this.tempStorage.Adminconfig.service_able_zip != undefined) {
						this.deliveryService
							.mobiAlert(
								'',
								'MediDelivery not in your area yet, we are adding to new zip codes soon, will notify once available in your area.Still can save up to 80 % on Rx with our FREE MediPocket Prescription Savings Card by simple showing from app at pharmacy and save $$$. <br> Delivery Available at <br>' +
									this.tempStorage.Adminconfig.service_able_zip.join() +
									'.'
							)
							.then(result => {
								this.viewCtrl.dismiss();
							});

						return false;
					}
				}
			}
			this.latitude = results[0].geometry.location.lat();
			this.longitude = results[0].geometry.location.lng();
			this.viewCtrl.dismiss({
				address: address,
				cords: {
					latitude: Number(this.latitude.toFixed(7)),
					zip: zipCode,
					longitude: Number(this.longitude.toFixed(7))
				}
			});
			// alert("lat: " + this.latitude + ", long: " + this.longitude);
		});
	}

	focusSearch() {
		this.searchDataForm.patchValue({ term: '' });

		setTimeout(() => {
			this.autosearch.setFocus();
			this.keyboard.show();
		}, 300);
	}
	searchbarClick() {}

	loadPharmaciesPrices(inst: any = '', pharmacyGroup = '') {
		this.showspinner = true;
		let paramsMeds = [];
		//  console.log(this.tempStorage.cart.medications);
		for (let i = 0; i < this.templateBasedData.length; i++) {
			paramsMeds.push({
				ndc: this.templateBasedData[i].NDC,
				qty: this.templateBasedData[i].QtySelected.qty
			});
		}
		// console.log(paramsMeds);
		//"maxReturn":10,
		let params = {
			radius: 4.02336,
			pharmAlias: 'P2',
			unc: ['unc'],
			medications: paramsMeds,
			mode: 'rollup',
			lat: 37.5407246,
			lng: -77.4360481
		};
		if (pharmacyGroup) {
			this.pharmGroupPriceData = [];
			params['mode'] = null;
			delete params['mode'];

			params['sort'] = 'distance';
			params['pharmacyGroup'] = pharmacyGroup;
		}

		if (
			this.myLocationObj.latitude !== undefined &&
			this.myLocationObj.longitude !== undefined
		) {
			params.lat = this.myLocationObj.latitude;
			params.lng = this.myLocationObj.longitude;
		}

		this.deliveryService.rxapi_price(params).then((result: any) => {
			this.showspinner = false;
			if (result.pharmData !== undefined && result.pharmData.length > 0) {
				if (pharmacyGroup) {
					// this wont get executed, as this is not called with pharmGroup
					// display only first 10 results of whose distance is < 2.5 miles
					/* 
					this.pharmGroupPriceData = result.pharmData;
					const tempArr = [];
					for (const item of result.pharmData) {
						if (item.distance > 2.5 && tempArr.length < 11) {
							tempArr.push(item);
						}
					}
					console.log('tempArr', tempArr);
					*/
					//    inst.hideLoading();
					//   console.log(this.pharmPriceData);
					//   console.log(this.pharmGroupPriceData);
				} else {
					  
					this.pharmPriceData = result.pharmData;
					console.log(this.pharmPriceData)
					setTimeout(() => {
						this.reOrderPharmacyData(this.filterSelected);
					}, 500);
				}

				//  console.log(this.pharmPriceData);
			} else {
				// console.log("in");
			}
		});
	}

	loadPharmacyFromGroup(inst, groupName) {
		//console.log("called");
		//this.loadPharmaciesPrices(inst, groupName);
		let paramsMeds = [];
		this.pharmGroupPriceData = [];
		//  console.log(this.tempStorage.cart.medications);
		for (let i = 0; i < this.templateBasedData.length; i++) {
			paramsMeds.push({
				ndc: this.templateBasedData[i].NDC,
				qty: this.templateBasedData[i].QtySelected.qty
			});
		}
		// console.log(paramsMeds);
		//"maxReturn":10,
		let params = {
			radius: 4.02336,
			pharmAlias: 'P2',
			unc: ['unc'],
			medications: paramsMeds,
			lat: 37.5407246,
			lng: -77.4360481
		};

		params['sort'] = 'distance';
		params['pharmacyGroup'] = groupName;

		if (
			this.myLocationObj.latitude !== undefined &&
			this.myLocationObj.longitude !== undefined
		) {
			params.lat = this.myLocationObj.latitude;
			params.lng = this.myLocationObj.longitude;
		}

		this.deliveryService.rxapi_price(params).then((result: any) => {
			if (result.pharmData !== undefined && result.pharmData.length > 0) {
				this.pharmGroupPriceData = result.pharmData;
				inst.hideLoading();
				//  inst.sortable = true;
				// console.log(this.pharmPriceData);
				// console.log(this.filterSelected);

				setTimeout(() => {
					this.reOrderPharmacyData(this.filterSelected);
				}, 500);
			} else {
				console.log('in');
			}
		});
	}

	loadMap() {
		// console.log(this.tempStorage.cart.medications);

		this.showspinner = false;
	}
	calculateTotalPrice(priceArray, index) {
		let totalCalcualted = this.deliveryService.calculateTotalFromPriceArray(
			priceArray
		);
		this.pharmGroupPriceData[index]['totalPrice'] =
			totalCalcualted['totalPrice'];
		this.pharmGroupPriceData[index]['totSaving'] = totalCalcualted['totSaving'];
		return this.pharmGroupPriceData[index]['totalPrice'];
	}

	reOrderPharmacyData(orderBy) {
		
		if (orderBy == 'price') {
			//this.pharmGroupPriceData // key : totalPrice
			//this.pharmPriceData //  key : Summary.MinPrice
			// console.log(this.pharmGroupPriceData);
			//console.log(this.pharmGroupPriceData.sort(this.deliveryService.sortArrayObj('totalPrice')));
			//console.log(this.pharmPriceData.sort(this.deliveryService.sortArrayObj('MinPrice', 'Summary')));
			this.pharmGroupPriceData.sort(
				this.deliveryService.sortArrayObj('totalPrice')
			);
			this.pharmPriceData.sort(
				this.deliveryService.sortArrayObj('MinPrice', 'Summary')
			);
		} else {
			//this.pharmGroupPriceData // key : distance
			//this.pharmPriceData //  key : Summary.MinDistance

			// console.log(this.pharmGroupPriceData.sort(this.deliveryService.sortArrayObj('distance')));
			// console.log(this.pharmPriceData.sort(this.deliveryService.sortArrayObj('MinDistance', 'Summary')));
			this.pharmGroupPriceData.sort(
				this.deliveryService.sortArrayObj('distance')
			);
			this.pharmPriceData.sort(
				this.deliveryService.sortArrayObj('MinDistance', 'Summary')
			);
			//    console.log(this.pharmPriceData);

			// if (this.pharmPriceData.length > 0) {
			//     for(let item of this.pharmPriceData) {
			//         if (item.name === 'Healthy Way Pharmacy') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/pharmacy.svg'});
			//         } else if (item.name === 'CVS') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/cvs-pharma.svg'});
			//         } else if (item.name === 'CVS Inside Target') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/CVS-Inside-Target.svg'});
			//         } else if (item.name === 'Walmart') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/Walmart.svg'});
			//         } else if (item.name === 'Rite Aid') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/Rite-Aid.svg'});
			//         } else if (item.name === 'Walgreens') {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/Walgreens.svg'});
			//         } else {
			//             this.pharmPriceData.push({'icon': 'assets/imgs/pharmacy.svg'});
			//         }
			//     }
			// }
			//    console.log(this.pharmPriceData);
		}
	}

	choosePharmacy(data) {
		console.log(data);
		this.pharmacyData = data;
		const prompt = this.alertCtrl.create({
			title: '',
			message: 'Would you like Same Day MediDelivery of your order?',
			buttons: [
				{
					text: 'No',
					handler: data => {
						this.goDiscountPage();
					}
				},
				{
					text: 'Yes',
					handler: data => {
						this.checkAvail();
					},
					cssClass: 'primary'
				}
			],
			cssClass: 'check-availability-alert-box'
		});
		prompt.present();
		// if (
		// 	data.pricing !== undefined &&
		// 	data.pricing.length == this.tempStorage.cart.medications.drugs.length
		// ) {
		// 	this.viewCtrl.dismiss(data);
		// } else {
		// 	this.deliveryService
		// 		.mobiconfirm(
		// 			'Some of the medicine not available in selected pharmacy, you can',
		// 			'',
		// 			'Change pharmacy',
		// 			'Remove drug'
		// 		)
		// 		.then(value => {
		// 			if (value) {
		// 				// choose other pahrmacy maens do othong just close the confirm window
		// 			} else {
		// 				// remove utem from cart close the model to seach page
		// 				this.viewCtrl.dismiss({});
		// 			}
		// 		});
		// }
	}

	checkAvail() {
		const prompt = this.alertCtrl.create({
			title: 'Check Availability',
			message: '',
			inputs: [
				{
					name: 'pincode',
					placeholder: 'Enter your zipcode here',
					type: 'number'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					cssClass: 'danger'
				},
				{
					text: 'Continue',
					handler: data => {
						this.pincode = data.pincode;
						this.checkAvailbility();
					},
					cssClass: 'primary'
				}
			],
			cssClass: 'check-availability-alert-box'
		});
		prompt.present();
	}

	goDiscountPage() {
		const prompt = this.alertCtrl.create({
			title: 'ENJOY SAVINGS $$ with FREE MediPocket Rx Discount Card',
			message:
				'Simply show Rx discount card at pharmacy and ask them to add to your file for future uses',
			buttons: [
				{
					text: 'Ok',
					handler: data => {
						this.navCtrl.push(MembershipCardPage);
					},
					cssClass: 'primary'
				}
			],
			cssClass: 'check-availability-alert-box'
		});
		prompt.present();
		
	}

	checkAvailbility() {
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
			91316
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

	showPromptTwo() {
		if (this.pincodeMatch) {
			const prompt = this.alertCtrl.create({
				title: 'Great!',
				message: 'MediDelivery service is available in your area',
				buttons: [
					{
						text: 'Not Now',
						handler: data => {
							console.log('Cancel clicked');
						},
						cssClass: 'danger'
					},
					{
						text: 'Continue',
						handler: data => {
							this.goToCart();
						},
						cssClass: 'primary'
					}
				],
				cssClass: 'check-availability-alert-box'
			});
			prompt.present();
		} else {
			const prompt = this.alertCtrl.create({
				title: 'Sorry!',
				message: 'MediDelivery service is not available in your zip code yet ',
				buttons: [
					{
						text: 'CONTINUE RX LOWEST PRICE SEARCH', // Rx Lowest Price search
						handler: data => {
							console.log('Saved clicked');
							this.goToSearchMedicinesPage();
						},
						cssClass: 'primary'
					}
				],
				cssClass: 'check-availability-alert-box'
			});
			prompt.present();
		}
	}

	goToSearchMedicinesPage() {
		this.navCtrl.push(LowestPricePage);
		//this.navCtrl.push(SearchMedicinesPage);
	}

	goToCart() {
		console.log(this.pharmacyData);
		let data = this.pharmacyData;
		if (
			data.pricing !== undefined &&
			data.pricing.length == this.tempStorage.cart.medications.drugs.length
		) {
			this.viewCtrl.dismiss(data);
		} else {
			this.deliveryService
				.mobiconfirm(
					'Some of the medicine not available in selected pharmacy, you can',
					'',
					'Change pharmacy',
					'Remove drug'
				)
				.then(value => {
					if (value) {
						// choose other pahrmacy maens do othong just close the confirm window
					} else {
						// remove utem from cart close the model to seach page
						this.viewCtrl.dismiss({});
					}
				});
		}
	}

	search(event) {
		console.log(this.ismodel);
		this.autoCompleteResultShow = false;
		this.autoCompleteNoResultShow = false;
		let keyword = event.value;

		if (keyword == '' || this.searchItemSelected) {
			this.autocomplete = [];
			this.autoCompleteResultShow = false;
			this.autoCompleteNoResultShow = false;
			this.searchItemSelected = false;
			if (keyword == '') {
				this.drugSelected = {};
			}

			return false;
		}

		this.autocomplete = [];
		this.showspinner = true;
		console.log(event.value);
		this.deliveryService.pharmacyList({ value: '', id: '' }).then(result => {
			this.autocomplete = [];
			let resultData: any;
			resultData = result;

			for (var i = 0; i < resultData.outdata.length; i++) {
				let item = resultData.outdata[i];
				var regExp = /\(([^)]+)\)/;
				// var matches = regExp.exec(item.display_name);
				// console.log(matches);
				let obj: any = {
					value: item.pharmacy_id,
					text: item.pharmacy_name,
					display_name: item.pharmacy_name
				};

				// this.searchOptionData[item.slug] = obj;
				this.autocomplete.push(obj);
			}
			this.autoCompleteResultShow = true;
			this.showspinner = false;
			// console.log(this.autocomplete);
			// console.log(this.autocomplete.length);
		});
	}

	updateAC(item) {
		console.log(item);
		this.searchDataForm.patchValue({ term: item.text });
		this.searchItemSelected = true;
		this.autoCompleteResultShow = false;
		this.dismiss(item);
	}
	dismiss(data) {
		// let data = { 'foo': 'bar' };
		this.viewCtrl.dismiss(data);
	}
	openCoupon(){
		console.log('openCoupon')
		// const modal = this.modalCtrl.create(customAutoComplete, {
		// 	ismodel: true,
		// 	myLocationObj: {},
		// 	template: 'change_location',
		// 	placeHolder: 'Search Pharmacy',
		// 	templateBasedData: {}
		// });
		// modal.onDidDismiss(data => {
		// 	//console.log(data);
			
		// });
		// modal.present();	
	}
}
