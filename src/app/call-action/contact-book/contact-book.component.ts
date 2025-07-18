import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContactComponent } from '../contact/contact.component';
import { RecentCallComponent } from '../recent-call/recent-call.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoomCallComponent } from '../room-call/room-call.component';
import { InQueueComponent } from '../in-queue/in-queue.component';
import { DialPadComponent } from '../dial-pad/dial-pad.component';
@Component({
  selector: 'app-contact-book',
  imports: [ SharedModule, RecentCallComponent, ContactComponent, RoomCallComponent,InQueueComponent, RouterLink],
  templateUrl: './contact-book.component.html',
  styleUrl: './contact-book.component.css'
})
export class ContactBookComponent {
  activeCall?:string='RecentCall';
  isOpenDialPad:boolean=false;
  @ViewChild('scrollcallpad') 
  private myScrollContainer: ElementRef<HTMLInputElement> = {} as ElementRef;
  constructor(private route: Router){}
  // activeCall(flag:boolean){

  //   this.isActiveCall = flag;
  // }
  getActiveCall(activeTab:string){
    
    this.activeCall = activeTab;
  }
}
