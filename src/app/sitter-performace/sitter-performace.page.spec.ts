import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitterPerformacePage } from './sitter-performace.page';

describe('SitterPerformacePage', () => {
  let component: SitterPerformacePage;
  let fixture: ComponentFixture<SitterPerformacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitterPerformacePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitterPerformacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
