import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingBasicInformationPage } from './listing-basic-information.page';

describe('ListingBasicInformationPage', () => {
  let component: ListingBasicInformationPage;
  let fixture: ComponentFixture<ListingBasicInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingBasicInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingBasicInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
