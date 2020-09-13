// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  /** Dev APIs  */
  production: false,
  authReq: 'https://dev.bosch-connected-elevators.com/api/user/auth/login',
  authReqLocal: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/api/user/auth/login',
  alertNotifications: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com',
 metrics: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/api/' 


  /** * Local API's 
  production: false,
  authReqLocal: 'http://localhost:5001/api/user/auth/login',
  metrics: 'http://localhost:5015/api/',
  alertNotifications: 'http://localhost:5015',
  authReq: 'http://localhost:5001/api/user/auth/login' */

  /**
  * QA API's  
  production: false,
  authReqLocal: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/qa/api/user/auth/login',
  metrics: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/qa/api/',
  alertNotifications: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/qa',
  authReq: 'http://up4-dev-556316795.ap-south-1.elb.amazonaws.com/qa/api/user/auth/login'
*/
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
