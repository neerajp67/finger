import { TestBed } from '@angular/core/testing';

import { PrefrenceService } from './prefrence.service';

describe('PrefrenceService', () => {
  let service: PrefrenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefrenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
