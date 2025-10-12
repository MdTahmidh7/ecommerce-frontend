import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // 1. Get the expected role(s) from the route data
    const expectedRoles = route.data['roles'] as string[];

    // 2. Get the user's role array (will be string[] | null)
    const userRoles = this.authService.getUserRole() as string[] | null;

    // 3. Check for authentication (a user must be logged in to have roles)
    if (!userRoles || userRoles.length === 0) {
      // Not logged in or no roles assigned, redirect to the appropriate login
      const is_admin_route = state.url.startsWith('/admin');
      if (is_admin_route) {
        return this.router.createUrlTree(['/admin/login']);
      }
      return this.router.createUrlTree(['/login']);
    }

    // 4. Role Authorization Check
    if (expectedRoles && expectedRoles.length > 0) {
      // Use the Array.prototype.some() method to check if at least one user role
      // is included in the array of expectedRoles.
      const hasRequiredRole = userRoles.some(role => expectedRoles.includes(role));

      if (hasRequiredRole) {
        // User has at least one of the required roles
        return true;
      } else {
        // User is logged in but does not have the correct role
        // Redirect to a specific unauthorized page or home
        return this.router.createUrlTree(['/home']);
      }
    }

    // If no roles are explicitly defined in the route data,
    // we only needed to verify the user is logged in (checked in step 3).
    return true;
  }
}
