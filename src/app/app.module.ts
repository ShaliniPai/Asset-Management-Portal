import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './Modules/Home/home/home.component';
import { NgMaterialModule } from './ng-material.module';
import { DashboardComponent } from './Modules/Home/Dashboard/dashboard/dashboard.component';
import { AssetMonitoringComponent } from './Modules/Home/Dashboard/asset-monitoring/asset-monitoring.component';
import { AlertNotificationComponent } from './Modules/Home/Dashboard/alert-notification/alert-notification.component';
import { AssetsComponent } from './Modules/Home/CorpSetting/assets/assets.component';
import { UserSettingsComponent } from './Modules/Home/CorpSetting/user-settings/user-settings.component';
import { RbComponentsUIModule } from './rb-components-ui.module';
import { LayoutModule } from '@angular/cdk/layout';
import { SuiteAssetFilterComponent } from './Modules/Home/Dashboard/suite-asset-filter/suite-asset-filter.component';
import { TreeviewRadioModule } from './Modules/Home/treeView/TreeViewRadio/treeview-radio.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonitoringDetailsComponent } from './Modules/Home/Dashboard/monitoring-details/monitoring-details.component';
import { MonitoringChartsComponent } from './Modules/Home/Dashboard/monitoring-charts/monitoring-charts.component';
import { LoginComponent } from './Modules/Auth/login/login.component';
import { ForgotpasswordComponent } from './Modules/Auth/forgotpassword/forgotpassword.component';
import { HomeMainComponent } from './Modules/Auth/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './Core/interceptor/token.interceptor';
import { UtilizationComponent } from './Modules/Home/Dashboard/metrics/utilization/utilization.component';
import { DowntimeComponent } from './Modules/Home/Dashboard/metrics/downtime/downtime.component';
import { EnergyComponent } from './Modules/Home/Dashboard/metrics/energy/energy.component';
import { PeakUsageComponent } from './Modules/Home/Dashboard/metrics/peak-usage/peak-usage.component';
import { FloorAndTripComponent } from './Modules/Home/Dashboard/metrics/floor-and-trip/floor-and-trip.component';
import { SnackMessageComponent } from './Core/MatSnackBarCom/snack-message/snack-message.component';
import { ChartsModule } from 'ng2-charts';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
// import { HttpClientModule } from '@angular/common/http';
import {
  NotificationsReceivedComponent
} from './Modules/Home/Dashboard/alert-notification/notifications-received/notifications-received.component';
import {
  DefineEventsComponent
} from './Modules/Home/Dashboard/alert-notification/define-events/define-events.component';
import {
  CurrentDefinedEventsComponent
} from './Modules/Home/Dashboard/alert-notification/current-defined-events/current-defined-events.component';
import { SitesComponent } from './Modules/Home/CorpSetting/sites/sites.component';
import { SitesShowComponent } from './Modules/Home/CorpSetting/sites/sites-show/sites-show.component';
import { SitesManageComponent } from './Modules/Home/CorpSetting/sites/sites-manage/sites-manage.component';
import { CreateUserComponent } from './Modules/Home/CorpSetting/create-user/create-user.component';
import { AddAssetComponent } from './Modules/Home/CorpSetting/add-asset/add-asset.component';
import {AddUserEntityComponent} from './Modules/Home/CorpSetting/add-user-entity/add-user-entity.component';
import { ResetPasswordComponent } from './Modules/Auth/reset-password/reset-password.component';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './Modules/Home/map/map.component';
import { ViewUserDetailsComponent } from './Modules/Home/CorpSetting/view-user-details/view-user-details.component';
import { ViewAssetDetailsComponent } from './Modules/Home/CorpSetting/view-asset-details/view-asset-details.component';
import {UserPrevilegesMappingComponent} from './Modules/Home/CorpSetting/user-previleges-mapping/user-previleges-mapping.component';
import { ChangePasswordComponent } from './Modules/Auth/change-password/change-password.component'; 
import { UserProfileComponent } from './Modules/Home/UserSetting/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    AssetMonitoringComponent,
    AlertNotificationComponent,
    AssetsComponent,
    UserSettingsComponent,
    SuiteAssetFilterComponent,
    MonitoringDetailsComponent,
    MonitoringChartsComponent,
    SnackMessageComponent,
    ResetPasswordComponent,


    /// Login
    LoginComponent,
    ForgotpasswordComponent,
    HomeMainComponent,
    UtilizationComponent,
    DowntimeComponent,
    EnergyComponent,
    PeakUsageComponent,
    FloorAndTripComponent,

    /// Alert and Notification
    NotificationsReceivedComponent,
    DefineEventsComponent,
    CurrentDefinedEventsComponent,
    SitesComponent,
    SitesShowComponent,
    SitesManageComponent,
    MapComponent,
    CreateUserComponent,
    AddAssetComponent,
    AddUserEntityComponent,
    ViewUserDetailsComponent,
    ViewAssetDetailsComponent,
    UserPrevilegesMappingComponent,
    ChangePasswordComponent,
    /// User Profile (Added By Vishal)
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    RbComponentsUIModule,
    LayoutModule,
    TreeviewRadioModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    PDFExportModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAfX8jilcH-RpIIAuLM97uqo3sGoEtMzJw', libraries: ['places'] })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [SnackMessageComponent, MapComponent,ResetPasswordComponent]
})
export class AppModule { }
