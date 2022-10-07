import { TestBed } from '@angular/core/testing';

import { PetcloudApiService } from './petcloud-api.service';

describe('PetcloudApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PetcloudApiService = TestBed.get(PetcloudApiService);
    expect(service).toBeTruthy();
  });
});
