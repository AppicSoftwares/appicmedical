import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpVerificationPage } from './otp-verification';

@NgModule({
  declarations: [
    OtpVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpVerificationPage),
  ],
})
export class OtpVerificationPageModule {}
