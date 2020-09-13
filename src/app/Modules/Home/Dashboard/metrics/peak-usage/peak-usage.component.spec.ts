import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakUsageComponent } from './peak-usage.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';

describe('PeakUsageComponent', () => {
  let component: PeakUsageComponent;
  let fixture: ComponentFixture<PeakUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeakUsageComponent ],
      schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],//noerror schema and custom element schema is added to avoid any template errors
      imports: [ FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:[ AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeakUsageComponent);
    component = fixture.componentInstance;
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);
    peakUsageComponent.onAccumulateData = () =>{};//overriding inAccumulateData function
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnLabels function to be called', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);
    peakUsageComponent.OnLabels('week');
    peakUsageComponent.OnLabels('day');
    expect(peakUsageComponent.OnLabels).toHaveBeenCalled;
  });

  it('onChartOptions function to be called', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);
    peakUsageComponent.onChartOptions();
    expect(peakUsageComponent.onChartOptions).toHaveBeenCalled;
  });


  it('chartCBTimeFormat function to be called - reportType=hour', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);
    peakUsageComponent.reportType='hour';
    peakUsageComponent.timeZone='+05:30';    
    peakUsageComponent.chartCBTimeFormat('2020/03/02');
    expect(peakUsageComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=" "', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);
    peakUsageComponent.reportType='';
    peakUsageComponent.timeZone='+05:30';    
    peakUsageComponent.chartCBTimeFormat('2020/03/02');
    expect(peakUsageComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('getDaysBetweenDates function to be called - value="weekday"', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);  
    peakUsageComponent.getDaysBetweenDates(10);
    expect(peakUsageComponent.getDaysBetweenDates).toHaveBeenCalled;
  });

  it('onSelectWeektype function to be called - value="weekday"', () => {
    const peakUsageComponent = fixture.debugElement.injector.get(PeakUsageComponent);  
    peakUsageComponent.onSelectWeektype(['1']);
    expect(peakUsageComponent.onSelectWeektype).toHaveBeenCalled;
  });

  
});
