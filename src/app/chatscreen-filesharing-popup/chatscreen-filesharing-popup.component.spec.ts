import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatscreenFilesharingPopupComponent } from './chatscreen-filesharing-popup.component';

describe('ChatscreenFilesharingPopupComponent', () => {
  let component: ChatscreenFilesharingPopupComponent;
  let fixture: ComponentFixture<ChatscreenFilesharingPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatscreenFilesharingPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatscreenFilesharingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
