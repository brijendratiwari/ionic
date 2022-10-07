import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSitterMapPage } from './search-sitter-map.page';

describe('SearchSitterMapPage', () => {
  let component: SearchSitterMapPage;
  let fixture: ComponentFixture<SearchSitterMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSitterMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSitterMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
