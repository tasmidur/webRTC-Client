import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { apiEndPoint, routerList } from '../common/utils';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnDestroy {
  info: any = {
    propertyName: '',
    propertyCode: '',
    propertyLogo: '/images/hotel_placeholder.png',
    user: '',
    userImage: '/images/default-avatar.jpg',
    loginDateTime: '',
  };
  lastApiAccessTime: number | null = null;
  private refreshIntervalId: any;
  user: any = {};

  constructor(
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.setUserInfo();
  }

  ngOnInit(): void {
    this.lastApiAccessTime = this.commonService.getLastApiAccessTime();
    this.refreshIntervalId = setInterval(() => {
      this.refreshSession();
    }, this.commonService.jazzWebSDKRefreshInterval * 60000);
  }

  refreshSession() {
    console.log('Refreshing session... at ', new Date().toLocaleTimeString());
    const sessionToken = this.commonService.getSessionToken();
    if (sessionToken) {
      this.doLogin();
    }
  }

  doLogin() {
    const userInfo = this.commonService.getUser();
    if (userInfo?.user && userInfo?.propertyName && userInfo?.propertyCode) {
      const payload = {
        username: userInfo?.user?.UserEmail,
        password: this.commonService.getPassword(),
        propertyName: userInfo?.propertyName,
        propertyCode: userInfo?.propertyCode,
      };
      this.authService.login(payload).subscribe({
        next: (response) => {
          if (!response) {
            this.commonService.removeSessionToken();
            this.commonService.removePropertyServicesSession();
            this.commonService.removeUser();
            window.location.href = routerList.default;
          } else {
            console.log('Successfully session updated.');
          }
        },
      });
    } else {
      this.commonService.removeSessionToken();
      this.commonService.removePropertyServicesSession();
      this.commonService.removeUser();
      window.location.href = routerList.default;
    }
  }

  menuList: any[] = [
    {
      Id: 1,
      Name: 'Home',
      RouteLink: '/dashboard/home',
      IsSelected: true,
    },
    {
      Id: 2,
      Name: 'Rooms & Guests',
      RouteLink: '/dashboard/room-guest',
      IsSelected: false,
    },
    {
      Id: 3,
      Name: 'Service Desk',
      RouteLink: '/dashboard/service-desk',
      IsSelected: false,
    },
    {
      Id: 4,
      Name: 'Operator 360',
      RouteLink: '', //dashboard/call-action
      IsSelected: false,
    },
    {
      Id: 4,
      Name: 'Message',
      RouteLink: '', ///dashboard/message-action
      IsSelected: false,
    },
    {
      Id: 5,
      Name: 'Property Dashboard',
      RouteLink: '/dashboard/property-dashboard',
      IsSelected: false,
    },
  ];
  private setUserInfo(): void {
    const userInfo = this.commonService.getUser();
    this.info.propertyName = userInfo?.propertyName || '';
    this.user = userInfo?.user || '';
    const userEmailValues = userInfo?.user?.UserEmail
      ? userInfo?.user?.UserEmail?.split('@')
      : [];

    if (userEmailValues?.length > 0 && userEmailValues[0] === '1001') {
      this.info.userImage = '/images/user1.png';
    }
  }
  onMenu(menu: any) {
    this.menuList.forEach((element) => {
      element.IsSelected = false;
    });
    menu.IsSelected = true;
    const host = window.location.origin;
    if (menu.Name == 'Operator 360') {
      //dev
      // window.open('http://localhost:4204/dashboard/call-message', 'operator 360', "width=700");
      //Prod
      window.open(`${host}/dashboard/call-action`, 'operator 360', 'width=640');
    } else if (menu.Name == 'Message') {
      //dev
      // window.open('http://localhost:4204/dashboard/message-action', 'Message', "width=700");
      //Prod
      window.open(`${host}/dashboard/message-action`, 'Message', 'width=640');
    }
  }
  Logout(): void {
    // Clear session data
    this.commonService.removeSessionToken();
    this.commonService.removePropertyServicesSession();
    this.commonService.removeLastApiAccessTime();
    this.commonService.removeUser();

    // Log for debugging
    console.log('Logout successful');

    // Attempt to close the window
    try {
      window.close();
      // If window.close() doesn't work, navigate to a default route
      setTimeout(() => {
        if (!window.closed) {
          console.warn(
            'Window could not be closed programmatically. Redirecting to default route.'
          );
          this.router.navigate(['']); // Navigate to default route (e.g., login page)
        }
      }, 100);
    } catch (error) {
      console.error('Error attempting to close window:', error);
      this.router.navigate(['']); // Fallback to default route
    }
  }
  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }
}
