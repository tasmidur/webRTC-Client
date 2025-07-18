import { Component } from '@angular/core';
import { IconCollection } from '../../common/IconCollection';
import { charFormat } from '../../common/pipe/charFormat';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Call } from '../../Models/call.model';
import { CommonService } from '../../services/common.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialPadComponent } from '../dial-pad/dial-pad.component';

@Component({
  selector: 'app-in-queue',
  imports: [SharedModule, charFormat, IconField, InputIcon,DialPadComponent], //RouterLink
  templateUrl: './in-queue.component.html',
  styleUrl: './in-queue.component.css'
})
export class InQueueComponent {
  globalSearchValue!:string;
  inQueueCallList:any[]=[];
  isOpenDialPad:boolean=false;
  constructor( private store: Store, private route: Router, private commonService: CommonService,){
    this.inQueueCallList = [
      {
        id:1,
        name:"Room 601",
        guestName:"Balogh Imre",
        type:"VIP",
        propertyId:"00426",
        propertyName:"Perry Lane Hotel",
        phone:"601",
        timePass:"12 Sec"
      },
      {
        id:2,
        name:"Room 708",
        guestName:"Bogdan Norbert",
        type:"",
        propertyId:"00427",
        propertyName:"Perry Lane Hotel",
        phone:"708",
        timePass:"5 Sec"
      },
      {
        id:3,        
        name:"The Pool",
        guestName:"",
        type:"",
        propertyId:"00600",
        propertyName:"Perry Lane Hotel",
        phone:"105",
        timePass:"26 Sec"
      },
      {
        id:4,
        name:"Security",
        guestName:"",
        type:"",
        propertyId:"00610",
        propertyName:"Perry Lane Hotel",
        phone:"999",
        timePass:"48 Sec"
      },
      {
        id:5,
        name:"Room 211",
        guestName:"Alex Bell",
        type:"",
        propertyId:"00510",
        propertyName:"Perry Lane Hotel",
        phone:"211",
        timePass:"20 Sec"
      },
      {
        id:6,
        name:"Room 210",
        guestName:"Michael Tan",
        type:"",
        propertyId:"00430",
        propertyName:"Perry Lane Hotel",
        phone:"210",
        timePass:"20 Sec"
      }
    ]
  }
  public getIcon(name: string): string {
    return IconCollection.getIcon(name);
  }
  oepnQueueCall(callDetail:any){

    this.store.dispatch({
      type: 'Init_Call', payload: <Call> { callType: callDetail.type, isDetail: true }
    });
    this.commonService.setCookie(this.commonService.callDetail, callDetail);
    this.route.navigate(["./dashboard/call-action/active-call"]);
  };
  getColor(waitTime:string):any{
     let strArr = waitTime.split(" ");
     if(strArr.length > 1){
        let time = Number(strArr[0]);
        if(strArr[1].toLowerCase().includes('min'))
          return {color:"#F7454A", background:"#940101"};
        if(time < 10)
          return {color:"#328048", background:"#C3F2D0"};
        else if(time > 10 &&time < 30)
          return {color:"#EC9312", background:"#FFF0DB"};
        else if(time > 30 &&time < 59)
          return {color:"#FF1E1D", background:"#FFCEBF"};
     }
  }
  openDialpad(){
    this.isOpenDialPad= !this.isOpenDialPad;
   }
   openDialpadByRoute(){
        this.route.navigate(["./dashboard/call-action/dial-pad"]);
   }
}
