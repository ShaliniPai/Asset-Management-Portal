import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Modules/Home/home/home.component';
import { DashboardComponent } from './Modules/Home/Dashboard/dashboard/dashboard.component';
import { AssetMonitoringComponent } from './Modules/Home/Dashboard/asset-monitoring/asset-monitoring.component';
import { AlertNotificationComponent } from './Modules/Home/Dashboard/alert-notification/alert-notification.component';
import { UserSettingsComponent } from './Modules/Home/CorpSetting/user-settings/user-settings.component';
import { AssetsComponent } from './Modules/Home/CorpSetting/assets/assets.component';
import { SuiteAssetFilterComponent } from './Modules/Home/Dashboard/suite-asset-filter/suite-asset-filter.component';
import { MonitoringDetailsComponent } from './Modules/Home/Dashboard/monitoring-details/monitoring-details.component';
import { HomeMainComponent } from './Modules/Auth/home.component';
import { LoginComponent } from './Modules/Auth/login/login.component';
import { ForgotpasswordComponent } from './Modules/Auth/forgotpassword/forgotpassword.component';
import { UtilizationComponent } from './Modules/Home/Dashboard/metrics/utilization/utilization.component';
import { FloorAndTripComponent } from './Modules/Home/Dashboard/metrics/floor-and-trip/floor-and-trip.component';
import { EnergyComponent } from './Modules/Home/Dashboard/metrics/energy/energy.component';
import { PeakUsageComponent } from './Modules/Home/Dashboard/metrics/peak-usage/peak-usage.component';
import { NotificationsReceivedComponent } from './Modules/Home/Dashboard/alert-notification/notifications-received/notifications-received.component';
import { DefineEventsComponent } from './Modules/Home/Dashboard/alert-notification/define-events/define-events.component';
import { CurrentDefinedEventsComponent } from './Modules/Home/Dashboard/alert-notification/current-defined-events/current-defined-events.component';
import { SitesComponent } from './Modules/Home/CorpSetting/sites/sites.component';
import { CreateUserComponent } from './Modules/Home/CorpSetting/create-user/create-user.component';
import { AddAssetComponent } from './Modules/Home/CorpSetting/add-asset/add-asset.component';
import { AddUserEntityComponent } from './Modules/Home/CorpSetting/add-user-entity/add-user-entity.component';
import { ViewUserDetailsComponent } from './Modules/Home/CorpSetting/view-user-details/view-user-details.component';
import { ViewAssetDetailsComponent } from './Modules/Home/CorpSetting/view-asset-details/view-asset-details.component';
import { ChangePasswordComponent } from './Modules/Auth/change-password/change-password.component';
import { UserProfileComponent } from './Modules/Home/UserSetting/user-profile.component';
import { UserPrevilegesMappingComponent } from './Modules/Home/CorpSetting/user-previleges-mapping/user-previleges-mapping.component';
import { RouteGuard } from './Core/Guards/route.guard';


const routes: Routes = [
  {
    component: HomeComponent, path: 'home', children: [
      { component: DashboardComponent, path: 'dashboard' },
      // { component: AssetMonitoringComponent, path: 'elevatorMonitor' },
      { component: SitesComponent, path: 'corp/sites', canActivate: [RouteGuard] },
      { component: UserSettingsComponent, path: 'corp/user', canActivate: [RouteGuard] },
      { component: UserPrevilegesMappingComponent, path: 'corp/user/UserPrevilegesMappingComponent', canActivate: [RouteGuard] },
      { component: AddUserEntityComponent, path: 'corp/user/addUserEntityComponent', canActivate: [RouteGuard] },
      { component: ViewUserDetailsComponent, path: 'corp/user/viewUserDetails', canActivate: [RouteGuard] },
      { component: ViewAssetDetailsComponent, path: 'corp/user/viewAssetDetails', canActivate: [RouteGuard] },
      { component: CreateUserComponent, path: 'corp/user/createUser', canActivate: [RouteGuard] },
      { component: AddAssetComponent, path: 'corp/asset/addAsset', canActivate: [RouteGuard] },
      { component: AssetsComponent, path: 'corp/asset', canActivate: [RouteGuard] },
      { component : UserProfileComponent, path: 'user/profile'},
      {
        component: SuiteAssetFilterComponent, path: 'suite', canActivate: [RouteGuard], children: [
          { component: AssetMonitoringComponent, path: 'assetMonitoring/:treeType', canActivate: [RouteGuard] },
        ]
      },
      {
        component: MonitoringDetailsComponent, path: 'monitoring/details', children: [
          { component: UtilizationComponent, path: 'util' },
          { component: FloorAndTripComponent, path: 'floorTrip' },
          { component: EnergyComponent, path: 'energy' },
          { component: PeakUsageComponent, path: 'peakUsage' },
          { path: '**', redirectTo: 'util', pathMatch: 'full' }
        ]
      },

      {
        path: 'alertsAndNotification', component: AlertNotificationComponent, canActivate: [RouteGuard],
        children: [
          { path: 'notificationReceived', component: NotificationsReceivedComponent, canActivate: [RouteGuard], },
          { path: 'defineEvents', component: DefineEventsComponent, canActivate: [RouteGuard], },
          { path: 'currentDefinedEvents', component: CurrentDefinedEventsComponent, canActivate: [RouteGuard], },
          { path: '', redirectTo: '/home/alertsAndNotification/notificationReceived', pathMatch: 'full', canActivate: [RouteGuard], },
        ]
      },

      { path: '**', redirectTo: 'suite/assetMonitoring/checkbox', pathMatch: 'full' },
    ]
  },
  {
    component: HomeMainComponent, path: 'auth', children: [
      { component: LoginComponent, path: 'login' },
      { component: ForgotpasswordComponent, path: 'forgotPassword' },
      { component: ChangePasswordComponent, path: 'changePassword' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: '**', redirectTo: 'auth', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
