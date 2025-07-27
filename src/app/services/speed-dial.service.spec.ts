import { TestBed } from '@angular/core/testing';

import { SpeedDialService } from './speed-dial.service';

describe('SpeedDialService', () => {
  let service: SpeedDialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeedDialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
