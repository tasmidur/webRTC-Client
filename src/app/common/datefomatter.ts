import { Injectable } from '@angular/core';
import { NgbAlertModule, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
function padNumber(value: number) {
    if (!isNaN(value) && value !== null) {
      return `0${value}`.slice(-2);
    } 
    return '';
  }
  
  @Injectable()
  export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct | null {
      if (value) {
        let dateParts:string[] = value.trim().split('/');
  
        let dateObj: any = { day: <any>null, month: <any>null, year: <any>null }//changed
        const dateLabels:string[] = Object.keys(dateObj);
  
        dateParts.forEach((datePart, idx) => {
          dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
        });
        return dateObj;
      }
      return null;
    }
   
    static formatDate(date: NgbDateStruct | NgbDate | null): string {
      return date ?
          `${padNumber(date.month)}/${padNumber(date.day)}/${date.year || ''}` : '';
    }
   
    format(date: NgbDateStruct | null): string {
      return NgbDateCustomParserFormatter.formatDate(date);
    }
  }