import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MenuController, Platform, NavController, ModalController } from '@ionic/angular';
// import model files
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-fastco',
  templateUrl: './fastco.component.html',
  styleUrls: ['./fastco.component.scss'],
})
export class FastcoComponent implements OnInit {

  public fastCoForm: FormGroup;
  public fastCo: any = { identifier: '', key: '' };
  constructor(public api: PetcloudApiService, private formBuilder: FormBuilder,
    protected storage: Storage,
    public navCntl: NavController,
    public modal: ModalController,
    protected router: Router, public sideMenu: MenuController,
    public platform: Platform, 

    ) {

    this.fastCo.key = this.api.FASTCO_KEY;
   
    this.sideMenu.enable(false);
  }

  ngOnInit() {
    this.fastCoForm = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.email]],
    });
  }

  fastLogin() {

   
    this.fastCo.identifier = this.fastCoForm.value.identifier;
    // this.api.showLoader();
    this.api.fastCoLogin(this.fastCo)
      .pipe(finalize(() => {
        this.api.hideLoader();
      }))
      .subscribe((res: any) => {
      }, err => {
      });
  }

  closeModal() {
    this.modal.dismiss();
  }

}
