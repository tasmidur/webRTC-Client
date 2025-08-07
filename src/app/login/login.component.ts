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
  public formSubmitionError: string | null = null;

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
        propertyName: this.propertyName,
        propertyCode: this.propertyCode,
      };
      this.authService.login(payload).subscribe({
        next: (response) => {
          this.isFormSubmitting = false;
          if (!response) {
            this.commonService.removeSessionToken();
            this.commonService.removePropertyServicesSession();
            this.commonService.removeUser();
            this.formSubmitionError = 'InValid username or password';
          } else {
            this.commonService.setPassword(this.password);
            window.location.href = routerList.callAction;
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
