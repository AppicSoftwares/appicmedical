import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(private googlePlus:GooglePlus) { console.log('Hello LoginProvider Provider'); }

  googleLogin(): Promise<any> {

    return new Promise((resolve, reject) => {
        this.googlePlus.login({
            'scopes': 'profile',
            'webClientId': '178481027508-6lu2nnr2kr4hjr6bg8ih8ikuka3ap3ca.apps.googleusercontent.com'
        }).then(res => {

        // call your backend api here
              resolve(res);
            },err => {
                reject(err);
            });
        }).catch(err => {
            console.log(err);      
      });
}

}
