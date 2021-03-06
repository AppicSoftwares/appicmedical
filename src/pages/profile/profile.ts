import { Component, ViewChild } from "@angular/core";
import {  NavController, NavParams, Platform, PopoverController } from "ionic-angular";
import { AppSettings } from "../../app/settings";
import { DeliveryServiceProvider } from "../../providers/delivery-service/delivery-service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TabPage } from "../tab/tab";
import { TempStorageProvider } from "../../providers/temp-storage/temp-storage";
import { SingleImageUploadComponent } from "../../components/single-image-upload/single-image-upload";
import { DomSanitizer } from "@angular/platform-browser";
import { VerifiedPage } from "../auth/verified/verified";
import { AuthenticationPage } from "../auth/authentication/authentication";
import {
  mobiscroll,
  MbscPopupOptions,
  MbscSelect,
  MbscSelectOptions,
  MbscNumpadOptions,
} from "../../lib/mobiscroll-package";
import * as moment from "moment";
import { FileUploadProvider } from "../../providers/file-upload/file-upload";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
@Component({
  selector: "page-profile",
  templateUrl: "profile.html",
})
export class ProfilePage {
  timeLine = "picture";
  gender = "female";
  userId;
  profileForm = new FormGroup({
    name: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    }),
    basic: new FormGroup({
      dob: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
    }),
    general: new FormGroup({
      address: new FormControl('', Validators.required),
      city: new FormControl(''),
      cityname: new FormControl(''),
      state: new FormControl('', Validators.required),
      statename: new FormControl(''),
      country: new FormControl('', Validators.required),
      countryname: new FormControl(''),
      zip_code: new FormControl('', Validators.required),
    }),
    bio: new FormGroup({
      height: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      blood_type: new FormControl(''),
    })
  });
  tempData: any = {
    country: null,
    state: null,
    city: null,
    license_country: null,
    license_state: null,
  };
  @ViewChild(SingleImageUploadComponent)
  singleImageUpload: SingleImageUploadComponent;
  @ViewChild("mbscRemoteCoun") remoteCoun: MbscSelect;
  @ViewChild("mbscRemoteReg") remoteReg: MbscSelect;
  @ViewChild("mbscRemoteDiv") remoteDiv: MbscSelect;
  uploadedAvatar: any = [];
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
  popOver: any;
  loggedData: any;
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
    responsive: this.getResposiveSetting(),
    multiline: 2,
    height: 50,
    onSet: (ev, inst) => {
      console.log(typeof inst);
      console.log(inst);
      console.log(ev);
      this.general.patchValue({ countryname: ev.valueText });
      if (typeof inst !== "boolean") {
        this.tempData.state = null;
        this.tempData.city = null;
      }
      console.log('remote Reg',this.remoteReg);
      
      this.remoteReg.instance.settings.invalid.length = 0;
      this.remoteReg.instance.settings.data.url =
        this.httpurl +
        "public-collections/mp_states/" +
        this.general.value.country +
        "/";
      this.remoteDiv.instance.settings.invalid.length = 0;
      if (this.tempData.state === null) {
        this.general.patchValue({ state: "", city: "" });
      } else {
        this.general.patchValue({ city: "" });
      }

      setTimeout(() => {
        this.remoteReg.instance.refresh();
        this.remoteReg.instance.enable();
        this.remoteDiv.instance.disable();
        if (this.tempData.state !== null) {
          this.general.patchValue({ state: this.tempData.state });
          this.stateSettings.onSet(
            { valueText: this.general.value.statename },
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
    responsive: this.getResposiveSetting(),
    multiline: 2,
    height: 50,
    onSet: (ev, inst) => {
      console.log(ev);
      console.log(inst);

      this.general.patchValue({ statename: ev.valueText });
      if (typeof inst !== "boolean") {
        this.tempData.city = null;
      }
      this.remoteDiv.instance.settings.invalid.length = 0;
      this.remoteDiv.instance.settings.data.url =
        this.httpurl +
        "public-collections/mp_cities/" +
        this.general.value.state +
        "/";
      if (this.tempData.city === null) {
        this.general.patchValue({ city: "" });
      }
      setTimeout(() => {
        this.remoteDiv.instance.refresh();
        this.remoteDiv.instance.enable();
        if (this.tempData.city !== null) {
          this.general.patchValue({ city: this.tempData.city });
          this.citySettings.onSet(
            { valueText: this.general.value.cityname },
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
    responsive: this.getResposiveSetting(),
    multiline: 2,
    height: 50,
    scrollLock:true,
    onSet: (ev, inst) => {
      console.log(ev);
      console.log(inst);
      this.general.patchValue({ cityname: ev.valueText });
    },
  };
  cont: Object;
  states: Object;
  loadUserImageParam: string="";
  userImageURL: string;
  user_id: any;
  user_email: any;
  auth_token: any;
  countryData1: any;
  stateData1: any;
  CityData1: any;
 
 
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deliveryService: DeliveryServiceProvider,
    public tempStorage: TempStorageProvider,
    private sanitization: DomSanitizer,
    private fileUpload: FileUploadProvider,
    private popOverCtrl: PopoverController,
    private androidplatform: Platform,
    private http:HttpClient,
  ) {
    
      this.AccessTokenLocation().subscribe(res=>{
       
    this.auth_token = res.auth_token;
    this.getCountries();
       });
    this.loggedData = this.navParams.get('loggedData');
       
    this.userId = this.loggedData && this.loggedData._id
    console.log('17 userId:', this.userId);
    this.user_email =  this.loggedData.to;
    // this.getcountries();
     //upload image
     this.fileUpload.getDownloadImageSubject().subscribe(data =>{
      this.loadUserImageParam = '?random='+Math.random();
     console.log("random"+ this.loadUserImageParam);
   });
   this.userImageURL ="https://medipocket-upload-file.s3.amazonaws.com/";
//    if(localStorage.getItem('socialLogin') == 'true'){
//       this.user_id =  localStorage.getItem('userId');
//     }
// else{
//   this.user_id = this.tempStorage.authsession.userdata.user_id;
// }  
  }
  getResposiveSetting() {
    return {
        small: {
            display: 'bubble'
        },
        medium: {
            touchUi: false
        }
    };
}
  getProfile() {
    this.deliveryService
      .profileInfo(AppSettings.usertype, this.user_email )
      .then((result) => {
        console.log(result);
      }).catch(err => {
        console.error('Error initialization', err);
      });
  }
  onUserNext() {
    this.timeLine = "gender";
  }
  onGenderNext() {
    this.timeLine = "general";
  }
  onGeneralNext() {
    this.timeLine = "bio";
  }
  get name() {
    return this.profileForm.get('name');
  }
  get basic() {
    return this.profileForm.get('basic');
  }
  get general() {
    return this.profileForm.get('general');
  }
  get bio() {
    return this.profileForm.get('bio');
  }

  filePicker(type) {
    console.log('type is', type);
    if(type==='camera'){
      this.fileUpload.takePicture();
    }else{
      this.fileUpload.openGallery();
    }
  }
  ionViewWillLeave(){
    let backAction = this.androidplatform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
  uploadAvatharFn(postData) {

    if (this.singleImageUpload.images.length == 0) {
      this.deliveryService.mobiToast("Please add profile image", "danger");
      return;
    }

    //let postData                         : any = {};
    this.singleImageUpload
      .uploadImages()
      .then((images) => {
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
           
        this.general.value.countryname = this.general.value.country;
        this.general.value.statename = this.general.value.state;
        this.general.value.cityname = this.general.value.city;
  
        postData.avatar = this.uploadedAvatar[0];
        const objs = {
          ...this.name.value,
          ...this.basic.value,
          ...this.general.value,
          ...this.bio.value,
          gender: this.gender,
          ...postData
        }
        this.updateProfile(objs);
      })
      .catch((err) => {
        console.log('error image uploading', err);

      });
  }
  updateProfile(objs) {

    console.log('update', objs);

    this.deliveryService
      .updateProfileInfo(objs, this.userId)
      .then((result) => {
        console.log('result', result);
        if (result) {
          this.deliveryService.mobiToast(
            "Profile created successfully.",
            "success"
          );
          if (this.popOver) {
            this.popOver.dismiss();
          }
          this.navCtrl.push(AuthenticationPage);
        }
      }).catch(err => {
        this.deliveryService.mobiToast(
          "Error in creating profile.",
          "danger"
        );
        console.error('Error is initialize', err)
      })
  }
  onSubmit() {
       
    this.general.value.countryname = this.general.value.country;
    this.general.value.statename = this.general.value.state;
    this.general.value.cityname = this.general.value.city;
  
    const objs = {
      ...this.name.value,
      ...this.basic.value,
      ...this.general.value,
      ...this.bio.value,
      gender: this.gender,
      dob : moment(this.basic.value.dob).format("X"),
      user_type: "patient"
    }

    this.updateProfile(objs);
    this.popOver = this.popOverCtrl.create(VerifiedPage, {}, { cssClass: 'verified-popover' });
    this.popOver.present();

  }

skipstep(){
  this.navCtrl.push(AuthenticationPage);
}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
getCountries() {
  this.countryApi(this.auth_token).subscribe((res) => {
    console.log(res);
  
    this.countryData1 = res;
  });
}
getState(val) {
     
  // const data = event.value.country_name;
  this.StateApi(val,this.auth_token).subscribe((res) => {
    console.log(res);
    this.stateData1 = res;
  });
}
getCity(val) {
  // const data = event.value.state_name;
  this.CityApi(val,this.auth_token).subscribe((res) => {
    console.log(res);
    this.CityData1 = res;
  });
}


AccessTokenLocation(): Observable<any> {
  let headers = new HttpHeaders({
    "Accept": "application/json",
    "api-token":"cJPhtp6EexcB23qp40XO_eqoEMUB8KkmGXmy9Qqk_nccd-v_f4Hk47RpB09ekYlkqPU",
    "user-email":"rahulkinger.appic@gmail.com"
  });
let options = { headers: headers };
 
  return this.http.get('https://www.universal-tutorial.com/api/getaccesstoken',options);
}
countryApi(auth_token): Observable<any> {
       
  let headers = new HttpHeaders({
    "Authorization": "Bearer "+auth_token,
    "Accept": "application/json"
  });
let options = { headers: headers };
 
  return this.http.get('https://www.universal-tutorial.com/api/countries/',options);
}
StateApi(data,auth_token): Observable<any> {
  let headers = new HttpHeaders({
    "Authorization": "Bearer "+auth_token,
    "Accept": "application/json"
  });
let options = { headers: headers };
 
  return this.http.get('https://www.universal-tutorial.com/api/states/'+data,options);
}
CityApi(data,auth_token): Observable<any> {
  let headers = new HttpHeaders({
    "Authorization": "Bearer "+auth_token,
    "Accept": "application/json"
  });
let options = { headers: headers };
 
  return this.http.get('https://www.universal-tutorial.com/api/cities/'+data,options);
}
}
