import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-chat-box-dialog',
  imports: [SharedModule],
  templateUrl: './chat-box-dialog.component.html',
  styleUrl: './chat-box-dialog.component.css'
})
export class ChatBoxDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChatBoxDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  chatDetail:any;
  globalSearchValue!:string;
  contactCallList?:any[];
  constructor(private route: Router, private commonService: CommonService,){
    this.chatDetail = this.data;
  }
  onCloseClick(): void {
    this.dialogRef.close({ data: 'data' });
}
}
