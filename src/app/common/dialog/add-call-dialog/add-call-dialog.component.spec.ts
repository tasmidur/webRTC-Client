import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCallDialogComponent } from './add-call-dialog.component';

describe('AddCallDialogComponent', () => {
  let component: AddCallDialogComponent;
  let fixture: ComponentFixture<AddCallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCallDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
