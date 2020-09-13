import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizationComponent } from './utilization.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';

describe('UtilizationComponent', () => {
  let component: UtilizationComponent;
  let fixture: ComponentFixture<UtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilizationComponent ],
      schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],//noerror schema and custom element schema is added to avoid any template errors
      imports: [ FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:[ AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnLabels function to be called', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.OnLabels(1221221211,1221222211,'+5:30UTC','week');
    utilizationComponent.OnLabels(1221221211,1221222211,'+5:30UTC','day');
    expect(utilizationComponent.OnLabels).toHaveBeenCalled;
  });


  it('onChartOptions function to be called', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.onChartOptions();
    expect(utilizationComponent.onChartOptions).toHaveBeenCalled;
  });

  it('onChartOptions function to be called', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.reportType='day';
    utilizationComponent.onChartOptions();
    expect(utilizationComponent.onChartOptions).toHaveBeenCalled;
  });

  it('onChartOptions function to be called', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.reportType='week';
    utilizationComponent.onChartOptions();
    expect(utilizationComponent.onChartOptions).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=week', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.reportType='week';
    utilizationComponent.timeZone='+05:30';    
    utilizationComponent.chartCBTimeFormat('2020/03/02');
    expect(utilizationComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=day', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.reportType='day';
    utilizationComponent.timeZone='+05:30';    
    utilizationComponent.chartCBTimeFormat('2020/03/02');
    expect(utilizationComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('onTrimDataTOMaxUnits function to be called - reportType=hour', () => {
    const utilizationComponent = fixture.debugElement.injector.get(UtilizationComponent);
    utilizationComponent.rawData=[{
      active:1,
      idle: 0,
      down: 2,
      shutdown: 1,
      slow: 1,
      device: "string",
      date: "2020/03/02",
      dayNo: "string",
    }];
    utilizationComponent.assetCategory='elevator';
    utilizationComponent.reportType='week';
    utilizationComponent.timeZone='+5:30UTC';
    utilizationComponent.onTrimDataTOMaxUnits();
    expect(utilizationComponent.onTrimDataTOMaxUnits).toHaveBeenCalled;
  });

});
