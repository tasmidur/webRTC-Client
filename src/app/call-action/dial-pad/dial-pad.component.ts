import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-dial-pad',
  imports: [SharedModule],
  templateUrl: './dial-pad.component.html',
  styleUrl: './dial-pad.component.css'
})
export class DialPadComponent {
@Output() backKeyPress = new EventEmitter<string>();

  keypad = [
    [
      { value: '1', label: '' },
      { value: '2', label: 'ABC' },
      { value: '3', label: 'DEF' },
    ],
    [
      { value: '4', label: 'GHI' },
      { value: '5', label: 'JKL' },
      { value: '6', label: 'MNO' },
    ],
    [
      { value: '7', label: 'PQRS' },
      { value: '8', label: 'TUV' },
      { value: '9', label: 'WXYZ' },
    ],
    [
      { value: '*', label: '' },
      { value: '0', label: '+' },
      { value: '#', label: '' },
    ],
  ];

  phoneNumber: string = "";
  
  constructor(private route:Router, private commonService: CommonService) {}

  ngOnInit() {
  }

  onBackKeyPress() {
    this.route.navigate(["./dashboard/call-action"]);
  }

  onKeyPadPress(key: string): void {
    this.phoneNumber += key;
  }

  onClearPressed(): void {
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }
   openActiveCall(){
    this.commonService.setCookie(this.commonService.dialPadNumber, this.phoneNumber);
    this.route.navigate(["./dashboard/call-action/active-call"]);
  }
}
