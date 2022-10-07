import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-authorization-congrats-model',
  templateUrl: './authorization-congrats-model.component.html',
  styleUrls: ['./authorization-congrats-model.component.scss'],
})
export class AuthorizationCongratsModelComponent implements OnInit {
  constructor(public model:ModalController,
    public router:Router) { }

  ngOnInit() {}

  goToBalanceCheck(){
    this.closeModal();
    this.router.navigateByUrl("/wallet")
  }

  closeModal(){
    this.model.dismiss()
  }

}
