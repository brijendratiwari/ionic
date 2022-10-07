import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmoneyPage } from './addmoney.page';

describe('AddmoneyPage', () => {
  let component: AddmoneyPage;
  let fixture: ComponentFixture<AddmoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmoneyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
