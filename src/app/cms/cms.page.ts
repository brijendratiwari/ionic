import { Component, OnInit } from "@angular/core";
import { CmsPageService } from "../api/cms-page.service";
import { ActivatedRoute } from '@angular/router';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: "app-cms",
  templateUrl: "./cms.page.html",
  styleUrls: ["./cms.page.scss"],
})
export class CMSPage implements OnInit {

  isPetOwnerReview: boolean = false;
  isRSPAProperty: boolean = false;
  isPreparationBeforeStay: boolean = false;
  ispackingList: boolean = false;
  isHouseSitting: boolean = false
  isRSPAPartnerShip: boolean = false;
  isSocialImpact: boolean = false;
  isHowItWorks: boolean = false;
  isTermsofService: boolean = false;
  isPircesandService: boolean = false;
  isPrivercy: boolean = false;
  isNewMedia: boolean = false

  pdfObj = null;
  rspa_property_check: any;
  preparationList: any;
  packingList: any;
  houseSitting: any

  offSet : any = 0;
  title: any
  reviewList: any;

  isHidePagination: boolean = false;

  public pageContentHTML: any = {
    title: '',
    content: ''
  };
  public isFirstLoad: boolean = true;


  constructor(
    public cmsService: CmsPageService,
    public activatedRoute: ActivatedRoute,
    public api: PetcloudApiService,
  ) {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.title = params["title"];


      if (this.title == "Preparing your Pet for a Pet Stay") {
        this.isPreparationBeforeStay = true
      } else if (this.title == "Pet Stay Packing List") {
        this.ispackingList = true;
      } else if (this.title == "RSPCA Safe Property Guide") {
        this.isRSPAProperty = true;
      } else if (this.title == "House Sitting Welcome Guide & Guest Rules") {
        this.isHouseSitting = true;
      } else if (this.title == "RSPCA Partnership") {
        this.isRSPAPartnerShip = true;
      } else if (this.title == "Social Impact") {
        this.isSocialImpact = true;
      } else if (this.title == "How It Works") {
        this.isHowItWorks = true;
      } else if (this.title == "Terms Of Service") {
        this.isTermsofService = true;
      }
      else if (this.title == "Services & Prices") {
        this.isPircesandService = true;
      }
      else if (this.title == "News & Media") {
        this.isNewMedia = true;
      }
      else if (this.title == "Privacy") {
        this.isPrivercy = true;
      } else if (this.title == "Pet Owner Reviews") {
        this.isPetOwnerReview = true
        this.getReviews(0,"");
      }
    })
  }

  ngOnInit() {
    this.isFirstLoad = true;
    this.rspa_property_check = this.cmsService.cmsPage[0].rspa_property_check
    this.preparationList = this.cmsService.cmsPage[0].preparation;
    this.packingList = this.cmsService.cmsPage[0].packingList;
    this.houseSitting = this.cmsService.cmsPage[0].houseSitting;

    if (this.isRSPAPartnerShip == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.rspca_partnership;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }

    else if (this.isSocialImpact == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.social_impact;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }

    else if (this.isHowItWorks == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.how_it_works;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }

    else if (this.isTermsofService == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.terms_service;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }

    else if (this.isPircesandService == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.service_prices;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }

    else if (this.isPrivercy == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.privacy;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }
    else if (this.isNewMedia == true) {
      this.pageContentHTML = this.cmsService.CMS_JSON.news_media;
      let findWord = /href=/gi;
      this.pageContentHTML.content = this.pageContentHTML.content.replace(findWord, 'title=');
    }


  }

  async getReviews(offSet, pagination) {
    const param = {
      offset: offSet,
      limit: 10
    }
    if(offSet == 0 && this.isFirstLoad){
      await this.api.showLoader();
      this.isFirstLoad = false;
    }
    this.api.reviewList(param)
      .pipe(finalize(() => {
        this.api.hideLoader();
      }))
      .subscribe((res: any) => {

        if(pagination){
          pagination.target.complete();
        }
      if(res.success){
          if(res.entry){
            console.log("review list", res);
            if(res.entry.data.length){
              if(!(res?.entry?.data)) {
                return;
              }

              let data = res.entry.data;
              data.map(element => {
                element['create_date'] = moment(element.create_date).format("MMM YYYY");
                return element
              });
              
              // this.reviewList = res.entry.data;
                

              console.log("review data", data);
                
                if(data?.length){
                    this.isHidePagination = false;
                    if(data?.length>0 && this.reviewList?.length>0){
                      data.forEach(element => {
                        let inedx =  this.reviewList.findIndex((resp)=> resp.id == element.id);
                        if(inedx>-1) {
                          this.reviewList[inedx] = element;
                        } else {
                          this.reviewList.push(element);
                        }                        
                      });
                    } else {
                      this.reviewList = data;
                    }                   
                }else{
                  this.isHidePagination = true;
                }
                
                
                console.log("review list", this.reviewList);
            }else{
              this.isHidePagination = true;
              this.api.showToast("No Reviews Found","3000","bottom")
            }

          }else{
            this.api.showToast("No Reviews Found","3000","bottom")
          }
      }else{
        this.api.showToast("No Reviews Found","3000","bottom")
      }
      }, (err: any) => {
        this.api.autoLogout(err,param)
      });
  }

  loadData(event){
        this.offSet =  this.offSet + 1;
        this.getReviews(this.offSet, event);
  }

  radioBtnChange(event) {
    console.log(event)
  }

  save() {

  }

  public convertNumberToArray(number: any) {
    return new Array(number);
}
}
