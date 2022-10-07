import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyJoinPage } from './why-join.page';

describe('WhyJoinPage', () => {
  let component: WhyJoinPage;
  let fixture: ComponentFixture<WhyJoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyJoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyJoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
