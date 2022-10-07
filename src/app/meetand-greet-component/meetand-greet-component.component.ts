import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AnalyticsService } from '../analytics.service';
import { User } from '../model/user';
import { AppsFlyerService } from '../apps-flyer.service';

@Component({
  selector: 'app-meetand-greet-component',
  templateUrl: './meetand-greet-component.component.html',
  styleUrls: ['./meetand-greet-component.component.scss'],
})
export class MeetandGreetComponentComponent implements OnInit {
  bookingId: any;
  isMeetandGreet: boolean = false;  // Cannot Edit
  maxDate: any;
  public formData: any = {
    date: [{ date: '', time: '' }], location: ''
  };
  public formData1: any = {
    date: [{ date: '', time: '' }, { date: '', time: '' }], location: ''
  };
  public formData2: any = {
    date: [{ date: '', time: '' }, { date: '', time: '' }, { date: '', time: '' }], location: ''
  };

  geetForm = { date: [{ date: '', time: '' }], location: '' }

  isDate1Selected: boolean = false;
  istime1Selected: boolean = false;
  isDate2Selected: boolean = false;
  istime2Selected: boolean = false;

  public meetGreetform: any;
  public isSelectedForm1: boolean = false;
  public isSelectedForm2: boolean = false;
  public isSelectedForm3: boolean = false;

  public editMeetandGreet: any = {
    date: '',
    time: '',
    location: ''
  }


  meetgreetForm: FormGroup;
  // Hiding Dates
  isDate2: Boolean = false;
  isDate3: Boolean = false;
  click=0;
  userid: any = ""

  startMinDate: any;
  startTotime: any;
  constructor(protected router: Router,
    protected storage: Storage, public modal: ModalController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public analytics: AnalyticsService,
    public appsFlyerService:AppsFlyerService,
    public api: PetcloudApiService, public navcntl: NavController) {
    this.bookingId = this.navParams.get('id');
    this.isMeetandGreet = this.navParams.get('isMeetandGreetEdit');
  
    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString();
    this.startMinDate = new Date().toISOString();
    this.maxDate = new Date(today.setDate(today.getDate() + 8)).toISOString();
    this.startTotime = "16:00";
  }

  ngOnInit() {
    this.meetgreetForm = this.formBuilder.group({
      location: ['petownershouse', [Validators.required]],
      date1: [this.startMinDate, [Validators.required]],
      time1: [this.startTotime, [Validators.required]],
      date2: [""],
      time2: [''],
      date3: [''],
      time3: [''],
    });

  }


  public getInfo(){
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        this.userid = userData.id;
      })
  }

  // hiding Date Pickers
  showDates() {
    this.click = this.click+ 1;
    if(this.click>2){
      this.click = 0
    }
   if (this.isDate2 == false) {
      this.isDate2 = true;
    } else if (this.isDate2 == true && this.isDate3 == false) {
      this.isDate3 = true
    } else {
      this.isDate2 = false;
      this.isDate3 = false;
    }
  }

  convertDate(date) {
    const dt = new DatePipe('en-US').transform(date, 'EEE dd MMM y');

    return dt != null ? dt : "";
  }
  private tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  selectDt2(event) {
    if (event.detail.value != "") {
      this.isDate1Selected = false;
    } else {
      this.isDate1Selected = true;
    }
  }

  selecttime2(event) {

    if (event.detail.value != "") {
      this.istime1Selected = false;
    } else {
      this.istime1Selected = true;
    }
  }

  selectDt3(event) {
    if (event.detail.value != "") {
      this.isDate2Selected = false;
    } else {
      this.isDate2Selected = true;
    }
  }

  selecttime3(event) {
    if (event.detail.value != "") {
      this.istime2Selected = false;
    } else {
      this.istime2Selected = true;
    }
  }

  createMeetGreetForm(formData) {
    this.geetForm.date = formData.date.reduce((newArray, element) => {
      newArray.push(element);
      return newArray;
    }, []);
  }


  meetGreet() {

    
    // Converting date and Time Values
    const date1 = this.convertDate(this.meetgreetForm.value.date1);
    const date2 = this.convertDate(this.meetgreetForm.value.date2);
    const date3 = this.convertDate(this.meetgreetForm.value.date3);
    const time1 = this.tConvert(this.meetgreetForm.value.time1);
    const time2 = new DatePipe('en-US').transform(this.meetgreetForm.value.time2, 'hh:mm ,aaa');
    const time3 = new DatePipe('en-US').transform(this.meetgreetForm.value.time3, 'hh:mm ,aaa');

    this.geetForm.location = this.meetgreetForm.value.location;

    if(this.click == 0 && time2 == null && time3 == null   ){
      this.formData.date[0].date = date1;
      this.formData.date[0].time = time1;
      this.createMeetGreetForm(this.formData);   
      this.callMeetGreetAPI();
  }else if(this.click == 1 && time2 != null && date2 != "" && time3 == null && date3 == ""   ){
    
    let t2formater;
    t2formater = time2.split(",")[1] == 'AM' ? t2formater = "am" : "pm"
    const t2 = time2.split(",");

    let formatedTime2 = t2[0].split(" ").join("") + t2formater;

    this.formData1.date[0].date = date1;
    this.formData1.date[0].time = time1;
    this.formData1.date[1].date = date2;
    this.formData1.date[1].time = formatedTime2;

    this.isSelectedForm1 = false;
    this.isSelectedForm2 = true;
    this.isSelectedForm3 = false;

    this.createMeetGreetForm(this.formData1)   
    this.callMeetGreetAPI();
}else if(this.click == 2 && time2 != null && date2 != "" && time3 != null && date3 != "" ){
  let t2formater;
        let t3formater;
        t2formater = time2.split(",")[1] == 'AM' ? t2formater = "am" : "pm"
        t3formater = time3.split(",")[1] == 'AM' ? t3formater = "am" : "pm"

        const t2 = time2.split(",");
        const t3 = time3.split(",");

        let formatedTime2 = t2[0].split(" ").join("") + t2formater;
        let formatedTime3 = t3[0].split(" ").join("") + t3formater;

        this.formData2.date[0].date = date1;
        this.formData2.date[0].time = time1;
        this.formData2.date[1].date = date2;
        this.formData2.date[1].time = formatedTime2;
        this.formData2.date[2].date = date3;
        this.formData2.date[2].time = formatedTime3;

        this.isSelectedForm1 = false;
        this.isSelectedForm2 = false;
        this.isSelectedForm3 = true;

        this.createMeetGreetForm(this.formData2)
}


    if (date2 != "" && time2 == "") {
      this.istime1Selected = true;
    } else if (time2 != "" && date2 == "") {
      this.isDate1Selected = true
    } else if (date3 != "" && time3 == "") {
      this.istime2Selected = true;
    } else if (time3 != "" && date3 == "") {
      this.isDate2Selected = true
    } else {
      this.istime1Selected = false;
      this.isDate1Selected = false;
      this.istime2Selected = false;
      this.isDate2Selected = false;

      // Setting Form Data Values
      this.formData.location = this.meetgreetForm.value.location;
      this.formData1.location = this.meetgreetForm.value.location;
      this.formData2.location = this.meetgreetForm.value.location;
    
      if (date1 != "" && time1 != ""
       && date2 == "" && time2 == null) {
        this.formData.date[0].date = date1;
        this.formData.date[0].time = time1;
        this.isSelectedForm1 = true;
        this.isSelectedForm2 = false;
        this.isSelectedForm3 = false;

      this.createMeetGreetForm(this.formData);    
      }

      

    else  if (date1 != "" && time1 != "" && date2 != "" && time2 != null && date3 == "" && time3 == null) {
        let t2formater;
        t2formater = time2.split(",")[1] == 'AM' ? t2formater = "am" : "pm"
        const t2 = time2.split(",");

        let formatedTime2 = t2[0].split(" ").join("") + t2formater;

        this.formData1.date[0].date = date1;
        this.formData1.date[0].time = time1;
        this.formData1.date[1].date = date2;
        this.formData1.date[1].time = formatedTime2;



        this.isSelectedForm1 = false;
        this.isSelectedForm2 = true;
        this.isSelectedForm3 = false;

        this.createMeetGreetForm(this.formData1)
      }

     else if (date1 != "" && time1 != "" && date2 != "" && time2 != "" && date3 != "" && time3 != "") {


        let t2formater;
        let t3formater;
        t2formater = time2.split(",")[1] == 'AM' ? t2formater = "am" : "pm"
        t3formater = time3.split(",")[1] == 'AM' ? t3formater = "am" : "pm"

        const t2 = time2.split(",");
        const t3 = time3.split(",");

        let formatedTime2 = t2[0].split(" ").join("") + t2formater;
        let formatedTime3 = t3[0].split(" ").join("") + t3formater;

        this.formData2.date[0].date = date1;
        this.formData2.date[0].time = time1;
        this.formData2.date[1].date = date2;
        this.formData2.date[1].time = formatedTime2;
        this.formData2.date[2].date = date3;
        this.formData2.date[2].time = formatedTime3;

        this.isSelectedForm1 = false;
        this.isSelectedForm2 = false;
        this.isSelectedForm3 = true;

        this.createMeetGreetForm(this.formData2)
      }
      this.callMeetGreetAPI();
    }
  }

  public callMeetGreetAPI(){
    
      this.api.showLoader();
      this.api.requestMeetandGreetBooking(this.bookingId, this.geetForm)
        .pipe(finalize(() => {
          this.api.hideLoader();
        })).subscribe((res: any) => {
          if (res.success) {

            this.appsFlyerService.bookingEvent({
              af_booking_status: "M",
              af_booking_id: this.bookingId,
              af_potentional_revenue:"",
              af_actual_revenue:"",
              af_minder_id: res.minderId,
              af_owner_id: res.ownerid
            })
            
            this.api.showToast(res.message, '2000', 'bottom');
            this.modal.dismiss('refreshchatscreen');
          } else {
            this.api.showToast(res.message, '2000', 'bottom');
            this.modal.dismiss();
          }
        }, (err: any) => {
          this.api.autoLogout(err,this.geetForm)
        });
  }

  minderMeetandGreet() {

    const date1 = this.convertDate(this.meetgreetForm.value.date1);
    const time1 = this.tConvert(this.meetgreetForm.value.time1);

    this.editMeetandGreet.location = this.meetgreetForm.value.location;
    this.editMeetandGreet.date = date1;
    this.editMeetandGreet.time = time1;


    this.api.showLoader();
    this.api.minderMeetandGreet(this.bookingId, this.editMeetandGreet)
      .pipe(finalize(() => {
        this.api.hideLoader();
      })).subscribe((res: any) => {
        if (res.success) {
          this.analytics.logEvent(PetcloudApiService.meetgreetrequest,{userId:this.userid});
          this.api.showToast(res.message, '2000', 'bottom');
          this.modal.dismiss('refreshchatscreen');
        } else {
          this.api.showToast(res.message, '2000', 'bottom');
          this.closeModal();
        }
      }, (err: any) => {
        this.api.autoLogout(err, this.editMeetandGreet);
      });
  }

  public closeModal() {
    this.modal.dismiss();
  }

}
