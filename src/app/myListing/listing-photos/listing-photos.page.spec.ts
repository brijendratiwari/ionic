import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPhotosPage } from './listing-photos.page';

describe('ListingPhotosPage', () => {
  let component: ListingPhotosPage;
  let fixture: ComponentFixture<ListingPhotosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingPhotosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
