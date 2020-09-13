import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../Service/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private $auth: AuthorizationService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    // console.log('URL Serarch :' + url.search('/corp/'));

    /**
     * Asset Monitoring : Required Adminstative/Gatekeeping/Standard
     */
    if (url.search('/assetMonitoring') !== -1) {
      const AdmingrantRTM = this.$auth.$grantAccess('A');
      const GKgrantRTM = this.$auth.$grantAccess('G');
      const StdgrantRTMA = this.$auth.$grantAccess('S');
      if (AdmingrantRTM === true || GKgrantRTM === true || StdgrantRTMA === true) {
        return true;
      }
      this.router.navigate(['/auth/login']);
      return false;
    }
    /**
     * Allow the access to Corporate seting those who have role as 'Adminstrative'
     * ---------------------------------------------------------------------------
     */
    if (url.search('/corp/') !== -1) {
      /// A - Adminstrative role

      /// Sites
      if (url.search('/sites') !== -1) {
        const grantPerSites = this.$auth.$grantAccess('A');
        if (grantPerSites === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }

      /// Create Users : All page access to Gatekeeper only
      if (url.search('/createUser') !== -1) {
        const AdmingrantRTM = this.$auth.$grantAccess('A');
        const GKgrantRTM = this.$auth.$grantAccess('G');
        if (AdmingrantRTM === true || GKgrantRTM === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }
      /// Add User Entity : All page access to Administrative only
      if (url.search('/addUserEntityComponent') !== -1) {
        const grantPerUsersAdmin = this.$auth.$grantAccess('A');
        if (grantPerUsersAdmin === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }
      /// Users Mapping : All page access to Gatekeeper only
      if (url.search('/UserPrevilegesMappingComponent') !== -1) {
        const AdmingrantRTM = this.$auth.$grantAccess('A');
        const GKgrantRTM = this.$auth.$grantAccess('G');
        if (AdmingrantRTM === true || GKgrantRTM === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }

      /// Users : All page access to either Gatekeeper/Administrative only
      if (url.search('/user') !== -1) {
        const grantPerUsersAdmin = this.$auth.$grantAccess('A');
        const grantPerUsersGate = this.$auth.$grantAccess('G');
        if (grantPerUsersAdmin === true || grantPerUsersGate === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }

      /// Asset : All page access to Administrative only
      if (url.search('/asset') !== -1) {
        const grantPerUsersAsset = this.$auth.$grantAccess('A');
        if (grantPerUsersAsset === true) {
          return true;
        }
        this.router.navigate(['/auth/login']);
        return false;
      }

    }
    /// End.. Corportate setting url role config

    /*
     ******  Alert and Notitications *******
     ----------------------------------------------*/
    if (url.search('/alertsAndNotification/') !== -1) {
      const AdmingrantRTM = this.$auth.$grantAccess('A');
      const GKgrantRTM = this.$auth.$grantAccess('G');
      const StdgrantRTMA = this.$auth.$grantAccess('S');
      if (AdmingrantRTM === true || GKgrantRTM === true || StdgrantRTMA === true) {
        return true;
      }
      this.router.navigate(['/auth/login']);
      return false;
    }
    /// End Alert & Notification


    return true;
  }
}
