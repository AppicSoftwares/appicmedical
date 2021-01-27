import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../app/settings';
import { Platform, ActionSheetController, AlertController, ToastController,LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { TempStorageProvider } from '../temp-storage/temp-storage';
import { Http } from '@angular/http';
import { Subject } from 'rxjs';
import { UtilsProvider } from '../utils/utils';

/*
  Generated class for the FileUploadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileUploadProvider {
  // public serverUrl = "http://jquery-file-upload.appspot.com/";
  //  public serverUrl = AppSettings.nodeserverurl + "imageupload/";
  liveurl: any = AppSettings.liveurl;
  public isUploading = false;
  public uploadingProgress = {};
  public uploadingHandler = {};
  public images: any = [];
  public imagesValue: Array<any>;
  public imagesBase64: any = [];
  user_id: any;
  safeImg: any;
  private downloaduserImage = new Subject<any>();
  constructor(  private util: UtilsProvider,public loadingController: LoadingController,public http: Http, public tempStorage: TempStorageProvider, public platform: Platform, private base64: Base64, private sanitization: DomSanitizer, private actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: FileTransfer, private file: File, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    //  console.log('server Url', this.serverUrl);
    this.user_id = this.tempStorage.authsession.userdata.user_id;
  }


  takePicture() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      //destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      targetWidth: 1200,
      targetHeight: 800,
      saveToPhotoAlbum: false,
      correctOrientation: true,

    }
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = null;
      if (this.platform.is('ios'))
        base64Image = imageData;
      else
        base64Image = imageData;
      let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      this.file.readAsDataURL(path, filename).then((res) => {
        console.log('res', res);
        console.log('images', this.images)
        this.uploadFile(res);
        this.imagesBase64.push(res);
        this.images.push(imageData);

      });

    }, (error) => {
      console.log("Unable to obtain picture: " + error, "app");
      // console.log(error);
    });
  }
  openGallery() {
    let cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 80,
      targetWidth: 1200,
      targetHeight: 800,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(cameraOptions).then((file_uri) => {
 
      let filename = file_uri.substring(file_uri.lastIndexOf('/') + 1);
      let path = file_uri.substring(0, file_uri.lastIndexOf('/') + 1);
      if (filename.lastIndexOf('?') > filename.lastIndexOf('.')) {
        filename = filename.substring(0, filename.lastIndexOf('?'));
      }
       
      const newBaseFilesystemPath = this.file.dataDirectory;
      this.file.copyFile(path, filename,
        newBaseFilesystemPath, filename);
      const storedPhoto = newBaseFilesystemPath + filename;
      console.log('storedPhoto', storedPhoto)
      const displayImage = window['Ionic']['WebView'].convertFileSrc(storedPhoto);
      console.log('displayImage', displayImage)
      localStorage.setItem('profilePhotoUrl',displayImage)
      console.log('safeImg', this.safeImg)
     
      this.file.readAsDataURL(path, filename).then(async (res) => {
        console.log('readAsDataURL', res)
        console.log('images', this.images)
        // let toast = this.toastCtrl.create({
        //   message: 'Please Wait ...',
        //   duration: 5000,
        //   position: 'bottom'
        // });
      
        // toast.onDidDismiss(() => {
        //   console.log('Dismissed toast');
        // });
      
        // toast.present();
        this.util.presentLoading();
        this.uploadFileFromDevice(res);
        this.imagesBase64.push(res);
        console.log('file_uri', file_uri)
        this.images.push(file_uri);
      },
        (error) => {
          console.log('error init', error);
        });
    }, (error) => {
      this.util.dismissLoading();
      console.debug("Unable to obtain picture: " + error, "app");
      console.log(error);
    });
  }
  // uploadFileFromDevice(imageURI) {
  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   let options: FileUploadOptions = {
  //     fileKey: "file",
  //      fileName: new Date().getTime().toString(),
  //     // chunkedMode: false,
  //     // mimeType: 'multipart/form-data',
  //    // httpMethod: 'POST',
  //     params : {"user_id": this.user_id},
  //     headers:{}
  //   }
  //   console.log('uploadFile',imageURI)
  //   fileTransfer.upload(JSON.stringify(imageURI), this.liveurl + 'upload-file', options)
  //     .then((data) => {
  //       console.log(data + " Uploaded Successfully");
  //     }, (err) => {
  //       console.log(err);

  //     });
  // }
  //upload on server
  uploadFileFromDevice(imageURI) {
  let data  =  {
    file:imageURI,
    user_id:this.user_id
  }
    console.log('uploadFile',imageURI);
    const request: string = this.liveurl + 'upload-file';
    this.http.post(request, data).map((res) => res.json()).subscribe(
      (data) => {
        this.util.presentLoading();
        console.log('upload-success', data);
        this.setDownloadImageSubject();
        this.downloadFile();
        //resolve(data);
      },
      (error) => {
        this.util.dismissLoading();
        let toast = this.toastCtrl.create({
          message: 'error in uploading',
          duration: 3000,
          position: 'bottom',
          cssClass:'danger'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
        //reject(error)
        console.log('error-upload', error);
      });
  }
  // //here is the method is used to get content type of an bas64 data  
  getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }
  //here is the method is used to convert base64 data to blob data  
  base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }
  uploadFile(imageURI) {
    let contentType = this.getContentType(imageURI);
    let DataBlob = this.base64toBlob(imageURI, contentType);
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    let filePath = this.file.externalRootDirectory + 'profile';
    this.file.writeFile(filePath, this.user_id + '.jpg', DataBlob, contentType).then((success) => {
      console.log("File Writed Successfully", success);
    }).catch((err) => {
      console.log("Error Occured While Writing File", err);
    })
  }
  downloadFile() {
    console.log('downloadFile');
    const request: string = 'https://medipocket-upload-file.s3.amazonaws.com/';
    this.http.get(request + this.user_id, '').subscribe(
      (data) => {
        this.setDownloadImageSubject();
        console.log('Download Success: ', data);
        
        this.util.dismissLoading();
      },
      (error) => {
        this.util.dismissLoading();
        // let toast = this.toastCtrl.create({
        //   message: 'error in uploading',
        //   duration: 3000,
        //   position: 'bottom',
        //   cssClass:'danger'
        // });
      
        // toast.onDidDismiss(() => {
        //   console.log('Dismissed toast');
        // });
      
        // toast.present();
        console.log('Download Error: ', error);
      }
    );
  }
  setDownloadImageSubject(){
    this.downloaduserImage.next();
  }
  getDownloadImageSubject(){
    return this.downloaduserImage;
  }
}