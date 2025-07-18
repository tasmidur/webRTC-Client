import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCallAlertDialogComponent } from './incoming-call-alert-dialog.component';

describe('IncomingCallAlertDialogComponent', () => {
  let component: IncomingCallAlertDialogComponent;
  let fixture: ComponentFixture<IncomingCallAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingCallAlertDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingCallAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
