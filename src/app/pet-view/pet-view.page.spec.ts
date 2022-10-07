import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetViewPage } from './pet-view.page';

describe('PetViewPage', () => {
  let component: PetViewPage;
  let fixture: ComponentFixture<PetViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
