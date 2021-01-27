import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { DrugInfoPage } from '../../../pages/delivery/drug-info/drug-info';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { MembershipSignupPage } from '../membership-signup/membership-signup';
import { MembershipCardPage } from '../../membership-card/membership-card';
import { DiscountCardPage } from '../../discount-card/discount-card';
import { RxDiscountPage } from '../../RX-Discount/rx-discount/rx-discount';

/**
 * Generated class for the MembershipPlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-membership-plan',
  templateUrl: 'membership-plan.html',
})
export class MembershipPlanPage {
    planDataForm 								          : any;
    currmembershipStatus                                  : any;
    pageSettings = {
        theme: 'ios'
    };
    constructor(public tempStorage: TempStorageProvider, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
        this.planDataForm                             = this.formBuilder.group({
            type                                        : ["free", Validators.required]
        });
        this.currmembershipStatus = this.tempStorage.getMembershipStatus();
        console.log(this.currmembershipStatus);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MembershipPlanPage');
        this.currmembershipStatus = this.tempStorage.getMembershipStatus();
        
    }
    ionViewDidEnter() {
        console.log(this.currmembershipStatus);
        //console.log(this.tempStorage.cart);
    }
    continuenext() {
        //console.log(this.planDataForm.value);
        this.tempStorage.setCartMembership('member', this.planDataForm.value.type);
        this.navCtrl.push(MembershipSignupPage);
    }
    druginfo() {
        this.navCtrl.setRoot(DrugInfoPage);
    }

    takeToMemberCard(){
        this.navCtrl.push(RxDiscountPage);
    }

}
