import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectoryListingPage } from './add-directory-listing.page';

describe('AddDirectoryListingPage', () => {
  let component: AddDirectoryListingPage;
  let fixture: ComponentFixture<AddDirectoryListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDirectoryListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectoryListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
