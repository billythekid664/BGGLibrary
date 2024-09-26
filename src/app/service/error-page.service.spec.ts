import { TestBed } from '@angular/core/testing';

import { ErrorPageService } from './error-page.service';

describe('ErrorPageService', () => {
  let service: ErrorPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
