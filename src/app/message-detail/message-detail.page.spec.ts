import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetailPage } from './message-detail.page';

describe('MessageDetailPage', () => {
  let component: MessageDetailPage;
  let fixture: ComponentFixture<MessageDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
