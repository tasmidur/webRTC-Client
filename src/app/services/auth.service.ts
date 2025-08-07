import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { catchError, map, Observable, observeOn, of } from 'rxjs';
import { apiEndPoint } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;
  private sharedSession: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private commonService: CommonService
  ) {
    this.isAuthenticated = !!localStorage.getItem(
      this.commonService.sessionToken
    );
  }
  /** POST: add a new hero to the database */
  login(model: any): Observable<any> {
    const endPoint = apiEndPoint.validateLogin;
    const payload = {
      username: model.username,
      password: model.password,
      hbpid: '',
      fromAuth: false,
      portalCookieA: '',
    };

    return this.http
      .post<any>(`${this.commonService.baseUrl}/${endPoint}`, payload)
      .pipe(
        map((response) => {
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
              propertyName: model.propertyName,
              propertyCode: model.propertyCode,
              user: {
                UserEmail: model.username,
                FirstName:
                  userValues && userValues?.length > 1 ? userValues[1] : '',
                LastName:
                  userValues && userValues?.length > 0 ? userValues[0] : '',
              },
            });
            this.isAuthenticated = true;
            return response?.IsLoggedIn;
          } else {
            this.commonService.removeSessionToken();
            this.commonService.removePropertyServicesSession();
            this.commonService.removeUser();
            return of(this.isAuthenticated);
          }
        })
      );
  }
  logon(model: any): Observable<any> {
    const endPoint = apiEndPoint.logon;
    return this.http
      .post<any>(`${this.commonService.baseUrl}/${endPoint}`, model)
      .pipe(catchError(this.commonService.handleError));
  }
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
  logout(endPoint: string): Observable<any> {
    this.isAuthenticated = false;
    return this.http
      .post<any>(
        this.commonService.baseUrl + endPoint,
        {},
        this.commonService.httpOptions
      )
      .pipe(catchError(this.commonService.handleError));
  }

  /**
   * Shared Session Management
   */
  refreshSharedSession(session: any): Observable<boolean> {
    this.isAuthenticated = true;
    if (!session) {
      this.isAuthenticated = false;
    }
    return this.http
      .post<any>(`${this.commonService.baseUrl}/${apiEndPoint.extendSession}`, {
        sessionId: session,
      })
      .pipe(
        map((res) => {
          if (res && res === 'success') {
            this.isAuthenticated = true;
            this.commonService.setSessionToken(session || '');
            this.commonService.setLastApiAccessTime();
            return this.isAuthenticated;
          } else {
            this.isAuthenticated = false;
            return this.isAuthenticated;
          }
        }),
        catchError((err) => {
          this.isAuthenticated = false;
          return of(this.isAuthenticated);
        })
      );
  }
}
