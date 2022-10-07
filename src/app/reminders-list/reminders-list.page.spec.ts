import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersListPage } from './reminders-list.page';

describe('RemindersListPage', () => {
  let component: RemindersListPage;
  let fixture: ComponentFixture<RemindersListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindersListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
