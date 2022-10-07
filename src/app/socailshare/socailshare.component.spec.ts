import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocailshareComponent } from './socailshare.component';

describe('SocailshareComponent', () => {
  let component: SocailshareComponent;
  let fixture: ComponentFixture<SocailshareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocailshareComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocailshareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
