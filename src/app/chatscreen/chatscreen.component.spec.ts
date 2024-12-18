import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatscreenComponent } from './chatscreen.component';

describe('ChatscreenComponent', () => {
  let component: ChatscreenComponent;
  let fixture: ComponentFixture<ChatscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatscreenComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
