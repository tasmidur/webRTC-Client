import { Component, inject, model } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { charFormat } from '../../pipe/charFormat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { IconCollection } from '../../IconCollection';

@Component({
  selector: 'app-add-call-dialog',
  imports: [SharedModule,charFormat],
  templateUrl: './add-call-dialog.component.html',
  styleUrl: './add-call-dialog.component.css'
})
export class AddCallDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddCallDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  callDetail:any;
  globalSearchValue!:string;
  contactCallList?:any[];
  constructor(private route: Router, private commonService: CommonService,){
    this.callDetail = this.data
  }
  public getIcon(name: string): string {
      return IconCollection.getIcon(name);
  }
    
  filterContact(){
  
  }
  onCloseClick(): void {
      this.dialogRef.close({ data: 'data' });
  }
  save(){}
}
