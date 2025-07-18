import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InQueueComponent } from './in-queue/in-queue.component';
import { charFormat } from '../common/pipe/charFormat';
import { IconCollection } from '../common/IconCollection';
import { Call } from '../Models/call.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../services/common.service';
import { CallPopupComponent } from './call-popup/call-popup.component';
import { SignalService } from '../services/signal.service';
import { SipService } from '../services/sip.service';
import { RegistererState } from 'sip.js';
import { IncomingCallAlertDialogComponent } from '../common/dialog/incoming-call-alert-dialog/incoming-call-alert-dialog.component';

@Component({
  selector: 'app-call-action',
  imports: [SharedModule, RouterOutlet, InQueueComponent, CallPopupComponent, RouterLink], //charFormat,RouterLinkActive, RouterLink
  templateUrl: './call-action.component.html',
  styleUrl: './call-action.component.css'
})
export class CallActionComponent {
  selectedChatId: number | null = null;
  isOpenCallPopup: boolean = false;
  inQueueCallList: any[] = [];
  callpopData: any;
  isCallRoute: boolean = false;
  private ringtone = new Audio('phone-ring.mp3');
  constructor(private route: Router, public commonService: CommonService, private signalService: SignalService, private cdref: ChangeDetectorRef, private sipService: SipService,
    public dialog: MatDialog,
  ) {
    this.ringtone.loop = true;

    this.inQueueCallList = [
      {
        id: 1,
        name: "Room 601",
        guestName: "Balogh Imre",
        type: "VIP",
        propertyId: "00426",
        propertyName: "Perry Lane Hotel",
        phone: "601",
        timePass: "12 Sec"
      },
      {
        id: 2,
        name: "Room 708",
        guestName: "Bogdan Norbert",
        type: "",
        propertyId: "00427",
        propertyName: "Perry Lane Hotel",
        phone: "708",
        timePass: "5 Sec"
      },
      {
        id: 3,
        name: "The Pool",
        guestName: "",
        type: "",
        propertyId: "00600",
        propertyName: "Perry Lane Hotel",
        phone: "105",
        timePass: "26 Sec"
      },
      {
        id: 4,
        name: "Security",
        guestName: "",
        type: "",
        propertyId: "00610",
        propertyName: "Perry Lane Hotel",
        phone: "999",
        timePass: "48 Sec"
      },
      {
        id: 5,
        name: "Room 211",
        guestName: "Alex Bell",
        type: "",
        propertyId: "00510",
        propertyName: "Perry Lane Hotel",
        phone: "211",
        timePass: "20 Sec"
      },
      {
        id: 6,
        name: "Room 210",
        guestName: "Michael Tan",
        type: "",
        propertyId: "00430",
        propertyName: "Perry Lane Hotel",
        phone: "210",
        timePass: "20 Sec"
      }
    ]
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      const username = userEmail.split('@')[0]; // Extract username from email

      if (username === '1001') {
        this.callpopData = {
          id: 201,
          name: "Perry Lane Hotel - Guest",
          guestName: "John Smith",
          propertyId: "",
          propertyName: "",
          mode: "Incoming",
          phone: "1003",
          type: "",
          timePass: "10 Sec",
        };
      } else if (username === '1003') {
        this.callpopData = {
          id: 202,
          name: "Perry Lane Hotel - Facilities",
          guestName: "Maintenance",
          propertyId: "",
          propertyName: "",
          mode: "Incoming",
          phone: "1001",
          type: "",
          timePass: "10 Sec",
        };
      } else {
        // Default fallback for other users
        this.callpopData = {
          id: 203,
          name: "Unknown Caller",
          guestName: "Unknown",
          propertyId: "",
          propertyName: "",
          mode: "Incoming",
          phone: "0000",
          type: "",
          timePass: "00 Sec",
        };
      }
    }
    effect(() => {
      this.isCallRoute = this.signalService.getCallRoute();
    });
    // Subscribe to incoming call events
    this.sipService.callStatus$.subscribe((status) => {
      if (status === 'incoming') {
        this.isOpenCallPopup = false;
        this.playRingtone();
      } else if (status === "ended") {
        this.isOpenCallPopup = false;
        this.stopRingtone();
      } else {
        this.stopRingtone();
      }
    });

  }
  async ngOnInit(): Promise<void> {
    if (this.route.url.includes('active-call')) {
      this.isCallRoute = true;
    } else {
      this.isCallRoute = false;
    }

    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      const matchedUser = this.sipService.dummyUsers.find(
        (user) => user.email === userEmail
      );

      if (matchedUser) {
        try {
          // Check if the client is already registered
          if (this.sipService.registerer?.state === RegistererState.Registered) {
            console.log('SIP client is already registered.');
          } else {
            console.log('SIP client is not registered. Registering now...');
            await this.sipService.register(matchedUser.username, matchedUser.password);
          }
        } catch (error) {
          console.error('Failed to check or register SIP client:', error);
        }
      } else {
        console.warn('No matching user found for the provided email.');
      }
    } else {
      console.warn('No userEmail found in localStorage.');
    }
  }
  ngAfterViewInit() {
    // if(this.route.url.includes('active-call')){
    //   this.isCallRoute = true;
    // }else{
    //   this.isCallRoute = false;
    // }
    this.openIncomingCallAlert();
  }
  onMessageSelected(chatId: number) {
    window.open('http://www.google.com', '_blank', 'toolbar=0,location=0,menubar=0');
    this.selectedChatId = chatId;
  }

  oepnQueueCall(callDetail: any) {
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.route.navigate(["./dashboard/call-action/active-call"]);

  };

  endCall(callDetail: any) {
    const index = this.inQueueCallList.indexOf(callDetail);

    if (index > -1)
      this.inQueueCallList.splice(index, 1);

    if (!this.inQueueCallList.length)
      this.isOpenCallPopup = false;
  }
  private async playRingtone() {
    try {
      if (!this.isOpenCallPopup) return; // 🔴 Prevent playing if popup is not visible
      this.ringtone.currentTime = 0;
      await this.ringtone.play();
      console.log('Playing ringtone...');

      // Remove click event listener after playing successfully
      document.removeEventListener('click', this.resumePlayback);
    } catch (err) {
      console.error('Autoplay blocked. Waiting for user interaction...', err);
      document.addEventListener('click', this.resumePlayback, { once: true });
    }
  }

  private stopRingtone() {
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
    console.log('Ringtone stopped.');
    document.removeEventListener('click', this.resumePlayback); // ✅ Remove listener
  }

  // ✅ Resume playback only if popup is open
  private resumePlayback = async () => {
    try {
      if (!this.isOpenCallPopup) return; // 🔴 Prevent playback if popup is not visible
      await this.ringtone.play();
      console.log('Playback resumed.');
    } catch (err) {
      console.error('Failed to resume playback:', err);
    }
  };
  callPopAction(action: any) {
    this.isOpenCallPopup = false;
    console.log(action);
    this.commonService.setCookie(this.commonService.callDetail, this.callpopData);
    // this.route.navigate(["./dashboard/call-message/active-call"]);
    if (action == "accept") {
      this.stopRingtone();
      this.isOpenCallPopup = false;
      this.route.navigate(["./dashboard/call-message/active-call"], {
        queryParams: { timestamp: Date.now() },
        state: { incomingCallAccepted: true }
      });
    } else if (action == "reject") {
      this.stopRingtone();
      this.sipService.terminateCall();
      this.isOpenCallPopup = false;
    } else if (action == "queue") {
      this.stopRingtone();
      this.isOpenCallPopup = false;
    }
  }
    openIncomingCallAlert(call: any=''){
  
      // Dialog to show incoming call alert
      // const dialogRefAddCallTo = this.dialog.open(IncomingCallAlertDialogComponent, {
      //   panelClass:"incomingCallAlert",
      //   data: this.callpopData,
      // });
  
      // dialogRefAddCallTo.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   if (result !== undefined) {
      //    console.log(result);
      //   }
      // });
    }
  ngOnDestroy() {
    this.stopRingtone();
  }
}
