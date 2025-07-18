import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CallActionModule } from './call-action/call-action.module';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
    {
        path: '', 
        pathMatch:'prefix',
        redirectTo: () => {
            return 'login/default'; // Redirect to session-manager with sessionId
    }},
    // { 
    //     path:'login',
    //     loadComponent: ()=> import('./login/login.component').then( c => LoginComponent),
    // },
    // {
    //     path:"guest-information",
    //     loadComponent:()=> import('./guest-information/guest-information.component').then( c => GuestInformationComponent),
    //     canActivate:[authGuard]
    // },
    { 
        path:'login/:sessionId',
        loadComponent: ()=> import('./login/login.component').then( c => LoginComponent),
    },
    {
        path:'dashboard',
        loadComponent: ()=> import('./dashboard/dashboard.component').then( c => DashboardComponent),
        children:[
            {
                path:"call-action",
                loadChildren:()=> import('./call-action/call-action.module').then( c => CallActionModule),
            }
        ],
        canActivate:[authGuard]
    }
];