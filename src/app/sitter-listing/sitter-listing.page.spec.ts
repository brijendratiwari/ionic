import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitterListingPage } from './sitter-listing.page';

describe('SitterListingPage', () => {
  let component: SitterListingPage;
  let fixture: ComponentFixture<SitterListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitterListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitterListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
