import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAvailabilityPage } from './check-availability.page';

describe('CheckAvailabilityPage', () => {
  let component: CheckAvailabilityPage;
  let fixture: ComponentFixture<CheckAvailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckAvailabilityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
