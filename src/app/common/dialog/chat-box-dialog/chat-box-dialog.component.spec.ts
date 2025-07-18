import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxDialogComponent } from './chat-box-dialog.component';

describe('ChatBoxDialogComponent', () => {
  let component: ChatBoxDialogComponent;
  let fixture: ComponentFixture<ChatBoxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBoxDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
