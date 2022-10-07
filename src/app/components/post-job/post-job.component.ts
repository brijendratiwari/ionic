import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PetcloudApiService } from "../../api/petcloud-api.service";
import { Storage } from "@ionic/storage";
import { Location, DatePipe } from "@angular/common";
import { NavController, Platform, ModalController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { finalize, filter } from "rxjs/operators";
import { User } from "../../model/user";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { DatePicker } from "@ionic-native/date-picker/ngx";


@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
})
export class PostJobComponent implements OnInit {

  public selectedService: any;
  public jobPostingForm: FormGroup;
  public serviceList: Array<any> = [];
  public petList: Array<any> = [];
  public selectedPet = [];
  public selectedServiceId: any;
  public isFormValid: boolean = false;
  public ServiceChargeType: any = "";
  public hideServices: boolean = false;
  public isMessagesContainerSectionLoaded: boolean = false;

  private subscription: Subscription;


  //Boolean Show Hide Variables
  public isRecurring: boolean = false;
  public hideBothDaySelector: boolean = false;
  public isCustomDays: boolean = false;
  public isEndDateTime: boolean = true;
  public isMultipleDays: boolean = false;
  public isNoPets: boolean = false;
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

  private CUSTOM = "C";
  private EVERYDAY = "ED";
  private WEEKEND = "W";
  private ONCE_A_WEEK = "OAW";
  private EVERY_2nd_DAY = "E2D";
  private EVERY_WEEK_DAY = "EWD";
  private EVERY_2nd_DAY_WEEK = "E2WD";

  constructor(
    private formBuilder: FormBuilder,
    public api: PetcloudApiService,
    protected storage: Storage,
    protected location: Location,
    public model: ModalController,
    public navCtrl: NavController,
    public platform: Platform,
    public __router: Router,
    private datePicker: DatePicker,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {

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
    });
          
    this.storage
    .get(PetcloudApiService.USER)
      .then(async (res: User) => {
            if (res != null) {
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
                this.toDate = new Date(today.setDate(today.getDate() + 2)).toISOString();

                this.lbl_formatedStartDate = this.startMinDate;
                this.lbl_formatedEndDate = this.minToDate;

                this.startMinTime = "08:30";
                this.startTotime = "16:00";

                this.jobPostingForm.patchValue({
                  start_date: this.startMinDate,
                  end_date: this.minToDate,
                  start_time:this.startMinTime,
                  end_time: this.startTotime,
                  bookingType:"0"
                });


                this.totalEstimatedCost = 1;
                this.weeklyEstimatedCost = 1;
              
                this.getRecurringOptions();
                this.getPetsListing();
            } else {
              this.navCtrl.navigateRoot("/get-started");
            }
  });
    
      this.backButtonEvent();
  }



  ionViewDidLeave() {
    this.isCustomDays = false;
  }

 

  public getServiceTypeList() {
    this.api.getAllService().subscribe(
      (res: any) => {
        if (res.primary.length) {
          this.serviceList = res.primary;
        } else {
          this.api.showToast("service is not available. Please try again!",2000,"bottom");
        }
      },
      (err: any) => {
        this.api.autoLogout(err,"");
      }
    );
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
  }

  public endDateChange(event) {
    this.lbl_formatedEndDate = event;
    this.jobPostingForm.patchValue({
      end_date: event});

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

   
      this.jobPostingForm.value.pets.length == 0 ? (this.isPetSelected = true) : (this.isPetSelected = false);
   
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
      this.isDaysCount = 0;
      dates = this.getDates(start_date, end_date);
      // every day Sunday to Saturday.
      if (this.ServiceChargeType != "0") {
        if (this.jobPostingForm.value.recurring_type == this.EVERYDAY) {
          everyday = dates.length;
          this.isDaysCount = everyday;
        }

        dates.forEach((element) => {
          // Saturday and sunday
          if (this.jobPostingForm.value.recurring_type == this.WEEKEND) {
            if (
              new Date(element).getDay() == 6 ||
              new Date(element).getDay() == 0
            ) {
              weekendDays = weekendDays + 1;
              this.isDaysCount = weekendDays;
            }
          } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY) {
            if (
              new Date(element).getDay() == 1 ||
              new Date(element).getDay() == 3 ||
              new Date(element).getDay() == 5
            ) {
              every2ndDay = every2ndDay + 1;
              this.isDaysCount = every2ndDay;
            }
          } else if (this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY) {
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
          } else if (this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK) {
            if (
              new Date(element).getDay() ==
              this.jobPostingForm.value.booking_days
            ) {
              oaw = oaw + 1;
              this.isDaysCount = oaw;
            }
          } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY_WEEK) {
            if (
              new Date(element).getDay() == 1 ||
              new Date(element).getDay() == 3 ||
              new Date(element).getDay() == 5
            ) {
              mwf = mwf + 1;
              this.isDaysCount = mwf;
            }
          }
        });
      }
    }
  }

  //Calculating Total and Weekly Estimated Cost..
  calculateWeeklyandTotalPrice(detailOfPets) {
    let payablePrice = [];
    let weeklyPay = [];
 
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
                payablePrice.push(7 * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 5) {
                weeklyPay.push(5 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(diffDay * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY_WEEK) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              weeklyPay.push(1 * detailOfPets[i][0].price);
            } else if (this.jobPostingForm.value.recurring_type == this.WEEKEND) {
              payablePrice.push(this.isDaysCount * detailOfPets[i][0].price);
              if (this.diffDays >= 3) {
                weeklyPay.push(2 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.CUSTOM) {
              if (this.isEndDateTime == true) {
                if (this.diffDays >= 7) {
                  payablePrice.push(
                    this.isDaysCount * detailOfPets[i][0].price
                  );
                }
                 else {
                  if (this.isDaysCount > 1) {
                    weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
                    payablePrice.push(
                      this.isDaysCount * detailOfPets[i][0].price
                    );
                  } else if (this.isDaysCount == 1) {
                    weeklyPay.push(detailOfPets[i][0].price);
                    payablePrice.push(detailOfPets[i][0].price);
                  } else if (this.diffDays > 1) {
                    weeklyPay.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                    payablePrice.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                  } else if (this.diffDays == 1) {
                    weeklyPay.push(1 * detailOfPets[i][0].price);
                    payablePrice.push(1 * detailOfPets[i][0].price);
                  }
                }
                if (this.isDaysCount >= 2) {
                  weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
                } else if (this.isDaysCount == 1) {
                  weeklyPay.push(1 * detailOfPets[i][0].price);
                }
              } else {
                payablePrice.push(
                  this.customSelectedDays * detailOfPets[i][0].price
                );
                if(this.diffDays >= 7) {
                  weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
                } else {
                  weeklyPay.push(
                    this.diffDays * detailOfPets[i][0].price
                  );
                }
              }
            }
          } else if (this.selectedService.perPet == 0) {
            if (this.jobPostingForm.value.recurring_type == this.EVERYDAY) {
              if (this.isEndDateTime == true) {
                payablePrice.push(this.differenceDays * this.selectedService.price);
                weeklyPay.push(7 * detailOfPets[i][0].price);
              } else {
                payablePrice.push(7 * this.selectedService.price);
                weeklyPay.push(7 * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              weeklyPay.push(3 * detailOfPets[i][0].price);
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_WEEK_DAY) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              weeklyPay.push(5 * detailOfPets[i][0].price);
            } else if (this.jobPostingForm.value.recurring_type == this.EVERY_2nd_DAY_WEEK) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              if (this.diffDays >= 3) {
                weeklyPay.push(3 * detailOfPets[i][0].price);
              } else {
                weeklyPay.push(this.diffDays * detailOfPets[i][0].price);
              }
            } else if (this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK) {
              payablePrice.push(this.isDaysCount * this.selectedService.price);
              weeklyPay.push(1 * detailOfPets[i][0].price);
            } else if (this.jobPostingForm.value.recurring_type == this.WEEKEND) {
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
            }
             else if (this.jobPostingForm.value.recurring_type == this.CUSTOM) {
                if(this.customSelectedDays>0){
                if (this.isEndDateTime == true) {
                  if (this.diffDays >= 7) {
                    payablePrice.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                    weeklyPay.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                  } else {
                    payablePrice.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                    weeklyPay.push(
                      this.customSelectedDays * detailOfPets[i][0].price
                    );
                  }
                } else {
                  payablePrice.push(
                    this.customSelectedDays * detailOfPets[i][0].price
                  );
                  weeklyPay.push(
                    this.customSelectedDays * detailOfPets[i][0].price
                  );
                }
              }else{
                this.weeklyEstimatedCost = 0;
                this.totalEstimatedCost = 0;
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

  selectService(event) {
    this.totalEstimatedCost = 1;
    this.weeklyEstimatedCost = 1;
    this.selectedService = event.detail.value;
    this.selectedServiceId = event.detail.value.id;

    this.SelectedServiceEvent = event;
    this.priceValues = event.detail.value.avgPrice;

    this.ServiceChargeType = event.detail.value.serviceChargeType;

    if (this.selectedService.allow_reoccurring == 1) {
      this.isRecurring = true;
    } else if (this.selectedService.allow_reoccurring == 0) {
      this.isRecurring = false;
    }

    // this.pricesOfSelectedPet();

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

    if (event.detail.value.serviceChargeType == 3) {
      this.isEndDateTime = false;
    }

    if (event.detail.value.serviceChargeType != 3) {
      this.isEndDateTime = true;
    } else {
      this.isRecurring = false;
      this.hideBothDaySelector = false;
      this.jobPostingForm.patchValue({
        recurring_type: "",
        booking_days: "",
      });
    }

    if (event.detail.value.id == "") {
      this.is_service_type_id = true;
    } else {
      this.is_service_type_id = false;
    }

    this.jobPostingForm.patchValue({
      recurring_type: "",
      booking_days: "",
    });
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

    if (event.detail.value == this.ONCE_A_WEEK || event.detail.value == this.CUSTOM) {
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

    
    this.is_booking_days == true ? this.isFormValid = false : this.isFormValid = true
      
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
    if (event.detail.value == this.ONCE_A_WEEK || event.detail.value == this.CUSTOM) {
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

    if (event.detail.value == this.ONCE_A_WEEK || event.detail.value == this.CUSTOM) {
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
          console.log(this.jobPostingForm.value.recurring_type);

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
          this.progressStepper = await this.recurringOptions.progress
          this.isPhEmailVerified = this.recurringOptions.progress.email == 1 ? true : false;
          this.isMessagesContainerSectionLoaded = true;
         
          this.jobPostingForm.get("service_type_id").setValue(res.services[0]);
          this.SelectedValueOfService = res.services[0];
          this.jobPostingForm.get("bookingType").setValue("0");

          this.compareWith = this.compareWithFn;

          this.isWeekend(this.frmDate, this.toDate);
        },
        (err: any) => {
          this.isMessagesContainerSectionLoaded = false;
          this.api.autoLogout(err,"");
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
  public createJob() {
    if (!this.isPhEmailVerified) {
      this.api.showToast("Please verify email and mobile number",2000,"bottom");
    }else if (
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

      let booking_days=[];
      if(this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK){
        booking_days.push(this.jobPostingForm.value.booking_days)
      }


    
      const jobPostForm = {
        service_type_id: this.selectedServiceId,
        pets: this.selectedPetIds,
        start_date,
        end_date: this.isEndDateTime == false ? "" : end_date,
        description: this.jobPostingForm.value.description,
        start_time,
        end_time: this.isEndDateTime == false ? "" : end_time,
        bookingType: this.jobPostingForm.value.bookingType,
        booking_days: this.jobPostingForm.value.recurring_type == this.ONCE_A_WEEK ? booking_days : this.jobPostingForm.value.booking_days,
        recurring_type: this.jobPostingForm.value.recurring_type,
      };

      console.log("Job posting", jobPostForm)
      // return false;

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
              this.api.postedJobCount();
              this.api.showToast("Job posted successful", 2000, "bottom");

              await this.getPetsListing();
              await this.getRecurringOptions();

              if (this.isEndDateTime == false) {
                this.isEndDateTime = true;

                this.jobPostingForm.patchValue({
                  end_date: this.jobPostingForm.value.start_date,
                  end_time: "16:00",
                });
              }
              this.__router.navigateByUrl("/job-posted-success");
            } else {
              this.api.showToast("Job not posted, Try again!", 2000, "bottom");
            }
          },
          (err: any) => {
            this.api.autoLogout(err,jobPostForm);
          }
        );
    }
  }

  public getPetsListing() {
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {
        console.log(userData);
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
              this.api.autoLogout(err,userData.id);
            }
          );
      },
      (err: any) => {
        // this.api.autoLogout(err);
      }
    );
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  public navigateMyJobs() {
    this.__router.navigateByUrl("/jobs");
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

  async sendEmailtoAccounts(){

    this.api.sendEmailtoAccounts("accounts@petcloud.com.au",[""],null,null);
  
  }

  goToAddMoney(){
    this.__router.navigateByUrl('/addmoney')
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.api.dismissModelorAlert();
      if (this.__router.url === "/home/tabs/post-job") {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      }
    });
  }

}
