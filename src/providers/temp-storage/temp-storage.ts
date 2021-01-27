import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../app/settings';


@Injectable()
export class TempStorageProvider {
	profile: any;
	cart: any;
	uploadrx: any;
	membershipsetting: any = AppSettings.membership;
	user_id: any = AppSettings.userid;
	authsession: any;
	Adminconfig: any;
	constructor(public http: Http) {
		this.uploadrx = [];
		this.authsession = { userdata: null };
		this.Adminconfig = {};
		this.clearCart();
		console.log('Hello TempStorageProvider Provider');
	}

	setAuthSession(userdata: any = null) {
		this.authsession = { userdata: userdata }
	}
	setAdminConfig(adminConfig: any = null) {
		this.Adminconfig = adminConfig;
	}
	clearAuthSession() {
		this.authsession = { userdata: null };
		this.Adminconfig = {};
	}
	clearSession() {

	}

	clearCart() {
		this.cart = {
			isEdit: false, // true means edit from order list
			cartHasControlledMedicine: false,
			drugs: [], keys: [], pharmacy: null, total: 0, pricediff: 0,
			pharmacy_id: "",
			membership: { status: "nonmember", price: 0, plan: "" },
			membershipdata: {},
			medications: { drugs: [], byNdc: {} },
			activities: [],
			deliveryInfo: {
				address: {
					text: "",
					zip: "",
					placeId: "",
					latitude: "",
					longitude: ""
				},
				deliveryOption: "", //delivery or pickup
				timeSlot: ""


			},
			fillpxFormData: {},
			rxPickup: {
				address: {
					//same as deliery info address obj
				},
				timeSlot: ""
			}
		};
		this.uploadrx = [];

	}

	clearCartMembership() {
		this.cart.membership = { status: "nonmember", price: 0, plan: "" };
		this.cart.membershipdata = {};
	}
	clearCartDrugs() {
		this.cart.drugs = [];
		this.cart.keys = [];
		this.cart.pharmacy = null;
		this.cart.medications = { drugs: [], byNdc: {} };
		this.cart.total = 0;
		this.cart.membership = 0;
		this.cart.remoteId = "";
	}

	setCartMembership(status: any = 'nonmember', plan: any = "") {
		//	console.log(this.cart);
		//	console.log(plan);
		this.cart.membership.plan = plan;
		this.cart.membership.status = status;

		if (plan == "free") {
			this.cart.membership.price = this.membershipsetting.free;
		}
		else if (plan == "premium") {
			this.cart.membership.price = this.membershipsetting.premium;
		}
		else {
			this.cart.membership.price = 0;
		}
	}
	setProfileMembership(status: any = 'nonmember', plan: any = "") {
		this.profile = { membership: { status: status, price: 0, plan: plan } };
	}

	getMembershipStatus() {
		let membership: any = { plan: "", status: "nonmember" };
		if (typeof this.profile !== "undefined") {
			membership = { plan: this.profile.membership.plan, status: this.profile.membership.status };
		}
		let status = 'nonmember';
		if ((membership.plan == 'premium') && (membership.status == 'active')) {
			status = "premiumactive";
		}
		else if ((membership.plan == 'premium') && (membership.status == 'expired')) {
			status = "premiumexpired";
		}
		else if (membership.plan == 'free') {
			status = "free";
		}
		return status;
	}


}
