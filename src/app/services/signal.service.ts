import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private message = signal<string>('');
  private isCallRoute = signal<boolean>(false);
  constructor() { }
  setMessage(message:string){
    console.log("signal set");
    this.message.update(()=>message);
  }
  getMessage(){
    console.log("signal get");
    return this.message();
  }
  setCallRoute(flag:boolean){
    this.isCallRoute.update(()=>flag);
  }
  getCallRoute(){
    return this.isCallRoute();
  }
}
