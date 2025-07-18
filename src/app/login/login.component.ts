import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routerList } from '../common/utils';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private sessionId: string | null = null;

  public username: string | null = null;
  private propertyCode: string | null = null;
  private propertyName: string | null = null;

  public password: string | null = null;

  public isSessionValid: boolean = false;
  public message: string = '';

  isSessionExpired: boolean = false;

  public isFormSubmitting = false;
  public formSubmitionError = null;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.sessionId = params.get('sessionId') || null;
      if (this.sessionId) {
        const decrypedValue = this.commonService.cryptoJsDecryption(
          this.sessionId
        );
        this.username = decrypedValue?.username || null;
        this.propertyCode = decrypedValue?.propertyCode || null;
        this.propertyName = decrypedValue?.propertyName || null;
      }
    });
  }

  ngOnInit(): void {
    this.handleSession();
  }

  async handleSession() {
    const chachedSession = this.commonService.getSessionToken();
    const storedUserInfo = this.commonService.getUser();
    const isUserExist =
      storedUserInfo.user && storedUserInfo.user?.UserEmail == this.username;
    if (!this.username) {
      this._handleVerifySession(chachedSession);
    } else if (this.username && isUserExist) {
      this.commonService.setUser({
        user: storedUserInfo.user,
        propertyName: this.propertyName,
        propertyCode: this.propertyCode,
      });
      this._handleVerifySession(chachedSession);
    } else {
      this.isSessionValid = false;
      this.isSessionExpired = false;
      this.message = '';
      this.commonService.removeSessionToken();
      this.commonService.removeLastApiAccessTime();
      this.commonService.removePropertyServicesSession();
    }
  }

  async _handleVerifySession(chachedSession: any) {
    if (chachedSession) {
      await this.verifySession(chachedSession);
    } else {
      this.isSessionValid = false;
      this.isSessionExpired = !this.username;
      if (!this.username) {
        this.message =
          'You are missing the session information. You need to go to the customer portal to login again to access this site.';
      } else {
        this.message =
          'The session is expired. You need to go to the customer portal to login again to access this site.';
      }

      this.commonService.removeSessionToken();
      this.commonService.removeLastApiAccessTime();
      this.commonService.removePropertyServicesSession();
    }
  }

  onSubmit() {
    if (this.password) {
      this.isFormSubmitting = true;
      this.formSubmitionError = null;
      // Add your login logic here (e.g., call to authentication service)
      const payload = {
        username: this.username,
        password: this.password,
        hbpid: '',
        fromAuth: false,
        portalCookieA: '',
      };
      this.authService.login(payload).subscribe({
        next: (response) => {
          if (response && response?.IsLoggedIn) {
            /**
             * Logon api call for session
             */
            const retvalValues = response?.Retval.split(':');
            const sessionTokenValue = retvalValues[retvalValues.length - 1];
            this.commonService.setSessionToken(sessionTokenValue || '');
            const userValues = response?.User.split(',');
            /**
             * Set Property session
             */
            this.commonService.setPropertyServicesSession(
              response?.PropertyServicesSession || ''
            );
            /**
             * Set User info
             */
            this.commonService.setUser({
              propertyName: this.propertyName,
              propertyCode: this.propertyCode,
              user: {
                UserEmail: this.username,
                FirstName:
                  userValues && userValues?.length > 1 ? userValues[1] : '',
                LastName:
                  userValues && userValues?.length > 0 ? userValues[0] : '',
              },
            });
            /**
             * Redirect to Dashboard
             */
            window.location.href = routerList.callAction;
          } else {
            this.commonService.removeSessionToken();
            this.commonService.removePropertyServicesSession();
            this.commonService.removeUser();
          }
        },
      });
    }
  }

  async verifySession(sessionId: string | null) {
    if (sessionId) {
      this.isSessionValid = Boolean(sessionId);
      this.commonService.setSessionToken(sessionId || '');
      this.commonService.setLastApiAccessTime();
      this.router.navigate([routerList.callAction]);
    } else {
      console.log('verifySession else call');
      this.isSessionValid = false;
      this.isSessionExpired = true;
      this.commonService.removeSessionToken();
      this.commonService.removeLastApiAccessTime();
      this.message =
        'The session is expired. You need to go to the customer portal to login again to access this site.';
    }
  }

  openCustomerPortal() {
    window.location.href = this.commonService.getCustomerPortalUrl();
  }
}
