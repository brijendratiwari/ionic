import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-search-job-filter',
  templateUrl: './search-job-filter.component.html',
  styleUrls: ['./search-job-filter.component.scss'],
})

export class SearchJobFilterComponent implements OnInit {

  primaryService: any;
  currentDate: any;
  minToDate: any;
  isAPILoaded: boolean = false;

  @Input() selectedFilter: any = {
    breed: '',
    distance: 25,
    start_date: '',
    end_date:'',
    petWeight:"1",
    ratepernight: 0,
    bookingtype: ''
  };
  allFtrequency: boolean = false;
  onceOffJob: boolean = false;
  recurringJob: boolean = false;
  isFirstLoad: boolean = true;

  constructor(public modal: ModalController,
    public api: PetcloudApiService,
    public storage: Storage, public navCtrl: NavController) {
    this.getAllService();
  }

  ngOnInit() {
    // let todaydate = new Date();
    // this.currentDate = new Date();
    // this.currentDate = new Date(this.currentDate.setDate(todaydate.getDate())).toISOString();
    // this.selectedFilter.start_date = new Date(todaydate.setDate(todaydate.getDate())).toISOString();
    // this.selectedFilter.end_date = new Date(todaydate.setDate(todaydate.getDate())).toISOString();
  
    // this.setFilter('petTypes','1');
    this.isFirstLoad = true;
    this.changeBookingtype();
  }

  // Dismiss Modal
  public dismissModal() {
    this.modal.dismiss();
  }

  //Set End Date and Clearing Form Values of To Date
  public fromDate(event) {
    this.minToDate = "";
    if(!this.isFirstLoad) {
      this.selectedFilter.end_date = "";
      this.isFirstLoad = false;
    }
    this.minToDate = event.value;
  }

  public getAllService() {
    this.api.showLoader();
    this.api.getAllService().pipe(
      finalize(() => {
        this.api.hideLoader();
      }))
      .subscribe((res: any) => {
        this.isAPILoaded = true;
        this.primaryService = res.primary;
        let iconCount = 1;
        for (let i = 0; i < this.primaryService.length; i++) {
          this.primaryService[i]['serviceIcon'] = 'filter_b_' + iconCount + '.svg';
          iconCount++;
        }        
      }, (err: any) => {
        this.isAPILoaded = false;
        this.api.autoLogout(err,"")
      });
  }

  public setFilter(key, val) {
    
    let mainVal: any = val;

    if(key=='serviceTypeId' || key =='petWeight'  || key =='petTypes' || key =='bookingtype') {
      let existValue = this.selectedFilter[key]? this.selectedFilter[key].split(',') : '';
      if(existValue && existValue.length>0) {
        let index = existValue.findIndex((d)=> parseInt(d) == val);
        if(index>-1){
          mainVal = existValue.splice(index, 1);
        } else {
          existValue.push(val.toString());
        }
        mainVal = existValue.join();
      } else {
        mainVal = val.toString();
      }
    }
    this.selectedFilter[key] = mainVal;
  }

  isSelected(key, val) {
    let existValue = this.selectedFilter[key]? this.selectedFilter[key].split(',') : '';
    if(existValue && existValue.length>0) {
      let index = existValue.findIndex((d)=> parseInt(d) == val);
      return (index>-1);
    }
    return false;
  }



  public applyFilter() {

    this.modal.dismiss(this.selectedFilter);
  }

  clearFilter() {
    this.selectedFilter = {
      breed: '',
      distance: 0,
      start_date: '',
      end_date:'',
      petWeight:"",
      serviceTypeId: '',
      petTypes: '',
      ratepernight: 0,
      bookingtype: ''
    };
    this.modal.dismiss(this.selectedFilter);
  }

  changeBookingtype() {
    let existValue = this.selectedFilter.bookingtype? this.selectedFilter.bookingtype.split(',') : '';
    if(existValue && existValue.length>0) {
      this.allFtrequency = false;
      let index = existValue.findIndex((d)=> parseInt(d) == 0);
      let index2 = existValue.findIndex((d)=> parseInt(d) == 1);
      this.onceOffJob = (index>-1);
      this.recurringJob = (index2>-1);
    } else {
      this.allFtrequency = true;
      this.onceOffJob = false;
      this.recurringJob = false;
    }
  }

  changeBooking(val) {
    setTimeout(() => {
      if(val==='') {
        this.selectedFilter.bookingtype = '';
      } 
      else {
        this.setFilter('bookingtype', val)
      } 
      this.changeBookingtype();
    }, 200);
  }
}
