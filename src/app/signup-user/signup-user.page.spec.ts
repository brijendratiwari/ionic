import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupUserPage } from './signup-user.page';

describe('SignupUserPage', () => {
  let component: SignupUserPage;
  let fixture: ComponentFixture<SignupUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
