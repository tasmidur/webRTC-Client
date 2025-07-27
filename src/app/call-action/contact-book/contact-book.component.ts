import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContactComponent } from '../speed-dial/speed-dial.component';
import { RecentCallComponent } from '../recent-call/recent-call.component';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { RoomCallComponent } from '../room-call/room-call.component';
import { InQueueComponent } from '../in-queue/in-queue.component';
import { DialPadComponent } from '../dial-pad/dial-pad.component';
@Component({
  selector: 'app-contact-book',
  imports: [
    SharedModule,
    RecentCallComponent,
    ContactComponent,
    RoomCallComponent,
    InQueueComponent,
    RouterLink,
  ],
  templateUrl: './contact-book.component.html',
  styleUrl: './contact-book.component.css',
})
export class ContactBookComponent {
  activeCall?: string = 'RecentCall';
  isOpenDialPad: boolean = false;
  @ViewChild('scrollcallpad')
  private myScrollContainer: ElementRef<HTMLInputElement> = {} as ElementRef;
  constructor(private route: Router, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    // Subscribe to query parameters to initialize activeCall and globalSearchValue
    this.activatedRoute.queryParams.subscribe((params) => {
      this.activeCall = params['tab'] || 'RecentCall';
    });
  }
  getActiveCall(activeTab: string) {
    this.activeCall = activeTab;
    // Navigate with query parameters for tab and search
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { tab: activeTab },
      queryParamsHandling: 'merge',
    });
  }
}
