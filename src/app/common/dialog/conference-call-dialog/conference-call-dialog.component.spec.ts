import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceCallDialogComponent } from './conference-call-dialog.component';

describe('ConferenceCallDialogComponent', () => {
  let component: ConferenceCallDialogComponent;
  let fixture: ComponentFixture<ConferenceCallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceCallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
