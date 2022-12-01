import { Component, OnInit } from '@angular/core';
import { PetcloudApiService } from '../../api/petcloud-api.service';
import { Storage } from '@ionic/storage';
// import model files
import { User } from '../../model/user';
import { finalize } from 'rxjs/operators';
import { NavController, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-listing-services',
    templateUrl: './listing-services.page.html',
    styleUrls: ['./listing-services.page.scss'],
})
export class ListingServicesPage implements OnInit {
    public primaryPrice: any = [];
    public extraPrice: any = [];
    public activeService: any = [];
    public travel_distance: any = 0;
    public listingService = {
        listing: [],
        primaryServices: [],
        secondaryServices: []
    };
    rangeVal: any;
    showRangeGroup = null;
    

    public getPricing = { getDogPrice: '', getCatPrice: '', getHorsePrice: '', getOtherPrice: '', getPrice: '' };
    public steps: 10;

    public pets = { sits_dogs: null, sits_cat: null, sits_horse: null, sits_others: null }
    public custom_values = [0, 10, 100, 1000, 10000, 100000, 1000000];
    public selectedSegment = '';

    constructor(public api: PetcloudApiService,
        protected storage: Storage,
        public alertController: AlertController,
        protected navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.api.hideLoader();
        this.getListingService();
        this.selectedSegment = 'mainService';
    }

    ngOnDestroy(){
        this.api.hideLoader();
    }

    gotoCalendar(){
        this.navCtrl.navigateForward("/availability");
    }

    /**
     * Open and close accordian
     * @param activeBlock
     */
    public openActiveBlock(activeBlock: any) {
        if (this.activeService.length > 0) {
            let indx = this.activeService.indexOf(activeBlock);
            if (indx >= 0) {
                this.activeService.splice(indx, 1);
            } else {
                this.activeService.push(activeBlock);
            }
        } else {
            this.activeService.push(activeBlock);
        }
    }

    /**
     * Get Full Listing service and get full pet details for listing service.
     */
    public getListingService() {
        this.api.showLoader();
        this.api.getListingInfo().pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe((res: any) => {
            const listData: User = res.user;
            console.log(res.user)
            this.listingService.listing = res.user.listing;
            this.listingService.primaryServices = listData.primaryServices;
            this.listingService.secondaryServices = listData.secondaryServices;

            this.listingService.primaryServices.map(function(currentelement, index, arrayobj) {
                currentelement.idx = index;
              });

              this.listingService.secondaryServices.map(function(currentelement, index, arrayobj) {
                currentelement.idx = index;
              });

            this.compareEnableStringData(res.user.listing, this.listingService.primaryServices, this.listingService.secondaryServices)
            // make proper some string data by parsing it.
            //    this.listingService = this.parsingStringData(this.listingService, listData.listing);
            this.selectedSegment = 'mainService';
        }, (err: any) => {
            this.api.autoLogout(err,"");
        });
    }

    private compareEnableStringData(listing, primaryServices, secondaryServices) {


        // For inputting user value of prices in pet
        this.listingService.primaryServices.map(pl => {
            pl.getDogPrice = pl.dog;
            pl.getCatPrice = pl.cat;
            pl.getHorsePrice = pl.horse;
            pl.getOtherPrice = pl.misc;
            pl.getPrice = pl.price;

            pl.originalDogPrice = pl.dog;
            pl.originalCatPrice = pl.cat;
            pl.originalHorsePrice = pl.horse;
            pl.originalOtherPirce = pl.misc
            pl.originalPrice = pl.price;
        });

        this.listingService.secondaryServices.map(ss => {
            ss.getDogPrice = ss.dog;
            ss.getCatPrice = ss.cat;
            ss.getHorsePrice = ss.horse;
            ss.getOtherPrice = ss.misc;
            ss.getPrice = ss.price;

            ss.originalDogPrice = ss.dog;
            ss.originalCatPrice = ss.cat;
            ss.originalHorsePrice = ss.horse;
            ss.originalOtherPirce = ss.misc
            ss.originalPrice = ss.price;
        });

     
        // 0 is for not lisited 1 is for listed
        this.pets.sits_dogs = listing.sits_dogs;
        this.pets.sits_cat = listing.sits_cats;
        this.pets.sits_horse = listing.sits_horses;
        this.pets.sits_others = listing.sits_misc;
        this.travel_distance = listing.travel_distance;


        let dataSet = [{ id:0, value:0},{ id:1, value:5},{ id:2, value:10},{ id:3, value:20},
            ,{ id:4, value:30},
            { id:5, value:50},{ id:6, value:75},
            { id:7, value:100},{ id:8, value:250},{ id:9, value:500}]
            if(listing.distance != ""){
                let distance = dataSet.filter(data => data.value == this.travel_distance);
                if(distance.length){
                    this.rangeVal = distance[0].id;
                }
                 
            }else{
                this.rangeVal= 0
            }
        
    }

    

    rangeChange(event) {
       let customValue = [{ id:0, value:0},{ id:1, value:5},{ id:2, value:10},{ id:3, value:20},
        ,{ id:4, value:30},
        { id:5, value:50},{ id:6, value:75},
        { id:7, value:100},{ id:8, value:250},{ id:9, value:500}]

        let distance = customValue.filter(data => data.id == event.detail.value);
        this.travel_distance =  distance[0].value; 
    }

    toggleRange(group) {
        if (this.isRangeValueShown(group)) {
            this.showRangeGroup = null;
        } else {
            this.showRangeGroup = group;
        }
    };

    isRangeValueShown(group) {
        return this.showRangeGroup === group
    }


    public updateDistance() {
  
        this.api.showLoader();
        const distanceUpdate = {
            travel_distance: this.travel_distance,
        };
        this.api.updateDistance(distanceUpdate).pipe(finalize(() => {
            this.api.hideLoader();
        })).subscribe((res: any) => {
            if (res.success) {
                this.api.showToast('Services distance saved successfully', 2000, 'bottom');
            } else {
                this.api.showToast('Service distance not Updated try again!', 2000, 'bottom');
            }
        }, (err: any) => {
            this.api.autoLogout(err,distanceUpdate);
        });

    }

    public saveService(serviceId, serviceTypeId,
        getDogPrice,
        getCatPrice,
        getHorsePrice,
        getOtherPrice,
        getPrice,
        isPrimaryService, price, flag, pricing, perPet, service) {
        let validation = { isDogValidated: false, isCatValidation: false, isHorseValidation: false, isOtherValidation: false, isPriceValdation: false };
        if (perPet == 1) {
            if (pricing[0].type == "Dog") {
                if (service.originalDogPrice != getDogPrice) {
                    if (getDogPrice < pricing[0].minPrice) {
                        validation.isDogValidated = false;
                        this.api.showToast('Minimum price for ' + pricing[0].type + ' is $ ' + pricing[0].minPrice, 200, 'bottom');
                    } else if (getDogPrice > pricing[0].maxPrice) {
                        validation.isDogValidated = false;
                        this.api.showToast('Oops, that number is too high for ' + pricing[0].type, 200, 'bottom');
                    } else {
                        validation.isDogValidated = true;
                        this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                    }
                }
                else {
                    // Price is Same..
                    validation.isDogValidated = true;
                    this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                }
            }
            if (pricing[1].type == "Cat") {
                
                if (service.originalCatPrice != getCatPrice) {
                    if (getCatPrice < pricing[1].minPrice) {
                        validation.isCatValidation = false;
                        this.api.showToast('Minimum price for ' + pricing[1].type + ' is $ ' + pricing[1].minPrice, 200, 'bottom');
                    } else if (getCatPrice > pricing[1].maxPrice) {
                        validation.isCatValidation = false;
                        this.api.showToast('Oops, that number is too high for ' + pricing[1].type, 200, 'bottom');
                    } else {
                        validation.isCatValidation = true;
                        this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                            getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                    }
                } else {
                    validation.isCatValidation = true;
                    this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                }
            }
            if (pricing[2].type == "Horse") {
                if (service.originalHorsePrice != getHorsePrice) {
                    if (getHorsePrice < pricing[2].minPrice) {
                        validation.isHorseValidation = false;
                        this.api.showToast('Minimum price for ' + pricing[2].type + ' is $ ' + pricing[2].minPrice, 200, 'bottom');
                    } else if (getHorsePrice > pricing[2].maxPrice) {
                        validation.isHorseValidation = false;
                        this.api.showToast('Oops, that number is too high for ' + pricing[2].type, 200, 'bottom');
                    } else {
                        validation.isHorseValidation = true;
                        this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                            getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                    }
                } else {
                    validation.isHorseValidation = true;
                    this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                }
            }
             if (pricing[3].type == "Other") {
                if (service.originalOtherPirce != getOtherPrice) {
                    if (getOtherPrice < pricing[3].minPrice) {
                        validation.isOtherValidation = false;
                        this.api.showToast('Minimum price for ' + pricing[3].type + ' is $ ' + pricing[3].minPrice, 200, 'bottom');
                    } else if (getOtherPrice > pricing[3].maxPrice) {
                        validation.isOtherValidation = false;
                        this.api.showToast('Oops, that number is too high for ' + pricing[3].type, 200, 'bottom');
                    } else {
                        validation.isOtherValidation = true;
                        this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                            getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                    }
                } else {
                    validation.isOtherValidation = true;
                    this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                }
            }
            else {
                this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                    getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
            }
        } else if (perPet == 0) {
            if (service.originalPrice != getPrice) {

                if (pricing[4].type == "Price") {
                    if (getPrice < pricing[4].minPrice) {
                        validation.isPriceValdation = false;
                        this.api.showToast('Minimum price for ' + pricing[4].type + ' is $ ' + pricing[4].minPrice, 200, 'bottom');
                    } else if (getPrice > pricing[4].maxPrice) {
                        validation.isPriceValdation = false;
                        this.api.showToast('Oops, that number is too high for ' + pricing[4].type, 200, 'bottom');
                    } else {
                        validation.isPriceValdation = true;
                        this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                            getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                    }
                }else{
                    validation.isPriceValdation = true;
                    this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                        getCatPrice, getHorsePrice, getOtherPrice, getPrice,validation,perPet)
                }
            }
            else {
                this.saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
                    getCatPrice, getHorsePrice, getOtherPrice, getPrice, validation,perPet)
            }
        }


    }


    saveListingService(serviceId, serviceTypeId, flag, getDogPrice,
        getCatPrice, getHorsePrice, getOtherPrice, getPrice, validation,perPet) {

          
            if (validation.isDogValidated && validation.isCatValidation && validation.isHorseValidation 
            && validation.isOtherValidation && perPet==1) {
    
                this.api.showLoader();
        
                serviceId == null ? serviceId = "" : serviceId;
                serviceTypeId == null ? serviceTypeId == "" : serviceTypeId;
        
                const serviceForm = {
                    id: serviceId,
                    serviceTypeId: serviceTypeId,
                    isPrimaryService: flag,
                    dog: getDogPrice,
                    cat: getCatPrice,
                    horse: getHorsePrice,
                    misc: getOtherPrice,
                    price: getPrice
                };
        
                const finalServiceFrm = {
                    ServiceForm: serviceForm
                };
           
                this.api.updateListingService(serviceId, finalServiceFrm).pipe(finalize(() => {
                    this.api.hideLoader();
                })).subscribe((res: any) => {
                    if (res.success) {
                        this.activeService = [];
                        this.api.showToast('Service is Updated successfully', 2000, 'bottom');
                        this.getListingService();
                    } else {
                        this.api.showToast('Service is not Updated try again!', 2000, 'bottom');
                    }
                }, (err: any) => {
                    this.api.autoLogout(err,serviceForm);
                });
        } else {
            if(perPet==0 && validation.isPriceValdation){
                this.api.showLoader();
        
                serviceId == null ? serviceId = "" : serviceId;
                serviceTypeId == null ? serviceTypeId == "" : serviceTypeId;
        
                const serviceForm = {
                    id: serviceId,
                    serviceTypeId: serviceTypeId,
                    isPrimaryService: flag,
                    dog: getDogPrice,
                    cat: getCatPrice,
                    horse: getHorsePrice,
                    misc: getOtherPrice,
                    price: getPrice
                };
        
                const finalServiceFrm = {
                    ServiceForm: serviceForm
                };
              
                this.api.updateListingService(serviceId, finalServiceFrm).pipe(finalize(() => {
                    this.api.hideLoader();
                })).subscribe((res: any) => {
                    if (res.success) {
                        this.api.showToast('Service is Updated successfully', 2000, 'bottom');
                        this.getListingService();
                    } else {
                        this.api.showToast('Service is not Updated try again!', 2000, 'bottom');
                    }
                }, (err: any) => {
                    this.api.autoLogout(err,finalServiceFrm);
                });
            }
        }
    }

    async changeStatusService(service) {
    
        let status = service.notification_message.panel_status == "Active" ? "Deactivate" : "Active";
      
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Do you want to ' + status + " " + service.serviceType.serviceName + ' Service?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        //this.api.showLoader();
                        const serviceStatus: any = {
                            service_id: service.id, is_active: 
                            service.notification_message.panel_status == "Active" ? "deactive" : "active"
                        
                        }
                        this.api.serviceactivedeactive(serviceStatus).pipe(finalize(() => {
                            this.api.hideLoader();
                        })).subscribe((res: any) => {
                            if (res.success) {
                                this.api.showToast(res.message, 2000, 'bottom');
                                this.getListingService();
                            } else {
                                this.api.showToast(res.error, 2000, 'bottom');
                            }
                        }, (err: any) => {
                            this.api.autoLogout(err,serviceStatus);
                        });

                    }
                }
            ]
        });
        await alert.present();
    }
}
