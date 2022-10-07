import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpArticlePage } from './help-article.page';

describe('HelpArticlePage', () => {
  let component: HelpArticlePage;
  let fixture: ComponentFixture<HelpArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpArticlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
