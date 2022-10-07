import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentJobListingPage } from './recent-job-listing.page';

describe('RecentJobListingPage', () => {
  let component: RecentJobListingPage;
  let fixture: ComponentFixture<RecentJobListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentJobListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentJobListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
