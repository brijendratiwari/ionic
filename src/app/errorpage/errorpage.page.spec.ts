import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorpagePage } from './errorpage.page';

describe('ErrorpagePage', () => {
  let component: ErrorpagePage;
  let fixture: ComponentFixture<ErrorpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
