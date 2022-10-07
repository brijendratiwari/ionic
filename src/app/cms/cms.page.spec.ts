import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSPage } from './cms.page';

describe('CMSPage', () => {
  let component: CMSPage;
  let fixture: ComponentFixture<CMSPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMSPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
