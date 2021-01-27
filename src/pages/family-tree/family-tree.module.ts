import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyTreePage } from './family-tree';

@NgModule({
  declarations: [
    FamilyTreePage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyTreePage),
  ],
})
export class FamilyTreePageModule {}
