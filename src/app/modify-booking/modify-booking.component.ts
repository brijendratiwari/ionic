import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-modify-booking',
  templateUrl: './modify-booking.component.html',
  styleUrls: ['./modify-booking.component.scss'],
})
export class ModifyBookingComponent implements OnInit {
  bookingId: any;
  modifiedMessage: any;
  public BookingModifyForm: FormGroup;
  
  public lbl_formatedStartDate: any;
  public lbl_formatedEndDate: any;
  
  public frmDate: any;
  public toDate: any;
  public minEdDate: any;
  // Setting Min Date and Min Max Time
  public startMinDate = "";
  public minToDate: any;
  public startMinTime: any;
  public startTotime: any;

  constructor(public model: ModalController,
    private api: PetcloudApiService,
    private formBuilder: FormBuilder,
    private datePicker: DatePicker,
    private platform: Platform,
    public navParams: NavParams) { 
    this.bookingId = this.navParams.get('id');
    this.modifiedMessage = this.navParams.get('details')
  }

  ngOnInit() {
    this.BookingModifyForm = this.formBuilder.group({
      bookingId: [this.bookingId],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      start_time: ["05:00", [Validators.required]],
      end_time: ["16:00", [Validators.required]],
      details: [this.modifiedMessage != null ||
        this.modifiedMessage != "" ||
        this.modifiedMessage != undefined ? this.modifiedMessage : "" , [Validators.required]],
    });
    this.startMinTime = "05:00";
    this.startTotime = "16:00";
    const today = new Date();
    const tomorrow = new Date(
      today.setDate(today.getDate() + 1)
    ).toISOString();
    this.startMinDate = tomorrow;
    this.minEdDate = tomorrow;
    this.minToDate = new Date(
      today.setDate(today.getDate() + 2)
    ).toISOString();
    this.frmDate = tomorrow;
    this.toDate = new Date(today.setDate(today.getDate())).toISOString();

    this.lbl_formatedStartDate = this.startMinDate;
    this.lbl_formatedEndDate = this.minToDate;
    this.BookingModifyForm.patchValue({
      start_date: this.startMinDate,
      end_date: this.minToDate,
    });
  }

  closeModal(isClose){
    this.model.dismiss(isClose);
  }

  openFromDateCalender(date_type) {
    this.datePicker
      .show({
        date: new Date(this.lbl_formatedStartDate),
        mode: "date",
        minDate: this.platform.is("ios") ? new Date() : new Date().valueOf(),
        allowOldDates: false,
        allowFutureDates: true,
        androidTheme: 5,
      })
      .then(
        async (date) => {
          if(date) {
            this.fromDate(date);
          }
        },
        (err) => console.log("Error occurred while getting date: ", err)
      );
  }

  openToCalender(date_type) {
    this.datePicker
      .show({
        date: new Date(this.lbl_formatedEndDate),
        mode: "date",
        minDate: this.platform.is("ios") ? new Date() : new Date().valueOf(),
        allowOldDates: false,
        allowFutureDates: true,
        androidTheme: 5,
      })
      .then(
        async (date) => {
          if(date) {
            this.endDateChange(date);
          }
        },
        (err) => console.log("Error occurred while getting date: ", err)
      );
  }

  //Set End Date and Clearing Form Values of To Date
  public fromDate(event) {
    this.lbl_formatedStartDate = event;
    this.BookingModifyForm.patchValue({
      start_date: event,
      end_date: "",
    });
    this.frmDate = event;

    this.minToDate > this.frmDate
      ? ((this.minToDate = this.minToDate), (this.minEdDate = event))
      : ((this.minToDate = event), (this.minEdDate = this.minToDate));

    this.BookingModifyForm.patchValue({
      end_date: this.minToDate,
    });
  }

  public endDateChange(event) {
    this.lbl_formatedEndDate = event;
    this.BookingModifyForm.patchValue({
      end_date: event,
    });

    this.toDate = event;
    this.minEdDate > this.frmDate
      ? (this.minToDate = this.minToDate)
      : ((this.minToDate = event), (this.minEdDate = this.minToDate));
  }

  isValidFromTime() {
    const ONE_HOUR = 60 * 60 * 1000; /* ms */
    const satrtDate = this.lbl_formatedStartDate;
    const startTime = this.BookingModifyForm.value.start_time;
    const endDate = this.lbl_formatedEndDate;
    const endTime = this.BookingModifyForm.value.end_time;
    let resp = {
      isValidStart: true,
      isValidEndDate: true,
      isValidEndTime: true
    }
    let startDateTime;
    let endDateTime;
    if(satrtDate && startTime){
      const startTimeArry = startTime.split(':');
      startDateTime = new Date(satrtDate).setHours(startTimeArry[0], startTimeArry[1], 0, 0);
    }
    if(endDate && endTime){
      const endTimeArry = endTime.split(':');
      endDateTime = new Date(endDate).setHours(endTimeArry[0], endTimeArry[1], 0, 0);
    }
    if(startDateTime) {
      resp.isValidStart = !((new Date(startDateTime).getTime() - new Date().getTime()) < ONE_HOUR);
    }
    if(endDateTime) {
      resp.isValidEndTime = !((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) < ONE_HOUR);
    }
    if(startDateTime && endDateTime){
      const start = new Date(startDateTime).setHours(0,0,0,0);
      const end = new Date(endDateTime).setHours(0,0,0,0);
      resp.isValidEndDate = !(end < start);
    }
    return resp;
  }

  sendRequest(){

    let start_date = new DatePipe("en-US").transform(
      this.lbl_formatedStartDate,
      "EEE dd MMM y"
    );
    let end_date = new DatePipe("en-US").transform(
      this.lbl_formatedEndDate,
      "EEE dd MMM y"
    );
    let start_time = this.formatTime(this.BookingModifyForm.value.start_time);
    let end_time = this.formatTime(this.BookingModifyForm.value.end_time);

    const bookingForm = {
      BookingModifyForm : {
        start_date: start_date,
        start_time: start_time,
        end_date: end_date,
        end_time: end_time,
        details: this.BookingModifyForm.value.details,
        bookingId: this.bookingId 
      }
    }
    
    this.api.showLoader()
    this.api.modifyBooking(bookingForm)
      .subscribe((res: any) => {
        this.api.hideLoader();
        if (res.status) {
          this.api.showToast(res.message, 2000, 'bottom');
          this.closeModal('yes');
        } else {
          this.api.showToast(res.error, 2000, 'bottom');
        }
      }, (err: any) => {
        this.api.autoLogout(err,bookingForm)
        this.api.hideLoader();
      });
  }
  private formatTime(time) {
    const timeFormat = moment(time, ["HH.mm"]).format("hh:mma");
    return timeFormat; // return adjusted time or original string
  }

}
