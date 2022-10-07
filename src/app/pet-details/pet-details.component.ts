import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.scss'],
})
export class PetDetailsComponent implements OnInit {
    petDetail: any;
    name: any
    public years_old = "";
    public specification = [];
  
  constructor(public modal: ModalController,public navParam: NavParams) {
   }

  async ngOnInit() {

    this.petDetail = await this.navParam.get('petDetails');      
    this.name= this.petDetail[0].name;

    if(this.petDetail[0].dob) {
        let monthsOld = moment().diff(moment(this.petDetail[0].dob, 'DD/MM/YYYY'), 'months');
        if (monthsOld >= 12) {
            this.years_old =  (monthsOld / 12 | 0) + "." + (monthsOld % 12 > 0 ? monthsOld % 12 : "") + " years";
        } else {
            this.years_old = (moment().diff(moment(this.petDetail[0].dob, 'DD/MM/YYYY'), 'months')).toFixed(0).concat(monthsOld == 1 ? " Month Old" : " Months Old")
        }
    } else {
        this.years_old = '';
    }

    if(this.petDetail[0].specification) {
        this.specification = this.petDetail[0].specification.title;
    }
  }

  
  public getHabits(habitId: any) {
    switch (habitId) {
        case '1':
            return 'Escapism';
            break;
        case '2':
            return 'Digging holes';
            break;
        case '3':
            return 'Destructive behaviour';
            break;
        case '4':
            return 'Barking/meowing/calling';
            break;
        case '5':
            return 'Growling';
            break;
        case '6':
            return 'Health Issues';
            break;
        default:
            return 'Not specified';
    }
}

public getChildStay(stayId: any) {
    switch (stayId) {
        case 1:
            return 'Fine with children over age 2';
            break;
        case 2:
            return 'Fine with children over age 5';
            break;
        case 3:
            return 'Fine with children over age 8';
            break;
        case 4:
            return 'Fine with children over age 10';
            break;
        case 5:
            return 'Fine with children all ages';
            break;
        case 6:
            return 'Not ok with children';
            break;
        default:
            return 'Not specified';
    }
}

public getPetSleep(sleepId: any) {
    switch (sleepId) {
        case 1:
            return 'Own bed in bedroom';
            break;
        case 2:
            return 'Lounge/Family room';
            break;
        case 3:
            return 'Other part of house';
            break;
        case 4:
            return 'Laundry/Garage/Patio/Other';
            break;
        case 5:
            return 'Outside';
            break;
        case 6:
            return 'Stables';
            break;
        case 7:
            return 'On my bed';
            break;
        default:
            return 'Not specified';
    }
}

public getPetalone(aloneId: any) {
    switch (aloneId) {
        case 1:
            return '1 to 4 hours';
            break;
        case 2:
            return '4 to 8 hours';
            break;
        case 3:
            return '8 to 12 hours';
            break;
        case 4:
            return 'Daily';
            break;
        default:
            return 'Not specified';
    }
}

public getPetReact(reactId: any) {
    switch (reactId) {
        case 1:
            return 'Unsettled but Ok';
            break;
        case 2:
            return 'Terrified';
            break;
        case 3:
            return 'May try to escape';
            break;
        case 4:
            return 'No Problem at all';
            break;
        default:
            return 'Not specified';
    }
}

public getPetWeight(weight: any){
    switch (weight) {
        case 1:
            return '10Kg (small)';
            break;
        case 2:
            return '11-25Kg (medium)';
            break;
        case 3:
            return '26-40Kg (large)';
            break;
        case 4:
            return '>41Kg (Very large)';
            break;
        case 5:
            return 'Daily';
            break;
        default:
            return 'Not specified';
    }
}

public getPetWalk(walkId: any) {
    switch (walkId) {
        case 1:
            return 'A couple of times a week';
            break;
        case 2:
            return 'Once a week';
            break;
        case 3:
            return 'Occasionally';
            break;
        case 4:
            return 'Never';
            break;
        case 5:
            return 'Daily';
            break;
        default:
            return 'Not specified';
    }
}

public getPetWalkBehave(walkBehaveId: any) {
    switch (walkBehaveId) {
        case 1:
            return 'Pulls at first and then settles down';
            break;
        case 2:
            return 'Needs a strong person to walk him/her';
            break;
        case 3:
            return 'Impossible to walk';
            break;
        default:
            return 'Not specified';
    }
}

public getPetFleas(fleasId: any) {
    switch (fleasId) {
        case 1:
            return 'Weekly';
            break;
        case 2:
            return 'Monthly';
            break;
        case 3:
            return 'Never';
            break;
        case 4:
            return 'No Problem';
            break;
        default:
            return 'Not specified';
    }
}

  closeModal(){
    this.modal.dismiss();
  }

}
