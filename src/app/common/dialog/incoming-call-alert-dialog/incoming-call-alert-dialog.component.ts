import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { charFormat } from '../../pipe/charFormat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-incoming-call-alert-dialog',
  imports: [SharedModule, charFormat],
  templateUrl: './incoming-call-alert-dialog.component.html',
  styleUrl: './incoming-call-alert-dialog.component.css'
})
export class IncomingCallAlertDialogComponent {
  readonly dialogRef = inject(MatDialogRef<IncomingCallAlertDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  callDetail:any=null;
  @Output() 
  callAction = new EventEmitter<any>();
  constructor( private route:Router,  public commonService: CommonService) { }

  ngOnInit() {
    this.getCallDetails();
  }
  callBtnAction(status:string){
    this.callAction.emit(status);
    this.dialogRef.close({ data: 'data' });
  }
  getCallDetails(){
    this.callDetail= this.data;
  }
  //callTime:string="";
  // callTimer(min:number,sec:number){
  //   let tick = ()=> {
  //     this.callTime = min.toString() + ":" + (sec < 10 ? "0" : "") + String(sec);
  //     sec++;
  //     if ( sec<60 && sec >= 0) {
  //          setTimeout(tick, 1000);
  //     } else {
  //       setTimeout(()=> {
  //         this.callTimer(min + 1, 0);
  //       }, 1000);
  //     }
  // }
  // tick();
  // }
  onCloseClick(): void {
    this.dialogRef.close({ data: 'data' });
  }
}
