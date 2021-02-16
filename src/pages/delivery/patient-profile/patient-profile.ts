import { Component, NgZone, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  PopoverController,
  Platform,
} from "ionic-angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { SingleImageUploadComponent } from "../../../components/single-image-upload/single-image-upload";
import { MultiImageUpload } from "../../../components/multi-image-upload/multi-image-upload";
// import { DrugInfoPage } from '../../../pages/delivery/drug-info/drug-info';
// import { ConfirmationMessagePage } from '../../../pages/delivery/confirmation-message/confirmation-message';
import { DeliveryServiceProvider } from "../../../providers/delivery-service/delivery-service";
import { TempStorageProvider } from "../../../providers/temp-storage/temp-storage";
import {
  mobiscroll,
  MbscPopupOptions,
  MbscSelect,
  MbscSelectOptions,
  MbscNumpadOptions,
} from "../../../lib/mobiscroll-package";
import { AppSettings } from "../../../app/settings";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { ImageSlidePage } from "../../image-slide/image-slide";
import { FamilyTreePage } from "../../family-tree/family-tree";
import { DiscountCardPage } from "../../discount-card/discount-card";
import { UtilsProvider } from "../../../providers/utils/utils";
import { FileUploadProvider } from "../../../providers/file-upload/file-upload";
import { ApiCallProvider } from "../../../providers/api-call/api-call";

/**
 * Generated class for the MembershipSignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

mobiscroll.settings = {
  theme: "ios",
};
@Component({
  selector: "page-patient-profile",
  templateUrl: "patient-profile.html",
})
export class PatientProfilePage {
  profileFormData: FormGroup;
  today: any = new Date().toISOString();
  tempData: any = {
    country: null,
    state: null,
    city: null,
    license_country: null,
    license_state: null,
  };
  displayError: any;
  memberdetails: any;
  cartOrders: any;
  profileUpdate: any;
  profileSpecSettings: MbscPopupOptions;

  user_id: any;
  profileInfo: any;
  displayMode: boolean = true;
  @ViewChild(SingleImageUploadComponent)
  singleImageUpload: SingleImageUploadComponent;
  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  @ViewChild("mbscRemoteCoun") remoteCoun: MbscSelect;
  @ViewChild("mbscRemoteReg") remoteReg: MbscSelect;
  @ViewChild("mbscRemoteDiv") remoteDiv: MbscSelect;

  heightSettings: MbscSelectOptions = {
    theme: "ios",
  };
  heightItems: any = [
    {
      value: 1,
      text: "inches",
    },
    {
      value: 2,
      text: "cms",
    },
  ];
  weightSettings: MbscSelectOptions = {
    theme: "ios",
  };
  weightItems: any = [
    {
      value: 1,
      text: "lbs",
    },
    {
      value: 2,
      text: "kgs",
    },
  ];
  bloodtypeSettings: MbscSelectOptions = {
    theme: "ios",
  };
  bloodtypeItems: any = [
    {
      value: "",
      text: "",
    },
    {
      value: 1,
      text: "A+",
    },
    {
      value: 2,
      text: "A-",
    },
    {
      value: 3,
      text: "B+",
    },
    {
      value: 4,
      text: "B-",
    },
    {
      value: 5,
      text: "AB+",
    },
    {
      value: 6,
      text: "O+",
    },
    {
      value: 7,
      text: "O-",
    },
  ];
  protected uploadFinished = false;
  uploadedAvatar: any = [];
  //	liveurl                         : any = AppSettings.liveurl;
  httpurl: any = AppSettings.API_ENDPOINT;

  localurl: any = AppSettings.localurl;
  // nodeserverurl                   : any = AppSettings.nodeserverurl;
  emptyValue = { value: "", text: "", disabled: true };
   processResponse = (result) => {
    let data: any = result.data;
    console.log("country", data);
    var i,
      item,
      ret = [];

    if (data) {
      for (i = 0; i < result.data.length; i++) {
        item = data[i];
        ret.push({
          value: item._id,
          text: item.name,
        });
      }
    }
    // ret.unshift(this.emptyValue);
    return ret;
  };
 countryData: any = {
    url: this.httpurl + "public-collections/mp_countries/",
    dataType: "json",
    remoteFilter: true,
    processResponse: this.processResponse,
  };
  stateData: any = {
    url: this.httpurl + "public-collections/mp_states/0/",
    dataType: "json",
    remoteFilter: true,
    processResponse: this.processResponse,
  };

  cityData: any = {
    url: this.httpurl + "public-collections/mp_cities/0/",
    dataType: "json",
    remoteFilter: true,
    processResponse: this.processResponse,
  };
  countrySettings: MbscSelectOptions = {
    data: this.countryData,
    filter: true,
    onSet: (ev, inst) => {
      console.log(typeof inst);
      console.log(inst);
      console.log(ev);
      this.profileFormData.patchValue({ countryname: ev.valueText });
      if (typeof inst !== "boolean") {
        this.tempData.state = null;
        this.tempData.city = null;
      }
      console.log('remote Reg',this.remoteReg);
      
      this.remoteReg.instance.settings.invalid.length = 0;
      this.remoteReg.instance.settings.data.url =
        this.httpurl +
        "public-collections/mp_states/" +
        this.profileFormData.value.country +
        "/";
      this.remoteDiv.instance.settings.invalid.length = 0;
      if (this.tempData.state === null) {
        this.profileFormData.patchValue({ state: "", city: "" });
      } else {
        this.profileFormData.patchValue({ city: "" });
      }

      setTimeout(() => {
        this.remoteReg.instance.refresh();
        this.remoteReg.instance.enable();
        this.remoteDiv.instance.disable();
        if (this.tempData.state !== null) {
          this.profileFormData.patchValue({ state: this.tempData.state });
          this.stateSettings.onSet(
            { valueText: this.profileFormData.value.statename },
            true
          );
        }
      }, 200);
    },
  };
  stateSettings: MbscSelectOptions = {
    data: this.stateData,
    filter: true,
    disabled: true,
    onSet: (ev, inst) => {
      console.log(ev);
      console.log(inst);

      this.profileFormData.patchValue({ statename: ev.valueText });
      if (typeof inst !== "boolean") {
        this.tempData.city = null;
      }
      this.remoteDiv.instance.settings.invalid.length = 0;
      this.remoteDiv.instance.settings.data.url =
        this.httpurl +
        "public-collections/mp_cities/" +
        this.profileFormData.value.state +
        "/";
      if (this.tempData.city === null) {
        this.profileFormData.patchValue({ city: "" });
      }
      setTimeout(() => {
        this.remoteDiv.instance.refresh();
        this.remoteDiv.instance.enable();
        if (this.tempData.city !== null) {
          this.profileFormData.patchValue({ city: this.tempData.city });
          this.citySettings.onSet(
            { valueText: this.profileFormData.value.cityname },
            true
          );
        }
      }, 200);
    },
  };
  citySettings: MbscSelectOptions = {
    data: this.cityData,
    disabled: true,
    filter: true,
    onSet: (ev, inst) => {
      console.log(ev);
      console.log(inst);
      this.profileFormData.patchValue({ cityname: ev.valueText });
    },
  };
  @ViewChild('verifyPhone') VerifyPhone: any;
  
  verifyPhonesettings: MbscPopupOptions = {
    display: "center",
    buttons: [
      {
        text: "Close",
        handler: "cancel",
      },
      {
        text: "Verify",
        
        handler: (event, inst) => {
             
          // do your check here
          console.log(this.verifyOtp);
          if (this.verifyOtp) {
            this.verifyAndCreate(inst);
            //inst.hide();
          } else {
            this.deliveryService.mobiToast("OTP can't be empty", "danger");
            return false;
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
  verifyOtp: number;
  showspinnerOTP: any;

  numpadSettings: MbscNumpadOptions = {
    theme: "ios",
    template: "dddd",
    allowLeadingZero: true,
    placeholder: "-",

    validate: (event) => {
      return {
        disabled: [],
        invalid: event.values.length !== 4,
      };
    },
  };
  showSpinner: any;

  uploadedInsuranceCard: any;
  editUploadedInsuranceCard: any;
  isSubmitted: any;
  typeIn: boolean = false;
  userImageURL:any ="https://medipocket-upload-file.s3.amazonaws.com/";
  loadUserImageParam:string='';
  gender1: string;
  constructor(
    public modalCtrl: ModalController,
    private changeDetector: ChangeDetectorRef,
    private sanitization: DomSanitizer,
    public zone: NgZone,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryService: DeliveryServiceProvider,
    public tempStorage: TempStorageProvider,
    private popOverCtrl: PopoverController,
    private util: UtilsProvider,
    private fileUpload: FileUploadProvider,
    private api:ApiCallProvider,
    private androidplatform: Platform
  ) {
    this.profileFormData = this.formBuilder.group({
      name: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [""],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      address: ["", Validators.required],
      city: [""],
      cityname: [""],
      state: ["", Validators.required],
      statename: [""],
      zip_code: ["", Validators.required],
      country: ["", Validators.required],
      countryname: [""],
      phone: ["", Validators.required],
      height: ["", Validators.required],
      height_unit: [1],
      weight: ["", Validators.required],
      weight_unit: [1],
      blood_type: [""],
      avatar: [{}],
    });
    this.showSpinner = false;
    this.isSubmitted = false;
    this.uploadedInsuranceCard = [];
    this.editUploadedInsuranceCard = [];
    console.log(this.tempStorage.authsession);
     
    if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    this.profileInfo = {};
    this.profileInfo.avatar = {};
    
    // this.api.getUniversal('getaccesstoken').then(data=>{
    //   console.log(data.auth_token)
    //   this.api.getUniversal('states/United States', data.auth_token).then(data=>{
    //     console.log('states', data)
    //   } , err=>{
    //     console.log('err states', err)
    //   })
    // }, err=>{
    //   console.log(err)
    // });
    
    this.getProfileInfo();
    this.profileSpecSettings = {
      display: "center",
      theme: "ios",
      buttons: [
        {
          text: "Update",
          handler: "set",
        },
      ],
      onSet: function (event, inst) {
        console.log(event);
        console.log(inst);
      },
      onBeforeShow: function (event, inst) {
        console.log(event);
        console.log(inst);
      },
    };

    //upload image
    this.fileUpload.getDownloadImageSubject().subscribe(data =>{
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
  }

  protected uploadAvatharFn(postData) {
    if (!this.profileFormData.valid) {
      this.displayError = true;
      return false;
    }
    if (this.singleImageUpload.images.length == 0) {
      this.deliveryService.mobiToast("Please add profile image", "danger");
      return;
    }

    //let postData                         : any = {};
    this.isSubmitted = true;
    this.singleImageUpload
      .uploadImages()
      .then((images) => {
        this.uploadFinished = false;
        this.singleImageUpload.isUploading = false;
        this.singleImageUpload.images = [];
        this.singleImageUpload.imagesValue = [];
        this.singleImageUpload.imagesBase64 = [];
        this.singleImageUpload.uploadingHandler = {};
        this.singleImageUpload.uploadingProgress = {};

        for (var i = 0; i <= images.length - 1; i++) {
          let item = {
            originalpath: images[i].file.path,
            path: this.sanitization.bypassSecurityTrustStyle(
              "url(" + images[i].file.path + ")"
            ),
          };
          this.uploadedAvatar = [];
          this.uploadedAvatar.push(item);
        }

        postData.avatar = this.uploadedAvatar[0];
        this.isSubmitted = false;
        this.updateProfileFields(postData);
      })
      .catch(() => {
        this.isSubmitted = false;
      });
  }
  protected cancel() {
    this.deliveryService.confirm("Are you sure to cancel?").then((value) => {
      if (value) {
        this.singleImageUpload.abort();
      }
    });
  }
 
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
 ionViewWillEnter(){
  this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
   if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
 }
  ionViewDidLoad() {
     this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
     if(localStorage.getItem('socialLogin') == 'true'){
      this.user_id =  localStorage.getItem('userId');
    }
else{
  this.user_id = this.tempStorage.authsession.userdata.user_id;
}  
    console.log(this.profileInfo);
    console.log("ionViewDidLoad MembershipSignupPage");
  }
  setDisplayMode(value: boolean, addFamily: boolean) {
    if (addFamily) {
      this.navCtrl.push(FamilyTreePage);
    } else {
      this.editUploadedInsuranceCard = [...this.uploadedInsuranceCard];
      console.log(this.editUploadedInsuranceCard);
      if (!value) {
        this.displayMode = value;
        this.changeDetector.detectChanges();
        this.countrySettings.onSet(
          { valueText: this.profileInfo.countryname },
          true
        );
      } else {
        this.profileFormData.patchValue({
          country: this.profileInfo.country,
          countryname: this.profileInfo.countryname,
          state: this.profileInfo.state,
          statename: this.profileInfo.statename,
          city: this.profileInfo.city,
          cityname: this.profileInfo.cityname,
        });
        this.tempData.country = this.profileInfo.country;
        this.tempData.state = this.profileInfo.state;
        this.tempData.city = this.profileInfo.city;
        this.remoteReg.instance.settings.data.url =
          this.httpurl +
          "public-collections/mp_states/" +
          this.profileInfo.country +
          "/";
        this.remoteDiv.instance.settings.data.url =
          this.httpurl +
          "public-collections/mp_cities/" +
          this.profileInfo.state +
          "/";

        this.displayMode = value;
      }
      console.log(this.profileFormData.get('cityname').value)
      console.log('temp City',this.tempData.city);
    }
  }
  removeAvatar(image: any, index: any) {
    this.deliveryService.confirm("Are you sure to remove it?").then((value) => {
      if (value) {
        this.uploadedAvatar.splice(index, 1);
        this.profileFormData.patchValue({
          avatar: {},
        });
      }
    });
  }
  updateProfileFields(Objs) {
    this.isSubmitted = true;
    this.util.presentLoading();
    this.deliveryService
      .updateProfileInfo(Objs, this.user_id)
      .then((result) => {
        let resultData: any = {};
        resultData = result;
        this.isSubmitted = false;
        this.util.dismissLoading();
        //console.log(result);
        if (resultData.data !== undefined) {
          this.fileUpload.setDownloadImageSubject();
          this.displayMode = true;
          this.deliveryService.mobiToast(
            "Profile updated successfully.",
            "success"
          );
          setTimeout(() => {
            if (
              this.profileInfo.phone_verified !== undefined &&
              this.profileInfo.phone_verified == true
            ) {
              Objs.phone_verified = true;
            } else {
              Objs.phone_verified = false;
            }

            this.profileInfo = Objs;
           // birthdate
            this.profileInfo.dob = moment.unix(Objs.dob).toISOString(true);
              
            this.tempStorage.authsession.userdata.profileData.email =
              Objs.email;
            this.tempStorage.authsession.userdata.profileData.name = Objs.name;
            this.tempStorage.authsession.userdata.profileData.dob = Objs.dob;
            /*console.log(this.tempStorage.authsession);
	userdata:
	profileData:
	dob: "1055010600"
	email: "info@tech-bee.com"
	name: "Muni P"
	phone: "1234567890"*/
  this.profileInfo.avatar.path = this.sanitization.bypassSecurityTrustStyle(
    "url(http://localhost/_app_file_/data/user/0/com.medipocket.newpatient/files/IMG-20201017-WA0017.jpg)"
  );
            if (
              this.profileInfo.avatar !== undefined &&
              this.profileInfo.avatar.originalpath !== undefined
            ) {
              this.profileInfo.avatar.path = this.sanitization.bypassSecurityTrustStyle(
                "url(" + this.profileInfo.avatar.originalpath + ")"
              );
           
              localStorage.setItem(
                "profilePhotoUrl",
                this.profileInfo.avatar.originalpath
              );
           }
            // image form control value as well
            this.profileFormData.patchValue({
              avatar: this.profileInfo.avatar,
            });

            this.tempData.country = this.profileInfo.country;
            this.tempData.state = this.profileInfo.state;
            this.tempData.city = this.profileInfo.city;

            //	console.log(this.tempStorage.authsession);
            this.tempStorage.authsession.userdata.profileIncompelete = false;
          }, 500);
        } else {
          this.deliveryService.mobiToast(
            "Error in updating profile.",
            "danger"
          );
        }
      });
  }

	
  
  submitProfileInfo() {
    if (!this.profileFormData.valid) {
      this.displayError = true;
      return false;
    }
    this.util.presentLoading();
    setTimeout(() => {
      let postData = { ...this.profileFormData.value };
     postData.dob = moment(postData.dob).format("X");

    if (
      this.singleImageUpload !== undefined &&
      this.singleImageUpload.images !== undefined &&
      this.singleImageUpload.images.length > 0
    ) {
      this.uploadInsurance().then((uploadedInsurance) => {
        if (uploadedInsurance != undefined && uploadedInsurance.length > 0) {
          postData.uploadedInsurance = uploadedInsurance;
          this.uploadedInsuranceCard = [...uploadedInsurance]; // to shpw om view mode
        } else {
          if (this.editUploadedInsuranceCard.length == 0) {
            // if image removed
            postData.uploadedInsurance = [];
            this.uploadedInsuranceCard = []; // to shpw om view mode
          }
        }

        this.uploadAvatharFn(postData);
      });
    } else {
      this.uploadInsurance().then((uploadedInsurance) => {
        if (uploadedInsurance != undefined && uploadedInsurance.length > 0) {
          postData.uploadedInsurance = uploadedInsurance;
          this.uploadedInsuranceCard = [...uploadedInsurance]; // to shpw om view mode
        } else {
          if (this.editUploadedInsuranceCard.length == 0) {
            // image removed
            postData.uploadedInsurance = [];
            this.uploadedInsuranceCard = []; // to shpw om view mode
          }
        }
        this.updateProfileFields(postData);
      });
    }
  },5000);
  }

  async uploadInsurance() {
    if (
      this.multiImageUpload == undefined ||
      this.multiImageUpload.images == undefined ||
      this.multiImageUpload.images.length == 0
    ) {
      // this.deliveryService.mobiToast("Please select at least 1 photo", "danger");
      return [];
    } else {
      try {
        this.isSubmitted = true;
        const images = await this.multiImageUpload.uploadImages();
        this.uploadFinished = false;
        this.multiImageUpload.isUploading = false;
        this.multiImageUpload.images = [];
        this.multiImageUpload.imagesValue = [];
        this.multiImageUpload.imagesBase64 = [];
        this.multiImageUpload.uploadingHandler = {};
        this.multiImageUpload.uploadingProgress = {};
        let insuranceUploaded = [];
        for (var i = 0; i <= images.length - 1; i++) {
          let item = {
            originalpath: images[i].file.path,
            path: this.sanitization.bypassSecurityTrustStyle(
              "url(" + images[i].file.path + ")"
            ),
          };
          insuranceUploaded.push(item);
        }
        this.isSubmitted = false;

        return insuranceUploaded;
      } catch (e) {
        this.isSubmitted = false;
        return [];
      }
    }
  }

  removeInsuranceCard() {
    this.editUploadedInsuranceCard = [];
  }

  getHeight(val: any) {
    let heightText: any = "";
    for (var x = 0; x <= this.heightItems.length - 1; x++) {
      if (val == this.heightItems[x].value) {
        heightText = this.heightItems[x].text;
        break;
      }
    }
    return heightText;
  }
  getWeight(val: any) {
    let weightText: any = "";
    for (var x = 0; x <= this.weightItems.length - 1; x++) {
      if (val == this.weightItems[x].value) {
        weightText = this.weightItems[x].text;
        break;
      }
    }
    return weightText;
  }
  getBloodType(val: any) {
    let bloodText: any = "";
    for (var x = 0; x <= this.bloodtypeItems.length - 1; x++) {
      if (val == this.bloodtypeItems[x].value) {
        bloodText = this.bloodtypeItems[x].text;
        break;
      }
    }
    return bloodText;
  }
  getProfileInfo() {
    this.util.presentLoading();
    this.tempData = { country: null, state: null, city: null };
    this.showSpinner = true;
    this.uploadedInsuranceCard = [];
    this.deliveryService
      .profileInfo(AppSettings.usertype, this.user_id)
      .then((result) => {
        this.util.dismissLoading();
        console.log('result of profile is', result);

        let resultData: any = {};
        resultData = result;
        this.showSpinner = false;
         
        if (resultData.data !== undefined) {
           
          this.zone.run(() => {
             
            this.profileInfo = resultData.data;
    
            if(resultData.data.firstName !== undefined){
              localStorage.setItem('name',resultData.data.firstName)
            }
              
            console.log('profile Info:-', this.profileInfo);
            this.profileInfo.dob = moment
              .unix(resultData.data.dob)
              .toISOString(true);
               
              this.profileInfo.avatar={};
              this.profileInfo.avatar.path = this.sanitization.bypassSecurityTrustStyle(
                "url(http://localhost/_app_file_/data/user/0/com.medipocket.newpatient/files/IMG-20201017-WA0017.jpg)"
              );
              
            if (this.profileInfo.avatar !== undefined && this.profileInfo.avatar.path !== undefined
            ) {
               
              
              this.profileInfo.avatar.path = this.sanitization.bypassSecurityTrustStyle(
                "url(" + this.profileInfo.avatar.originalpath + ")"
              );
             
              localStorage.setItem(
                "profilePhotoUrl",
                this.profileInfo.avatar.originalpath
              );
              this.uploadedAvatar = [];
              this.uploadedAvatar.push(this.profileInfo.avatar);
              this.uploadedAvatar[0].path = this.sanitization.bypassSecurityTrustStyle(
                "url(" + this.profileInfo.avatar.originalpath + ")"
              );
            } else {
               
              this.profileInfo.avatar = {};
              this.uploadedAvatar = [];
            }

            if (
              this.profileInfo.uploadedInsurance !== undefined &&
              this.profileInfo.uploadedInsurance.length > 0
            ) {
              for (
                var i = 0;
                i < this.profileInfo.uploadedInsurance.length;
                i++
              ) {
                if (
                  this.profileInfo.uploadedInsurance[i] !== undefined &&
                  this.profileInfo.uploadedInsurance[i].path !== undefined
                ) {
                  this.profileInfo.uploadedInsurance[
                    i
                  ].path = this.sanitization.bypassSecurityTrustStyle(
                    "url(" +
                    this.profileInfo.uploadedInsurance[i].originalpath +
                    ")"
                  );
                  this.uploadedInsuranceCard.push(
                    this.profileInfo.uploadedInsurance[i]
                  );
                  this.uploadedInsuranceCard[
                    i
                  ].path = this.sanitization.bypassSecurityTrustStyle(
                    "url(" +
                    this.profileInfo.uploadedInsurance[i].originalpath +
                    ")"
                  );
                }
              }
            } else {
              this.profileInfo.uploadedInsurance = [];
              this.uploadedInsuranceCard = [];
            }

            //  console.log(this.profileInfo);
            this.profileFormData.patchValue({
              name: this.profileInfo.name,
              firstName: this.profileInfo.firstName,
              lastName: this.profileInfo.lastName,
              dob: this.profileInfo.dob,
              gender: this.profileInfo.gender,
              address: this.profileInfo.address,
              city: this.profileInfo.city,
              state: this.profileInfo.state,
              zip_code: this.profileInfo.zip_code,
              country: this.profileInfo.country,
              countryname: this.profileInfo.countryname,
              statename: this.profileInfo.statename,
              cityname: this.profileInfo.cityname,
              phone: this.profileInfo.phone,
              email: this.profileInfo.email,
              height: this.profileInfo.height,
              height_unit: this.profileInfo.height_unit,
              weight: this.profileInfo.weight,
              weight_unit: this.profileInfo.weight_unit,
              blood_type: this.profileInfo.blood_type,
            });
            this.util.dismissLoading();
            this.tempData.country = this.profileInfo.country;
            this.tempData.state = this.profileInfo.state;
            this.tempData.city = this.profileInfo.city;
            if (!this.displayMode) {
              this.countrySettings.onSet(
                { valueText: this.profileFormData.value.countryname },
                true
              );
            } else {
            }
          });
        } else {
        }
      }).catch(error => {
        this.util.dismissLoading();
        console.log('Error initialization is', error);
      });
  }

  zoomImage(image: any) {
    let searchModal = this.modalCtrl.create(ImageSlidePage, {
      templateTitle: "Insurance",
      template: "uploaded_insurance",
      url: image.originalpath,
    });
    searchModal.onDidDismiss((data) => {
      console.log("page > modal dismissed > data > ", data);
      if (data) {
      }
    });
    searchModal.present();
  }

  updatedProfileOTPInfo() {
    let Objs = {};
    this.deliveryService
      .updateProfileInfo(Objs, this.user_id)
      .then((result) => { });
  }
  openVerifyWindow() {
     
    let postData: any = {};
    postData.msg = "will be replaced";
    postData.action = "verify-phone";
    postData.purpose = "otp";
    this.displayError = false;

    // if (!this.profileFormData.value.phone) {
    //    
    //   this.displayError = true;
    //   this.deliveryService.mobiToast(
    //     "Phone number can not be empty!!!",
    //     "danger"
    //   );
    //   return false;
    // }
    if (!this.profileInfo.phone) {
       
      this.displayError = true;
      this.deliveryService.mobiToast(
        "Phone number can not be empty!!!",
        "danger"
      );
      return false;
    }
    // postData.source 					= "email";
    //	postData.subject = "Otp to rest password";
  //  postData.to = this.profileFormData.value.phone; //this.profileInfo.phone,
  postData.to = this.profileInfo.phone;
    (postData.user_id = this.user_id),
      //postData.resend                     = false
      //	postData.user_type = this.profileInfo.user_type;
      
      this.deliveryService.mobiToast("Sending OTP, Please wait...", "success");
       
      this.VerifyPhone.instance.show();
    this.deliveryService.registerGetOTP(postData).then((result) => {
        
      this.VerifyPhone.instance.show();
    }).catch(error => {
      console.log('Error initialization is', error);
    });
  }

  verifyAndCreate(popoverInst) {
     
    //console.log(this.verifyOtp);
    this.showspinnerOTP = false;
    if (!this.verifyOtp) {
      this.displayError = true;
      return false;
    }
    this.showspinnerOTP = true;
    // if(type == 'trainer')
    // {
    let postData: any = {};
    postData.to = this.profileFormData.value.phone;
    postData.action = "verify-phone";
    postData.purpose = "otp";
    postData.source = "sms";
    postData.user_id = this.user_id;
    postData.otp = this.verifyOtp;
    // console.log(type);
    return this.deliveryService.verifyOTP(postData).then((result) => {
       
      let resultData: any;
      resultData = result;
      this.showspinnerOTP = false;
      if (resultData.data !== undefined) {
        let updateObj = {};
        updateObj = {
          phone: this.profileFormData.value.phone,
          phone_verified: true,
        };
        this.profileInfo.phone = this.profileFormData.value.phone;
        this.profileInfo.phone_verified = true;
        this.tempStorage.authsession.userdata.profileData.phone_verified = true;
        this.deliveryService
          .updateProfileInfo(updateObj, this.user_id)
          .then((result) => { });
           
        this.deliveryService.mobiToast("OTP Verified, Successfully", "success");
        setTimeout(() => {
          popoverInst.hide();
        }, 2000);

        return false;
      } else {
        this.deliveryService.mobiToast(
          "Sorry, unable to verify. OTP not mathcing",
          "danger"
        );
        return false;
      }
    }).catch(error => {
      console.log('Error initialization is', error);
    });

    // }
    //console.log();
  }
  filePicker(type) {
    console.log('type is', type);
    if(type==='camera'){
      this.fileUpload.takePicture();
    }else{
      this.fileUpload.openGallery();
    }
  }
  discountCard() {
    const popOver = this.popOverCtrl.create(DiscountCardPage);
    popOver.present();
  }
  opentypeIn(typeIn){
    if(typeIn == 'typein'){
      this.typeIn = true;
      this.gender1 ="";
    }
    else{
      this.typeIn = false;
    }
   
  }
}
