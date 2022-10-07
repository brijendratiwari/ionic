import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PetcloudApiService } from "../../api/petcloud-api.service";
import { Storage } from "@ionic/storage";
import { Location, DatePipe } from "@angular/common";
import { NavController, Platform, ModalController, IonSlides, AlertController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { finalize, filter } from "rxjs/operators";
import { User } from "../../model/user";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { AnalyticsService } from "src/app/analytics.service";
import { AppsFlyerService } from "src/app/apps-flyer.service";
import { PetTaxiAgreementModelComponent } from "src/app/pet-taxi-agreement-model/pet-taxi-agreement-model.component";
import { Market } from "@ionic-native/market/ngx";
declare var google;


@Component({
  selector: 'app-post-enquiry',
  templateUrl: './post-enquiry.component.html',
  styleUrls: ['./post-enquiry.component.scss'],
})
export class PostEnquiryComponent implements OnInit {

  @Input() isModalView: boolean = false;
  @Input() sitter: any;
  sitterInfo: any;

  public selectedService: any;
  public jobPostingForm: FormGroup;
  public serviceList: Array<any> = [];
  public petList: Array<any> = [];
  public selectedPet = [];
  public selectedServiceId: any;
  public isFormValid: boolean = false;
  public ServiceChargeType: any = "";
  public hideServices: boolean = false;

  //Boolean Show Hide Variables
  public isRecurring: boolean = false;
  public isOnceOff: boolean = false; // Show or hide Once off
  public hideBothDaySelector: boolean = false;
  public isCustomDays: boolean = false;
  public isEndDateTime: boolean = true;
  public isMultipleDays: boolean = false;
  public isNoPets: boolean = false;
  public isPetTaxi: boolean = false;
  // Response in Recurring Type
  recurringOptions: any;
  public isOneOffDateSelector: boolean = false;
  public isRecurringDateSelector: boolean = false;

  // Setting Min Date and Min Max Time
  public startMinDate = "";
  public minToDate: any;
  public startMinTime: any;
  public startTotime: any;

  //Estimated Cost..
  public totalEstimatedCost = 1;
  public weeklyEstimatedCost = 1;
  public differenceDays = 2;
  public customSelectedDays: any;
  public isMessagesContainerSectionLoaded: boolean = false;

  public isEmailVerified: boolean = false;
  public isPhVerifed: boolean = false;
  public paymentVeried: boolean = false;

  //fromDate and To Date
  public frmDate: any;
  public toDate: any;
  public minEdDate: any;
  public SelectedServiceEvent: any;
  public priceValues: any;
  public diffDays = 0;
  public priceOfPet: 0;
  hideFabButton: boolean = false;
  public hideCosts: boolean = true;
  public isDaysCount: number;
  public customDayCount: number; // count day selected between 2 dates of calender and save common total days value
  public daysBetweenCustomDateSelected = [];
  public calucations: any = ([] = [
    { petId: "" },
    { diffDay: "" },
    { priceOfPet: "" },
  ]);
  public selectedPetIds = [];
  public selectedpetType = [];
  public selectedDayStatus: any;

  public petDetails: any = [{ id: "", petType: "" }];
  public selectedMode: any;

  public isrecurringSelected: Boolean = false;
  public isPetAvailable: boolean = false;
  public petsList: any;
  isModelClick: boolean = false;

  //Validations
  public isbookingType: boolean = false;
  public isPetSelected: boolean = true;
  public is_service_type_id: boolean = false;
  public is_recurringType: boolean = false;
  public is_booking_days: boolean = false;
  public isCustomSelectorValidated: boolean = false;
  public isPhEmailVerified: boolean = false;

  compareWith: any;
  SelectedValueOfService: string;

  public lbl_formatedStartDate: any;
  public lbl_formatedEndDate: any;

  public progressStepper: any;
  public recurringOption: any = "";
  private CUSTOM = "C";
  private EVERYDAY = "ED";
  private WEEKEND = "W";
  private ONCE_A_WEEK = "OAW";
  private EVERY_2nd_DAY = "E2D";
  private EVERY_WEEK_DAY = "EWD";
  private EVERY_2nd_DAY_WEEK = "E2WD";
  userId: any = "";
  pickupLocation: "";
  destinationLocation: "";
  distanceForPetTaxi: "";
  travelTime: "";
  taxiTravelTimeinSecond: any;
  isCreateButtonShown = true;

  @ViewChild("mapElement") mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  directionForm: FormGroup;
  origin: any;
  destination: any;
  googleMapShown: boolean = false;
  estimationTaxiPrice;
  options = {
    // types: ['(regions)'],
    componentRestrictions: { country: "AU" },
    bounds: null,
    types: [],
    fields: null,
    strictBounds: null,
    origin: null
  };

  @ViewChild('jobSlides') jobSlides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    // autoHeight: true
  };
  activeSlideIndex: number = 0;
  primaryServices: any;
  secondaryServices: any;
  estimatedPrice: number = 0;
  public costData: any = {};
  public totalCost = 0;
  public bookingCost = 0;
  isRSPCADonationChecked: boolean = true;
  shareNumber: boolean = false;
  termsAccpted: boolean = false;
  userData: any;
  bookingForm: any;
  
  constructor(
    private formBuilder: FormBuilder,
    public api: PetcloudApiService,
    protected storage: Storage,
    protected location: Location,
    public model: ModalController,
    public navCtrl: NavController,
    public platform: Platform,
    public router: Router,
    private datePicker: DatePicker,
    public route: ActivatedRoute,
    public analytics: AnalyticsService,
    public appsFlyerAnalytics: AppsFlyerService,
    private market: Market,
    private alertController: AlertController,
    private datepipe: DatePipe,
  ) {
    //Store URL to check in pet Add Page.
    this.storage.set("pervURL", this.router.url);
    if (this.router.url == "post-job") {
      this.hideFabButton = false;
    } else {
      this.hideFabButton = true;
    }

    this.backButtonEvent();
  }

  ngOnInit() {
    //1)bookingType:- 0 for one-off and 1 for recurring.
    //  2)booking_days[]:- (0 for SUN, 1 for MON, 2 for TUE, 3 for WED, 4 for THR, 5 for FRI, 6 for SAT)
    this.jobPostingForm = this.formBuilder.group({
      service_id: ["", [Validators.required]],
      pets: [[], [Validators.required]],
      start_date: [""],
      end_date: [""],
      description: [""],
      start_time: [""],
      end_time: [""],
      bookingType: [],
      booking_days: ["", [Validators.required]],
      recurring_type: [""],
      pickup_address: [""],
      destination_address: [""],
      km_distance: [""],
      min_distance: [""],
      taxi_way: [""],
      petTaxiCleaninessAgree: true,
      pickup_suburb: "",
      destination_suburb: "",
    });
  }

  async ionViewWillEnter() {
    this.jobPostingForm.patchValue({
      start_date: this.startMinDate,
      end_date: this.minToDate,
    });

    this.totalEstimatedCost = 1;
    this.weeklyEstimatedCost = 1;

    this.startMinTime = "05:00";
    this.startTotime = "16:00";
    this.jobSlides.lockSwipes(true);

    this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
        this.userData = res;
        let sitterInfo = await this.api.getSittersProfileDetails(this.sitter.id).toPromise();
        this.sitterInfo = sitterInfo;
        if(sitterInfo) {
          this.primaryServices = this.sitterInfo.user.primaryServices;
          this.selectedService = (this.primaryServices && this.primaryServices.length>0)? this.primaryServices[0] : null,
          this.secondaryServices = this.sitterInfo.user.secondaryServices;
          if(this.secondaryServices?.length>0) {
            this.secondaryServices.map((data)=>{
              data['occasions'] = 0;
            })
          }
        }
        await this.getPetsListing();
        await this.api.isVerificationPendingModel();
        // get tomorrow date.

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
      } else {
      }
    });
  }

  ionViewDidLeave() {
    this.isCustomDays = false;
  }

  public clearData() {
    this.isbookingType = false;
    this.isPetSelected = false;
    this.is_service_type_id = false;
    this.is_recurringType = false;
    this.is_booking_days = false;
    this.isCustomDays = false;
    this.isCustomSelectorValidated = false;

    this.jobPostingForm.value.booking_days = "";
    this.jobPostingForm.value.recurring_type = "";
    this.jobPostingForm.value.bookingType = "";
    this.jobPostingForm.value.recurring_type = "";
    this.jobPostingForm.value.pets = [];
    this.jobPostingForm.get("booking_days").clearValidators();
    this.jobPostingForm.get("booking_days").updateValueAndValidity();
    this.isRecurringDateSelector = false;
    this.weeklyEstimatedCost = 1;
    this.totalEstimatedCost = 1;
  }

  //Set End Date and Clearing Form Values of To Date
  public fromDate(event) {
    this.lbl_formatedStartDate = event;
    this.jobPostingForm.patchValue({
      start_date: event,
      end_date: "",
    });
    this.frmDate = event;

    this.minToDate > this.frmDate
      ? ((this.minToDate = this.minToDate), (this.minEdDate = event))
      : ((this.minToDate = event), (this.minEdDate = this.minToDate));
    this.selectedPetIds.length
      ? (this.isPetSelected = false)
      : (this.isPetSelected = true);

    this.jobPostingForm.patchValue({
      end_date: this.minToDate,
    });
    this.isWeekend(this.frmDate, this.toDate);
  }

  public fromTimeChange(time) {
    this.clearPetTaxiValue();
  }

  public endDateChange(event) {
    this.lbl_formatedEndDate = event;
    this.jobPostingForm.patchValue({
      end_date: event,
    });

    this.toDate = event;
    this.minEdDate > this.frmDate
      ? (this.minToDate = this.minToDate)
      : ((this.minToDate = event), (this.minEdDate = this.minToDate));
    this.selectedPetIds.length
      ? (this.isNoPets = false)
      : (this.isNoPets = true);

    this.isWeekend(this.frmDate, this.toDate);

    this.dateDifference();
  }

  dateDifference() {
    let date1 = new Date(this.frmDate);
    let date2 = new Date(this.toDate);

    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getDates(startDate, stopDate) {
    var dateArray = [];
    let fromDate: any;
    let endDt: any;
    fromDate = moment(startDate).format("YYYY-MM-DD");
    endDt = moment(stopDate).format("YYYY-MM-DD");

    var dateArray = [];
    var currentDate = moment(startDate);
    let stopDt = moment(stopDate);
    while (currentDate <= stopDt) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  }

  isFooterShown() {
    this.isCreateButtonShown = false;

    if (this.pickupLocation != "" && this.destinationLocation != "") {
      this.isCreateButtonShown = true;
    }
  }

  public isWeekend(start_date, end_date) {
    {
      let dates = [];
      let weekendDays = 0;
      let every2ndDay = 0;
      let m2f = 0; // Monday to friday.
      let customDay = 0;
      let oaw = 0;
      let mwf = 0;
      let everyday = 0;
      this.daysBetweenCustomDateSelected = [];
      this.customDayCount = 0;

      dates = this.getDates(start_date, end_date);
      // every day Sunday to Saturday.
      if (this.ServiceChargeType != "0") {
        if (this.jobPostingForm.value.recurring_type == this.EVERYDAY) {
          everyday = dates.length;
          this.isDaysCount = everyday;
        }
        dates.forEach(async (element) => {
          this.daysBetweenCustomDateSelected.push(new Date(element).getDay()); // Get Day from Date in Array.
          // Saturday and sunday
          if (this.jobPostingForm.value.recurring_type == this.WEEKEND) {
            if (
              new Date(element).getDay() == 6 ||
              new Date(element).getDay() == 0
            ) {
              weekendDays = weekendDays + 1;
              this.isDaysCount = weekendDays;
            }
          } else if (
            this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY
          ) {
            if (
              new Date(element).getDay() == 1 ||
              new Date(element).getDay() == 3 ||
              new Date(element).getDay() == 5
            ) {
              every2ndDay = every2ndDay + 1;
              this.isDaysCount = every2ndDay;
            }
          } else if (
            this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY
          ) {
            if (
              new Date(element).getDay() == 1 ||
              new Date(element).getDay() == 2 ||
              new Date(element).getDay() == 3 ||
              new Date(element).getDay() == 4 ||
              new Date(element).getDay() == 5
            ) {
              m2f = m2f + 1;
              this.isDaysCount = m2f;
            }
          } else if (
            this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
          ) {
            if (
              new Date(element).getDay() ==
              this.jobPostingForm.value.booking_days
            ) {
              oaw = oaw + 1;
              this.isDaysCount = oaw;
            }
          } else if (
            this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY_WEEK
          ) {
            if (
              new Date(element).getDay() == 1 ||
              new Date(element).getDay() == 3 ||
              new Date(element).getDay() == 5
            ) {
              mwf = mwf + 1;
              this.isDaysCount = mwf;
            }
          } else if (this.jobPostingForm.value.recurring_type == this.CUSTOM) {
            if (this.jobPostingForm.value.booking_days.length) {
              let booking_days =
                await this.jobPostingForm.value.booking_days.map(Number);
              this.customDayCount =
                await this.daysBetweenCustomDateSelected.filter((dayEle) =>
                  booking_days.includes(dayEle)
                ).length;
            } else {
            }
          }
        });
      }
    }
  }

  onPetSelectChange(event, petDetail) {
    //Selected Pets.
    this.jobPostingForm.value.pets;
    const index = this.selectedPetIds.indexOf(petDetail.id);
    if (event.detail.checked) {
      if (index === -1) {
        this.selectedPetIds.push(petDetail.id);
        this.selectedpetType.push(petDetail.petType);
        this.jobPostingForm.value.pets.push(petDetail.id);
      } else {
        this.selectedPetIds.splice(index, 1);
        this.selectedpetType.splice(index, 1);
        this.jobPostingForm.value.pets.splice(index, 1);
      }

      if (this.jobPostingForm.value.pets.length == 0) {
        this.isPetSelected = true;
      }
      if (this.jobPostingForm.value.pets.length > 0) {
        this.isPetSelected = false;
        // this.pricesOfSelectedPet();
      }
    } else {
      this.selectedPetIds.splice(index, 1);
      this.selectedpetType.splice(index, 1);
      this.jobPostingForm.value.pets.splice(index, 1);
      // this.pricesOfSelectedPet();
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }
    if (this.jobPostingForm.value.service_id == "") {
      this.isFormValid = false;
    } else if (this.selectedMode == undefined) {
      this.isFormValid = false;
    } else if (this.selectedPetIds.length == 0) {
      this.isFormValid = false;
    } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
      if (this.ServiceChargeType == 0) {
        this.isFormValid = true;
      } else if (this.ServiceChargeType != 0) {
        if (
          this.jobPostingForm.value.recurring_type != this.CUSTOM ||
          this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.recurring_type != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        } else if (
          this.jobPostingForm.value.recurring == this.CUSTOM ||
          this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.booking_days != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }
  }

  setHideOnce(hideOnce) {
    if (hideOnce) {
      this.isEndDateTime = false;
      this.lbl_formatedEndDate = "";
      this.jobPostingForm.patchValue({
        bookingType: "1",
        recurring_type: "EWD",
        end_date: "",
        end_time: "",
      });
    } else {
      this.lbl_formatedEndDate = this.minToDate;
      this.isEndDateTime = true;
      this.jobPostingForm.patchValue({
        bookingType: "0",
        recurring_type: "ED",
        end_data: this.lbl_formatedEndDate,
        end_time: "16:00",
      });
    }
  }

  petTaxiFareCalcuation(distanceinMeter, travelTime) {
    let distanceinKms: any = (distanceinMeter / 1000).toFixed(1);
    let day = new Date(this.lbl_formatedStartDate).getDay();
    let minutes = travelTime / 60;

    const calcuatePrice = {
      meters: distanceinMeter,
      seconds: travelTime,
      daytime: this.jobPostingForm.value.start_time,
      dayVal: day,
    };
    this.api.calcuatePetTaxiFare(calcuatePrice).subscribe(
      (response: any) => {
        if (response.status) {
          this.estimationTaxiPrice = response.amount;
        } else {
          this.api.showToast(response.error, "3000", "bottom");
        }
      },
      (err) => {
        this.api.autoLogout(err, "");
      }
    );
    this.jobPostingForm.patchValue({
      km_distance: distanceinKms,
      min_distance: minutes,
    });
  }

  selectService(event) {
    if(!event.detail.value || !event.detail.value.serviceType)
      return;
    this.totalEstimatedCost = 1;
    this.weeklyEstimatedCost = 1;
    this.selectedService = event.detail.value;
    this.selectedServiceId = event.detail.value.id;

    this.SelectedServiceEvent = event;
    this.priceValues = JSON.parse(event.detail.value.serviceType.avgPrice);
    this.ServiceChargeType = event.detail.value.serviceType.serviceChargeType;
    this.isOnceOff = event.detail.value.hideonce;

    if (this.selectedService.serviceType.serviceName == "Pet Taxi") {
      this.isPetTaxi = true;
      this.startMinTime = "00:00";
    } else if (this.selectedService.serviceType.serviceName != "Pet Taxi") {
      this.isPetTaxi = false;
      // this.isCreateButtonShown = true;
      this.startMinTime = "05:00";
      this.distanceForPetTaxi = "";
      this.travelTime = "";
      this.googleMapShown = false;
      this.destinationLocation = "";
      this.pickupLocation = "";
      this.jobPostingForm.patchValue({
        pickup_address: "",
        destination_address: "",
        km_distance: "",
        min_distance: "",
        taxi_way: "",
        petTaxiCleaninessAgree: true,
        pickup_suburb: "",
        destination_suburb: "",
      });
    }

    if (this.selectedService.serviceType.allow_reoccurring == 1) {
      this.isRecurring = true;
    } else if (this.selectedService.serviceType.allow_reoccurring == 0) {
      this.isRecurring = false;
    }

    if (this.ServiceChargeType != "0") {
      this.hideServices = true;
    }
    if (this.ServiceChargeType == "0") {
      this.hideServices = false;
    }

    if (this.selectedService.serviceType.allow_reoccurring == 1) {
      this.isRecurring = true;
      this.hideBothDaySelector = false;
    }

    this.setHideOnce(event.detail.value.hideonce);

    if (event.detail.value.serviceChargeType == 3) {
      this.isEndDateTime = false;
    }
    if (event.detail.value.serviceChargeType != 3) {
      this.isEndDateTime = true;
      this.setHideOnce(event.detail.value.hideonce);
    }
    if (event.detail.value.id == "") {
      this.is_service_type_id = true;
    } else {
      this.is_service_type_id = false;
    }
    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }

    if (this.selectedMode == undefined) {
      this.isFormValid = false;
    } else if (this.selectedPetIds.length == 0) {
      this.isFormValid = false;
    } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
      if (this.ServiceChargeType == "0") {
        this.isFormValid = true;
      } else if (this.ServiceChargeType != "0") {
        if (
          this.jobPostingForm.value.recurring_type != this.CUSTOM ||
          this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.recurring_type != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        } else if (
          this.jobPostingForm.value.recurring == this.CUSTOM ||
          this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.booking_days != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }

    // this.pricesOfSelectedPet();
  }

  //Custom Calender Selector
  customDays(event) {
    let val = event.detail.value;
    this.daysBetweenCustomDateSelected = [];

    this.customSelectedDays = val.length;
    // this.pricesOfSelectedPet();

    if (this.isOneOffDateSelector || this.isRecurringDateSelector) {
      if (this.jobPostingForm.value.recurring_type == "") {
        this.is_recurringType = true;
      }
      if (this.jobPostingForm.value.recurring_type != "") {
        this.is_recurringType = false;
      }
      if (this.selectedDayStatus == this.CUSTOM && this.isCustomDays) {
        if (val != "") {
          this.is_booking_days = false;
        } else {
          this.is_booking_days = true;
        }

        this.isWeekend(this.frmDate, this.toDate);
      }

      if (this.selectedPetIds.length) {
        this.isPetSelected = false;
      } else {
        this.isPetSelected = true;
      }

      if (this.selectedMode == undefined) {
        this.isFormValid = false;
      } else if (this.selectedPetIds.length == 0) {
        this.isFormValid = false;
      } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
        if (this.ServiceChargeType == 0) {
          this.isFormValid = true;
        } else if (this.ServiceChargeType != "0") {
          if (
            this.jobPostingForm.value.recurring_type != this.CUSTOM ||
            this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
          ) {
            if (this.jobPostingForm.value.recurring_type != "") {
              this.isFormValid = true;
            } else {
              this.isFormValid = false;
            }
          } else if (
            this.jobPostingForm.value.recurring == this.CUSTOM ||
            this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
          ) {
            if (this.jobPostingForm.value.booking_days != "") {
              this.isFormValid = true;
            } else {
              this.isFormValid = false;
            }
          }
        }
      } else {
        this.isFormValid = false;
      }
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }

    if (
      event.detail.value == this.ONCE_A_WEEK ||
      event.detail.value == this.CUSTOM
    ) {
      if (this.jobPostingForm.value.booking_days == "") {
        this.isFormValid = false;
      }
    } else if (this.selectedMode == undefined) {
      this.isFormValid = false;
    } else if (this.selectedPetIds.length == 0) {
      this.isFormValid = false;
    } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
      if (this.ServiceChargeType == 0) {
        this.isFormValid = true;
      } else if (this.ServiceChargeType != 0) {
        if (
          this.jobPostingForm.value.recurring_type != this.CUSTOM ||
          this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.recurring_type != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        } else if (
          this.jobPostingForm.value.recurring == this.CUSTOM ||
          this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.booking_days != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }

    this.is_booking_days == true
      ? (this.isFormValid = false)
      : (this.isFormValid = true);
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
      this.jobPostingForm.patchValue({
        recurring_type: "",
        booking_days: "",
      });
    } else {
      this.hideBothDaySelector = true;
      this.isrecurringSelected = true;
      this.isOneOffDateSelector = false;
      this.isRecurringDateSelector = true;
    }

    if (event.detail.value == "") {
      this.isbookingType = true;
    } else {
      this.isbookingType = false;
      this.weeklyEstimatedCost = 1;
      this.totalEstimatedCost = 1;
      // this.pricesOfSelectedPet();
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }
    if (this.jobPostingForm.value.service_id == "") {
      this.isFormValid = false;
    } else if (this.selectedMode == undefined) {
      this.isFormValid = false;
    } else if (this.selectedPetIds.length == 0) {
      this.isFormValid = false;
    } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
      if (this.ServiceChargeType == 0) {
        this.isFormValid = true;
      } else if (this.ServiceChargeType != 0) {
        if (
          this.jobPostingForm.value.recurring_type != this.CUSTOM ||
          this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.recurring_type != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        } else if (
          this.jobPostingForm.value.recurring == this.CUSTOM ||
          this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.booking_days != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }
  }

  selectDays(event) {
    this.selectedDayStatus = event.detail.value;

    this.jobPostingForm.patchValue({ booking_days: "" });
    if (
      event.detail.value == this.ONCE_A_WEEK ||
      event.detail.value == this.CUSTOM
    ) {
      this.isCustomDays = true;

      if (event.detail.value == this.ONCE_A_WEEK) {
        this.isMultipleDays = false;
      } else {
        this.isMultipleDays = true;
      }
    } else {
      this.is_booking_days = false;
      this.jobPostingForm.get("booking_days").clearValidators();
      this.jobPostingForm.get("booking_days").updateValueAndValidity();
      this.isCustomDays = false;
      this.jobPostingForm.patchValue({ booking_days: "" });
    }

    if (this.isOneOffDateSelector || this.isRecurringDateSelector) {
      if (event.detail.value == "") {
        this.is_recurringType = true;
      }
      if (event.detail.value != "") {
        this.is_recurringType = false;
        // this.pricesOfSelectedPet();
      }
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }

    if (
      event.detail.value == this.ONCE_A_WEEK ||
      event.detail.value == this.CUSTOM
    ) {
      if (this.jobPostingForm.value.booking_days == "") {
        this.isFormValid = false;
      }
    } else if (this.selectedMode == undefined) {
      this.isFormValid = false;
    } else if (this.selectedPetIds.length == 0) {
      this.isFormValid = false;
    } else if (this.selectedMode != undefined && this.selectedPetIds.length) {
      if (this.ServiceChargeType == 0) {
        this.isFormValid = true;
      } else if (this.ServiceChargeType != 0) {
        if (
          this.jobPostingForm.value.recurring_type != this.CUSTOM ||
          this.jobPostingForm.value.recurring_type != this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.recurring_type != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        } else if (
          this.jobPostingForm.value.recurring == this.CUSTOM ||
          this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
        ) {
          if (this.jobPostingForm.value.booking_days != "") {
            this.isFormValid = true;
          } else {
            this.isFormValid = false;
          }
        }
      }
    } else {
      this.isFormValid = false;
    }

    this.isWeekend(this.frmDate, this.toDate);
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
          this.recurringOptions = await res;
          this.progressStepper = await this.recurringOptions.progress;
          this.isPhEmailVerified =
            this.recurringOptions.progress.email == 1 ? true : false;
          this.isMessagesContainerSectionLoaded = true;

          this.jobPostingForm.get("service_id").setValue(this.primaryServices[0]);
          this.SelectedValueOfService = this.primaryServices[0];
          if (this.primaryServices[0]?.serviceType?.serviceName == "Pet Taxi") {
            this.isPetTaxi = true;
            this.startMinTime = "00:00";
          } else {
            this.isPetTaxi = false;
            //   this.isCreateButtonShown = true;
            this.startMinTime = "08:30";
          }

          this.setHideOnce(this.primaryServices[0]?.hideonce);

          if (this.primaryServices[0]?.serviceType?.serviceChargeType == 3) {
            this.isEndDateTime = false;

            this.jobPostingForm.patchValue({
              end_date: "",
              end_time: "",
              bookingType: 0,
              recurring_type: "ED",
            });
            this.lbl_formatedEndDate = "";
          }

          this.compareWith = this.compareWithFn;

          this.isWeekend(this.frmDate, this.toDate);
        },
        (err: any) => {
          this.isMessagesContainerSectionLoaded = false;
          this.api.autoLogout(err, "");
        }
      );
  }

  private formatTime(time) {
    const timeFormat = moment(time, ["HH.mm"]).format("hh:mma");

    return timeFormat; // return adjusted time or original string
  }

  public getPetsListing() {
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        this.userId = userData.id;
        this.api
          .getPetList(userData.id)
          .pipe(
            finalize(() => {
              this.api.hideLoader();
            })
          )
          .subscribe(
            (res: any) => {
              if (res.success) {
                this.getRecurringOptions();

                if (res.pets.length > 0) {
                  this.isNoPets = false;
                  //Clear Form
                  this.isPetAvailable = true;
                  this.petList = [];
                  this.petList = res.pets; // assign list object to local variable.
                  this.jobPostingForm.value.pets = [];
                  this.selectedPetIds = [];
                  this.selectedpetType = [];
                  this.petList.forEach((element) => {
                    this.selectedPetIds.push(element.id);
                    this.selectedpetType.push(element.petType);
                    this.jobPostingForm.value.pets.push(element.id);
                  });

                  this.diffDays = 2;
                  this.differenceDays = 2;
                  // this.pricesOfSelectedPet();
                } else {
                  this.isNoPets = true;
                  this.isPetAvailable = false;
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
              this.api.hideLoader();
              this.api.showToast(
                "No pet found! add new family member",
                2000,
                "bottom"
              );
              this.api.autoLogout(err, userData.id);
            }
          );
      },
      (err: any) => {}
    );
  }

  goToAddMoney() {
    this.router.navigateByUrl("/addmoney");
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  public navigateMyJobs() {
    this.router.navigateByUrl("/jobs");
  }

  public clearPetTaxiValue() {
    if (this.isPetTaxi) {
      this.jobPostingForm.patchValue({
        pickup_address: "",
        destination_address: "",
        km_distance: "",
        min_distance: "",
        taxi_way: "",
        pickup_suburb: "",
        destination_suburb: "",
      });
      this.distanceForPetTaxi = "";
      this.travelTime = "";
      this.taxiTravelTimeinSecond = "";
      this.destinationLocation = "";
      this.pickupLocation = "";
      this.googleMapShown = false;
      this.estimationTaxiPrice = "";
      this.isCreateButtonShown = true;
    }
  }
  openFromDateCalender(date_type) {
    this.clearPetTaxiValue();
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

  async sendEmailtoAccounts() {
    this.api.sendEmailtoAccounts(
      "accounts@petcloud.com.au",
      ["kirtan.p@shaligraminfotech.com"],
      "Pet Cloud app review",
      ""
    );
  }

  isNaN: Function = Number.isNaN;

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var origin = new google.maps.LatLng(lat1, lon1);
    var destination = new google.maps.LatLng(lat2, lon2);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: "DRIVING",
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status == "OK") {
          if (response.rows) {
            if (response.rows.length) {
              let distance = response.rows[0].elements[0].distance.text;
              let time = response.rows[0].elements[0].duration.text;

              this.distanceForPetTaxi = distance;
              this.travelTime = time;
              this.taxiTravelTimeinSecond =
                response.rows[0].elements[0].duration.value;
              this.petTaxiFareCalcuation(
                response.rows[0].elements[0].distance.value,
                response.rows[0].elements[0].duration.value
              );
            }
          }
        }
      },
      (err) => {
        this.api.showAlert("", "Error in getting distance", "");
        console.log("error", err);
      }
    );
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  calculateAndDisplayRoute() {
    this.googleMapShown = true;
    this.isCreateButtonShown = true;
    const distance = this.getDistanceFromLatLonInKm(
      this.origin.lat,
      this.origin.lng,
      this.destination.lat,
      this.destination.lng
    );

    this.directionsService
      .route({
        origin: this.origin,
        destination: this.destination,
        optimizeWaypoints: true,
        avoidHighways: false,
        avoidTolls: false,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        this.directionsDisplay.setDirections(response);
      })
      .catch((e) => console.log("error", e));
  }

  public async handleAddressChange(location, address: any) {
    this.isFooterShown();
    let start_location = null,
      end_location = null;
    if (location == "start_location") {
      start_location = address.formatted_address;
      this.loadMap(location, address);
      this.pickupLocation = start_location;
      this.jobPostingForm.patchValue({
        pickup_address: start_location + address.vicinity,
      });
      await this.api
        .getSuburb(
          address.geometry.location.lat(),
          address.geometry.location.lng()
        )
        .subscribe(async (response: any) => {
          this.jobPostingForm.patchValue({
            pickup_suburb: response.locality,
          });
        });
    } else {
      end_location = address.formatted_address;
      this.loadMap(location, address);
      this.jobPostingForm.patchValue({
        destination_address: end_location,
      });
      this.destinationLocation = end_location;

      await this.api
        .getSuburb(
          address.geometry.location.lat(),
          address.geometry.location.lng()
        )
        .subscribe(async (response: any) => {
          this.jobPostingForm.patchValue({
            destination_suburb: response.locality,
          });
        });
    }
  }

  loadMap(location, address) {
    if (location == "start_location") {
      this.origin = {
        lat: parseFloat(address.geometry.location.lat()),
        lng: address.geometry.location.lng(),
      };
    } else {
      this.destination = {
        lat: parseFloat(address.geometry.location.lat()),
        lng: address.geometry.location.lng(),
      };
    }

    if (this.origin != undefined && this.destination != undefined) {
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        zoom: 7,
        center: {
          lat: address.geometry.location.lat(),
          lng: address.geometry.location.lng(),
        },
      });

      this.directionsDisplay.setMap(map);
      this.calculateAndDisplayRoute();
    }
  }

  onPetTaxiAgreement(event) {
    this.jobPostingForm.patchValue({
      petTaxiCleaninessAgree: event.detail.checked,
    });
  }

  async petTaxiAgreement() {
    const modal = await this.model.create({
      component: PetTaxiAgreementModelComponent,
      animated: true,
    });
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
      if (this.router.url === "/home/tabs/jobs-tab/post-job") {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      }
    });
  }

  isValidFromTime() {
    const ONE_HOUR = 60 * 60 * 1000; /* ms */
    const satrtDate = this.lbl_formatedStartDate;
    const startTime = this.jobPostingForm.value.start_time;
    const endDate = this.lbl_formatedEndDate;
    const endTime = this.jobPostingForm.value.end_time;
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

  closeModal() {
    this.model.dismiss();
  }

  async slideChange(ev) {
    const index = await this.jobSlides.getActiveIndex();
    this.activeSlideIndex = index;
  }

  next() { 
    this.selectedPet = [];
    if(this.petList?.length>0 && this.selectedPetIds?.length>0) {
      this.selectedPetIds.forEach((id)=>{
        let index = this.petList.findIndex((data)=> {
          return data.id == id;
        });
        if(index>-1) {
          this.selectedPet.push({...this.petList[index], isSelected: false});
        }
      })
    }
    if(this.secondaryServices?.length>0) {     
      if(this.activeSlideIndex==0) {
        this.secondaryServices.map((serv)=>{
          serv['petList'] = this.selectedPet;
          return serv;
        });      
      }
    }
    this.calculatePrice(true);
  }

  back() {
    this.jobSlides.lockSwipes(false);
    if(this.secondaryServices?.length>0) {
      this.jobSlides.slidePrev();
    } else {
      this.jobSlides.slideTo(0);
    }
    this.jobSlides.lockSwipes(true);
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
    this.calculatePrice();
  }

  selectPet(pet) {
    pet.isSelected = !pet.isSelected;
    this.calculatePrice();
  }

  getTotalPets(secServ) {
    if(secServ?.petList?.length>0) {
      let totalSelectedPets = secServ.petList.filter((petData) => petData.isSelected);
      return totalSelectedPets.length;
    }
    return 0;
  }

  public async calculatePrice(isSLide: boolean = false) {
    this.isCreateButtonShown = true;
    if (
      !this.isPetTaxi &&
      new Date(this.lbl_formatedEndDate) < new Date(this.lbl_formatedStartDate)
    ) {
      this.api.showToast("Start Date is less then end date", "3000", "bottom");
    } else {
      if (this.selectedPetIds.length) {
        this.isNoPets = false;
      } else {
        this.isNoPets = true;
      }

      //Main Logic of Inserting pet Id's
      this.jobPostingForm.value.pets = [];
      this.selectedPetIds.forEach((element) => {
        this.jobPostingForm.value.pets.push(element);
      });

      let start_date = new DatePipe("en-US").transform(
        this.lbl_formatedStartDate,
        "EEE dd MMM y"
      );
      let end_date = new DatePipe("en-US").transform(
        this.lbl_formatedEndDate,
        "EEE dd MMM y"
      );

      this.jobPostingForm.value.service_id = this.selectedServiceId;
      let start_time = this.formatTime(this.jobPostingForm.value.start_time);
      let end_time = this.formatTime(this.jobPostingForm.value.end_time);

      if (this.isEndDateTime == false) {
        this.jobPostingForm.patchValue({
          end_date: "",
          end_time: "",
        });
      }

      let booking_days = [];
      if (this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK) {
        booking_days.push(this.jobPostingForm.value.booking_days);
      }
      let jobPostForm = {};

      let extraServiceData = new Object();
      if(this.secondaryServices?.length>0) {
        this.secondaryServices.forEach((secServ) => {
          if(secServ.petList.length>0) {
            let totalSelectedPets = secServ.petList.filter((petData) => petData.isSelected);
            if(totalSelectedPets?.length>0 && secServ.occasions>0) {
              
              extraServiceData[secServ.id] = {
                    serviceName: secServ.serviceType.serviceName,
                    occasions: secServ.occasions,
                    pets: totalSelectedPets.map((data, index) => data.id)
                  }

            }
          }
        });
      }
      
      if (this.isPetTaxi) {
        jobPostForm = {
          service_id: this.selectedServiceId,
          pets: this.selectedPetIds,
          end_date: this.isEndDateTime == false ? "" : end_date,
          description: this.jobPostingForm.value.description,
          end_time: this.isEndDateTime == false ? "" : end_time,
          bookingType: this.jobPostingForm.value.bookingType,
          booking_days: "",
          recurring_type: "",
          estimatecost: this.estimationTaxiPrice,
          chkendDate: this.isEndDateTime == true ? 0 : 1,
          pickup_date: start_date,
          pickup_time: start_time,
          pickup_address: this.jobPostingForm.value.pickup_address,
          destination_address: this.jobPostingForm.value.destination_address,
          km_distance: this.jobPostingForm.value.km_distance,
          min_distance: this.jobPostingForm.value.min_distance,
          taxi_way: 1,
          pickup_suburb: this.jobPostingForm.value.pickup_suburb,
          destination_suburb: this.jobPostingForm.value.destination_suburb,
          minderid: this.sitter.id,
          frequency: 1,
          service: this.selectedServiceId,
          // book_days: this.availabilityFrm.value.book_days,
          check_endDate: this.isOnceOff == true ? 1 : 0
        };
      } else {
        jobPostForm = {
          service_id: this.selectedServiceId,
          pets: this.selectedPetIds,
          start_date,
          end_date: this.isEndDateTime == false ? "" : end_date,
          description: this.jobPostingForm.value.description,
          start_time,
          end_time: this.isEndDateTime == false ? "" : end_time,
          bookingType: this.jobPostingForm.value.bookingType,
          booking_days:
            this.jobPostingForm.value.recurring_type == this.WEEKEND
              ? ["6"]
              : this.jobPostingForm.value.recurring_type == this.EVERYDAY
              ? ["0","1","2","3","4","5","6"]
              : this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
              ? booking_days
              : this.jobPostingForm.value.booking_days,
          recurring_type: this.jobPostingForm.value.recurring_type,
          estimatecost:
            this.jobPostingForm.value.bookingType == "0"
              ? this.totalEstimatedCost
              : this.weeklyEstimatedCost,
          chkendDate: this.isEndDateTime == true ? 0 : 1,
          pickup_date: "",
          pickup_time: "",
          pickup_address: "",
          destination_address: "",
          km_distance: "",
          min_distance: "",
          taxi_way: 0,

          minderid: this.sitter.id,
          frequency: 1,
          service: this.selectedServiceId,
          // book_days: this.availabilityFrm.value.book_days,
          check_endDate: this.isOnceOff == true ? 1 : 0
        };
      }

      if(Object.keys(extraServiceData).length > 0 && extraServiceData.constructor === Object) {
        jobPostForm['extraservices'] = extraServiceData;
      }

      if (this.isPetTaxi) {
        if (this.pickupLocation == undefined || this.pickupLocation == "") {
          this.api.showToast(
            "Please enter your pickup location",
            2000,
            "bottom"
          );
          return false;
        } else if (
          this.destinationLocation == undefined ||
          this.destinationLocation == ""
        ) {
          this.api.showToast(
            "Please enter your destination location",
            2000,
            "bottom"
          );
          return false;
        } else if (!this.jobPostingForm.value.petTaxiCleaninessAgree) {
          this.api.showToast(
            "Please enter your pet safety & cleaning terms & conditions",
            2000,
            "bottom"
          );
          return false;
        }
      }
      this.api.showLoader();
      this.api
        .calculatePreCostPrice(jobPostForm)
        .pipe(
          finalize(() => {
            this.api.hideLoader();
          })
        )
        .subscribe(
          async (res: any) => {
            if(res.result) {
              if(isSLide) {
                this.jobSlides.lockSwipes(false);    
                if(this.secondaryServices?.length>0) {
                  this.jobSlides.slideNext();
                } else {
                  this.jobSlides.slideTo(2);
                }
                this.jobSlides.lockSwipes(true);
              }
              this.bookingForm = jobPostForm;
              this.costData = await res;
              if(this.costData?.primary?.length>0) {
                this.costData.primary.map((cdata)=> {
                  let index  = this.petList.findIndex((pet) => pet.id == cdata.petId);
                  if(index>-1) {
                    cdata['petname'] =  this.petList[index].name;
                  }
                })
              }
              if(this.costData?.secondary?.length>0) {
                this.costData.secondary.map((cdata)=> {
                  let index  = this.petList.findIndex((pet) => pet.id == cdata.petId);
                  if(index>-1) {
                    cdata['petname'] =  this.petList[index].name;
                  }
                })
              }
                let minBookingPrice = this.costData.bookingfee.minPrice;
                let maxBookingPrice = this.costData.bookingfee.maxPrice;

                if (this.costData.total >= 400) {
                    this.bookingCost = parseFloat(maxBookingPrice);
                    this.totalCost = parseFloat(this.costData.total) + parseFloat(maxBookingPrice);
                } else {
                    this.bookingCost = (this.costData.total * minBookingPrice);
                    this.totalCost = (this.costData.total * minBookingPrice) + parseFloat(this.costData.total);
                }
                this.totalCost = this.totalCost + 1;
                this.estimatedPrice = res.total + this.bookingCost;
            } else {
              let msg = res.response? res.response : res.error ? res.error : 'Something went wrong please try again.';
              this.api.showToast(msg, 3000, "bottom");
            }
          },
          (err: any) => {
            this.api.autoLogout(err, jobPostForm);
          }
        );
    }
  } 

  public isRSPCADonation(event) {
    this.isRSPCADonationChecked = event.detail.checked;
    event.detail.checked ? this.totalCost = this.totalCost + 1 : this.totalCost = this.totalCost - 1;
  }

  public async sendBookingRequest() {

    if (this.shareNumber && this.termsAccpted) {
        let endDate = this.bookingForm['end_date'];
        endDate == "" || null || undefined ? "" : this.datepipe.transform(new Date(Date.parse(this.bookingForm['end_date'])), 'EEE d MMM y')
        this.bookingForm['start_date'] = this.datepipe.transform(new Date(Date.parse(this.bookingForm['start_date'])), 'EEE d MMM y');
        this.bookingForm['end_date'] = endDate;
        this.bookingForm['couponCode'] = '';
        this.bookingForm['donationagree'] = this.isRSPCADonationChecked ? 1 : 0;
        this.bookingForm['donationamount'] = this.isRSPCADonationChecked ?  1 : "";
        
        const BookingForm = {
            'BookingRequestForm': this.bookingForm,
            'share-number': 1,
        };
        // send booking request
        this.api.showLoader();
        this.api.sendBookingRequestForm(BookingForm).pipe(finalize(() => {
            // hide loader in success
            this.api.hideLoader();
        })).subscribe(async (res: any) => {
            if (res.success) {
              
                  const booking = {
                    af_booking_status:"P",
                    af_booking_id:res.bookingId,
                    af_minder_id: this.bookingForm.minderid,
                    af_owner_id: this.appsFlyerAnalytics.userid,
                    af_potentional_revenue:"",
                    af_actual_revenue:"",
                  }

                  this.appsFlyerAnalytics.bookingEvent(booking);
                
                await this.storage.get(PetcloudApiService.USER).then(async (user: User) => {
                    this.analytics.logEvent(PetcloudApiService.direct_inquiry, { userId: user.id });
                })

                this.api.showToast('Enquiry sent successfully', 2000, 'bottom');
                this.storage.set('bookingId', res.bookingId);

                if (this.userData.app_review == 0) {
                    this.appRating();
                } else {
                  this.model.dismiss();
                  this.router.navigateByUrl('/home/tabs/messages');
                }

            } else {
                this.api.showToast('Enquiry not send', 2000, 'bottom');
            }


        }, (err: any) => {
            this.api.showToast(err.message, 2000, 'bottom');
            this.api.autoLogout(err, BookingForm);
        });
    }
     else{
        this.api.showToast('please select Share number and terms', 2000, 'bottom');
    }  
  }
  async appRating() {
    const alert = await this.alertController.create({
        header: 'Inquiry Sent!',
        subHeader: 'What do you think of the PetCloud App?',
        buttons: [
            {
                text: 'Could improve',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    this.appSuggestionAlert();
                }
            }, {
                text: 'I love it!',
                handler: async (data) => {

                    this.api.showLoader();
                    const appRate = {
                        status: 1
                    }

                    this.api.showLoader();
                    this.api.rateAPP(appRate).subscribe(async (res: any) => {
                        this.api.hideLoader();

                        await this.storage.get(PetcloudApiService.USER).then(async (user: User) => {
                            user.app_review = 1
                            await this.storage.set(PetcloudApiService.USER, user);
                        })

                        if (this.platform.is("android")) {
                          this.model.dismiss();
                          this.router.navigateByUrl('/home/tabs/messages');
                          this.market.open('com.petcloud.petcloud');
                        } else {
                          this.model.dismiss();
                          this.router.navigateByUrl('/home/tabs/messages');
                          this.market.open('id1539909889');
                        }
                    }, err => {
                        this.api.autoLogout(err, appRate);
                    })
                }
            }
        ]
    });
    await alert.present();
  }
  async appSuggestionAlert() {
    const alert = await this.alertController.create({
        subHeader: 'Sorry, what can we do to improve?',
        buttons: [
            {
                text: 'Give Suggestions',
                handler: (data) => {

                    this.sendFeedbackEmail();
                }
            }, {
                text: 'No thanks',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  this.model.dismiss();
                  this.router.navigateByUrl('/home/tabs/messages');
                }
            },
        ]
    });
    await alert.present();
  }
  async sendFeedbackEmail() {
    this.model.dismiss();
    this.api.sendEmailtoAccounts("support@petcloud.com.au", null, "Pet Cloud app review", "")
}
}
