import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { User } from "../model/user";
import { Pet } from "../model/pet";
import { ModalController, Platform } from "@ionic/angular";
import { BookingCostComponent } from "../booking-cost/booking-cost.component";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { NonAvailabilityAdditionalBookingsComponent } from "../non-availability-additional-bookings/non-availability-additional-bookings.component";
import { AnalyticsService } from '../analytics.service';
@Component({
  selector: "app-check-availability",
  templateUrl: "./check-availability.page.html",
  styleUrls: ["./check-availability.page.scss"],
})
export class CheckAvailabilityPage implements OnInit {
  public sitterId: any;
  public sitterName: any;
  public sitterServices = { primary: [], secondary: [] };
  public localUserdata: User;
  public petList: Pet[];
  public selectedPet = [];
  public availabilityFrm: FormGroup;
  public showPetError = false;
  public isRecurringDateSelector = false;
  public isbookingType = false;
  public is_recurringType: boolean = false;
  public is_booking_days: boolean = false;
  public selectedPetIds = [];
  public extraServicesId = [];
  public activeService: any = [""];

  //fromDate and To Date
  public frmDate: any;
  public toDate: any;

  checkedItems: any = [];

  // Setting Min Date and Min Max Time
  public startMinDate = "";
  public minToDate: any;
  public startMinTime: any;
  public startTotime: any;
  public previousUrl: any;
  public isNoPets: boolean = false;
  public primaryService: any;
  public secondaryService: any;

  //Boolean Show Hide Variables
  public isRecurring: boolean = false;
  public isOnceOff: boolean = false; // Show or hide Once off 
  public hideBothDaySelector: boolean = false;
  public isCustomDays: boolean = false;
  public isEndDateTime: boolean = true;
  public isMultipleDays: boolean = false;
  public isrecurringSelected: Boolean = false;
  // Response in Recurring Type
  recurringOptions: any;
  public isOneOffDateSelector: boolean = false;
  public selectedMode: any;
  selectedDayStatus: any;
  public isFormValid: boolean = false;
  public isEmailVerified: boolean = false;
  public isPhVerifed: boolean = false;
  public minEdDate: any;
  compareWith: any;
  public selectedServiceId = "";
  private _routerSub = Subscription.EMPTY;
  private sittersDetail: any;
  public serviceChargeType: any;
  public isRebook: boolean = false;

  public lbl_formatedStartDate: any;
  public lbl_formatedEndDate: any;
  public isInquireAnyWay: boolean = false;
  public isAPILoaded: boolean = false;
  public endDateChangedValue: any;

  public extraServices = [];
  public extraServiceData;
  public serviceData;
  public isAppReviewed: any = ""

  days: any = [
    { label: "Mon", value: '1', checked: false, disabled: true },
    { label: "Tue", value: '2', checked: false, disabled: true },
    { label: "Wed", value: '3', checked: false, disabled: true },
    { label: "Thu", value: '4', checked: false, disabled: true },
    { label: "Fri", value: '5', checked: false, disabled: true },
    { label: "Sat", value: '6', checked: false, disabled: true },
    { label: "Sun", value: '7', checked: false, disabled: true },
  ]

  constructor(
    protected storage: Storage,
    private formBuilder: FormBuilder,
    public api: PetcloudApiService,
    public datePicker: DatePicker,
    public platform: Platform,
    protected modalCtrl: ModalController,
    protected route: Router,
    public firebaseAnalytics: AnalyticsService
  ) { }

  ngOnInit() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString();
    this.startMinDate = tomorrow;

    this.availabilityFrm = this.formBuilder.group({
      minderid: [this.sitterId],
      frequency: [1],
      bookingType: [],
      booking_days: [""],
      book_days: [],
      service: ["", [Validators.required]],
      services: [[]],
      pets: [[], [Validators.required, Validators.minLength(1)]],
      start_date: [tomorrow, [Validators.required]],
      start_time: ["", [Validators.required]],
      end_date: [""],
      end_time: [""],
      couponCode: [""],
      recurring_type: ["C"],
    });

    // get availability
    this.storage.get("availabilitySitter").then((siterData: any) => {
      if (siterData != null) {
        
        this.sittersDetail = siterData;
        this.sitterId = siterData.sitterId;
        this.isRebook = siterData.isRebook;

        this.days.forEach(day =>{
          let finder = siterData.operating_days.findIndex( x => x == day.value );
          if(finder >= 0){
            day.disabled = false;
          }
        })

        // add minderid.
        this.availabilityFrm.patchValue({
          minderid: this.sitterId,
        });

        this.firebaseAnalytics.setUser();
        this.firebaseAnalytics.logEvent(PetcloudApiService.check_availability_analytics, { "sitterId": this.sitterId })

        this.sitterName = siterData.sitterName;
        this.primaryService = siterData.primaryService.filter((res) => res.active == "1");

        this.availabilityFrm.patchValue({
          service: this.primaryService[0],
        });

        this.selectedServiceId = this.primaryService[0].id;

        let selectedServiceValue = this.sittersDetail.primaryService.filter(
          (data) => data.id == this.primaryService[0].id
        );
        this.serviceChargeType = selectedServiceValue[0].serviceType.serviceChargeType;

        this.isOnceOff = selectedServiceValue[0].hideonce;
       
        selectedServiceValue[0].serviceType.allow_reoccurring == 1
          ? ((this.isRecurring = true,
            this.isRecurringDateSelector = true,
            this.isOneOffDateSelector = false,
            this.availabilityFrm.patchValue({
              bookingType: "1",
              recurring_type: "C"
            })))
          : (this.isRecurring = false,
            this.isRecurringDateSelector = false,
            this.availabilityFrm.patchValue({
              bookingType: "0",
              recurring_type: "C"
            }));


            if (selectedServiceValue[0].serviceType.serviceChargeType == 3 || selectedServiceValue[0].hideonce == true ) {
              this.isEndDateTime = false;

              this.availabilityFrm.patchValue({
                end_date: "",
                end_time: "",
              });
              this.lbl_formatedEndDate = "";
              this.availabilityFrm.patchValue({
                end_date:"",
                end_time:""
              })
            }else{
              this.isEndDateTime = true;
            }



        if (siterData.primaryService.length > 0) {
          for (const s of siterData.primaryService) {
            this.sitterServices.primary.push({
              serviceId: s.id,
              serviceName: s.serviceType.serviceName,
            });
          }
        }
        // display extra services.
        //push extra services to keep accordian open in activeService
        if (siterData.secondaryService.length > 0) {
          for (const s of siterData.secondaryService) {
            this.sitterServices.secondary.push({
              serviceId: s.id,
              isSelected: false,
              serviceName: s.serviceType.serviceName,
              occasions: 0,
              sec_description: s.serviceType.sec_description,
              noOfPetSelected: 0,
            });
            this.activeService.push('extra-' + s.id)
          }
        }
      }
    });



    this.isFormValid = true;
    this.getInfo();
    this.getRecurringOptions();
    this.selectedMode = 0;
  }

  ionViewWillEnter() {
    // get tomorrow date.
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString();

    this.startMinDate = tomorrow;
    this.minEdDate = tomorrow;
    this.minToDate = tomorrow;
    this.startMinTime = "09:00";
    //set to time
    this.startTotime = this.startMinTime;
    this.minToDate = new Date(today.setDate(today.getDate() + 2)).toISOString();

    this.selectedPet = [];
    this.availabilityFrm.patchValue({
      start_date: this.startMinDate,
      start_time: this.startMinTime,
      end_date: this.minToDate,
      end_time: "16:00",
    });
    this.isInquireAnyWay = false;

    this.lbl_formatedStartDate = this.startMinDate;
    this.lbl_formatedEndDate = this.minToDate;
    this.endDateChangedValue = this.minToDate;
    this.isFormValid = true;

    this.getPetsListing();
  }

  /**
   * Open and close accordian
   * @param activeBlock
   */
  public openActiveBlock(activeBlock: any) {


    let indx = this.activeService.indexOf(activeBlock);

    if (indx >= 0) {
      this.activeService.splice(indx, 1);
    } else {
      this.activeService.push(activeBlock);
    }
  }

  checkValidations() {

    if (this.selectedPetIds.length > 0 && this.selectedMode != null && this.availabilityFrm.value.service != "") {
      if (this.serviceChargeType == 0) {
        this.isFormValid = true;
      } else if (this.serviceChargeType != 0) {
        if (this.availabilityFrm.value.recurring_type == "") {
          this.isFormValid = false;
        } else if (this.availabilityFrm.value.recurring_type != "") {
          if (this.availabilityFrm.value.recurring_type == "OAW" || this.availabilityFrm.value.recurring_type == "C") {
            if (this.availabilityFrm.value.recurring_type == "OAW") {
              this.isMultipleDays = false;
              if (this.availabilityFrm.value.booking_days != "") {
                this.isFormValid = true;
              } else {
                this.isFormValid = false;
              }
            }
            if (this.availabilityFrm.value.recurring_type == "C") {
              if (this.availabilityFrm.value.booking_days.length) {
                this.isFormValid = true;
              } else {
                this.isFormValid = false;
              }
            }
          } else if (this.availabilityFrm.value.recurring_type != "OAW" || this.availabilityFrm.value.recurring_type != "C") {
            this.isFormValid = true;
            this.isMultipleDays = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

  getInfo() {
    this.storage.get(PetcloudApiService.USER).then(
      (res: User) => {
        res.verify_phoneflag == "N"
          ? (this.isPhVerifed = false)
          : (this.isPhVerifed = true);
        res.verified == 0
          ? (this.isEmailVerified = false)
          : (this.isEmailVerified = true);
      },
      (err) => {

      }
    );
  }

  public calculatePrice() {
    let start_date = new DatePipe("en-US").transform(
      this.availabilityFrm.value.start_date,
      "EEE dd MMM y"
    );
    let end_date = new DatePipe("en-US").transform(
      this.availabilityFrm.value.end_date,
      "EEE dd MMM y"
    );

    if (this.availabilityFrm.value.pets.length === 0) {
      this.showPetError = true;
    }
    if (this.selectedDayStatus == "ED") {
      this.availabilityFrm.patchValue({
        book_days: "",
      });
      this.saveCalculateAPI(start_date, end_date);
    } else if (this.selectedDayStatus == "C") {
      // Book days in comma seperated vals
      if (this.availabilityFrm.value.booking_days.length) {
        this.availabilityFrm.value.book_days = Array.prototype.map
          .call(this.availabilityFrm.value.booking_days, function (item) {
            return item;
          })
          .join(",");

        this.saveCalculateAPI(start_date, end_date);
      } else if (
        this.availabilityFrm.value.booking_days == "" ||
        this.availabilityFrm.value.booking_days == null
      ) {
        console.log("isCustomDays", this.isCustomDays);
      } else {
        this.saveCalculateAPI(start_date, end_date);
      }
    } else {
      this.saveCalculateAPI(start_date, end_date);
    }
  }

  async saveCalculateAPI(start_date, end_date) {
    if (
      this.minEdDate != null &&
      new Date(this.lbl_formatedEndDate) < new Date(this.lbl_formatedStartDate)
    ) {
      this.api.showToast("Start Date is less then end date", "3000", "bottom");
    } else {

      let booking_days = [];

      if (this.availabilityFrm.value.recurring_type == "OAW") {
        booking_days.push(this.availabilityFrm.value.booking_days);
      }
      let avilaFrm = {
        minderid: this.availabilityFrm.value.minderid,
        frequency: this.availabilityFrm.value.frequency,
        service: this.availabilityFrm.value.service.id,
        pets: this.selectedPetIds,
        start_date,
        end_date: end_date != null ? end_date : "",
        start_time: this.tConvert(this.availabilityFrm.value.start_time),
        end_time:
          this.availabilityFrm.value.end_time != null
            ? this.tConvert(this.availabilityFrm.value.end_time)
            : "",
        book_days: this.availabilityFrm.value.book_days,

        booking_days: this.availabilityFrm.value.recurring_type == "W" ? ['6'] :
          this.availabilityFrm.value.recurring_type == "OAW" ? booking_days :
            this.availabilityFrm.value.booking_days,
        recurring_type: this.availabilityFrm.value.recurring_type,
        bookingType: this.availabilityFrm.value.bookingType,
        inquire_anyway: this.isInquireAnyWay == true ? "inquireanyway" : "",
        extraservices: this.extraServiceData == undefined ? "" : this.extraServiceData,
        check_endDate: this.isOnceOff == true ? 1 : 0
      };


      if (avilaFrm.extraservices != null) {
        let isFormValid = [];


        for (let [key, value] of Object.entries(avilaFrm.extraservices)) {
          let val: any
          val = value;

          if (val.occasions == 0 && val.pets.length == 0) {
            await delete avilaFrm.extraservices[key];
          }

          if (val.occasions > 0 && val.pets.length > 0) {
          } else if (val.occasions == 0 && val.pets.length > 0) {
            await isFormValid.push(key);
            this.api.showToast("Please Select Occasions for " + val.serviceName, "3000", "bottom");
          } else if (val.occasions > 0 && val.pets.length == 0) {
            await isFormValid.push(key);
            this.api.showToast("Please Select Pets for " + val.serviceName, "3000", "bottom");
          }
        }


        //Calling API on Form Valid
        await isFormValid.length == 0 ? this.availabilityAPI(avilaFrm) : ""

      } else {

        this.availabilityAPI(avilaFrm);
      }
    }
  }

  onOccuranceChange(event, servs) {
    servs.occurance = event.detail.occurance;
    this.createExtraService(servs);

  }

  availabilityAPI(avilaFrm) {


   
    this.isFormValid = true;
    this.storage.set("BookingRequestForm", avilaFrm);
    this.api.showLoader();
    this.api
      .calculatePreCostPrice(avilaFrm)
      .pipe(
        finalize(() => {
          // hide loader in success
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          this.isFormValid = false;
          if (res.result) {
            res["sitterName"] = this.sitterName;
            res["serviceName"] = this.availabilityFrm.value.service;
            this.storage.set("bookingCost", res);
              this.route.navigateByUrl("/booking-cost")
          
          } else {
            // show Inquiry Pop Up If true
            if (res.inquirepopup) {
              const modal = await this.modalCtrl.create({
                component: NonAvailabilityAdditionalBookingsComponent,
                animated: true,
                cssClass: "modalCss",
                componentProps: {
                  message: res.response,
                },
              });
              modal.onDidDismiss().then((data: any) => {
                if (data.data != "") {
                  this.isInquireAnyWay = true;
                  this.calculatePrice();
                } else {
                  this.isInquireAnyWay = false;
                }
              });
              return await modal.present();
            } else {
              this.isFormValid = true;
              this.api.showToast(res.response, 2000, "bottom");
            }
          }
        },
        (err) => {
          this.isFormValid = false;
          this.api.autoLogout(err, avilaFrm);
        }
      );
  }

  compareWithDocument(object1: any, object2: any) {
    return object1 && object2 && object2 === object1;
  }

  compareDays(object1: any, object2: any) {
    return object1 && object2 && object2 === object1;
  }

  setHideOnce(hideOnce){
    if(hideOnce){
      this.isEndDateTime = false; 
      this.lbl_formatedEndDate = "";
      this.availabilityFrm.patchValue({
        bookingType: "1",
        recurring_type: "C",
        end_date: "",
        end_time: "",
      });

    }else{
      this.lbl_formatedEndDate = this.endDateChangedValue
      this.isEndDateTime = true;
      this.availabilityFrm.patchValue({
        bookingType: "0",
        recurring_type: "C",
        end_data: this.lbl_formatedEndDate,
        end_time: "16:00",

      });
    }    

  }

  primaryServiceChange(event) { 
    event.detail.value.serviceType.allow_reoccurring == 1 ? (this.isRecurring = true) : (this.isRecurring = false); 
    this.serviceChargeType = event.detail.value.serviceType.serviceChargeType;
    this.isOnceOff = event.detail.value.hideonce;
    
    console.log("service charge type", event.detail.value.serviceType.serviceChargeType);
      
    this.setHideOnce(event.detail.value.hideonce)
    if (event.detail.value.serviceType.serviceChargeType == 3) {
      this.isEndDateTime = false;
    } 


    this.storage.get("availabilitySitter").then((siterData: any) => {
      if (siterData != null) {
        this.sitterServices.secondary = [];
        if (siterData.secondaryService.length > 0) {
          for (const s of siterData.secondaryService) {
            if(event.detail.value.serviceTypeId == '14' && s.serviceTypeId == '11'){
              continue;
            }
            this.sitterServices.secondary.push({
              serviceId: s.id,
              isSelected: false,
              serviceName: s.serviceType.serviceName,
              occasions: 0,
              sec_description: s.serviceType.sec_description,
              noOfPetSelected: 0,
              petListing: this.petList
            });
            this.activeService.push('extra-' + s.id)
          }
        }
      }
    });

    console.log("once off", this.isOnceOff);
    this.checkValidations();
  }

  /**
   * get Recurring options get Servies and Recurring Type
   */
  getRecurringOptions() {
    this.api.showLoader();
    this.api
      .recurringOptions()
      .pipe(
        finalize(() => {
          this.api.hideLoader();
        })
      )
      .subscribe(
        async (res: any) => {
          this.isAPILoaded = true;
          this.recurringOptions = await res;

          this.checkValidations();
        },
        (err: any) => {
          this.isAPILoaded = false;
          this.api.autoLogout(err, "");
        }
      );
  }

  selectDays(event) {
    this.selectedDayStatus = event.detail.value;

    this.availabilityFrm.patchValue({
      booking_days: "",
    });

    if (event.detail.value == "OAW" || event.detail.value == "C") {
      this.isCustomDays = true;
      if (event.detail.value == "OAW") {
        this.isMultipleDays = false;
        this.isFormValid = false;
      } else {
        this.isMultipleDays = true;
        this.isFormValid = false;
      }
    } else {
      this.availabilityFrm.patchValue({
        booking_days: "",
      });
      if (this.availabilityFrm.value.pets.length === 0) {
        this.isFormValid = false;
      } else if (this.availabilityFrm.value.pets.length === 1) {
        this.isFormValid = true;
      }
      this.isCustomDays = false;
    }
    this.checkValidations();
  }

  // Mode Select
  selectMode(event) {
    this.selectedMode = event.detail.value;
    if (event.detail.value == "0") {
      this.isrecurringSelected = false;
      this.isOneOffDateSelector = true;
      this.isRecurringDateSelector = false;

      this.hideBothDaySelector = false;
      // Clear Form Values
      this.availabilityFrm.patchValue({
        recurring_type: "C",
        booking_days: "",
      });
      this.isFormValid = false;

      if (this.serviceChargeType != 0) {
        this.availabilityFrm.patchValue({
          recurring_type: "C",
        });
      }

      this.checkValidations();
    } else {
      this.hideBothDaySelector = true;
      this.isrecurringSelected = true;
      this.isOneOffDateSelector = false;
      this.isRecurringDateSelector = true;

      this.availabilityFrm.patchValue({
        recurring_type: "C",
        booking_days: "",
      });
      this.isFormValid = false;

      if (this.serviceChargeType != 0) {
        this.availabilityFrm.patchValue({
          recurring_type: "C",
        });
      }

      this.checkValidations();
    }

    if (event.detail.value == "") {
      this.isbookingType = true;
    } else {
      this.isbookingType = false;
    }
  }

  onChange(item) {
    if (this.checkedItems.includes(item)) {
      this.checkedItems = this.checkedItems.filter((value) => value != item);
    } else {
      this.checkedItems.push(item)
      // }
      // console.log(this.checkedItems.toString())
      
    }
    this.availabilityFrm.get("booking_days").setValue(this.checkedItems);
    this.checkValidations();
  }
  //Custom Calender Selector
  customDays(event) {
    let val = event.detail.value;
    this.checkValidations();
  }

  onPetSelectChange(event, petId) {
    if (this.selectedPetIds.length > 0) {
      const index = this.selectedPetIds.indexOf(petId);
      if (index >= 0) {
        this.selectedPetIds.splice(index, 1);
      } else {
        this.selectedPetIds.push(petId);
      }
    } else {
      this.selectedPetIds.push(petId);
    }

    this.availabilityFrm.patchValue({
      pets: this.selectedPetIds,
    });
    if (this.selectedPetIds.length > 0) {
      this.checkValidations();
    } else {
      this.isFormValid = false;
    }
  }

  async presentBookingCostModal(costData: any) {
    const modal = await this.modalCtrl.create({
      component: BookingCostComponent,
      componentProps: { value: costData },
    });
    return await modal.present();
  }

  //Set End Date and Clearing Form Values of To Date
  public fromDate(event) {
    this.frmDate = event;
    this.lbl_formatedStartDate = event;

    this.availabilityFrm.patchValue({
      start_date: event,
    });
    this.minToDate = "";
    this.availabilityFrm.value.end_date = "";
    // this.minToDate = event.value;

    if (this.minToDate > this.frmDate) {
      this.minToDate = this.minToDate;
      this.minEdDate = event;
      this.lbl_formatedStartDate = this.minEdDate;
    } else {
      this.minToDate = event;
      this.minEdDate = this.minToDate;
      this.lbl_formatedStartDate = this.minEdDate;
    }
  }

  public endDateChange(event) {
    this.toDate = event;
    this.lbl_formatedEndDate = event;
    this.endDateChangedValue = event;

    this.availabilityFrm.patchValue({
      end_date: event,
    });

    if (this.minToDate > this.frmDate) {
      this.minToDate = this.minToDate;
    } else {
      this.minToDate = event;
      this.minEdDate = this.minToDate;
      // this.lbl_formatedStartDate = this.minEdDate;
    }
  }

  public fromTimeChange(event) {
    this.startTotime = event.value;
  }

  private tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM this.sitterServices.secondary[index].petListing[petIndex].isPetSelected
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  public getPetsListing() {
    this.selectedPetIds = [];
    let extraServicesId = [];

    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        this.api
          .getPetList(userData.id)
          .pipe(
            finalize(() => {
              this.api.hideLoader();
            })
          )
          .subscribe(
            async (res: any) => {
              if (res.success) {
                if (res.pets.length > 0) {
                  this.isNoPets = false;
                  this.petList = await res.pets; // assign list object to local variable.


                  this.availabilityFrm.value.pets = [];
                  this.petList.forEach((element: any) => {
                    element.isPetSelected = false;
                    this.selectedPetIds.push(element.id);
                    this.availabilityFrm.value.pets.push(element.id);
                  });

                  // Push PetList in Sitter secondary service.
                  if (this.sitterServices.secondary.length) {
                    this.sitterServices.secondary.forEach((ele) => {
                      ele.petList = [];
                      ele.petListing = this.petList;
                    });

                  }

                  if (
                    this.availabilityFrm.value.pets.length > 0 &&
                    this.selectedMode != undefined &&
                    this.selectedServiceId != ""
                  ) {
                    this.isFormValid = true;
                  } else {
                    this.isFormValid = false;
                  }

                  this.checkValidations();
                } else {
                  this.isNoPets = true;
                }
              } else {
                this.api.showToast(
                  "No pet found! add new family member",
                  200,
                  "bottom"
                );
              }
            },
            (err: any) => {
              this.api.autoLogout(err, (userData.id));
            }
          );
      },
      (err: any) => {
      }
    );
  }

  openFromDateCalender(date_type) {
    this.datePicker
      .show({
        date: new Date(),
        mode: "date",
        minDate: this.platform.is("ios") ? new Date() : new Date().valueOf(),
        allowOldDates: false,
        allowFutureDates: true,
        androidTheme: 5,
      })
      .then(
        async (date) => this.fromDate(date),
        (err) => console.log("Error occurred while getting date: ", err)
      );
  }

  openToCalender(date_type) {
    this.datePicker
      .show({
        date: new Date(),
        mode: "date",
        minDate: this.platform.is("ios") ? new Date() : new Date().valueOf(),
        allowOldDates: false,
        allowFutureDates: true,
        androidTheme: 5,
      })
      .then(
        async (date) => this.endDateChange(date),
        (err) => console.log("Error occurred while getting date: ", err)
      );
  }

  changeOccuranceValue(event, service) {

    if (event == "add") {
      service.occasions = parseInt(service.occasions) + 1;
    } else if (event == "textInput") {
      service.occasions = parseInt(service.occasions)
    } else if (service.occasions > 0) {
      service.occasions = parseInt(service.occasions) - 1;
    } else {
      service.occasions = 0;
    }

    this.createExtraService(service);
  }

  changePetToSecondaryListing = async (petList, servs, index, petIndex, event) => {
    // Pushing PetId in Pet List 
    servs.petList.indexOf(petList.id) !== -1 ? servs.petList = servs.petList.filter(petId => petId != petList.id) : servs.petList.push(petList.id);
    // Checking No of Pets Selected
    // servs.noOfPetSelected = await servs.petList.length;
    this.createExtraService(servs)
  }

  async createExtraService(servs) {
    if (this.extraServices.length > 0) {
      let indx = this.extraServices.indexOf(servs.serviceId);
      if (indx >= 0) {
        if (servs.occasions == 0) {
        }
        this.createExtraServices();
      } else {
        if (servs.occasions > 0) {
          this.extraServices.push(servs.serviceId);
        } else {
        }
        this.createExtraServices();
      }
    } else {
      this.extraServices.push(servs.serviceId);
      this.createExtraServices();
    }

    // Checking No of Pets Selected
    servs.noOfPetSelected = await servs.petList.length;
  }

  createExtraServices() {
    this.extraServiceData = Object.assign(
      {},
      ...this.extraServices.map((key) => ({
        [key]: {
          serviceName: this.sitterServices.secondary.filter(occuranceData => key == occuranceData.serviceId).map((data) => data.serviceName)[0],
          occasions: this.sitterServices.secondary.filter(occuranceData => key == occuranceData.serviceId).map((data) => data.occasions)[0],
          pets: (this.sitterServices.secondary.filter(serviceData => key == serviceData.serviceId).map((data, index) => data.petList))[0]
        },
      })))
    console.log("extra serv", this.extraServiceData);
  }
}