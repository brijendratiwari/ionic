import { Component, Inject, LOCALE_ID, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { PetcloudApiService } from "../../api/petcloud-api.service";
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { ModalController, NavController, Platform } from "@ionic/angular";
import * as moment from "moment";
import { User } from "../../../app/model/user";
import { Router, ActivatedRoute } from "@angular/router";
import { SittergeneralavailabilityComponent } from "../../sittergeneralavailability/sittergeneralavailability.component";
import { MeetingdetailComponent } from "../../meetingdetail/meetingdetail.component";

@Component({
  selector: "app-availability",
  templateUrl: "./availability.page.html",
  styleUrls: ["./availability.page.scss"],
})
export class AvailabilityPage implements OnInit {
  public currentDate: any;
  public isMeetingDataShown: boolean = false;
  public selectedBlockDay = {
    selectedMonth: "",
    day: [],
    // defaultDate : new Date()
    defaultDate: "",
  };
  public currDate = new Date();
  public tdDate: any;
  public meetData: any = [];
  public pagination: boolean = false;

  public currentActiveMonth: any;
  public currentActiveYear: any;
  public type = "string";
  public unavailable = [];
  public selectedMth: any = "";

  public limited = [];
  public allLimited = [];
  public allUnavailble = [];

  public meetingData: any = [];
  public calendarOption: CalendarComponentOptions;

  public optionsMulti: CalendarComponentOptions = {
    // canBackwardsSelected: true,
    pickMode: "multi",
    color: "dark",
    from: new Date(),
  };
  backButton: any = "";
  daysConfig: DayConfig[] = [];
  public selectedDays: string[];
  public selectedMonth: any;

  public offsetLimit = 0;

  public meetingSchedules = [{ date: [], data: [] }];
  constructor(
    public api: PetcloudApiService,
    public navCntl: NavController,
    public plt: Platform,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    public storage: Storage,
    public navcntl: NavController
  ) {
    // this.backButtonEvent();

    this.backButton = this.route.snapshot.paramMap.get("backBtn");

    this.currentActiveMonth = this.currDate.getMonth() + 1;
    this.currentActiveYear = this.currDate.getFullYear();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.meetingData = [];
    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let month = today.getMonth() + 1 < 10 ? "0" + currentMonth : currentMonth;
    let year = today.getFullYear();
    let selectedMonth = year + "-" + month;
    this.selectedMth = year + "-" + month;
    this.tdDate =new Date().toISOString().split('T')[0]
    this.getAvailibilityDates(selectedMonth);
    this.getBookingList(this.tdDate, "", this.tdDate);
  }

  ionViewWillLeave(){
    this.meetingData = [];
  }

  /**
   * Month change event
   * @param event
   */
  onChange(event) {
    this.currentActiveYear = event.newMonth.years;
    this.currentActiveMonth =
      event.newMonth.months < 10
        ? "0" + event.newMonth.months
        : event.newMonth.months;
    let selectedMonth = this.currentActiveYear + "-" + this.currentActiveMonth;
    this.selectedMth = this.currentActiveYear + "-" + this.currentActiveMonth;
    this.getAvailibilityDates(selectedMonth);
    this.meetingData = [];

    
   
    this.getBookingList(this.currentActiveYear + "-" +this.currentActiveMonth + "-" + "01", "", "");
  }

  public saveAvailability() {
    let year = this.currentActiveMonth;
    let month = this.currentActiveYear;

    let currentUnavialbleDates = [];
    //Get Unavialbale Days that are already marked
    if (this.allUnavailble.length) {
      this.allUnavailble.forEach((element) => {
        currentUnavialbleDates.push(element);
      });
    }
    // Compare and get unique element from Array
    if (this.selectedDays != undefined) {
      let unique1 = currentUnavialbleDates.filter(
        (o) => this.selectedDays.indexOf(o) === -1
      );
      let unique2 = this.selectedDays.filter(
        (o) => currentUnavialbleDates.indexOf(o) === -1
      );
      const unique = unique1.concat(unique2);

      let date = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;

      if (month < 10) month = "0" + month;
      if (year + "-" + month == this.selectedMth) {
        let date = [];
        unique.forEach((element) => {
          if (element.split("-")[0] == year && element.split("-")[1] == month) {
            date.push(new Date(element).getDate());
          }
        });

        this.selectedBlockDay.day = date;
        this.selectedBlockDay.selectedMonth = this.selectedMth;
      } else {
        let notCurrentMonthDate = [];
        unique.forEach((element) => {
          if (
            element.split("-")[0] == this.selectedMth.split("-")[0] &&
            element.split("-")[1] == this.selectedMth.split("-")[1]
          ) {
            notCurrentMonthDate.push(new Date(element).getDate());
          }
        });

        this.selectedBlockDay.day = notCurrentMonthDate;
        this.selectedBlockDay.selectedMonth = this.selectedMth;
      }

      this.api.showLoader();
      this.api.updateAvailability(this.selectedBlockDay).subscribe(
        (res: any) => {
          this.api.hideLoader();
          if (res.success) {
            this.api.showToast("Availability updated.", 2000, "bottom");

            this.storage
              .get(PetcloudApiService.USER)
              .then(async (userData: User) => {
                await moment(date, "DD/MM/YYYY HH:mm");
                userData.lastCalendarUpdate = moment(new Date()).format(
                  "YYYY-MM-DD"
                );

                // update user object
                this.storage.set(PetcloudApiService.USER, userData);
              });

            this.navCntl.navigateRoot("/home/tabs/profile-menu", {
              skipLocationChange: true,
            });
          } else {
            this.api.showToast("Availability not updated.", 2000, "bottom");
          }
        },
        (err: any) => {
          this.api.hideLoader();

          this.api.autoLogout(err,this.selectedBlockDay);
        }
      );
    } else {
      const noUpdate = {
        selectedMonth: moment(new Date()).format("YYYY-MM"),
        day: "",
      };

      this.api.showLoader();
      this.api.updateAvailability(noUpdate).subscribe(
        (res: any) => {
          this.api.hideLoader();
          if (res.success) {
            this.api.showToast("Availability updated.", 2000, "bottom");

            this.storage.get(PetcloudApiService.USER).then((userData: User) => {
              userData.lastCalendarUpdate = moment(new Date()).format(
                "YYYY-MM-DD"
              );
              // update user object
              this.storage.set(PetcloudApiService.USER, userData);
            });

            this.navCntl.navigateRoot("/home/tabs/profile-menu", {
              skipLocationChange: true,
            });
          } else {
            this.api.showToast("Availability not updated.", 2000, "bottom");
          }
        },
        (err: any) => {
          this.api.hideLoader();

          this.api.autoLogout(err,noUpdate);
        }
      );
    }
  }

  backButtonNavigate() {
    if (this.backButton) {
      this.router.navigateByUrl("/home/tabs/jobs-tab");
    } else {
      this.navCntl.pop();
    }
  }

  async daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getDates(startDate, endDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var endDt = moment(endDate);
    while (currentDate <= endDt) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }

  calenderOption() {
    this.calendarOption = {
      daysConfig: this.daysConfig,
      color: "dark",
      pickMode: "multi",
    };
  }

  async getBookingList(selectedDate, infiniteScroll, nextDate) {
     let daysInMonth = await this.daysInMonth(7,2009);

     const param = {
      date: selectedDate,
      limit:  nextDate == 30 && daysInMonth == 30 ? 0:
      nextDate >= 27 && daysInMonth == 30 ? 3 :
     nextDate > 30 && daysInMonth == 31 ? 1 :
     nextDate >= 27 && daysInMonth == 31 ? 4 :
     nextDate >= 25 && daysInMonth == 28 ? 3 : 5
    };
    this.api.getBookingCalenderList(param).subscribe(
      (res: any) => {
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        if (res.success) {
          this.pagination = true;
          this.isMeetingDataShown = true;
     
          if (res.booking) {
            const meetingDataVal = [];
            Object.keys(res.booking).forEach(function(key) {
              meetingDataVal.push({
                "date":key,
                "data":res.booking[key]
              })
             
          });
          meetingDataVal.forEach(async element => {
            element.showStartDate = await moment(element.startDate).format(" h:mm A");
            this.meetingData.push(element);
          });
     
          }
        } else {
          this.pagination = false;
          this.isMeetingDataShown = false;
        }
      },
      (err) => {
        this.pagination = false;
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.api.autoLogout(err,param);
      }
    );
  }

  public getAvailibilityDates(selectedMonth) {
    this.api.showLoader();
    this.api.getAvailibility(selectedMonth).subscribe(
      (res: any) => {
        if (res.success) {
          if (res.blockedandlimited.length) {
            let ltdDates = []; // get Limited Dates
            let ele = []; // push element of ltdDates
            let blockedDates = [];
            let blockedEle = [];
            res.blockedandlimited.forEach((element) => {
              if (element.title == "limited") {
                ltdDates = this.getDates(element.start, element.end);
                ltdDates.forEach((element) => {
                  ele.push(element);
                });
              }
              if (element.title == "Blocked") {
                blockedDates = this.getDates(element.start, element.end);
                blockedDates.forEach((element) => {
                  blockedEle.push(element);
                });
              }
            });

            // Unique Dates of Blocked..
            this.allUnavailble = blockedEle.reduce(function (dt, dt1) {
              if (dt.indexOf(dt1) < 0) dt.push(dt1);
              return dt;
            }, []);

            this.allUnavailble.forEach((element) => {
              if (element == this.tdDate) {
                this.daysConfig.push({
                  date: new Date(element),
                  cssClass: "today",
                });
              } else {
                this.daysConfig.push({
                  date: new Date(element),
                  cssClass: "unavailableDays",
                });
              }
            });

            // Unique Dates of Limited..
            this.allLimited = ele.reduce(function (dt, dt1) {
              if (dt.indexOf(dt1) < 0) dt.push(dt1);
              return dt;
            }, []);
            this.allLimited.forEach((element) => {
              if (element == this.tdDate) {
                this.daysConfig.push({
                  date: new Date(element),
                  cssClass: "today",
                });
              } else {
                this.daysConfig.push({
                  date: new Date(element),
                  cssClass: "limitedDays",
                });
              }
            });
          }
        }

       
        this.api.hideLoader();
        this.calenderOption();
      },
      (err: any) => {
        this.api.hideLoader();
        this.api.autoLogout(err,selectedMonth);
      }
    );
  }

  async sittergeneralAvailability() {
    const modal = await this.modalCtrl.create({
      component: SittergeneralavailabilityComponent,
      animated: true,
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  async meetingDetail(data) {
    const modal = await this.modalCtrl.create({
      component: MeetingdetailComponent,
      animated: true,
      componentProps: {
        id: data.id
      },
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  async loadData(infiniteScroll) {  
     let last_date = await this.meetingData[Object.keys(this.meetingData)[Object.keys(this.meetingData).length - 1]];
     let seconds = await new Date(last_date.date).setDate(new Date(last_date.date).getDate() + 1);
     let next_date =await moment(seconds).format("YYYY-MM-DD");
  
    this.getBookingList(next_date, infiniteScroll, 28);
  }


}
