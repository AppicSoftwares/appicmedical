import { Component, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'modal-page-popup',
  templateUrl: 'model-page.html',
})
export class ModalPage {

  constructor(navParams: NavParams) {
    // console.log(navParams.get('firstName'))
  }

}