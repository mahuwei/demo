import { TestBed } from '@angular/core/testing';

import { MhwLibService } from './mhw-lib.service';

describe('MhwLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MhwLibService = TestBed.get(MhwLibService);
    expect(service).toBeTruthy();
  });
});
