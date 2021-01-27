import {Component} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { ActionSheetController, AlertController, Platform, ToastController, normalizeURL} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import { Base64 } from '@ionic-native/base64';
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { AppSettings } from '../../app/settings';

/**
 * Generated class for the SingleImageUploadComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var cordova: any;
@Component({
  selector: 'single-image-upload',
  templateUrl: 'single-image-upload.html',
  providers: [Camera, File, FilePath, Platform]
})
export class SingleImageUploadComponent {
	// public serverUrl = "http://jquery-file-upload.appspot.com/";
    public serverUrl = AppSettings.nodeserverurl + "imageupload/";

    public isUploading = false;
    public uploadingProgress = {};
    public uploadingHandler = {};
    public images: any = [];
    public imagesValue: Array<any>;
    public imagesBase64: any = [];

    constructor(public platform: Platform,private base64: Base64, private sanitization: DomSanitizer, private actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: FileTransfer, private file: File, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    }

    public uploadImages(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.isUploading = true;
            Promise.all(this.images.map(image => {
                return this.uploadImage(image);
            }))
                .then(resolve)
                .catch(reason => {
                    this.isUploading = false;
                    this.uploadingProgress = {};
                    this.uploadingHandler = {};
                    reject(reason);
                });

        });
    }

    public abort() {
        if (!this.isUploading)
            return;
        this.isUploading = false;
        for (let key in this.uploadingHandler) {
            this.uploadingHandler[key].abort();
        }
    }

    // ======================================================================

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

            //get photo from the camera based on platform type
            if (this.platform.is('ios'))
                base64Image = imageData;
            else
                base64Image = imageData;

           // console.log("file url");
           // console.log(imageData);
            let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
           // console.log(filename);
            let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
           // console.log(path);
 
            //then use the method reasDataURL  btw. var_picture is ur image variable
            this.file.readAsDataURL(path, filename).then((res) => {
             //    console.log(res);
                this.imagesBase64.push(res);
                this.images.push(imageData);
                this.util.trustImages();

            });
                //add photo to the array of photos
            // this.addPhoto(base64Image);
          //  this.images.push(base64Image);
          //  this.util.trustImages();

        }, (error) => {
            console.debug("Unable to obtain picture: " + error, "app");
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
          //encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }

        this.camera.getPicture(cameraOptions).then((file_uri) => {

            //add photo to the array of photos
           // this.addPhoto(normalizeURL(file_uri));
          // console.log("gal file url");
           // console.log(file_uri); 
            
            let filename = file_uri.substring(file_uri.lastIndexOf('/') + 1);
           // console.log(filename);
            let path = file_uri.substring(0, file_uri.lastIndexOf('/') + 1);
           // console.log(path);
           // console.log(filename.indexOf('?'));
           // console.log("--");
            //console.log(filename.indexOf('.'));
            if (filename.lastIndexOf('?') > filename.lastIndexOf('.')){
                filename = filename.substring(0, filename.lastIndexOf('?'));
            }
          //  console.log(filename);

            //then use the method reasDataURL  btw. var_picture is ur image variable
            this.file.readAsDataURL(path, filename).then((res) => {
              //  console.log(res);
                this.imagesBase64.push(res);
                this.images.push(file_uri);
                this.util.trustImages();

            },
            (error)=>{
                console.log(error);
                
            });
           // let drawImage = this.generateFromImage(file_uri, 700, 700, 1,"");
            /*let test = this.generateFromImage(file_uri, 400, 400, 0.5, thumbnail => {
                console.log("am i in ");
                console.log(thumbnail);
                this.imagesBase64.push(thumbnail);
                this.images.push(file_uri);
                this.util.trustImages();
            }) */ 

            

           // this.imagesBase64.push(drawImage);
           // this.images.push(normalizeURL(file_uri));
            

        }, (error) => {
            console.debug("Unable to obtain picture: " + error, "app");
            console.log(error);
        });
    }

    protected removeImage(image) {
        if (this.isUploading)
            return;
        this.util.confirm("Are you sure to remove it?").then(value => {
            if (value) {
                this.util.removeFromArray(this.imagesValue, image);
                this.util.removeFromArray(this.images, image.url);
                this.util.removeFromArray(this.imagesBase64, image.base64);
            }
        });
    }

    protected showAddImage() {
        if (!window['cordova']) {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = "image/x-png,image/gif,image/jpeg";
            input.click();
            input.onchange = () => {
                let blob = window.URL.createObjectURL(input.files[0]);
                this.imagesBase64.push(blob);
                this.images.push(blob);
                this.util.trustImages();
            }
        } else {
            new Promise((resolve, reject) => {
                let actionSheet = this.actionSheetCtrl.create({
                    title: 'Add a photo',
                    buttons: [
                        {
                            text: 'From photo library',
                            handler: () => {
                                resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
                            }
                        },
                        {
                            text: 'From camera',
                            handler: () => {
                                resolve(this.camera.PictureSourceType.CAMERA);
                            }
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                reject();
                            }
                        }
                    ]
                });
                actionSheet.present();
            }).then(sourceType => {
                if (!window['cordova'])
                    return;
                if(sourceType === this.camera.PictureSourceType.CAMERA){

                    this.takePicture();
                
                }else{

                    this.openGallery();

                }
                    
                    
                 
            }).catch(() => {
            });
        }
    }
    
   

    public generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
        var canvas: any = document.createElement("canvas");
        var image = new Image();

        image.onload = () => {
          var width = image.width;
          var height = image.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");

          ctx.drawImage(image, 0, 0, width, height);

          // IMPORTANT: 'jpeg' NOT 'jpg'
          var dataUrl = canvas.toDataURL('image/jpeg', quality);

          callback(dataUrl)
        }
        image.src = img;
    }
    private base64Encode(val: any) {
        this.base64.encodeFile(val).then((base64File: string) => {
            console.log(base64File);
        }, (err) => {
    
            console.log(err);
        });
    }


    private uploadImage(targetPath) {
        return new Promise((resolve, reject) => {
            this.uploadingProgress[targetPath] = 0;

            if (window['cordova']) {
                let options = {
                    fileKey: "files[]",
                    fileName: targetPath,
                    chunkedMode: false,
                    mimeType: "multipart/form-data",
                };

                const fileTransfer : FileTransferObject = this.transfer.create();
                this.uploadingHandler[targetPath] = fileTransfer;

                fileTransfer.upload(targetPath, this.serverUrl, options).then(data => {
                    resolve(JSON.parse(data.response));
                }).catch(() => {
                    askRetry();
                });

                fileTransfer.onProgress(event2 => {
                    this.uploadingProgress[targetPath] = Math.round(event2.loaded * 100 / event2.total);
                });
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', targetPath, true);
                xhr.responseType = 'blob';
                xhr.onload = (e) => {
                    if (xhr['status'] != 200) {
                        this.util.showToast("Your browser doesn't support blob API");
                        console.error(e, xhr);
                        askRetry();
                    } else {
                        const blob = xhr['response'];
                        let formData: FormData = new FormData(),
                            xhr2: XMLHttpRequest = new XMLHttpRequest();
                        formData.append('files[]', blob);
                        this.uploadingHandler[targetPath] = xhr2;

                        xhr2.onreadystatechange = () => {
                            if (xhr2.readyState === 4) {
                                if (xhr2.status === 200)
                                    resolve(JSON.parse(xhr2.response));
                                else
                                    askRetry();
                            }
                        };

                        xhr2.upload.onprogress = (event) => {
                            this.uploadingProgress[targetPath] = Math.round(event.loaded * 100 / event.total);
                        };

                        xhr2.open('POST', this.serverUrl, true);
                        xhr2.send(formData);
                    }
                };
                xhr.send();
            }

            let askRetry = () => {
                // might have been aborted
                if (!this.isUploading) return reject(null);
                this.util.confirm('Do you wish to retry?', 'Upload failed').then(res => {
                    if (!res) {
                        this.isUploading = false;
                        for (let key in this.uploadingHandler) {
                            this.uploadingHandler[key].abort();
                        }
                        return reject(null);
                    }
                    else {
                        if (!this.isUploading) return reject(null);
                        this.uploadImage(targetPath).then(resolve, reject);
                    }
                });
            };
        });
    }

    private util = ((_this: any) => {
        return {
            removeFromArray<T>(array: Array<T>, item: T) {
                let index: number = array.indexOf(item);
                if (index !== -1) {
                    array.splice(index, 1);
                }
            },
            confirm(text, title = '', yes = "Yes", no = "No") {
                return new Promise(
                    (resolve) => {
                        _this.alertCtrl.create({
                            title: title,
                            message: text,
                            buttons: [
                                {
                                    text: no,
                                    role: 'cancel',
                                    handler: () => {
                                        resolve(false);
                                    }
                                },
                                {
                                    text: yes,
                                    handler: () => {
                                        resolve(true);
                                    }
                                }
                            ]
                        }).present();
                    }
                );
            },
            trustImages(base64: any = false) {
                _this.imagesValue = _this.images.map(
                    (val, index) => {
                        var currBase64 = _this.imagesBase64[index];
                        return {
                            base64: currBase64,
                            url: val,
                            sanitized: _this.sanitization.bypassSecurityTrustStyle("url(" + currBase64 + ")")
                        
                        }
                    }
                );
            },
            showToast(text: string) {
                _this.toastCtrl.create({
                    message: text,
                    duration: 5000,
                    position: 'bottom'
                }).present();
            }
        }
    })(this);

}
