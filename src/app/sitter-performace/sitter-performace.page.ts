import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-sitter-performace',
  templateUrl: './sitter-performace.page.html',
  styleUrls: ['./sitter-performace.page.scss'],
})
export class SitterPerformacePage implements OnInit {

  public petCareServices: any;

  current: number = 70;
  max: number = 100;
  stroke: number = 8;
  radius: number = 40;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#45ccce';
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 0;
  animations: string[] = [];
  gradient: boolean = false;
  realCurrent: number = 0;
  rate:number;
  
  graphData: any = null;
  isGraphDataAvailable:boolean = false;
  isAPILoaded: boolean = false;

  constructor(public api: PetcloudApiService) {

  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getRecurringOptions();
    this.getGraphData("");
  }


    /**
   * get Recurring options get Servies and Recurring Type
   */
  getRecurringOptions() {
    this.api.recurringOptions().pipe(finalize(() => {})
      ).subscribe(
        async (res: any) => {
          this.petCareServices = res.services;
        },
        (err: any) => {
          this.api.autoLogout(err,"");
        }
      );
  }

  petCareSelectedService(event){
      this.isGraphDataAvailable = false;
      this.isAPILoaded = false;
      this.getGraphData(event.detail.value.id); // Passing pet care service Id
  }

  getGraphData(serviceId) {
    this.api.showLoader();
      this.api.dashboardPerformace({serviceTypeId: serviceId}).subscribe((data:any)=>{
        this.isAPILoaded = true;
        this.api.hideLoader();
        if(data.status){
            this.isGraphDataAvailable = true;
            this.graphData = data.data
        }else{
          this.isGraphDataAvailable = false;
          this.api.showToast("Performance Data not available","3000","bottom");
        }
      },(err:any)=>{
        this.isGraphDataAvailable = false;
        this.isAPILoaded = false;
        this.api.autoLogout(err,{serviceTypeId: serviceId})
      })
  }
}