import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingServicesPage } from './listing-services.page';

describe('ListingServicesPage', () => {
  let component: ListingServicesPage;
  let fixture: ComponentFixture<ListingServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
