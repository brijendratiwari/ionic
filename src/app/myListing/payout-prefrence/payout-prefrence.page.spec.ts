import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutPrefrencePage } from './payout-prefrence.page';

describe('PayoutPrefrencePage', () => {
  let component: PayoutPrefrencePage;
  let fixture: ComponentFixture<PayoutPrefrencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutPrefrencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutPrefrencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
