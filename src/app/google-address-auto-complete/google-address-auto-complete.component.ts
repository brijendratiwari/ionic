/// <refrence types="@types/googlemaps"/>
import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
declare let google: any;

@Component({
  selector: 'app-google-address-auto-complete',
  template: `<input class="input" type="text" [(ngModel)]="autocompleteInput" #addresstext
  style="padding: 12px 20px; border: 1px solid #ccc; width: 400px"/>`,
  // templateUrl: './google-address-auto-complete.component.html',
  styleUrls: ['./google-address-auto-complete.component.scss'],
})
export class GoogleAddressAutoCompleteComponent implements OnInit, AfterViewInit {

  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext',{read:true}) addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'US' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

}
