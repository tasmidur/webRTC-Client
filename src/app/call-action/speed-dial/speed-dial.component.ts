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
import { SpeedDialService } from '../../services/speed-dial.service';

@Component({
  selector: 'app-contact',
  imports: [SharedModule, IconField, InputIcon, charFormat, DialPadComponent],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.css',
})
export class ContactComponent {
  globalSearchValue!: string;
  speedDialList?: any[];
  originalSpeedDialList?: any[];
  isOpenDialPad: boolean = false;
  speedDialPayload: any = {
    sessionId: '',
    propertyId: '',
  };
  constructor(
    private route: Router,
    private commonService: CommonService,
    public dialog: MatDialog,
    public speedDialService: SpeedDialService
  ) {
    this.speedDialPayload.propertyId =
      this.commonService.getUser()?.propertyCode;
    this.speedDialPayload.sessionId =
      this.commonService.getPropertyServicesSession();
  }

  ngOnInit(): void {
    this.getSpeedDialList();
  }

  public getSpeedDialList() {
    if (this.speedDialPayload.sessionId) {
      this.speedDialService
        .getSpeedDialList(this.speedDialPayload)
        .subscribe((res) => {
          if (res) {
            const propertyName = this.commonService.getUser()?.propertyName;
            this.speedDialList = res?.SpeedDialList?.map((_item: any) => ({
              phone: _item?.ExtensionNumber,
              name: _item?.Name,
              type: _item?.Type,
              propertyId: this.speedDialPayload.propertyId,
              propertyName: propertyName,
            })).sort((a: any, b: any) => {
              // Primary sort: inHouseGuest (true first)
              let inHouseComparison =
                (b.inHouseGuest ? 1 : 0) - (a.inHouseGuest ? 1 : 0);
              // Secondary sort: phone (ascending) if inHouseGuest is the same
              return inHouseComparison || a.phone.localeCompare(b.phone);
            });
            this.originalSpeedDialList = [...(this.speedDialList as any)]; // Store a copy of the original list
          }
        });
    }
  }

  public filterContact() {
    if (!this.globalSearchValue) {
      this.speedDialList = this.originalSpeedDialList
        ? [...this.originalSpeedDialList]
        : [];
    } else {
      const searchTerm = this.globalSearchValue.toLowerCase();
      this.speedDialList =
        this.originalSpeedDialList?.filter(
          (item: any) =>
            item.phone.toLowerCase().includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm) ||
            item.type.toLowerCase().includes(searchTerm) ||
            `${item.propertyId}`.toLowerCase().includes(searchTerm) ||
            item.propertyName.toLowerCase().includes(searchTerm)
        ) || [];
    }
    this.speedDialList.sort(
      (a: any, b: any) => (b.inHouseGuest ? 1 : 0) - (a.inHouseGuest ? 1 : 0)
    );
  }
  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }

  openActiveCall(callDetail: any) {
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.commonService.setCookie(this.commonService.dialPadNumber, '1001');
    this.route.navigate(['./dashboard/call-action/active-call']);
  }
  openDialpad() {
    // this.route.navigate(["./dashboard/call-message/dial-pad"]);
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
