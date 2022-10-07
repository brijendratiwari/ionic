import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInternetConnectionPage } from './check-internet-connection.page';

describe('CheckInternetConnectionPage', () => {
  let component: CheckInternetConnectionPage;
  let fixture: ComponentFixture<CheckInternetConnectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInternetConnectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInternetConnectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
