import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOtherSitterPage } from './contact-other-sitter.page';

describe('ContactOtherSitterPage', () => {
  let component: ContactOtherSitterPage;
  let fixture: ComponentFixture<ContactOtherSitterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactOtherSitterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactOtherSitterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
