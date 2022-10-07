import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVacinationComponent } from './add-vacination.component';

describe('AddVacinationComponent', () => {
  let component: AddVacinationComponent;
  let fixture: ComponentFixture<AddVacinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVacinationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVacinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
