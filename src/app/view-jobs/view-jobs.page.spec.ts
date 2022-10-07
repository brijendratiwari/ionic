import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobsPage } from './view-jobs.page';

describe('ViewJobsPage', () => {
  let component: ViewJobsPage;
  let fixture: ComponentFixture<ViewJobsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewJobsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
