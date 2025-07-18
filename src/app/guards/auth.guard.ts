import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable, inject } from '@angular/core';
import { routerList } from '../common/utils';

@Injectable()
class UserToken {}

@Injectable({ providedIn: 'root' })
class PermissionsService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      return true;
    } else {
      this.router.navigate([routerList.default]);
      return false;
    }
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
}
export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
