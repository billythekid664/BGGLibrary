import { TestBed } from '@angular/core/testing';

import { HideNavService } from './hide-nav.service';

describe('ErrorPageService', () => {
  let service: HideNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HideNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
