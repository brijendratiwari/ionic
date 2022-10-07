import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastcoComponent } from './fastco.component';

describe('FastcoComponent', () => {
  let component: FastcoComponent;
  let fixture: ComponentFixture<FastcoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastcoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
