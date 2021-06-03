import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Searchbar, ModalController, Platform } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { DrugInfoPage } from "../../delivery/drug-info/drug-info";
import { MembershipPlanPage } from '../../membership/membership-plan/membership-plan';
import { customAutoComplete } from '../../../components/auto-complete/auto-complete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mobiscroll, MbscPopupOptions, MbscSelectOptions, MbscListviewOptions } from '../../../lib/mobiscroll-package';
import { Geolocation } from '@ionic-native/geolocation';
import { AppSettings } from '../../../app/settings';
import { Keyboard } from '@ionic-native/keyboard';
import { SocialSharing } from '@ionic-native/social-sharing';
declare var $:any;
//import * as moment from 'moment';

/**
 * Generated class for the LowestPricePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

mobiscroll.settings = {
    theme: 'ios'
};

@Component({
    selector: "page-lowest-price",
    templateUrl: "lowest-price.html",
  })
export class LowestPricePage {
    toWhom: any = "family";
    @ViewChild('autosearch') autosearch: Searchbar;
    httpurl: any = AppSettings.API_ENDPOINT;
    autoCompleteNoResultShow: any;
    autoCompleteResultShow: any;
    showspinner: any;
    drugSearchInp: any;
    requestmsg: any;
    autocomplete: any;
    placeSearchInperror: any;
    remoteSettings: any;
    remoteDate: any;
    myData: any;
    drugSelected: any;
    drugSelectedIndex: any;
    searchDataForm: any;
    filterDataForm: any;
    searchOptionData: any;
    pharmacies: any;
    pharmaciesError: any;
    cartDrugs: any;
    cartPharmacy: any;
    cartDrugsKey: any;
    ismember: any;
    drugSpecSettings: MbscPopupOptions;
    drugmg: any;
    drugcount: any;
    currentDrug: any;
    currentLocation: any = "";
    searchItemSelected: any;
    showAddDrugFab: any;
    cartOrders: any;
    addingInProgress: any;
    user_id: any;
    pharmacySelected: any = "";
    filterSearch: any;
    filterData: any;
    predictions: any;
    myLocationObj: any;

    data = [];
    gpi12Data: any = { index: [], value: [] };
    dosageData: any = { index: [], value: [] };
    strengthData: any = { index: [], value: [] };
    packagedescData: any = { index: [], value: [] };
    quantityData: any = { index: [], value: [] };
    packageData: any = { index: [], value: [] };
    medications: any;
    RecentSearch:any;
    medicationsList = true;
    isConfirm = false;
    searchName = true;
    customField = false;
    QuantityDropdown = true;
    gpi12Settings: MbscSelectOptions = {
        display: 'bubble',
        data: this.gpi12Data.value,
        inputClass: 'gpi12-select',
        onSet: (ev, inst) => {
            this.trigger_gpi14();
            console.log(ev);
            console.log(inst);
        }
    };

    containerSettings: MbscPopupOptions = {
        display: 'bubble',
        anchor: '#showContainer',
        buttons: [],
        cssClass: 'mbsc-no-padding md-vertical-list show-quentity-list'
    };
    variationsSettings: MbscPopupOptions = {
        display: 'center',
        anchor: '#showVariations',
        buttons: [],
        cssClass: 'mbsc-no-padding md-vertical-list'
    };
    lvSettings: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        onItemTap: function (event, inst) {
            /*mobiscroll.toast({
                message: event.target.innerText + ' clicked'
            });*/
            //this.drugSelected.QtySelected = 
        }
    };

    dosageSettings: MbscSelectOptions = {
        data: this.dosageData.value,
        inputClass: 'dosage-select',
        onSet: (ev, inst) => {
            this.trigger_dosage();
            console.log(ev);
            console.log(inst);
        }
    };

    strengthSettings: MbscSelectOptions = {
        data: this.strengthData.value,
        inputClass: 'strength-select',
        onSet: (ev, inst) => {
            //   this.trigger_strength();
            // console.log(ev);
            // console.log(inst);
        }
    };


    packageSettings: MbscSelectOptions = {
        data: this.packageData.value,
        inputClass: 'package-select',
        onSet: (ev, inst) => {
            this.trigger_package();
            console.log(ev);
            console.log(inst);
        }
    };

    packagedescSettings: MbscSelectOptions = {
        data: this.packagedescData.value,
        inputClass: 'packagedesc-select',
        onSet: (ev, inst) => {
            this.trigger_packagedesc();
            console.log(ev);
            console.log(inst);
        }
    };

    quantitySettings: MbscSelectOptions = {
        data: this.quantityData.value,
        inputClass: 'quantity-select',
        onSet: (ev, inst) => {
            this.trigger_quantity();
            console.log(ev);
            console.log(inst);
        }
    };
    drugs: any[];
    finddis: boolean=false;
    finddisNot: boolean=true;
    TotalCartValue: any;
    medqty: any;
    pricelength: any;
    qty: any;
  
    medicabinetArray=[];
    medicabinetDataForm: FormGroup;
    RecentSearchArray=[];
   



    constructor(private androidplatform: Platform,private changeDetector: ChangeDetectorRef, public modalCtrl: ModalController, private keyboard: Keyboard, 
        public tempStorage: TempStorageProvider, private geolocation: Geolocation, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public deliveryService: DeliveryServiceProvider,
        public socialSharing: SocialSharing) {
this.medicabinetArray =this.tempStorage.getMedicabinetData();
this.RecentSearchArray=this.tempStorage.getRecentSearchData();
            this.currentLocation="";
        this.pharmacies = [];
        this.filterSearch = { first: false, second: false, third: false };
        this.gpi12Data = { index: [], value: [] };
        if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
        this.drugSelected = { QtyPrediction: [{}] };
        this.drugSelectedIndex = 0;
        this.medications = [];
        this.RecentSearch=[];
        this.autocomplete = [];
        this.searchItemSelected = false;
        this.showspinner = false;
        this.showAddDrugFab = false;
        this.addingInProgress = false;
        this.myLocationObj = {};
        this.cartOrders = this.deliveryService.cartOrders();
        this.predictions = [];
        //console.log(this.autocomplete.length);
        this.searchDataForm = this.formBuilder.group({
            term: ["", Validators.required],
            gpi10s: [""],
        });
        this.medicabinetDataForm =this.formBuilder.group({
            medicabinet:[false]
        })
        this.filterDataForm = this.formBuilder.group({
            gpi10s: [""],
            gpi12: [""],
            dosage: [""],
            strength: [""],
            package: [""],
            packagedesc: [""],
            quantity: [""]
        });
        this.drugmg = 300;
        this.drugcount = 30;
        this.getCart();
        this.setCart();
        this.searchOptionData = [];
        this.currentDrug = null;
        this.drugSpecSettings = {
            display: 'top',
            theme: 'ios',
            buttons: [{
                text: 'Update',
                handler: 'set'
            }],
            onSet: function (event, inst) {
                console.log(event);
                console.log(inst);

            }
        };
        this.customField = false;
        this.QuantityDropdown = true;
        /*this.geolocation.getCurrentPosition().then((position) => { 
            console.log(position);
        }); */
        console.log(this.currentLocation);
         
        if (!this.currentLocation) {
            this.geolocation.getCurrentPosition().then((position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                let postData = { latitude: latitude, longitude: longitude };

                this.myLocationObj = postData;
                // console.log(position);
                this.getAddress(postData);
            }).catch((error) => {
                this.currentLocation = "Unable to locate";
                console.log(error);
            });
        }
    }
    ionViewWillLeave(){
        let backAction = this.androidplatform.registerBackButtonAction(() => {
          this.navCtrl.pop();
        });
      }
    choosePharmacy() {
        // this.showAddDrugFab                                 = false;
        this.pharmacySelected = "";
        const modal = this.modalCtrl.create(customAutoComplete, { ismodel: true, placeHolder: "Search Pharmacy" });
        modal.onDidDismiss(data => {
            console.log(data);
            this.pharmacySelected = data;
            //  this.showAddDrugFab                                 = true;
        });
        modal.present();



    }

    getAddress(postData: any) {
        this.deliveryService.getAddress(postData).then((result) => {
            //console.log(result);
            let resultData: any;
            resultData = result;
            if (resultData.status == 'success') {
                if (this.checkDeliveryAvailale(resultData.outdata.zip)) {

                } else {
                    if (this.tempStorage.Adminconfig.service_able_zip != undefined) {
                        this.deliveryService.mobiAlert('', 'MediDelivery not in your area yet, we are adding to new zip codes soon, will notify once available in your area.Still can save up to 80 % on Rx with our FREE MediPocket Prescription Savings Card by simple showing from app at pharmacy and save $$$. <br> Delivery Available at <br>' + this.tempStorage.Adminconfig.service_able_zip.join() + ".").then(result => {
                            return false;
                        });
                    }
                    return false;
                }

                this.currentLocation = resultData.outdata.formatted_address;
                //  console.log(resultData);
                //this.currentLocation = data.address;
                this.tempStorage.cart.deliveryInfo.address.latitude = postData.latitude;
                this.tempStorage.cart.deliveryInfo.address.longitude = postData.longitude;
                this.tempStorage.cart.deliveryInfo.address.zip = resultData.outdata.zip;
                this.tempStorage.cart.deliveryInfo.address.text = this.currentLocation;
                // console.log(this.tempStorage.cart);

            }
        });
    }

    updateDrug() {
        if (1 == 1) {
            return false;
            //unused functions
        }
        if (this.currentDrug != null) {
            let drugindex = this.cartDrugsKey.indexOf(this.currentDrug);
            console.log(drugindex);
            console.log(this.currentDrug);
            if (drugindex > -1) {
                this.cartDrugs[drugindex].drugspec = { mg: this.drugmg, count: this.drugcount };
                this.setCart();
            }
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchMedicinesPage');
    }

    trigger_gpi14(gpi10 = "") {
        // console.log(this.filterDataForm.value.gpi12);
        this.resetdosage();
        /* let dosage     : any = [];
             dosage     = this.gpi12Data.value[this.filterDataForm.value.gpi12].group;
         for(let d = 0; d <= dosage.length -1; d++) {
             let item : any = dosage[d];
             this.dosageData.index.push(d);
             let dosagename : any = item.DosageForm;
             let dosagename_lowercase     : any = dosagename.toLowerCase();
             this.dosageData.value.push({value: d, text: dosagename_lowercase, data: item});
         }
         this.filterDataForm.patchValue({dosage: 0});
         console.log(this.dosageData); */
        this.trigger_dosage(gpi10);
    }

    trigger_dosage(gpi10 = "") {
         
        this.resetStrength();
        //let GPI12s_array : any = this.dosageData.value[this.filterDataForm.value.dosage].data.GPI12s;
        //let GPI12s : any = GPI12s_array.join();
        //let params       : any = {gpi12: GPI12s, gpi10: gpi10};
        let params: any = { gpi10: gpi10 };
        let strength: any = [];
        let count: any = 0;
        this.addingInProgress = true;

        this.deliveryService.rxapi_strength(params).then((result) => {
            let resultData: any;
            resultData = result;
            this.predictions = [];
            this.drugs = [];
            this.predictions = resultData.predictions;
            this.drugs =resultData.drugs;
            if (resultData.predictions.length > 0) {
                 
                /* for(let s = 0; s <= resultData.drugs.length -1; s++) {
                     let item = resultData.drugs[s];
                     if(item.BN == this.dosageData.value[this.filterDataForm.value.dosage].data.BN) {
                         if( this.strengthData.index.indexOf(item.BN) < 0 ) {
                             this.strengthData.index.push(item.BN);
                         }
                         
                         this.strengthData.value.push({text: item.Strength, value: count, data: item});
                         count++;
                     }
                     
                 }*/
                  
                this.drugSelected = { ...this.predictions[0] };
                 
                this.drugSelected.QtySelected = { ...this.predictions[0].QtyPrediction[0] };
                // this.drugSelectedIndex = 0;
                this.RecentSearchArray.push(this.drugSelected);
                this.tempStorage.setRecentSearchData(this.RecentSearchArray);
            }
            this.addingInProgress = false;
            // this.filterDataForm.patchValue({strength: 0});
            // console.log(this.strengthData);
            //  this.trigger_strength();
        })
    }
    resetStrength() {
        this.filterDataForm.patchValue({ strength: "" });
        this.strengthData = { index: [], value: [] };
        this.resetPackage();
    }

    trigger_strength() {
        this.resetPackage();

        /* Muni uncoment and see

        for(var pre = 0; pre <= this.predictions.length -1; pre++) {
            let prediction_item : any = this.predictions[pre];

            if(prediction_item.BN == this.dosageData.value[this.filterDataForm.value.dosage].data.BN && prediction_item.Strength == this.strengthData.value[this.filterDataForm.value.strength].data.Strength) {
                console.log(prediction_item);
            }
        }
        return true; 
        Muni uncoment and see
        */
        let GPI14s_array: any = this.strengthData.value[this.filterDataForm.value.strength].data.GPI14s;
        let GPI14s: any = GPI14s_array.join();
        let params: any = { gpi14: GPI14s };
        let drugpackage: any = [];
        this.deliveryService.rxapi_package(params).then((result) => {
            let resultData: any;
            resultData = result;
            let groupbyln: any = [];
            let groupindex: any = [];
            if (resultData.drugs.length > 0) {
                for (let s = 0; s <= resultData.drugs.length - 1; s++) {
                    let item = resultData.drugs[s];
                    let item_name = item.LN;
                    let item_name_lowercase = item_name.toLowerCase();
                    if (item.Strength == this.strengthData.value[this.filterDataForm.value.strength].data.Strength) {
                        if (this.packageData.index.indexOf(item.LN) < 0) {
                            this.packageData.index.push(item.LN);
                            var newObj = { text: item_name_lowercase, value: this.packageData.index.indexOf(item.LN), data: [] };
                            /* if(item_name_lowercase == parent_lowercase) {
                                newObj.text = item_name_lowercase;
                            } */
                            this.packageData.value[this.packageData.index.indexOf(item.LN)] = newObj;
                        }
                        this.packageData.value[this.packageData.index.indexOf(item.LN)].data.push(item);
                    }

                }
            }
            this.filterDataForm.patchValue({ package: 0 });
            this.trigger_package()
            console.log(this.packageData);
        })
    }

    trigger_package() {
        this.resetPackagedesc();
        let packageDetails: any = [];
        packageDetails = this.packageData.value[this.filterDataForm.value.package].data;
        console.log(packageDetails);
        if (packageDetails.length > 0) {
            let groupbypd: any = [];
            let groupindex: any = [];
            for (let pd = 0; pd <= packageDetails.length - 1; pd++) {

                let item = packageDetails[pd];
                let item_name = item.PackageDesc;
                let item_name_lowercase = item_name.toLowerCase();
                if (this.packagedescData.index.indexOf(item.PackageDesc) < 0) {
                    this.packagedescData.index.push(item.PackageDesc);
                    var newObj = { text: item_name_lowercase, value: this.packagedescData.index.indexOf(item.PackageDesc), data: [] };
                    this.packagedescData.value[this.packagedescData.index.indexOf(item.PackageDesc)] = newObj;
                }
                this.packagedescData.value[this.packagedescData.index.indexOf(item.PackageDesc)].data.push(item);
            }
        }
        this.filterDataForm.patchValue({ packagedesc: 0 });
        console.log(this.packagedescData);
        this.trigger_packagedesc();


    }

    resetPackagedesc() {
        this.filterDataForm.patchValue({ packagedesc: "" });
        this.packagedescData = { index: [], value: [] };
        this.resetQuantity();
    }

    trigger_packagedesc() {
        console.log('packagedesc');
        console.log(this.packagedescData.value);
        console.log(this.filterDataForm.value);
        this.resetQuantity();
        let quantityDetails: any = [];
        quantityDetails = this.packagedescData.value[this.filterDataForm.value.packagedesc].data;

        if (quantityDetails.length > 0) {
            let groupbyqty: any = [];
            let groupindex: any = [];
            for (let q = 0; q <= quantityDetails.length - 1; q++) {
                let item: any = quantityDetails[q];
                // let item_name            : any = item.PackageSize + (item.PackageUnit);
                let item_name: any = parseInt(item.PackageSize);
                if (this.quantityData.index.indexOf(item_name) < 0) {
                    if (this.quantityData.index[0]) {
                        if (parseInt(item_name) > parseInt(this.quantityData.index[0])) {
                            this.quantityData.index.push(item_name);
                        }
                        else {
                            this.quantityData.index.unshift(item_name);
                        }
                    }
                    else {
                        this.quantityData.index.push(item_name);
                    }

                    let newObj = { text: item_name, unit: item.PackageUnit, value: this.quantityData.index.indexOf(item_name), ndc: [], data: [] };
                    this.quantityData.value[this.quantityData.index.indexOf(item_name)] = newObj;
                }
                this.quantityData.value[this.quantityData.index.indexOf(item_name)].ndc.push(item.NDC);
                this.quantityData.value[this.quantityData.index.indexOf(item_name)].data.push(item);
            }
        }
        this.filterDataForm.patchValue({ quantity: 0 });
        console.log("test");
        console.log(this.quantityData);
        console.log("test");
    }

    resetQuantity() {
        this.filterDataForm.patchValue({ quantity: "" });
        this.quantityData = { index: [], value: [] };
    }

    trigger_quantity() {
        console.log('quantity');
    }

    resetPackage() {
        this.filterDataForm.patchValue({ package: "" });
        this.packageData = { index: [], value: [] };
        this.resetPackagedesc();
    }
    addToMedications() {
        this.medications.push(this.drugSelected);
        this.tempStorage.cart.medications.drugs = this.medications;
         
        this.tempStorage.cart.medications.byNdc[this.drugSelected.NDC] = this.drugSelected;
        this.drugSelected = { QtyPrediction: [{}], QtySelected: {} };
        this.showAddDrugFab = true;
        this.searchName = true;
        this.medicationsList = true;
        //  console.log(this.tempStorage.cart.medications);
    }
    removeMedication(index) {
           
        // let removedObj = this.RecentSearch.splice(index, 1);
        let removedObj = this.medications.splice(index, 1);
       // let removedObj = this.medications.filter(index, 1)
         
         console.log(removedObj);
        // console.log(removedObj[0].NDC);
        this.tempStorage.cart.medications.drugs = this.medications;
        this.tempStorage.cart.medications.byNdc[removedObj[0].NDC] = null;
        delete this.tempStorage.cart.medications.byNdc[removedObj[0].NDC];
        
         //this.getCart();
    }

    updateAC(item) {
        console.log(item);
        console.log(this.drugSelected);
      

        this.medicationsList = false;
        this.searchName = false;
        this.customField = false;
        this.QuantityDropdown = true;
        this.searchDataForm.patchValue({ term: item.text });
        this.searchDataForm.patchValue({ gpi10s: item.value });
        // console.log(this.searchDataForm.value.gpi10s);
        // console.log(this.searchDataForm.value.term);
        this.finddis=false;
        this.finddisNot=true;
        this.searchItemSelected = true;
        this.autoCompleteResultShow = false;
        let GPI10s_array: any = item.value;
        let GPI10s: any = GPI10s_array.join();
        //console.log(GPI10s);
         
        this.drugSelected = { QtyPrediction: [{}] };

        
        this.trigger_gpi14(GPI10s);

        /*this.filterSearch.first              = true;

        let parent                 : any;
            parent                 = item.text;
        let parent_lowercase                        : any = parent.toLowerCase();
        
        //this.filterSearch.first                     = false;
        this.deliveryService.formatDrugs({gpi10: GPI10s}).then((result) => {
            let resultData                 : any;
                resultData                 = result;

                this.addingInProgress = false;

            this.gpi12Data                                  = {index: [], value: []};
            if(resultData.drugs.length > 0) {
                for(let g = 0; g <= resultData.drugs.length -1; g++) {
                    let item : any = resultData.drugs[g];
                    let item_name: any = item.BN;
                    let item_name_lowercase: any = item_name.toLowerCase();
                    if( this.gpi12Data.index.indexOf(item.BN) < 0 ) {
                        this.gpi12Data.index.push(item.BN);
                        var newObj     = {text: item_name_lowercase, value: this.gpi12Data.index.indexOf(item.BN), group: []};
                        //if(item_name_lowercase == parent_lowercase) {
                         //   newObj.text = item_name_lowercase;
                        //} 
                        this.gpi12Data.value[this.gpi12Data.index.indexOf(item.BN)] = newObj;
                    }
                    this.gpi12Data.value[this.gpi12Data.index.indexOf(item.BN)].group.push(item);
                }
               // console.log(this.gpi12Data);
                this.filterDataForm.patchValue({gpi12: 0});

                this.trigger_gpi14(GPI10s);
                // this.changeDetector.detectChanges();
                this.filterSearch.first              = true;
            }
            
        });*/
        // this.searchMedicine(item.value);

    }

    resetdosage() {
        // Reset gpi12
        this.filterDataForm.patchValue({ dosage: "" });
        this.dosageData = { index: [], value: [] };
        this.resetStrength();
        // End 
    }
    resetgpi12() {
        // Reset gpi12
        this.filterDataForm.patchValue({ gpi12: "" });
        this.gpi12Data = { index: [], value: [] };
        // End 
        this.resetdosage();
    }
    updateDrugSelection(variationItem) {

        // console.log(variationItem);
        // console.log(this.searchDataForm.value.gpi10s);
        this.drugSelected = { QtyPrediction: [{}], QtySelected: {} };
        this.drugSelected = variationItem;
        this.drugSelected.QtySelected = variationItem.QtyPrediction[0];


    }
    ajaxMedicine(event) {
         
        this.showAddDrugFab = false;
        this.autoCompleteResultShow = false;
        this.autoCompleteNoResultShow = false;
        let keyword = event.value;
        this.currentDrug = null;
        this.drugSelected = { QtyPrediction: [{}] };
        if (keyword == "" || this.searchItemSelected) {
            this.autocomplete = [];
            this.autoCompleteResultShow = false;
            this.autoCompleteNoResultShow = false;
            this.searchItemSelected = false;
            if (keyword == "") {
                this.drugSelected = {};
            }

            return false;
        }

        this.autocomplete = [];
        this.showspinner = true;
        this.addingInProgress = false;
        this.resetgpi12();

        //console.log(event.value);
        this.deliveryService.ajaxDrugs({ term: keyword }).then((result) => {
            this.autocomplete = [];
            let resultData: any;
            resultData = result;

            //console.log(resultData);
            if (resultData.drugs.length > 0) {
                for (var i = 0; i < resultData.drugs.length; i++) {
                    let item = resultData.drugs[i];
                    let obj: any = {
                        value: item.GPI10s,
                        GPI10s: item.GPI10s[0],
                        text: item.BN,
                        DrugTypes: item.DrugTypes,
                        display_name: item.BN,
                        BN: [item.BN],
                        AN: ((item.AN) ? [item.AN] : []),
                        brand_text: ((item.AN) ? ((item.DrugTypes == "B") ? "Brand for " + item.AN : "Gneric for " + "" + item.AN) : "")
                    }
                    let indexMatched: any = this.deliveryService.contains(this.autocomplete, item.GPI10s[0], "GPI10s", true);
                    //  console.log(i);
                    //  console.log(indexMatched);
                    if (indexMatched >= 0) {
                        ((this.deliveryService.contains(this.autocomplete[indexMatched]['BN'], item.BN) ? "" : this.autocomplete[indexMatched]['BN'].push(item.BN)));

                        ((this.deliveryService.contains(this.autocomplete[indexMatched]['AN'], item.AN) ? "" : this.autocomplete[indexMatched]['AN'].push(item.AN)));

                        this.autocomplete[indexMatched]['brand_text'] = ((this.autocomplete[indexMatched]['AN'].length > 0) ? ((item.DrugTypes == "B") ? "Brand for " + this.autocomplete[indexMatched]['AN'].join(",") : "Gneric for " + this.autocomplete[indexMatched]['AN'].join(",")) : "")

                    } else {
                        
                        this.searchOptionData[item.slug] = obj;
                        this.autocomplete.push(obj);
                    }

                }
                this.autoCompleteResultShow = true;
            }
            else {
                this.autoCompleteNoResultShow = true;
            }
            this.showspinner = false;
            //  console.log(this.autocomplete);
            // console.log(this.autocomplete.length);
        });
    }
    filterPharmacies(pharmacies) {
        // console.log(pharmacies);
        return pharmacies;
    }
    searchMedicine(event) {
        this.showAddDrugFab = false;
        this.pharmaciesError = "Getting pharmacies, please wait.";
        //  this.drugSelected                                   = this.searchOptionData[event];
        this.pharmacies = [];
        this.deliveryService.pharmacyList(this.drugSelected).then((result) => {
            let resultData: any;
            resultData = result;
            this.pharmacies = [];
            if (resultData.outdata.length > 0) {
                for (var x = 0; x <= resultData.outdata.length - 1; x++) {
                    let item: any;
                    item = {
                        pharmacy_id: resultData.outdata[x].pharmacy_id,
                        pharmacy_name: resultData.outdata[x].pharmacy_name,
                        drug: resultData.outdata[x].drug,
                        drugtype: resultData.outdata[x].drugtype,
                        drugspec: { mg: "", count: "" },
                        retail_price: resultData.outdata[x].retail_price,
                        membership_price: resultData.outdata[x].membership_price,
                        nonmembership_price: resultData.outdata[x].nonmembership_price,
                        price: resultData.outdata[x].retail_price,
                        selected: false
                    };
                    /* if(this.ismember == "paidmember")
                    {
                        item.price                       = resultData.outdata[x].membership_price;
                    } */
                    this.currentDrug = resultData.outdata[x].drug.value;
                    let currentIndex = this.cartDrugsKey.indexOf(resultData.outdata[x].drug.value);
                    if (currentIndex > -1) {
                        if (this.cartDrugs[currentIndex]['pharmacy_id'] == resultData.outdata[x].pharmacy_id) {
                            item.selected = true;
                            item.drugspec = this.cartDrugs[currentIndex].drugspec;
                            this.drugmg = this.cartDrugs[currentIndex].drugspec.mg;
                            this.drugcount = this.cartDrugs[currentIndex].drugspec.count;
                            this.showAddDrugFab = true;
                        }
                    }
                    else {
                        item.drugspec = { mg: this.drugmg, count: this.drugcount }
                    }

                    if (this.pharmacySelected && this.pharmacySelected.value !== undefined) {
                        if (this.pharmacySelected.value === item.pharmacy_id) {
                            this.pharmacies.push(item);
                        }
                    } else {
                        this.pharmacies.push(item);
                    }
                }
            }
            else {
                this.pharmaciesError = "No Pharmacies found";
            }

        })
    }
    dismiss() {
        this.navCtrl.pop();
        // this.viewCtrl.dismiss();
    }
    onClearMedicineSearch(event: any) {
        this.drugSelected = {};
        this.resetgpi12();
        this.searchName = true;
        this.medicationsList = true;
    }

    onCancelMedicineSearch() {
        console.log("cancel");
    }

    showConfirm() {
        let profilemembership: any = this.tempStorage.getMembershipStatus();

        console.log(profilemembership);
        if (profilemembership == 'premiumactive') {
            this.nonmemberPrice();
        }
        else if (profilemembership == 'premiumexpired') {
            if (this.tempStorage.cart.membership.status == 'member') {
                this.nonmemberPrice();
            }
            else {
                this.membershipDetails();
            }
        }
        else if (profilemembership == 'free') {
            if (this.tempStorage.cart.membership.status == 'member') {
                this.nonmemberPrice();
            }
            else {
                this.deliveryService.mobiconfirm('Sign up to create discount card to avail discount up to 80% on prescription medicines.', 'Create Discount Card').then((result) => {
                    // console.log(result);
                    if (result == true) {
                        this.membershipDetails(); // take to membership page
                    }
                    else {
                        this.nonmemberPrice(); // go to cart page
                    }
                });
            }
        }
        else {
            // it will never com here as all user are mean to free memebership by default
            if (this.tempStorage.cart.membership.status == 'member') {
                this.nonmemberPrice();
            }
            else {
                this.deliveryService.mobiconfirm('Sign up and get more discount for Generic and Prescription Medicines.', 'Become a member').then((result) => {
                    console.log(result);
                    if (result == true) {
                        this.membershipDetails()
                    }
                    else {
                        this.nonmemberPrice();
                    }
                });
            }

        }
        /* let self : any = this;
        mobiscroll.confirm({
            title: ,
            message: ,
            okText: 'Yes',
            cancelText: 'No',
            callback: function (res) {
                if(res) {
                    setTimeout(() => {
                        
                        if(((membership.plan == "") || (membership.plan == "free")) && ((membership.status == "") || (membership.status == "expired"))) {
                            self.membershipDetails()
                        }
                        self.membershipDetails();
                    }, 1000);                    
                }
                else {
                    setTimeout(() => {
                        self.nonmemberPrice();
                    }, 1000);
                }
                mobiscroll.toast({
                    message: res ? 'Getting membership details' : 'Placing non membership order',
                    duration: 1000
                });
            }
        });*/
    }
    addDrug(pharmacy: any, index: any) {
        if (1 == 1) {
            return false;
            //unused functions
        }
        // if(this.cartDrugs[pharmacy.drug.value] && (this.cartDrugs[pharmacy.drug.value]['pharmacy_id'] != pharmacy.pharmacy_id)) {
        if ((this.cartDrugsKey.indexOf(pharmacy.drug.value) > -1) || (this.cartPharmacy != null && this.cartPharmacy != pharmacy.pharmacy_id)) {
            this.alertCannotAdd(pharmacy, index);
        }
        else {
            this.pharmacies[index].selected = true;
            this.pharmacies[index].drugspec = { mg: this.drugmg, count: this.drugcount }
            this.cartDrugs.push(pharmacy);
            this.cartDrugsKey.push(pharmacy.drug.value);
            this.cartPharmacy = pharmacy.pharmacy_id;
            this.showAddDrugFab = true;
        }
        console.log(this.cartDrugs);
        console.log(this.cartPharmacy);

        this.setCart();
    }

    removeDrug(pharmacy: any, index: any) {

        if (1 == 1) {
            return false;
            //unused functions
        }

        this.pharmacies[index].selected = false;
        this.cartDrugs.splice(this.cartDrugsKey.indexOf(pharmacy.drug.value), 1);
        this.cartDrugsKey.splice(this.cartDrugsKey.indexOf(pharmacy.drug.value), 1);

        // delete this.cartDrugs[pharmacy.drug.value];
        if (Object.keys(this.cartDrugs).length === 0) {
            this.cartPharmacy = null;
        }
        this.setCart();
    }

    removeAllDrugs() {
        for (var i = 0; i <= this.pharmacies.length - 1; i++) {
            this.pharmacies[i].selected = false;
        }
    }

    cartcount() {
           
        //return Object.keys(this.cartDrugs).length;
        this.cartOrders = this.deliveryService.cartOrders();
        if(this.cartOrders.cartPharmacy.pricing == undefined){
            this.TotalCartValue ='0';
          }
          else{
            this.TotalCartValue= this.cartOrders.cartPharmacy.pricing.length;
          }
          
        //this.TotalCartValue = this.tempStorage.cart.medications.drugs.length;
        console.log("total cart length"+this.tempStorage.cart.medications.drugs.length);
        return this.tempStorage.cart.medications.drugs.length;
        /*  if(this.medications !== undefined){
          return this.medications.length ;
          }else{
              return 0;
          }*/
    }
    membershipDetails() {
        this.searchDataForm.patchValue({ term: "" });
        this.navCtrl.push(MembershipPlanPage);
    }

    memberPrice() {

    }

    nonmemberPrice() {
        this.goto('druginfo');
    }

    alertCannotAdd(pharmacy: any, index: any) {
        var self = this;
        mobiscroll.confirm({
            title: 'You can only order drugs from one pharmacy at a time',
            message: 'Clear your cart if you\'d still like to order this drug',
            okText: 'Clear cart and Add',
            cancelText: 'Cancel',
            callback: function (res) {
                if (res) {
                    mobiscroll.toast({
                        message: 'Cart cleared and adding new drug',
                        duration: 1000
                    });
                    self.clearCart();
                    self.removeAllDrugs();
                    setTimeout(() => {
                        self.addDrug(pharmacy, index);
                    }, 1000);
                }
                else {

                }
                /* mobiscroll.toast({
                    message: res ? 'Getting membership details' : 'Placing non membership order',
                    duration: 1000
                }); */
            }
        });
    }

    clearCart() {
        this.cartDrugs = [];
        this.cartDrugsKey = [];
        this.cartPharmacy = null;
        this.setCart();
    }

    setCart() {
        // this.addingInProgress = true;

        /*  this.tempStorage.cart.drugs                   = this.cartDrugs;
          this.tempStorage.cart.keys                    = this.cartDrugsKey;
          this.tempStorage.cart.pharmacy                = this.cartPharmacy;
          i dont we need this, as i already updated tempvariable, no change req
          */

        /* updating db */
         
        this.cartOrders = this.deliveryService.cartOrders();
        console.log(this.cartOrders);
        let orderData: any = {};
        orderData.user_id = this.user_id;
        orderData.items = {
            otcdrugs: this.cartOrders.otcdrugs, //empty
            rxdrugs: this.cartOrders.rxdrugs // empty
        };
         
        orderData.medications = this.cartOrders.medications; //by NDC
        orderData.pharmacy = this.cartOrders.cartPharmacy;
        orderData.pharmacy_id = this.cartOrders.pharmacy_id;
        orderData.total_amount = this.cartOrders.cartvalue;
        orderData.total_saving = this.cartOrders.pricediff;
        // orderData.payment_status = "not-paid";
        // orderData.payment_id = "";
        orderData.order_status = "order-in-cart";
        orderData.order_type = "order";
        orderData.deliveryInfo = this.cartOrders.deliveryInfo;
  
        //orderData.rx = this.uploadedRXimages;
        // orderData.payment_type = "";
        console.log(orderData);
        this.deliveryService.createOrder(orderData, this.tempStorage.cart.remoteId).then((result: any) => {
  
            if (result.insertedId !== undefined) {

                this.tempStorage.cart.remoteId = result.insertedId;

            }

            //  this.addingInProgress = false;



        });

        /* updating db end */

        //console.log(this.cartOrders.otcdrugs);
        //console.log(this.cartOrders.rxdrugs);
        console.log(this.tempStorage.cart);
        console.log(this.tempStorage);
    }
    getCart() {
         
        
        this.showAddDrugFab = false;
        this.cartDrugs = this.tempStorage.cart.drugs; // not used
        this.cartDrugsKey = this.tempStorage.cart.keys; // not used
        this.cartPharmacy = this.tempStorage.cart.pharmacy;
        this.medications = this.tempStorage.cart.medications.drugs;
        // this.medications.forEach(element => {
        //      
        //     this.medqty = element.QtySelected.qty;
        // });
      //  this.medqty = this.tempStorage.cart.medications.drugs.QtySelected.qty;


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

    clearStorage() {
        this.tempStorage.clearCartDrugs();
    }

    ionViewDidEnter() {
        this.getCart();
        // this.onClearMedicineSearch(false);
    }
    goto(action: any) {
        this.navCtrl.push(DrugInfoPage);

        // if (action == 'druginfo') {
        //     // this.searchDataForm.patchValue({ term: "" });
        //     // console.log(this.tempStorage.cart);
        //     if (this.tempStorage.cart.pharmacy !== undefined && this.tempStorage.cart.pharmacy !== null && this.tempStorage.cart.pharmacy.pricing !== undefined && this.tempStorage.cart.pharmacy.pricing.length > 0 && (this.tempStorage.cart.pharmacy.pricing.length == this.tempStorage.cart.medications.drugs.length)) {
        //         this.searchDataForm.patchValue({ term: "" });
        //         this.navCtrl.push(DrugInfoPage);
        //     } else {
        //         this.deliveryService.mobiToast("Please choose price & pharmacy", "danger");
        //     }


        // }

    }

    focusSearch() {
        this.onClearMedicineSearch(null);
        this.searchDataForm.patchValue({ term: "" });
        this.showAddDrugFab = false;
        setTimeout(() => {
            this.autosearch.setFocus();
            this.keyboard.show();
        }, 300);
    }
    searchbarClick() {
        this.showAddDrugFab = false;
    }

    saveInMedicabinet(){
          
         const chkValue = this.medicabinetDataForm.value;
        if(chkValue.medicabinet == false){ //here false = true
            this.medicabinetArray.push(this.drugSelected);
             
           this.tempStorage.setMedicabinetData(this.medicabinetArray);
        }
        else{
            if(this.medicabinetArray.length != 0){
                this.medicabinetArray.pop();
                this.tempStorage.setMedicabinetData(this.medicabinetArray);
            }
            
        }
    }

    checked() {
        console.log('checked');
       this.medicabinetDataForm.controls['medicabinet'].setValue(false);

        // if (this.currentLocation !== '') {
            this.searchDataForm.patchValue({ term: "" });
 
            this.medications.push(this.drugSelected);
             
            //    this.RecentSearch.push(this.drugSelected);
            this.tempStorage.cart.medications.drugs = this.medications;
            // this.tempStorage.cart.recentSearch.drugs = this.RecentSearch;
             
            this.RecentSearch=this.medications;
            this.tempStorage.cart.medications.byNdc[this.drugSelected.NDC] = this.drugSelected;
          this.drugSelected = { QtyPrediction: [{}], QtySelected: {} };
            this.showAddDrugFab = true;
            this.searchName = true;
            this.medicationsList = true;
        // } else {
        //      
        //     this.changeLocation();
        // }
    }

    DrugQuantity(item){
         
        console.log(item);
        if(item.BN == this.drugSelected.BN){
             
            this.drugSelected.QtySelected.qty = this.qty;
        }
       
    }
    doneAllTablet(){
        this.medicabinetDataForm.controls['medicabinet'].setValue(false);
        this.searchDataForm.patchValue({ term: "" });
         
        // this.drugSelected.QtySelected.qty = this.qty;
        if(this.drugSelected && Object.keys(this.drugSelected).length){ 
        this.medications.push(this.drugSelected);
        this.RecentSearch=this.medications;
        // this.RecentSearch.push(this.drugSelected);
        }
         
        //store recent data
        // this.tempStorage.setRecentSearchData(this.medications);
           
        this.tempStorage.cart.medications.drugs = this.medications;
        this.RecentSearch=this.medications;
        // this.tempStorage.cart.recentSearch.drugs = this.RecentSearch;
          
        this.tempStorage.cart.medications.byNdc[this.drugSelected.NDC] = this.drugSelected;
        // this.tempStorage.cart.recentSearch.byNdc[this.drugSelected.NDC] = this.drugSelected;
        
        this.drugSelected = { QtyPrediction: [{}], QtySelected: {} };
        //this.getCart();

        this.finddis=true;
        this.finddisNot=false;
    }
    clearLocation() {
        this.currentLocation = ''
    }

    showCustomQuantity() {
        this.customField = true;
        this.QuantityDropdown = false;
    }

    openPharmacyModel() {
         
        if (this.checkDeliveryAvailale(this.myLocationObj.zip)) {

        } else {
             
            if (this.tempStorage.Adminconfig.service_able_zip != undefined) {
                this.deliveryService.mobiAlert('', 'MediDelivery not in your area yet, we are adding to new zip codes soon, will notify once available in your area.Still can save up to 80 % on Rx with our FREE MediPocket Prescription Savings Card by simple showing from app at pharmacy and save $$$. <br> Delivery Available at <br>' + this.tempStorage.Adminconfig.service_able_zip.join() + ".").then(result => {
                    return false;
                });
                return false;
            }
        }
        // const modal = this.modalCtrl.create(customAutoComplete, { ismodel: true, myLocationObj: this.myLocationObj, template: "pharmacy_price_list", placeHolder: "Search Pharmacy", templateBasedData: this.RecentSearch });
       const modal = this.modalCtrl.create(customAutoComplete, { ismodel: true, myLocationObj: this.myLocationObj, template: "pharmacy_price_list", placeHolder: "Search Pharmacy", templateBasedData: this.medications });
        modal.onDidDismiss(data => {
            // console.log(data);
            // console.log(this.tempStorage.cart);
            if (data && data.pricing !== undefined) { // means it has pahrmacy data selected
                 
                this.pharmacySelected = data;
                this.tempStorage.cart.pharmacy = this.pharmacySelected;
                // console.log(this.tempStorage.cart);
                let filterObj: any = {};
                filterObj.case = "set-pharmacy";
                filterObj.postData = {
                    "pharmacy_name": this.pharmacySelected.name,
                    "street1": this.pharmacySelected.street1,
                    "zip_code": this.pharmacySelected.zip
                }
                //filterObj.user_id = this.user_id;
                this.deliveryService.mobiToast("Setting your pharmacy, Please wait ...", "success").then((result) => {

                });
                
                this.deliveryService.commonUsecase(filterObj).then((result: any) => {

                    if (result.data !== undefined) {
                        this.tempStorage.cart.pharmacy_id = result.data.pharmacy_id;
                        this.getCart();
                        this.setCart();
                        this.showConfirm();
                    } else {
                        this.deliveryService.mobiToast("Sorry technical error, unable to move forward ...", "danger").then((result) => {

                        });
                    }



                });


            }
            //  this.showAddDrugFab                                 = true;
        });
        modal.present();
    }

    checkDeliveryAvailale(currZip) {
        if (currZip !== undefined && currZip != "") {
            return this.deliveryService.checkDeliveryAvailale(currZip);
        } else {
            return false;
        }
    }

    changeLocation() {

        const modal = this.modalCtrl.create(customAutoComplete, { ismodel: true, myLocationObj: this.myLocationObj, template: "change_location", placeHolder: "Search Pharmacy", templateBasedData: {} });
        modal.onDidDismiss(data => {
            console.log(data);
            if (data && data !== undefined && data.address !== undefined && data.cords !== undefined) {
                this.currentLocation = data.address;
                this.myLocationObj = data.cords;
                console.log(this.myLocationObj);
                this.tempStorage.cart.deliveryInfo.address.text = this.currentLocation;
                this.tempStorage.cart.deliveryInfo.address.latitude = this.myLocationObj.latitude;
                this.tempStorage.cart.deliveryInfo.address.longitude = this.myLocationObj.longitude;
                this.tempStorage.cart.deliveryInfo.address.zip = this.myLocationObj.zip;
            }
            // this.pharmacySelected = data;

        });
        modal.present();

    }

    shareMpCard() {

        let msg = "Show this with your prescription at the pharmacy counter and receive the instant savings.";
        let shareImageUrl = {
            family: "https://mymedipocket.com/qa/img/pharmacy-savings-card-front.png",
            pet: "https://mymedipocket.com/qa/img/pharmacy-savings-card-front-pet.png"
        }
        //console.log(this.httpurl +"assets/pdf/" +this.PoDetail.po_ref +".pdf");
        this.socialSharing.shareWithOptions(
            {
                message: msg,
                url: "https://mymedipocket.com/",
                files: [shareImageUrl[this.toWhom]],
                /////data/user/0/techbee.otpc/753025443.pdf" 
                chooserTitle: "MediPocket Pharmacy Discount Card"
            })
            .then((result) => {
                // this.analytics.trackEvent("Share Success" , result.app);
            })
            .catch((err) => {
                /// this.analytics.trackEvent("Share Fail" , JSON.stringify(err));
            });
    }


}
