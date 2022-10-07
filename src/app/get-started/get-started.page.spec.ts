import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedPage } from './get-started.page';

describe('GetStartedPage', () => {
  let component: GetStartedPage;
  let fixture: ComponentFixture<GetStartedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
