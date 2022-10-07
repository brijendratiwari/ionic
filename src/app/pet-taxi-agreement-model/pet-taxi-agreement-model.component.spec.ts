import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTaxiAgreementModelComponent } from './pet-taxi-agreement-model.component';

describe('PetTaxiAgreementModelComponent', () => {
  let component: PetTaxiAgreementModelComponent;
  let fixture: ComponentFixture<PetTaxiAgreementModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetTaxiAgreementModelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetTaxiAgreementModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
