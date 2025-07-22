import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { IconCollection } from '../../common/IconCollection';
import { SharedModule } from '../../shared/shared.module';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { charFormat } from '../../common/pipe/charFormat';
import { DialPadComponent } from '../dial-pad/dial-pad.component';
import { ChatBoxDialogComponent } from '../../common/dialog/chat-box-dialog/chat-box-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RoomGuestService } from '../../services/room-guest.service';

@Component({
  selector: 'app-room-call',
  imports: [SharedModule, IconField, InputIcon, DialPadComponent],
  templateUrl: './room-call.component.html',
  styleUrl: './room-call.component.css',
})
export class RoomCallComponent {
  globalSearchValue!: string;
  roomCallList?: any[];
  originalRoomCallList?: any[];
  isOpenDialPad: boolean = false;
  guestUserPayload: any = {
    sessionId: '',
    propertyId: '',
    requestAttr: {
      LastKnownVersion: 0,
      Filters: [],
      SortElements: [
        {
          SortName: 'RoomNumber',
          SortDesc: '',
          SortOrder: 'ASC',
        },
      ],
      SortElementList: null,
      StartFrom: 0,
      RecordCount: 10000,
    },
  };

  constructor(
    private route: Router,
    public commonService: CommonService,
    public dialog: MatDialog,
    public roomGuestService: RoomGuestService
  ) {
    this.guestUserPayload.propertyId =
      this.commonService.getUser()?.propertyCode;
    this.guestUserPayload.sessionId =
      this.commonService.getPropertyServicesSession();
  }

  ngOnInit(): void {
    this.getRoomList();
  }

  public getRoomList() {
    if (this.guestUserPayload.sessionId) {
      this.roomGuestService
        .getGuestRoomList(this.guestUserPayload)
        .subscribe((res) => {
          if (res && res?.GuestRoomList) {
            const propertyName = this.commonService.getUser()?.propertyName;
            this.roomCallList = res?.GuestRoomList?.map((_item: any) => ({
              id: _item?.Id,
              roomName: _item?.RoomNumber,
              guestName:
                `${_item?.GuestFirstName} ${_item?.GuestLastName}`.trim(),
              type: _item?.VIPCode,
              propertyId: this.guestUserPayload.propertyId,
              propertyName: propertyName,
              phone: _item?.ExtensionNumber,
              occupancy: _item?.Inhouse,
              inHouseGuest: _item?.occupancy == 'Inhouse',
            })).sort((a: any, b: any) => {
              // Primary sort: inHouseGuest (true first)
              let inHouseComparison =
                (b.inHouseGuest ? 1 : 0) - (a.inHouseGuest ? 1 : 0);
              // Secondary sort: phone (ascending) if inHouseGuest is the same
              return inHouseComparison || a.phone.localeCompare(b.phone);
            });
            this.originalRoomCallList = [...(this.roomCallList as any)]; // Store a copy of the original list
          }
        });
    }
  }

  public filterContact() {
    if (!this.globalSearchValue) {
      console.log('globalSearchValue-empty', this.globalSearchValue);
      this.roomCallList = this.originalRoomCallList
        ? [...this.originalRoomCallList]
        : [];
    } else {
      const searchTerm = this.globalSearchValue.toLowerCase();
      console.log('globalSearchValue', this.globalSearchValue);
      this.roomCallList =
        this.originalRoomCallList?.filter(
          (item: any) =>
            item.guestName.toLowerCase().includes(searchTerm) ||
            item.roomName.toLowerCase().includes(searchTerm) ||
            item.phone.toLowerCase().includes(searchTerm)
        ) || [];
    }
    this.roomCallList.sort(
      (a: any, b: any) => (b.inHouseGuest ? 1 : 0) - (a.inHouseGuest ? 1 : 0)
    );
  }

  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }

  openActiveCall(callDetail: any) {
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.route.navigate(['./dashboard/call-action/active-call']);
  }
  openDialpad() {
    this.isOpenDialPad = !this.isOpenDialPad;
  }
  openDialpadByRoute() {
    this.route.navigate(['./dashboard/call-action/dial-pad']);
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
