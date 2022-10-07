import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomodelComponent } from './infomodel.component';

describe('InfomodelComponent', () => {
  let component: InfomodelComponent;
  let fixture: ComponentFixture<InfomodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfomodelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfomodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
