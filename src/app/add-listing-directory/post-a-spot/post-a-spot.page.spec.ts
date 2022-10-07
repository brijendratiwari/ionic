import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostASpotPage } from './post-a-spot.page';

describe('PostASpotPage', () => {
  let component: PostASpotPage;
  let fixture: ComponentFixture<PostASpotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostASpotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostASpotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
