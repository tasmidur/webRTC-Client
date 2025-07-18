import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../../shared/shared.module';
import { charFormat } from '../../common/pipe/charFormat';

@Component({
  selector: 'app-call-popup',
  imports: [SharedModule, charFormat],
  templateUrl: './call-popup.component.html',
  styleUrl: './call-popup.component.css'
})
export class CallPopupComponent {
callDetail:any=null;
@Input()
callPopData:any;
@Output() 
callAction = new EventEmitter<any>();

  constructor( private route:Router,  public commonService: CommonService) { 
  }

  ngOnInit() {
    this.getCallDetails();
   // this.callTimer(0,0);
  }
  callBtnAction(status:string){
    this.callAction.emit(status);
    //this.route.navigate(["./dashboard/call-message"]);
  }
  getCallDetails(){
    this.callDetail=this.callPopData;
  }
  callTime:string="";
  callTimer(min:number,sec:number){
    let tick = ()=> {
      this.callTime = min.toString() + ":" + (sec < 10 ? "0" : "") + String(sec);
      sec++;
      if ( sec<60 && sec >= 0) {
           setTimeout(tick, 1000);
      } else {
        setTimeout(()=> {
          this.callTimer(min + 1, 0);
        }, 1000);
      }
  }
  tick();
  }
  
}
