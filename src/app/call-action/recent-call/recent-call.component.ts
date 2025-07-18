import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { IconCollection } from '../../common/IconCollection';
import { charFormat } from '../../common/pipe/charFormat';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SignalService } from '../../services/signal.service';
import { DialPadComponent } from '../dial-pad/dial-pad.component';
import { ChatBoxDialogComponent } from '../../common/dialog/chat-box-dialog/chat-box-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recent-call',
  imports: [SharedModule, IconField, InputIcon, charFormat, DialPadComponent],
  templateUrl: './recent-call.component.html',
  styleUrl: './recent-call.component.css',
})
export class RecentCallComponent {
  globalSearchValue!: string;
  recentCallList?: any[];
  isOpenDialPad: boolean = false;
  constructor(
    private route: Router,
    private commonService: CommonService,
    private signalService: SignalService,
    public dialog: MatDialog
  ) {
    this.recentCallList = [
      {
        id: 601,
        name: 'Room 601',
        type: 'VIP',
        guestName: 'Balogh Imre',
        propertyId: '00426',
        propertyName: 'Perry Lane Hotel',
        phone: '601',
        mode: 'Incoming',
        dateTime: '2:26 PM 24 OCT 2024',
        callDuration: '16 Sec',
      },
      {
        id: 2,
        name: 'Room 102',
        type: 'VIP',
        guestName: 'Sarah Lee',
        propertyId: '00426',
        propertyName: 'Perry Lane Hotel',
        phone: '102',
        mode: 'Outgoing',
        dateTime: '2:26 PM 24 OCT 2024',
        callDuration: '16 Sec',
      },
      {
        id: 3,
        name: 'Room 708',
        type: '',
        guestName: 'Bogdan Norbert',
        propertyId: '00427',
        propertyName: 'Perry Lane Hotel',
        phone: '708',
        mode: 'Missed',
        dateTime: '2:26 PM 24 OCT 2024',
        callDuration: '',
      },
      {
        id: 4,
        name: 'Room 210',
        type: '',
        guestName: 'Mickel Bon',
        propertyId: '00430',
        propertyName: 'Perry Lane Hotel',
        phone: '210',
        mode: 'Decline',
        dateTime: '2:26 PM 24 OCT 2024',
        callDuration: '16 Sec',
      },
      {
        id: 5,
        name: 'Room 801',
        type: '',
        guestName: 'Sophia Borwn',
        propertyId: '00116',
        propertyName: 'Perry Lane Hotel',
        phone: '801',
        mode: 'Missed',
        dateTime: '3:26 PM 27 OCT 2024',
        callDuration: '',
      },
      {
        id: 6,
        name: 'Room 310',
        type: '',
        guestName: '',
        propertyId: '00226',
        propertyName: 'Perry Lane Hotel',
        phone: '310',
        mode: 'Missed',
        dateTime: '2:26 PM 23 OCT 2024',
        callDuration: '',
      },
    ];
  }
  ngOnInit() {}
  getRecentCallList() {}
  openDialpad() {
    this.isOpenDialPad = !this.isOpenDialPad;
  }
  openDialpadByRoute() {
    this.route.navigate(['./dashboard/call-action/dial-pad']);
  }
  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }

  filterContact() {}
  nickName(name: string) {
    let str = name.split(' ');

    if (str.length == 1) {
      return name.charAt(0).toUpperCase();
    } else if (str.length > 1 && Number(str[str.length - 1])) {
      return str[str.length - 1];
    }
    return name
      .replaceAll('[^A-Za-z0-9]', '')
      .match(/^(\w)\w*\s+(\w{1,1})/)
      ?.slice(1)
      .join('');
  }
  openRecentCall(callDetail: any) {
    this.signalService.setMessage('Message' + Math.random());
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.route.navigate(['./dashboard/call-action/active-call']);
  }
  openChatBox(call: any = '') {
    const dialogRefChatBoxDialog = this.dialog.open(ChatBoxDialogComponent, {
      panelClass: 'chatBox',
      data: call,
    });

    dialogRefChatBoxDialog.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
      }
    });
  }
}
