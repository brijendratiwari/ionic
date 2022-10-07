import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingThanksPage } from './booking-thanks.page';

describe('BookingThanksPage', () => {
  let component: BookingThanksPage;
  let fixture: ComponentFixture<BookingThanksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingThanksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingThanksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
