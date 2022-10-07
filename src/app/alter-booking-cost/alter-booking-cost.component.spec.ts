import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterBookingCostComponent } from './alter-booking-cost.component';

describe('AlterBookingCostComponent', () => {
  let component: AlterBookingCostComponent;
  let fixture: ComponentFixture<AlterBookingCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterBookingCostComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterBookingCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
