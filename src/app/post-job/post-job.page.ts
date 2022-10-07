import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Storage } from "@ionic/storage";
import { Location, DatePipe } from "@angular/common";
import { NavController, Platform, ModalController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { finalize } from "rxjs/operators";
import { User } from "../model/user";
import * as moment from "moment";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { AnalyticsService } from "../analytics.service";
import { AppsFlyerService } from "../apps-flyer.service";
import { PetTaxiAgreementModelComponent } from "../pet-taxi-agreement-model/pet-taxi-agreement-model.component";
declare var google;

@Component({
  selector: "app-post-job",
  templateUrl: "./post-job.page.html",
  styleUrls: ["./post-job.page.scss"],
})
export class PostJobPage implements OnInit {
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
    public appsFlyerAnalytics: AppsFlyerService
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
      service_type_id: ["", [Validators.required]],
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

    this.storage.get(PetcloudApiService.USER).then(async (res: User) => {
      if (res != null) {
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

    this.pricesOfSelectedPet();
  }

  pricesOfSelectedPet() {
    let price = [];
    let detailOfPets = [];

    if (this.selectedServiceId != "") {
      //Compare Both Pet Id and Take Price Array..
      for (let i = 0; i < this.selectedpetType.length; i++) {
        if (this.priceValues) {
          price.push(
            this.priceValues.filter((res) => res.id == this.selectedpetType[i])
          );
          detailOfPets.push(
            this.priceValues.filter((res) => res.id == this.selectedpetType[i])
          );
        }
      }

      this.jobPostingForm.value.pets.length == 0
        ? (this.isPetSelected = true)
        : (this.isPetSelected = false);

      this.calculatePrice(detailOfPets);
    }
  }

  calculatePrice(detailOfPets) {
    if (this.diffDays == 0) {
      this.differenceDays = 1;
    } else {
      this.differenceDays = this.diffDays;
    }

    this.calculateWeeklyandTotalPrice(detailOfPets);
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

  //Calculating Total and Weekly Estimated Cost..
  async calculateWeeklyandTotalPrice(detailOfPets) {
    let payablePrice = [];
    let weeklyPay = [];
    this.recurringOption = this.jobPostingForm.value.recurring_type;
    if (this.ServiceChargeType != 0) {
      let diffDay = 1;
      diffDay = this.diffDays + 1;
      for (let i = 0; i < detailOfPets.length; i++) {
        if (detailOfPets[i][0].price != NaN || detailOfPets[i][0].price == 0) {
          if (this.selectedService.perPet == 1) {
            if (this.jobPostingForm.value.recurring_type == this.EVERYDAY) {
              if (this.isEndDateTime == true) {
                if (this.diffDays >= 7) {
                  payablePrice.push(
                    this.differenceDays * detailOfPets[i][0].price
                  );
                  weeklyPay.push(7 * detailOfPets[i][0].price);
                } else {
                  payablePrice.push(diffDay * detailOfPets[i][0].price);
                  weeklyPay.push(diffDay * detailOfPets[i][0].price);
                }
              } else {
                payablePrice.push(1 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY
            ) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(1 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY
            ) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 5) {
                weeklyPay.push(5 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type ==
              this.EVERY_2nd_DAY_WEEK
            ) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(1 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
            ) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              weeklyPay.push(1 * detailOfPets[i][0].price);
            } else if (
              this.jobPostingForm.value.recurring_type == this.WEEKEND
            ) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(2 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(1 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.CUSTOM
            ) {
              if (this.jobPostingForm.value.booking_days.length) {
                let booking_days =
                  await this.jobPostingForm.value.booking_days.map(Number);
                this.customDayCount =
                  await this.daysBetweenCustomDateSelected.filter((dayEle) =>
                    booking_days.includes(dayEle)
                  ).length;
              }

              if (this.isEndDateTime == true) {
                payablePrice = [];
                weeklyPay = [];
                if (this.customDayCount == 0) {
                  payablePrice.push(detailOfPets[i][0].price);
                  weeklyPay.push(detailOfPets[i][0].price);
                } else {
                  payablePrice.push(
                    this.customDayCount * detailOfPets[i][0].price
                  );
                  weeklyPay.push(
                    this.customDayCount * detailOfPets[i][0].price
                  );
                }
              } else {
                payablePrice.push(1 * detailOfPets[i][0].price);
                weeklyPay.push(1 * detailOfPets[i][0].price);
              }
            }
          } else if (this.selectedService.perPet == 0) {
            if (this.jobPostingForm.value.recurring_type == this.EVERYDAY) {
              if (this.isEndDateTime == true) {
                payablePrice.push(
                  this.differenceDays * this.selectedService.price
                );
                weeklyPay.push(7 * detailOfPets[i][0].price);
              } else {
                payablePrice.push(7 * this.selectedService.price);
                weeklyPay.push(7 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY
            ) {
              if (this.diffDays >= 3) {
                payablePrice.push(
                  this.isDaysCount * this.selectedService.price
                );
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                payablePrice.push(
                  this.isDaysCount * this.selectedService.price
                );
                weeklyPay.push(3 * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY
            ) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              weeklyPay.push(5 * detailOfPets[i][0].price);
            } else if (
              this.jobPostingForm.value.recurring_type ==
              this.EVERY_2nd_DAY_WEEK
            ) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK
            ) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              weeklyPay.push(1 * detailOfPets[i][0].price);
            } else if (
              this.jobPostingForm.value.recurring_type == this.WEEKEND
            ) {
              if (this.diffDays >= 7) {
                payablePrice.push(
                  this.isDaysCount * this.selectedService.price
                );
              } else {
                payablePrice.push(2 * this.selectedService.price);
                if (this.diffDays >= 3) {
                  weeklyPay.push(2 * detailOfPets[i][0].price);
                } else {
                  weeklyPay.push(3 * detailOfPets[i][0].price);
                }
              }
            } else if (
              this.jobPostingForm.value.recurring_type == this.CUSTOM
            ) {
              if (this.customSelectedDays > 0) {
                payablePrice.push(
                  this.customDayCount * detailOfPets[i][0].price
                );
                weeklyPay.push(this.customDayCount * detailOfPets[i][0].price);
              }
            }
          }
        } else {
          this.hideCosts = false;
        }
      }

      this.totalEstimatedCost = payablePrice.reduce((a, b) => a + b, 0);
      this.weeklyEstimatedCost = weeklyPay.reduce((a, b) => a + b, 0);

      let maxPrice = this.recurringOptions.bookingFee.maxPrice;
      let minPrice = this.recurringOptions.bookingFee.minPrice;

      if (this.weeklyEstimatedCost >= 400) {
        this.weeklyEstimatedCost =
          parseFloat(this.weeklyEstimatedCost.toString()) +
          parseFloat(maxPrice);
      } else {
        this.weeklyEstimatedCost =
          this.weeklyEstimatedCost * minPrice +
          parseFloat(this.weeklyEstimatedCost.toString());
      }

      if (this.totalEstimatedCost >= 400) {
        this.totalEstimatedCost =
          parseFloat(this.totalEstimatedCost.toString()) + parseFloat(maxPrice);
      } else {
        this.totalEstimatedCost =
          this.totalEstimatedCost * minPrice +
          parseFloat(this.totalEstimatedCost.toString());
      }
    } else if (this.ServiceChargeType == 0) {
      for (let i = 0; i < detailOfPets.length; i++) {
        if (detailOfPets[i][0].price != NaN || detailOfPets[i][0].price != 0) {
          if (this.selectedService.perPet == 1) {
            payablePrice.push(this.differenceDays * detailOfPets[i][0].price);
          } else if (this.selectedService.perPet == 0) {
            payablePrice.push(this.differenceDays * this.selectedService.price);
          }

          this.totalEstimatedCost = payablePrice.reduce((a, b) => a + b, 0);
        }
      }

      if (this.recurringOptions) {
        let maxPrice = this.recurringOptions.bookingFee.maxPrice;
        let minPrice = this.recurringOptions.bookingFee.minPrice;

        if (this.weeklyEstimatedCost >= 400) {
          this.weeklyEstimatedCost =
            parseFloat(this.weeklyEstimatedCost.toString()) +
            parseFloat(maxPrice);
        } else {
          this.weeklyEstimatedCost =
            this.weeklyEstimatedCost * minPrice +
            parseFloat(this.weeklyEstimatedCost.toString());
        }

        if (this.totalEstimatedCost >= 400) {
          this.totalEstimatedCost =
            parseFloat(this.totalEstimatedCost.toString()) +
            parseFloat(maxPrice);
        } else {
          this.totalEstimatedCost =
            this.totalEstimatedCost * minPrice +
            parseFloat(this.totalEstimatedCost.toString());
        }
      } else {
        this.isFormValid = false;

        this.jobPostingForm.patchValue({
          service_type_id: "",
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
        this.pricesOfSelectedPet();
      }
    } else {
      this.selectedPetIds.splice(index, 1);
      this.selectedpetType.splice(index, 1);
      this.jobPostingForm.value.pets.splice(index, 1);
      this.pricesOfSelectedPet();
    }

    if (this.selectedPetIds.length) {
      this.isPetSelected = false;
    } else {
      this.isPetSelected = true;
    }
    if (this.jobPostingForm.value.service_type_id == "") {
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
    this.totalEstimatedCost = 1;
    this.weeklyEstimatedCost = 1;
    this.selectedService = event.detail.value;
    this.selectedServiceId = event.detail.value.id;

    this.SelectedServiceEvent = event;
    this.priceValues = event.detail.value.avgPrice;
    this.ServiceChargeType = event.detail.value.serviceChargeType;
    this.isOnceOff = event.detail.value.hideonce;

    if (this.selectedService.serviceName == "Pet Taxi") {
      this.isPetTaxi = true;
      this.startMinTime = "00:00";
    } else if (this.selectedService.serviceName != "Pet Taxi") {
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

    if (this.selectedService.allow_reoccurring == 1) {
      this.isRecurring = true;
    } else if (this.selectedService.allow_reoccurring == 0) {
      this.isRecurring = false;
    }

    if (this.ServiceChargeType != "0") {
      this.hideServices = true;
    }
    if (this.ServiceChargeType == "0") {
      this.hideServices = false;
    }

    if (this.selectedService.allow_reoccurring == 1) {
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

    this.pricesOfSelectedPet();
  }

  //Custom Calender Selector
  customDays(event) {
    let val = event.detail.value;
    this.daysBetweenCustomDateSelected = [];

    this.customSelectedDays = val.length;
    this.pricesOfSelectedPet();

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
      this.pricesOfSelectedPet();
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
    if (this.jobPostingForm.value.service_type_id == "") {
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
        this.pricesOfSelectedPet();
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

          this.jobPostingForm.get("service_type_id").setValue(res.services[0]);
          this.SelectedValueOfService = res.services[0];
          if (res.services[0].serviceName == "Pet Taxi") {
            this.isPetTaxi = true;
            this.startMinTime = "00:00";
          } else {
            this.isPetTaxi = false;
            //   this.isCreateButtonShown = true;
            this.startMinTime = "08:30";
          }

          this.setHideOnce(res.services[0].hideonce);

          if (res.services[0].serviceChargeType == 3) {
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

  /**
   * Create job
   */
  public async createJob() {
    this.isCreateButtonShown = true;
    const resUser: User = await this.storage.get(PetcloudApiService.USER);
    if (!this.isPhEmailVerified) {
      this.api.showToast(
        "Please verify email and mobile number",
        2000,
        "bottom"
      );
    } else if(!resUser.address || !resUser.street_address) {
      this.api.showToast(
        "Please enter address details in profile before posting jobs",
        2000,
        "bottom"
      );
    } else if (
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

      this.jobPostingForm.value.service_type_id = this.selectedServiceId;
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

      if (this.isPetTaxi) {
        jobPostForm = {
          service_type_id: this.selectedServiceId,
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
        };
      } else {
        jobPostForm = {
          service_type_id: this.selectedServiceId,
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
        };
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
        .createJob(jobPostForm)
        .pipe(
          finalize(() => {
            this.api.hideLoader();
          })
        )
        .subscribe(
          async (res: any) => {
            if (res.success) {
              this.analytics.logEvent(PetcloudApiService.job_posted_success, {
                userId: this.userId,
              });
              await this.api.postedJobCount();
              this.api.showToast("Job posted successful", 2000, "bottom");
              const jobCount =
                parseInt(
                  localStorage.getItem(PetcloudApiService.TOTALPOSTEDJOB)
                ) + 1;

              const analytics = {
                last_job_posted_date: res.last_job_posted_date,
                first_job_posted_date: res.first_job_posted_date,
                job_posted_count: res.job_posted_count,
                user_id: res.user_id,
                post_id: res.post_id,
                app_version: this.appsFlyerAnalytics.getCurrentVersionCode(),
                services_needed: res.services_needed,
                start_date: res.start_date,
                end_date: res.end_data,
                start_time: res.start_time,
                end_time: res.end_time,
                total_time: res.total_time,
                total_days: res.total_days,
                app_type: this.appsFlyerAnalytics.platformName(),
              };

              this.appsFlyerAnalytics.postJobAnalytics(analytics);

              await this.getPetsListing();
              await this.getRecurringOptions();

              if (this.isEndDateTime == false) {
                this.isEndDateTime = true;

                this.jobPostingForm.patchValue({
                  end_date: this.jobPostingForm.value.start_date,
                  end_time: "16:00",
                });
              }
              this.router.navigateByUrl("/job-posted-success");
            } else {
              this.analytics.logEvent(PetcloudApiService.job_posted_fail, {
                userId: this.userId,
              });
              this.api.showToast("Job not posted, Try again!", 2000, "bottom");
            }
          },
          (err: any) => {
            this.api.autoLogout(err, jobPostForm);
          }
        );
    }
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
                  this.pricesOfSelectedPet();
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
}
