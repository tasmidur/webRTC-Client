import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConferenceCallDialogComponent } from '../../common/dialog/conference-call-dialog/conference-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddCallDialogComponent } from '../../common/dialog/add-call-dialog/add-call-dialog.component';
import { charFormat } from '../../common/pipe/charFormat';
import { ChatBoxDialogComponent } from '../../common/dialog/chat-box-dialog/chat-box-dialog.component';

@Component({
  selector: 'app-quick-action',
  imports: [SharedModule, charFormat],
  templateUrl: './quick-action.component.html',
  styleUrl: './quick-action.component.css'
})
export class QuickActionComponent {
  deptCallList:any[]=[]

  constructor(public dialog: MatDialog,){
    this.deptCallList = [
      {
        id:411,
        name:"Reservation",
        type:"Reservation",
        propertyId:"001",
        propertyName:"Perry Lane Hotel",
        phone:"123",
      },
      {
        id:205,
        name:"Housekeeping",
        type:"Guest Service",
        propertyId:"002",
        propertyName:"Perry Lane Hotel",
        phone:"111",
      },
      {
        id:601,        
        name:"Concierge",
        type:"AI Support",
        propertyId:"003",
        propertyName:"Perry Lane Hotel",
        phone:"100",
      },
      {
        id:102,
        name:"Security",
        type:"Security",
        propertyId:"004",
        propertyName:"Perry Lane Hotel",
        phone:"941",
      },
      {
        id:205,
        name:"Maintenance",
        type:"Maintenance",
        propertyId:"005",
        propertyName:"Perry Lane Hotel",
        phone:"444",
      },
      {
        id:102,
        name:"General Manager",
        type:"General Manager",
        propertyId:"005",
        propertyName:"Perry Lane Hotel",
        phone:"999",
      }
    ]
  }
    openConferenceCall(){
  
      const dialogRefConference = this.dialog.open(ConferenceCallDialogComponent, {
        panelClass:"conferenceCall",
        data: {name: "Test", animal: "Lion"},
      });
  
      dialogRefConference.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
         console.log(result);
        }
      });
    }
      openAddCallTo(call: any=''){
    
        const dialogRefAddCallTo = this.dialog.open(AddCallDialogComponent, {
          panelClass:"addCallTo",
          data: call,
        });
    
        dialogRefAddCallTo.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
           console.log(result);
          }
        });
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
