import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceupdatePage } from './forceupdate.page';

describe('ForceupdatePage', () => {
  let component: ForceupdatePage;
  let fixture: ComponentFixture<ForceupdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceupdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceupdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
