import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesOnboardingScreenPage } from './pages-onboarding-screen';

@NgModule({
  declarations: [
    PagesOnboardingScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesOnboardingScreenPage),
  ],
})
export class PagesOnboardingScreenPageModule {}
