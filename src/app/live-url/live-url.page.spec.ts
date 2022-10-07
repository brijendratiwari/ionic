import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveUrlPage } from './live-url.page';

describe('LiveUrlPage', () => {
  let component: LiveUrlPage;
  let fixture: ComponentFixture<LiveUrlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveUrlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveUrlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
