import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { catchError, Observable } from 'rxjs';
import { apiEndPoint } from '../common/utils';

@Injectable({
  providedIn: 'root',
})
export class SpeedDialService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  getSpeedDialList(model: any): Observable<any> {
    const endPoint = apiEndPoint.speedDialList;
    return this.http
      .post<any>(`${this.commonService.baseUrl}/${endPoint}`, model)
      .pipe(catchError(this.commonService.handleError));
  }
}
