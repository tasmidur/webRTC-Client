import { Component, inject, model } from '@angular/core';
import {  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { IconCollection } from '../../IconCollection';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { charFormat } from '../../pipe/charFormat';


@Component({
  selector: 'app-conference-call-dialog',
  imports: [SharedModule,IconField, InputIcon,charFormat],
  templateUrl: './conference-call-dialog.component.html',
  styleUrl: './conference-call-dialog.component.css'
})
export class ConferenceCallDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConferenceCallDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  globalSearchValue!:string;
  contactCallList?:any[];
  constructor(private route: Router, private commonService: CommonService,){
      this.contactCallList = [
        {
          id:1,
          name:"Housekeeping",
          type:"Housekeeping Service",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"123",
        },
        {
          id:2,
          name:"Concierge",
          type:"Guest Service",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"111",
        },
        {
          id:3,        
          name:"Room Service",
          type:"Food & Beverage",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"100",
        },
        {
          id:4,
          name:"Maintenance",
          type:"Facilities",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"941",
        },
        {
          id:5,
          name:"Security",
          type:"Security",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"444",
        },
        {
          id:6,
          name:"Spa & Wellness Center",
          type:"Spa Service",
          propertyId:"0034",
          propertyName:"Perry Lane Hotel",
          phone:"999",
        }
      ]
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
