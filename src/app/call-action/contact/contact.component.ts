import { Component } from '@angular/core';
import { IconCollection } from '../../common/IconCollection';
import { SharedModule } from '../../shared/shared.module';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { charFormat } from '../../common/pipe/charFormat';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { DialPadComponent } from '../dial-pad/dial-pad.component';
import { ChatBoxDialogComponent } from '../../common/dialog/chat-box-dialog/chat-box-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contact',
  imports: [SharedModule, IconField, InputIcon,charFormat, DialPadComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  globalSearchValue!:string;
  contactCallList?:any[];
  isOpenDialPad:boolean=false;
  constructor(private route: Router, private commonService: CommonService,public dialog: MatDialog,){
    this.contactCallList = [
      {
        id:601,
        name:"Maintenance",
        type:"Facilities",
        propertyId:"0034",
        propertyName:"Perry Lane Hotel",
        phone:"1003",
        
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
        name:"Housekeeping",
        type:"Housekeeping Service",
        propertyId:"0034",
        propertyName:"Perry Lane Hotel",
        phone:"123",
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

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const username = userEmail.split('@')[0];
      if (username === "1001") {
        this.contactCallList = this.contactCallList.filter(
          (contact) => contact.name !== "Maintenance"
        );
      }
    }
  }
  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }
  
  filterContact(){

  }
  openActiveCall(callDetail:any){
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.commonService.setCookie(this.commonService.dialPadNumber, "1001");
    this.route.navigate(["./dashboard/call-action/active-call"]);
  }
  openDialpad(){
    // this.route.navigate(["./dashboard/call-message/dial-pad"]);
     this.isOpenDialPad = !this.isOpenDialPad;
   }
   openDialpadByRoute(){
        this.route.navigate(["./dashboard/call-action/dial-pad"]);
   }
  openChatBox(call: any=''){
      const dialogRefChatBoxDialog = this.dialog.open(ChatBoxDialogComponent, {
        panelClass:"chatBox",
        data: call,
      });
  
      dialogRefChatBoxDialog.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log(result);
        }
      });
  }
}
