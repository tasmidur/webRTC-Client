import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { Call } from '../../Models/call.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { charFormat } from '../../common/pipe/charFormat';
import { SignalService } from '../../services/signal.service';
import { ConferenceCallDialogComponent } from '../../common/dialog/conference-call-dialog/conference-call-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TransferCallDialogComponent } from '../../common/dialog/transfer-call-dialog/transfer-call-dialog.component';
import { SipService } from '../../services/sip.service';
import { AddCallDialogComponent } from '../../common/dialog/add-call-dialog/add-call-dialog.component';
import { QuickActionComponent } from '../quick-action/quick-action.component';

@Component({
  selector: 'app-active-call',
  imports: [SharedModule, charFormat, QuickActionComponent],//charFormat
  templateUrl: './active-call.component.html',
  styleUrl: './active-call.component.css'
})
export class ActiveCallComponent {
  @ViewChild('callAudio') callAudio!: ElementRef<HTMLAudioElement>;
  callDetail:any=null;
  private ringtone = new Audio('phone-ring.mp3');
  callState: 'dialing' | 'ringing' | 'connecting' | 'connected' | 'ended' = 'dialing';
  showFiller = false;
  toggleQuickCall = true;
  // callDetail:Observable<Call[]>;
  deptCallList:any[]=[]
  constructor(private store: Store<AppState>, private route:Router,  public commonService: CommonService, private signalService: SignalService, public dialog: MatDialog, private sipService: SipService) { 
    // this.callDetail = this.store.select(state => state.call);
    // console.log(" this.callDetail", this.callDetail)
    this.ringtone.loop = true;
    this.ringtone.autoplay = true;
    this.ringtone.muted = false;
    this.deptCallList = [
      {
        id:1,
        name:"Reservation",
        type:"Reservation",
        propertyId:"001",
        propertyName:"Perry Lane Hotel",
        phone:"123",
      },
      {
        id:2,
        name:"Housekeeping",
        type:"Guest Service",
        propertyId:"002",
        propertyName:"Perry Lane Hotel",
        phone:"111",
      },
      {
        id:3,        
        name:"Concierge",
        type:"AI Support",
        propertyId:"003",
        propertyName:"Perry Lane Hotel",
        phone:"100",
      },
      {
        id:4,
        name:"Security",
        type:"Security",
        propertyId:"004",
        propertyName:"Perry Lane Hotel",
        phone:"941",
      },
      {
        id:5,
        name:"Maintenance",
        type:"Maintenance",
        propertyId:"005",
        propertyName:"Perry Lane Hotel",
        phone:"444",
      },
      {
        id:6,
        name:"General Manager",
        type:"General Manager",
        propertyId:"005",
        propertyName:"Perry Lane Hotel",
        phone:"999",
      }
    ]
    this.signalService.setCallRoute(true);
  }

  ngOnInit() {
    this.getCallDetails();
    // Check for outgoing call first
    const dialPhoneNumber = this.commonService.getCookie(
      this.commonService.dialPadNumber
    );
    if (dialPhoneNumber) {
      this.initiateOutgoingCall(dialPhoneNumber);
    }

    // Listen for call status updates (both incoming and outgoing)
    this.sipService.callStatus$.subscribe(async (status) => {
      console.log('SIP Call Status:', status);

      switch (status) {
        case 'incoming':
          console.log('Incoming call detected.');
          this.updateCallState('connecting'); // Incoming call starts with "ringing"
          await this.acceptIncomingCall(); // Handle incoming call acceptance
          break;

        case 'outgoing':
          this.updateCallState('ringing');
          break;

        case 'ringing':
          this.updateCallState('ringing');
          this.playRingtone();
          break;

        case 'connected':
          this.updateCallState('connected');
          this.stopRingtone();
          this.callTimer(0,0);
          this.bindAudioStream();
          break;

        case 'ended':
          this.updateCallState('ended');
          this.stopRingtone();
          this.endCall();
          break;

        default:
          this.updateCallState('dialing');
          break;
      }
    });
  }
  private async playRingtone() {
    try {
      this.ringtone.currentTime = 0;
      await this.ringtone.play();
      console.log('Playing ringtone...');
    } catch (err) {
      console.error('Autoplay blocked. Waiting for user interaction...', err);
    }
  }
  
  private stopRingtone() {
    this.ringtone.pause();
    this.ringtone.currentTime = 0;
    console.log('Ringtone stopped.');
  }
  private bindAudioStream(): void {
    const remoteStream = this.sipService.getRemoteMediaStream();
    
    if (remoteStream && this.callAudio) {
      console.log('Binding remote media stream to audio tag.');
      this.callAudio.nativeElement.srcObject = remoteStream;
    } else {
      console.error('No remote media stream found.');
    }
  }

  private async acceptIncomingCall(): Promise<void> {
    try {
      console.log('Accepting incoming call...');
      // this.updateCallState('connecting'); // Update state to "connecting" while accepting
      await this.sipService.acceptIncomingCall(); // Use SipService to accept the call
      this.updateCallState('connected'); // Transition to "connected" once established
      this.callTimer(0,0);
    } catch (error) {
      console.error('Failed to accept incoming call:', error);
      this.updateCallState('ended'); // Ensure the state transitions to "ended" on failure
    }
  }

  private initiateOutgoingCall(phoneNumber: string): void {
    try {
      console.log(`Initiating outgoing call to ${phoneNumber}`);
      this.updateCallState('dialing');
      this.sipService.makeOutgoingCall(`sip:${phoneNumber}@${this.sipService.getSipAddress()}`);
    } catch (error) {
      console.error('Failed to initiate outgoing call:', error);
      this.updateCallState('ended'); // Set state to ended on failure
    }
  }

  private updateCallState(state: 'dialing' | 'connecting' | 'ringing' | 'connected' | 'ended'): void {
    this.callState = state;
    console.log(`Call state updated: ${state}`);
  }

  // End the call and handle cleanup
  async endCall() {
    console.log('Terminating the call...');
  
    try {
      await this.sipService.terminateCall();
    } catch (error) {
      console.error('Error terminating call:', error);
    }
  
    this.updateCallState('dialing');
    
    // ✅ Ensure navigation happens after termination
    this.route.navigate(["./dashboard/call-action"]);
  }
  
  getCallDetails() {
    const userEmail = localStorage.getItem('userEmail');
  
    if (userEmail) {
      const username = userEmail.split('@')[0]; // Extract username from email
  
      if (this.commonService.getCookie(this.commonService.dialPadNumber)) {
        // Dynamically set outgoing call details based on the logged-in user
        this.callDetail = {
          id: 101,
          name: "Perry Lane Hotel - Guest",
          guestName: "John Smith",
          phone: "1003",
          type: "Incoming",
          timePass: "00:05:30",
        };
        if (username === '1001') {
          this.callDetail = {
            id: 101,
            name: "Perry Lane Hotel - Guest",
            guestName: "John Smith",
            phone: "1003",
            type: "Outgoing",
            timePass: "00:05:30",
          };
        } else if (username === '1003') {
          this.callDetail = {
            id: 102,
            name: "Perry Lane Hotel - Facilities",
            guestName: "Maintenance",
            phone: "1001",
            type: "Outgoing",
            timePass: "00:05:30",
          };
        } else {
          // Default behavior for other users
          this.callDetail = {
            id: 103,
            name: "Unknown",
            guestName: "Unknown",
            phone: "0000",
            type: "Outgoing",
            timePass: "00:00:00",
          };
        }
      } else {
        // Retrieve stored call details if no outgoing call is set
        this.callDetail = this.commonService.getCookie(this.commonService.callDetail);
      }
    }
  }
  
  callTime:string="";
  callTimer(min:number,sec:number){
    let tick = ()=> {
      this.callTime = min.toString() + ":" + (sec < 10 ? "0" : "") + String(sec);
      sec++;
      if ( sec<60 && sec >= 0) {
           setTimeout(tick, 1000);
      } else {
        setTimeout(()=> {
          this.callTimer(min + 1, 0);
        }, 1000);
      }
  }
  tick();
  }
  openActiveCall(callDetail:any){
    // this.commonService.setCookie(this.commonService.callDetail, callDetail);
    // this.route.navigate(["./dashboard/call-message/active-call"]);
  }
  toggleQuickCallAction(){
    this.toggleQuickCall = !this.toggleQuickCall;
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
  openTransferCall(call: any){

    const dialogRefTransferCall = this.dialog.open(TransferCallDialogComponent, {
      panelClass:"callTransfer",
      data: {name: "Test", animal: "Lion"},
    });

    dialogRefTransferCall.afterClosed().subscribe(result => {
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
  ngOnDestroy() {
    console.log('Destroying ActiveCallComponent...');
    this.commonService.removeCookie(this.commonService.callDetail);
    this.commonService.removeCookie(this.commonService.dialPadNumber);
    this.signalService.setCallRoute(false);
  }
}
