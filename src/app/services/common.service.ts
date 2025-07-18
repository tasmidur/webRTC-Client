import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { IconCollection } from '../common/IconCollection';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  readonly callDetail: string = 'CallDetail';
  readonly dialPadNumber: string = 'dialPadNumber';
  readonly baseUrl: string;
  readonly customerPortalUrl: string;
  readonly jazzWebSDKGuestApiURL: string;
  private cryptoAuthSecret: string | null = null;
  private sessionTimeoutPeriod: number | null = null;
  readonly authSecretKey = 'frontDesk.authToken';
  readonly userInfo = 'frontDesk.userInfo';
  readonly sessionToken = 'frontDesk.sessionToken';
  readonly propertyServicesSession = 'frontDesk.propertyServicesSession';
  readonly sessionTimeout = 'frontDesk.lastApiAccessTime';
  readonly jazzWebSDKRefreshInterval: number = 2;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.baseUrl = environment.baseApiUrl;
    this.customerPortalUrl = environment.customerPortalUrl;
    this.jazzWebSDKGuestApiURL = environment.jazzWebSDKGuestApiURL;
    this.cryptoAuthSecret = environment.cryptoAuthSecret;
    this.sessionTimeoutPeriod = environment.sessionTimeoutPeriod;
    this.jazzWebSDKRefreshInterval = environment.jazzWebSDKRefreshInterval;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + this.getToken(),
    }),
  };
  getUser() {
    let userString = localStorage.getItem(this.userInfo);
    let user = userString ? JSON.parse(userString) : {};
    return user;
  }
  setUser(userInfo: any) {
    localStorage.setItem(this.userInfo, JSON.stringify(userInfo));
  }
  removeUser() {
    localStorage.removeItem(this.userInfo);
  }
  getToken() {
    return localStorage.getItem(this.authSecretKey);
  }

  // Nowshad

  getSessionToken(): string | null {
    return localStorage.getItem(this.sessionToken);
  }

  setSessionToken(sessionToken: string): void {
    localStorage.setItem(this.sessionToken, sessionToken);
  }

  removeSessionToken(): void {
    localStorage.removeItem(this.sessionToken);
  }

  getPropertyServicesSession(): string | null {
    return localStorage.getItem(this.propertyServicesSession);
  }

  setPropertyServicesSession(sessionToken: string): void {
    localStorage.setItem(this.propertyServicesSession, sessionToken);
  }

  removePropertyServicesSession(): void {
    localStorage.removeItem(this.propertyServicesSession);
  }

  getLastApiAccessTime(): number | null {
    const lastAccessTime = localStorage.getItem(this.sessionTimeout);
    return lastAccessTime ? parseInt(lastAccessTime, 10) : null;
  }

  setLastApiAccessTime(): void {
    const currentTime = new Date().getTime();
    localStorage.setItem(this.sessionTimeout, currentTime.toString());
  }

  removeLastApiAccessTime(): void {
    localStorage.removeItem(this.sessionTimeout);
  }

  getSessionTimeout(): string | null {
    return localStorage.getItem(this.sessionTimeout);
  }

  getCryptoAuthSecret(): string | null {
    return this.cryptoAuthSecret;
  }

  getCustomerPortalUrl(): string {
    return this.customerPortalUrl;
  }

  getSessionTimeoutPeriod(): number | null {
    return this.sessionTimeoutPeriod;
  }

  cryptoJsDecryption(ciphertext: string): any {
    if (!ciphertext) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.cryptoAuthSecret || '');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Nowshad

  handleError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      Swal.fire({
        title: "<span style='color:red;'>Session expired!</span>",
        text: 'Please login again',
        icon: 'info',
      }).then((result) => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        location.reload();
      });
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
  setCookie(keyName: string, value: any) {
    debugger;
    const objJSON = JSON.stringify(value);
    this.cookieService.set(keyName, objJSON);
  }
  getCookie(keyName: string) {
    return this.cookieService.get(keyName)
      ? JSON.parse(this.cookieService.get(keyName))
      : null;
  }
  removeCookie(keyName: string) {
    this.cookieService.delete(keyName);
  }
  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }
}
