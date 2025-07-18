import { TestBed } from '@angular/core/testing';

import { RoomGuestService } from './room-guest.service';

describe('RoomGuestService', () => {
  let service: RoomGuestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomGuestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
