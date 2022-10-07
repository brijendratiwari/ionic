import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.page.html',
  styleUrls: ['./blog-details.page.scss'],
})
export class BlogDetailsPage implements OnInit {
  blogId: "";
  blogDetail;  
  isOpening: boolean = false;

  constructor(public activatedRoute: ActivatedRoute,
    public api: PetcloudApiService, private platform: Platform) { 

    this.activatedRoute.queryParams.subscribe((params) => {
      this.blogId = params["blogId"];
    
      this.api.getBlogDetails(this.blogId).subscribe((res:any)=>{
        if(res.success){
          if(res.blog){
            this.blogDetail = res.blog;
            setTimeout(() => {
              this.generateAnchorEventListner();
            }, 1000);
          }
        }
       
       },err=>{
         
       })
    })
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("call ionViewWillEnter");
  }

  ionViewWillLeave() {
    this.removeAnchorEventListner();
  }

  generateAnchorEventListner() {
    const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    if(anchorElements?.length>0) {
      anchorElements.forEach((elem)=>{
        if(this.platform.is('cordova') && elem?.target!= "_system") {
          elem.setAttribute('target', '_system');
        }
        elem.addEventListener('click', (e) => { 
          e.preventDefault(); 
          this.validateAndRedirect(elem.href)
        });
      })
    }
  }
  removeAnchorEventListner() {
    const anchorElements: any = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    if(anchorElements?.length>0) {
      anchorElements.forEach((elem)=>{        
        elem.removeEventListener('click', (e) => { 
          e.preventDefault(); 
          this.validateAndRedirect(elem.href)
        });
      })
    }
  }

  validateAndRedirect(herf) {
    if(herf) {
      const isValid = this.api.validURL(herf);
      console.log("isValid", herf, isValid)
      if(isValid && !this.isOpening && this.platform.is('cordova')) {
        this.isOpening = true;
        this.api.openExteralLinks(herf);
      }
    }
    this.isOpening = false;
  }
}
