import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesListPage } from './messages-list.page';

describe('MessagesListPage', () => {
  let component: MessagesListPage;
  let fixture: ComponentFixture<MessagesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
