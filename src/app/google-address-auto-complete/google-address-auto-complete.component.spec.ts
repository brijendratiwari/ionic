import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAddressAutoCompleteComponent } from './google-address-auto-complete.component';

describe('GoogleAddressAutoCompleteComponent', () => {
  let component: GoogleAddressAutoCompleteComponent;
  let fixture: ComponentFixture<GoogleAddressAutoCompleteComponent>;

beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleAddressAutoCompleteComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAddressAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
