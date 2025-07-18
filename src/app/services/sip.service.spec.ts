import { TestBed } from '@angular/core/testing';

import { SipService } from './sip.service';

describe('SipService', () => {
  let service: SipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
