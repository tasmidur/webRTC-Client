import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCallComponent } from './recent-call.component';

describe('RecentCallComponent', () => {
  let component: RecentCallComponent;
  let fixture: ComponentFixture<RecentCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
