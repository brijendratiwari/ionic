import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSitterDetailPage } from './pet-sitter-detail.page';

describe('PetSitterDetailPage', () => {
  let component: PetSitterDetailPage;
  let fixture: ComponentFixture<PetSitterDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetSitterDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetSitterDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
