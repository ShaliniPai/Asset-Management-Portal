import { Injectable } from '@angular/core';
import { roleEnum } from '../Enum/authorization.roles.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  /**
   * This function help us to get login User role
   * It return like ["Administrative","Gatekeeping","Standard","Installation"]
   */
  private onExtractMapping(): any[] {
    let roles = [];
    let mapping = localStorage.getItem('upUserMapping');
    /// There are two kind of users Tenant & Nontenant users
    const userRole = localStorage.getItem('upUserRole');
    if (mapping) {
      if (userRole) {
        mapping = JSON.parse(mapping);
        roles = mapping[userRole];
      }
      return roles;
    }
    return roles;
  }

  /**
   * This function returns boolean value to define the access permission based on feature with the associated role
   * @param role Role that is required to enable the feature
   * Roles shoutcuts such as
   * A = 'Administrative',
   * G = 'Gatekeeping',
   * S = 'Standard',
   * I = 'Installation'
   */
  public $grantAccess(role: string): boolean {
    const roleName = roleEnum[role];
    const definedRoles = this.onExtractMapping();
    if (definedRoles) {
      // If index is greater than -1 the role exists or it doesn't
      const isExists = definedRoles.findIndex((ele: string) => ele.toLowerCase() === roleName.toLowerCase());
      if (isExists >= 0) {
        return true;
      }
      return false;
    }
    return false;
  }

}
