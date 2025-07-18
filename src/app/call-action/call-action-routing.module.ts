import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadComponent:()=>import('./call-action.component').then(c=>c.CallActionComponent),
    children:[
      {
        path:'',
        loadComponent:()=>import('./contact-book/contact-book.component').then(c=>c.ContactBookComponent),//()=>import('./recent-call/recent-call.component').then(c=>c.RecentCallComponent),
        
      },
      {
        path:'dial-pad',
        loadComponent:()=>import('./dial-pad/dial-pad.component').then(c=>c.DialPadComponent),
        
      },
      {
        path:'active-call',
        loadComponent:()=>import('./active-call/active-call.component').then(c=>c.ActiveCallComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallActionRoutingModule { }
