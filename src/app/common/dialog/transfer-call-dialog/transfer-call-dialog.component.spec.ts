import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCallDialogComponent } from './transfer-call-dialog.component';

describe('TransferCallDialogComponent', () => {
  let component: TransferCallDialogComponent;
  let fixture: ComponentFixture<TransferCallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferCallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
