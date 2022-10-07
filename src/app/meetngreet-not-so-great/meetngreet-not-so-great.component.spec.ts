import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetngreetNotSoGreatComponent } from './meetngreet-not-so-great.component';

describe('MeetngreetNotSoGreatComponent', () => {
  let component: MeetngreetNotSoGreatComponent;
  let fixture: ComponentFixture<MeetngreetNotSoGreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetngreetNotSoGreatComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetngreetNotSoGreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
