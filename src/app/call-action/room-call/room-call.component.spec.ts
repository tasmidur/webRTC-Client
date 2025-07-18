import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCallComponent } from './room-call.component';

describe('RoomsComponent', () => {
  let component: RoomCallComponent;
  let fixture: ComponentFixture<RoomCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
