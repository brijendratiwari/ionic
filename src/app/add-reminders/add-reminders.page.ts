import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { PetcloudApiService } from '../api/petcloud-api.service';
import { User } from '../model/user';
import { Storage } from "@ionic/storage";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-add-reminders',
  templateUrl: './add-reminders.page.html',
  styleUrls: ['./add-reminders.page.scss'],
})
export class AddRemindersPage implements OnInit {

  public addReminderForm: FormGroup;
  public startMinDate = "";
  public startMinTime: any;
  public pets: any = [];
  public noPetsAvailable: any;
  public reminderTypes: any;

  constructor(private formBuilder: FormBuilder,
    public nav: NavController,
    public storage: Storage,
    private api: PetcloudApiService) { }

  ngOnInit() {

    this.startMinDate = new Date(new Date()).toISOString();
  
    let time = moment(new Date()).add(6, 'hours').format('hh:mm A');
    this.startMinTime = moment(time, ["h:mm A"]).format("HH:mm");// AEST time 

    
    this.addReminderForm = this.formBuilder.group({
      pets: ["",[Validators.required]],
      date: [this.startMinDate, [Validators.required]],
      time: [this.startMinTime, [Validators.required]],
      reminder_type:["",[Validators.required]],
      notifi_reminder: ["1"],
      alertFrequency:["0"],
      description: [""]
    });
  }

  ionViewWillEnter() {
    this.reminders()
    this.getPetsListing()
  }

  

  public reminders() {
    fetch('assets/JSON/reminders.json')
      .then(res => res.json())
      .then((data) => {
        this.reminderTypes = data;
      });
  }

  selectReminder(reminderType){

    this.addReminderForm.patchValue({
      reminder_type:reminderType.id
    })
  
    this.reminderTypes.forEach(element => {
      if(element.id == reminderType.id){
        element.isSelected = true;
      }else{
        element.isSelected = false
      }
    });
  }

  selectPet(pet){
    this.addReminderForm.patchValue({
      pets: pet.id 
    })
  }


  public getPetsListing() {
    this.storage.get(PetcloudApiService.USER).then(
      (userData: User) => {

        if (userData != null) {
          this.api
            .getPetList(userData.id).pipe(
              finalize(() => {
              })).subscribe(
                (res: any) => {
                  if (res.success) {
                    if (res.pets.length) {
                      this.noPetsAvailable = res.pets.length;
                      this.pets = res.pets
                    }
                  } else {
                    this.noPetsAvailable = 0
                  }
                },
                (err: any) => {
                  this.noPetsAvailable = 0
                  this.api.autoLogout(err, userData.id);
                }
              );
        }
        (err: any) => {
          this.noPetsAvailable = 0
        }
      }

    );
  }

  addReminder() {

  let startTime = moment(this.addReminderForm.value.time, 'HH:mm').format('hh:mm a');

    const petReminder = {
        PetAlerts:{
          petId:this.addReminderForm.value.pets,
          alertType:this.addReminderForm.value.reminder_type.toString(),
          alertFrequency:this.addReminderForm.value.notifi_reminder,
          alertDate:moment(this.addReminderForm.value.date).format("YYYY-MM-DD"),
          startTime,
          reminder:this.addReminderForm.value.notifi_reminder,
          Notes:this.addReminderForm.value.description,
        }
    }
   

      this.api.showLoader();
      this.api.createReminder(petReminder).subscribe((response:any)=>{
        this.api.hideLoader();
          if(response.success){
            this.api.showToast(response.message,"3000","bottom");
            this.nav.pop();
          }else{
            this.api.showToast(response.error,"3000","bottom");
          }
      }),err=>{
        this.api.autoLogout(err,petReminder);
        console.log("err", err);
      }
  }
}
