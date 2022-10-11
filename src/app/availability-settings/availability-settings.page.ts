import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-availability-settings',
  templateUrl: './availability-settings.page.html',
  styleUrls: ['./availability-settings.page.scss'],
})
export class AvailabilitySettingsPage implements OnInit {
  settingForm: FormGroup;
  checkedItems: any = [];
  days: any = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ]
  constructor(public modal: ModalController, public formBuilder: FormBuilder) {
    this.settingForm = this.formBuilder.group({
      enquires: ['', [Validators.required]],
      operating_days: [false],
      break: [false],
      regulars: [false]
    });
  }

  ngOnInit() {
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
      return
    }
    console.log(this.settingForm.value)
  }
  onChange(item) {
    if (this.checkedItems.includes(item)) {
      this.checkedItems = this.checkedItems.filter((value) => value != item);
    } else {
      this.checkedItems.push(item)
    }
    console.log(this.checkedItems.toString())
    this.settingForm.get("operating_days").setValue(this.checkedItems.toString());

  }
}
