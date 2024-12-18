import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobComponent } from './post-job.component';

describe('PostJobComponent', () => {
  let component: PostJobComponent;
  let fixture: ComponentFixture<PostJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
