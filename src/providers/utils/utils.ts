import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";


@Injectable()
export class UtilsProvider {
  loading: any;
  constructor(public loadingCtrl: LoadingController) {
    console.log("Hello UtilsProvider Provider");
  }
  presentLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        spinner: "hide",
        //duration: 10000,
        content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
             <img src="assets/imgs/loading.png" />
          </div>
        </div>`,
        cssClass: "custom-loader",
      });
      this.loading.present();
    }
  }
  dismissLoading() {
    if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
    }
  }
}
