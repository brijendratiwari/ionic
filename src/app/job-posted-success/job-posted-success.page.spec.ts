import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostedSuccessPage } from './job-posted-success.page';

describe('JobPostedSuccessPage', () => {
  let component: JobPostedSuccessPage;
  let fixture: ComponentFixture<JobPostedSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPostedSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostedSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
