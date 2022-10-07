import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { PetcloudApiService } from '../api/petcloud-api.service';
import * as moment from 'moment';


@Component({
  selector: 'app-sitter-search-filter',
  templateUrl: './sitter-search-filter.component.html',
  styleUrls: ['./sitter-search-filter.component.scss'],
})
export class SitterSearchFilterComponent implements OnInit {

  public searchParams: any;
  currentDate: any;
  minToDate: any;
  @Input() selectedFilter: any = {
    serviceTypeId: '',
    dropOff: '',
    pickUp: '',
    spacesPet: '',
    sml_dogs: '',
    med_dogs: '',
    lrg_dogs: '',
    gnt_dogs: '',
    samePetType: '0',
    samePetBreed: '0',
    samePetSize: '0',
    breed: '',
    distance: 25,
    ratepernight: { lower: '', upper: '' },
    property_type: '',
    backyard_type: '',
    hostSkills: '',
    similarPet: [],
    hostAttributes:[] ,
  };
  public filter: any;
  public isDogWeight: boolean = false;
  public selectedPetBreed = [];
  public isLoading: boolean = true;


  public rangePicker: any = {
    lower: 5,
    upper: 100
  }

  public breedName: any;
  public breed = [];// NgModel
  public petBreeds = []; // all pet Breed Name


  constructor(public modal: ModalController,
    protected navParam: NavParams, private formBuilder: FormBuilder,
    public api: PetcloudApiService, private storage: Storage, private navCtrl: NavController) {

    this.currentDate =moment(new Date()).format("YYYY-MM-DD");
  }



  ngOnInit() {
    this.isLoading = true;
    console.log("this.selectedFilter", this.selectedFilter)
    if(this.selectedFilter.spacesPet) {
      this.petTypeChange({detail: {value: this.selectedFilter.spacesPet}});
    }
    this.rangePicker.lower = this.selectedFilter.ratepernight.lower? this.selectedFilter.ratepernight.lower : 5;
    this.rangePicker.upper = this.selectedFilter.ratepernight.upper? this.selectedFilter.ratepernight.upper : 100;
    this.getSearchDetails();
  }

  fromDate(date) {
    if(this.selectedFilter.serviceTypeId != '14'){
      this.selectedFilter.end_date = date;
      this.selectedFilter.dropOff = date;
    }
   
  }

  /**
   * close self modal
   */
  public closeModal() {
    this.modal.dismiss();
  }

  public petTypeChange(event) {
    if (event.detail.value == "1") {
      this.isDogWeight = true;
    } else {
      this.isDogWeight = false;
    }
  }


  setFilter(samePetType,event) {
  }

  public addRemoveOpt(petSize, index, val) {
    if (petSize.cartValue >= 10) {

    }
    else if (val == 1) {
      if (this.searchParams.DogSize[index].cartValue >= 10) {

      } else {
        this.searchParams.DogSize[index].cartValue = parseInt(this.searchParams.DogSize[index].cartValue) + 1;
        if (petSize.kayName == "sml_dogs") {
          this.selectedFilter.sml_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "lrg_dogs") {
          this.selectedFilter.lrg_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "med_dogs") {
          this.selectedFilter.med_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "gnt_dogs") {
          this.selectedFilter.gnt_dogs = this.searchParams.DogSize[index].cartValue;
        }
      }
    } else if (val == 0) {
      if (this.searchParams.DogSize[index].cartValue <= 1) {
        this.searchParams.DogSize[index].cartValue = 0;
        if (petSize.kayName == "sml_dogs") {
          this.selectedFilter.sml_dogs = 0;
        } else if (petSize.kayName == "lrg_dogs") {
          this.selectedFilter.lrg_dogs = 0;
        } else if (petSize.kayName == "med_dogs") {
          this.selectedFilter.med_dogs = 0;
        } else if (petSize.kayName == "gnt_dogs") {
          this.selectedFilter.gnt_dogs = 0;
        }
      } else {
        this.searchParams.DogSize[index].cartValue = parseInt(this.searchParams.DogSize[index].cartValue) - 1;
        if (petSize.kayName == "sml_dogs") {
          this.selectedFilter.sml_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "lrg_dogs") {
          this.selectedFilter.lrg_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "med_dogs") {
          this.selectedFilter.med_dogs = this.searchParams.DogSize[index].cartValue;
        } else if (petSize.kayName == "gnt_dogs") {
          this.selectedFilter.gnt_dogs = this.searchParams.DogSize[index].cartValue;
        }
      }
    }
  }

  public getSearchDetails() {
    this.api.showLoader();
    this.api.getSitterFilterDetails()
      .pipe(finalize(() => {
        this.api.hideLoader();
      }))
      .subscribe(async (res: any) => {
        this.searchParams = await res;

        this.searchParams.DogSize.map(cart => {
          cart.imageName = cart.kayName + '.svg';
          if (cart.kayName == "sml_dogs" && this.selectedFilter.sml_dogs) {
            cart.cartValue = this.selectedFilter.sml_dogs;
          } else if (cart.kayName == "lrg_dogs" && this.selectedFilter.lrg_dogs) {
            cart.cartValue = this.selectedFilter.lrg_dogs;
          } else if (cart.kayName == "med_dogs" && this.selectedFilter.med_dogs) {
            cart.cartValue = this.selectedFilter.med_dogs;
          } else if (cart.kayName == "gnt_dogs" && this.selectedFilter.gnt_dogs) {
            cart.cartValue = this.selectedFilter.gnt_dogs;
          } else {            
            cart.cartValue = 0;
          }

        })

      }, (err: any) => {
        this.api.autoLogout(err,"")
      });

    this.getPetBreed();
  }

  smilarPetChange(event) {
    if (event.detail.checked) {
      if (event.detail.value.kayName == "samePetType") {
        this.searchParams.samePetType = 1;
        this.selectedFilter.samePetType = 1;
      } else if (event.detail.value.kayName == "samePetBreed") {
        this.searchParams.samePetBreed = 1;
        this.selectedFilter.samePetBreed = 1;
      } else if (event.detail.value.kayName == "samePetSize") {
        this.searchParams.samePetSize = 1;
        this.selectedFilter.samePetSize = 1;
      }
    } else if (event.detail.checked == false) {
      if (event.detail.value.kayName == "samePetType") {
        this.searchParams.samePetType = 0;
        this.selectedFilter.samePetType = 0;
      } else if (event.detail.value.kayName == "samePetBreed") {
        this.searchParams.samePetBreed = 0;
        this.selectedFilter.samePetBreed = 0;
      } else if (event.detail.value.kayName == "samePetSize") {
        this.searchParams.samePetSize = 0;
        this.selectedFilter.samePetSize = 0;
      }
    }
  }

  public getPetBreed() {
    this.api.getBreedName()
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((res: any) => {
        this.breedName = res;
        // Push Pet Names
        this.breedName.forEach(element => {
          this.petBreeds.push(element.text)
        });
        if(this.selectedFilter?.breed?.length) {
          let bridArray = this.selectedFilter.breed.split(',');
          for (let i = 0; i < bridArray.length; i++) {
            this.selectedPetBreed.push(this.breedName.find(item => (item?.value) && item.value === bridArray[i]));
          }
          // Remove Duplicate Element
          var uniqueArray = this.selectedPetBreed.filter(function (item, i, self) {
            return self.lastIndexOf(item) == i;
          });

          //Commma Seperated Values.
          this.breed = Array.prototype.map.call(uniqueArray, function (item) {
            return item.text;
          });
        }
      }, (err: any) => {
        this.api.autoLogout(err,"")
      });
  }

  public getName(event) {
  }

  applyFilter() {
    console.log(this.breed)
    let petbreedID: any;
    for (let i = 0; i < this.breed.length; i++) {
      this.selectedPetBreed.push(this.breedName.find(item => item.text === this.breed[i]));
    }

    // Remove Duplicate Element
    var uniqueArray = this.selectedPetBreed.filter(function (item, i, self) {
      return self.lastIndexOf(item) == i;
    });

    //Commma Seperated Values.
    petbreedID = Array.prototype.map.call(uniqueArray, function (item) {
      return item.value;
    }).join(',');



    this.selectedFilter.breed = petbreedID;
    this.selectedFilter.ratepernight.lower = this.rangePicker.lower;
    this.selectedFilter.ratepernight.upper = this.rangePicker.upper;
    this.modal.dismiss(this.selectedFilter)
  }

  clear() {
    this.selectedFilter = {
      serviceTypeId: '',
      dropOff: '',
      pickUp: '',
      spacesPet: '',
      sml_dogs: '',
      med_dogs: '',
      lrg_dogs: '',
      gnt_dogs: '',
      samePetType: '0',
      samePetBreed: '0',
      samePetSize: '0',
      breed: '',
      distance: 25,
      ratepernight: { lower: '', upper: '' },
      property_type: '',
      backyard_type: '',
      hostSkills: '',
      similarPet: [],
      hostAttributes:[] ,
    };
    this.rangePicker.lower = this.selectedFilter.ratepernight.lower? this.selectedFilter.ratepernight.lower : 5;
    this.rangePicker.upper = this.selectedFilter.ratepernight.upper? this.selectedFilter.ratepernight.upper : 100;
    this.searchParams.DogSize.map(cart => {
      cart.imageName = cart.kayName + '.svg';
      cart.cartValue = 0;
    })
  }
}
