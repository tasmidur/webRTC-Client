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
    return this.http
      .post<any>(`${this.commonService.baseUrl}/${endPoint}`, model)
      .pipe(catchError(this.commonService.handleError));
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
