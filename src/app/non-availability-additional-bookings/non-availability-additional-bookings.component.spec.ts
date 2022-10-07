import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonAvailabilityAdditionalBookingsComponent } from './non-availability-additional-bookings.component';

describe('NonAvailabilityAdditionalBookingsComponent', () => {
  let component: NonAvailabilityAdditionalBookingsComponent;
  let fixture: ComponentFixture<NonAvailabilityAdditionalBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonAvailabilityAdditionalBookingsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonAvailabilityAdditionalBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
