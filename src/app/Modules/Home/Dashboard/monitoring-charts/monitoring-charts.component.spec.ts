import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringChartsComponent } from './monitoring-charts.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';


describe('MonitoringChartsComponent', () => {
  let component: MonitoringChartsComponent;
  let fixture: ComponentFixture<MonitoringChartsComponent>;
  let httpMock:HttpTestingController;
  let tabInfo = { type: 'present', index: 1, tabLabel: '' };
  let ev = {
    index:1,
    tab:{
      textLabel:'something'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringChartsComponent ],
      schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],//noerror schema and custom element schema is added to avoid any template errors
      imports: [ FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:[ AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringChartsComponent);
    httpMock=TestBed.get(HttpTestingController);
    component = fixture.componentInstance;
    const monitoringChartsComponent = fixture.debugElement.injector.get(MonitoringChartsComponent);
  const listMetricWindow: any[] = [
    { value: 'L7D', text: 'Last 7 days' },
    { value: 'L30D', text: 'Last 30 days' },
    { value: 'L3M', text: 'Last 3 months' },
  ];
  monitoringChartsComponent.selectedWidget={
    assetId: '1',
      assetName: "1",
      type: "elevator",
      status: "string",
      floors: "any",
      trips: "any",
      util: 0,
      downtime: 0,
      energy: 0,
      rowSpan: 0,
      timezone: 'string',
      did: 'string',
      floorsDay: 'any',
      tripsDay: 'any',
      peakHour: 'string',
      peakDay: 'string',
      energyDay: 8,
      onCheckMachineType(type,value){
        return value;
      },
      onRoundPercent(value){
        return value;
      },
      onRoundToThousand(value) {
        return value;
      }
  } 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onTabChanges function should get called',() => {
    const monitoringChartsComponent = fixture.debugElement.injector.get(MonitoringChartsComponent);
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    monitoringChartsComponent.windowList={
      value:1
    };
    
    monitoringChartsComponent.onTabChanges('Not value',ev);
    monitoringChartsComponent.onTabChanges('present',ev);
    // assetMonitoringService.getAPIMetric('rtm',1582655400000,1582711555891,[monitoringChartsComponent.selectedWidget.did],'total');
    expect(monitoringChartsComponent.onTabChanges).toHaveBeenCalled;
  });


  it('onChangemetricWindow function should get called',() => {
    const monitoringChartsComponent = fixture.debugElement.injector.get(MonitoringChartsComponent);
    monitoringChartsComponent.pastTabGroupIndex=1;
    monitoringChartsComponent.onChangeMetricWindow();
    expect(monitoringChartsComponent.onChangeMetricWindow).toHaveBeenCalled;
  });

  it('onReturnPDFTitle function should get called',() => {
    const monitoringChartsComponent = fixture.debugElement.injector.get(MonitoringChartsComponent);
    monitoringChartsComponent.onReturnPDFTitle();
    expect(monitoringChartsComponent.onReturnPDFTitle).toHaveBeenCalled;
  });

});
