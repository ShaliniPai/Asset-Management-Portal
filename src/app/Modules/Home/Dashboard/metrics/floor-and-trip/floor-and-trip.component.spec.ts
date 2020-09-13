import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorAndTripComponent } from './floor-and-trip.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';

describe('FloorAndTripComponent', () => {
  let component: FloorAndTripComponent;
  let fixture: ComponentFixture<FloorAndTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorAndTripComponent ],
      schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],//noerror schema and custom element schema is added to avoid any template errors
      imports: [ FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:[ AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorAndTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('chartCBTimeFormat function to be called - reportType=day', () => {
    const floorAndTripComponent = fixture.debugElement.injector.get(FloorAndTripComponent);
    floorAndTripComponent.reportType='day';
    floorAndTripComponent.timeZone='+05:30';    
    floorAndTripComponent.chartCBTimeFormat('2020/03/02');
    expect(floorAndTripComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=week', () => {
    const floorAndTripComponent = fixture.debugElement.injector.get(FloorAndTripComponent);
    floorAndTripComponent.reportType='week';
    floorAndTripComponent.timeZone='+05:30';
    floorAndTripComponent.chartCBTimeFormat('2020/03/02');
    expect(floorAndTripComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=week', () => {
    const floorAndTripComponent = fixture.debugElement.injector.get(FloorAndTripComponent);
    floorAndTripComponent.reportType='';
    floorAndTripComponent.timeZone='+05:30';
    floorAndTripComponent.chartCBTimeFormat('2020/03/02');
    expect(floorAndTripComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  
  it('onChartOptions function to be called', () => {
    const floorAndTripComponent = fixture.debugElement.injector.get(FloorAndTripComponent);
    floorAndTripComponent.onChartOptions();
    expect(floorAndTripComponent.onChartOptions).toHaveBeenCalled;
  });


  it('OnLabels function to be called', () => {
    const floorAndTripComponent = fixture.debugElement.injector.get(FloorAndTripComponent);
    floorAndTripComponent.OnLabels(1221221211,1221222211,'+5:30UTC','week');
    floorAndTripComponent.OnLabels(1221221211,1221222211,'+5:30UTC','day');
    expect(floorAndTripComponent.OnLabels).toHaveBeenCalled;
  });
});
