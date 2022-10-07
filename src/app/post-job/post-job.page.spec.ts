import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobPage } from './post-job.page';

describe('PostJobPage', () => {
  let component: PostJobPage;
  let fixture: ComponentFixture<PostJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
