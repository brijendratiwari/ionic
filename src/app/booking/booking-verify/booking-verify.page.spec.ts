import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingVerifyPage } from './booking-verify.page';

describe('BookingVerifyPage', () => {
  let component: BookingVerifyPage;
  let fixture: ComponentFixture<BookingVerifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingVerifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingVerifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
