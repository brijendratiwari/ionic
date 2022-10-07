import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signin-window',
  templateUrl: './signin-window.component.html',
  styleUrls: ['./signin-window.component.scss'],
})
export class SigninWindowComponent implements OnInit {

  constructor(private model:ModalController,
    protected router: Router,
    public nav: NavController) { }

  ngOnInit() {}

  dismissModel(){
    this.model.dismiss();
  }

  doSinIn(){
    this.dismissModel();
    this.nav.navigateRoot("/login")
  }

  doSignUp(){
    this.model.dismiss();
    this.nav.navigateRoot("/get-started")
  }

  closeModal(){
    this.model.dismiss();
    this.router.navigateByUrl('/home/tabs/sitter-listing');
  }

}
