import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSitterPage } from './favourite-sitter.page';

describe('FavouriteSitterPage', () => {
  let component: FavouriteSitterPage;
  let fixture: ComponentFixture<FavouriteSitterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteSitterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSitterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
