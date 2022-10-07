import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private api: PetcloudApiService
  ) {
  
      this.ifLoggedIn();
   
  }

  ifLoggedIn() {
    console.log("Check Is Logged In")
    this.storage.get(PetcloudApiService.USER).then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }



}