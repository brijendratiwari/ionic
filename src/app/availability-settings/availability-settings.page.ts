import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetcloudApiService } from "../api/petcloud-api.service";
@Component({
  selector: 'app-availability-settings',
  templateUrl: './availability-settings.page.html',
  styleUrls: ['./availability-settings.page.scss'],
})
export class AvailabilitySettingsPage implements OnInit {
  settingForm: FormGroup;
  selectedMonth: any;
  settingsData: any = '';
  checkedItems: any = [];
  days: any = [
    { label: "Monday", value: '1', checked: false },
    { label: "Tuesday", value: '2', checked: false },
    { label: "Wednesday", value: '3', checked: false },
    { label: "Thursday", value: '4', checked: false },
    { label: "Friday", value: '5', checked: false },
    { label: "Saturday", value: '6', checked: false },
    { label: "Sunday", value: '7', checked: false },
  ]
  constructor(
    public modal: ModalController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public api: PetcloudApiService,) {
    this.settingForm = this.formBuilder.group({
      enquiriesValues: ['', [Validators.required]],
      daysValues: [],
      break: [false],
      regulars: [false]
    });
    this.selectedMonth = this.navParams.get('selectedMonth');

    // console.log(this.selectedMonth)
  }

  ngOnInit() {
    this.getDataAvailabilitySettings();
  }
  get f() {
    return this.settingForm.controls;
  }
  dismissModal() {
    this.modal.dismiss();
  }
  save() {
    if (!this.settingForm.valid) {
      this.settingForm.markAllAsTouched();
      return;
    }
    var data = this.settingForm.value;
    data.selectedMonth = this.selectedMonth;
    if (this.settingForm.value.break) {
      data.away_mode = "yes"
    } else {
      data.away_mode = "no"
    }
    if (this.settingForm.value.regulars) {
      data.repeat_customer = "yes"
    } else {
      data.repeat_customer = "no"
    }
    this.api.showLoader();
    this.api.calenderSettting(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.api.showToast(res.success, 2000, 'bottom');
          this.dismissModal();
        } else {
          this.api.showToast('Please,try again!', 2000, 'bottom');
        }
        this.api.hideLoader();
      },
      (err: any) => {
        this.api.hideLoader();
        this.api.autoLogout(err, data);
      }
    );
  }
  onChange(item) {
    if (this.checkedItems.includes(item)) {
      this.checkedItems = this.checkedItems.filter((value) => value != item);
    } else {
      this.checkedItems.push(item)
      // }
      // console.log(this.checkedItems.toString())
      this.settingForm.get("daysValues").setValue(this.checkedItems);
    }
  }
  getDataAvailabilitySettings() {
    this.api.getAvailabilitySettingsData().subscribe(
      (res: any) => {
        if (res.success) {
          this.settingsData = res;
          if (this.settingsData.away_mode == 'yes') {
            this.settingForm.get("break").setValue(true);
          } else {
            this.settingForm.get("break").setValue(false);
          }
          if (this.settingsData.repeat_customer == 'yes') {
            this.settingForm.get("regulars").setValue(true);
          } else {
            this.settingForm.get("regulars").setValue(false);
          }
          this.settingForm.get("enquiriesValues").setValue(res.enquiries);
          this.settingForm.get("daysValues").setValue(res.operating_days);
          this.checkedItems = res.operating_days;
          if (res.operating_days.length > 0) {
            for (var i = 0; i < res.operating_days.length; i++) {
              let index = this.days.findIndex((resp) => resp.value == res.operating_days[i]);
              if (index > -1) {
                this.days[index].checked = true;
              }
            }
          }
        } else {
          this.settingsData = '';
        }
      },
      (err: any) => {
        this.api.hideLoader();
      }
    );

  }
}
