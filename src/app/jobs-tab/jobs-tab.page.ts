import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonTabs, NavController, Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Storage } from "@ionic/storage";
import { Subscription } from 'rxjs';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { User } from '../model/user';

@Component({
  selector: 'app-jobs-tab',
  templateUrl: './jobs-tab.page.html',
  styleUrls: ['./jobs-tab.page.scss'],
})
export class JobsTabPage implements OnInit {

  post_job: boolean = true;
  view_jobs: boolean = false
  jobs_posted: boolean = false;
  private _routerJobTab = new Subscription();

  @ViewChild('jobsTabs',{read:true}) tabs: IonTabs;
 
  
  constructor(public router: Router,
    private platform: Platform,
    protected storage: Storage,
    private api: PetcloudApiService,
    public navCntl: NavController) { 

      this._routerJobTab.add(
        this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          if (event.url == "/home/tabs/jobs-tab") {
  
            this.storage.get(PetcloudApiService.USER).then((res: User) => {
              if (res != null) {
                if (event.url == "/home/tabs/jobs-tab") {
                  this.post_job = true;
                  this.view_jobs = false
                  this.jobs_posted= false;
                  this.getInfo();
                }else{
                  this.post_job = true;
                  this.view_jobs = false
                  this.jobs_posted= false;
                }
              } else {
                this.api.SignInWindow();
                // this._routerJobTab.unsubscribe();
              }
            });
          }
        })
      )

    this.backButtonEvent();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this._routerJobTab.unsubscribe();
  }
  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      async (user: User) => {
        if (user != null) {
       this.api.isVerificationPendingModel();
        }
      },
      (err) => {
        
      }
    );
  }

  navigateTo(pageName) {

    if (pageName == "post-job") {
      this.post_job = true;
      this.view_jobs = false
      this.jobs_posted= false;
    } else if(pageName == "view-jobs") {
      this.post_job = false;
      this.view_jobs = true
      this.jobs_posted= false;
    }else if(pageName == "jobs") {
      this.post_job = false;
      this.view_jobs = false;
      this.jobs_posted= true;
    }
     this.router.navigate(['/home/tabs/jobs-tab/'+pageName])
  }

    // active hardware back button
    backButtonEvent() {
      this.platform.backButton.subscribe(async () => {
        this.api.dismissModelorAlert();
        if (this.router.url === "/home/tabs/jobs-tab") {
          this.navCntl.navigateRoot("/home/tabs/sitter-listing")
        }
      });
    }

}
