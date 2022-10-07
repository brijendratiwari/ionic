import { TestBed } from '@angular/core/testing';

import { CmsPageService } from './cms-page.service';

describe('CmsPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsPageService = TestBed.get(CmsPageService);
    expect(service).toBeTruthy();
  });
});
