import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFriendPage } from './invite-friend.page';

describe('InviteFriendPage', () => {
  let component: InviteFriendPage;
  let fixture: ComponentFixture<InviteFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFriendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
