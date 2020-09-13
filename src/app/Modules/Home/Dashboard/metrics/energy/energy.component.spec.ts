import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyComponent } from './energy.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';




describe('EnergyComponent', () => {
  let component: EnergyComponent;
  let fixture: ComponentFixture<EnergyComponent>;
  let httpMock:HttpTestingController;

 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyComponent ],
      schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],//noerror schema and custom element schema is added to avoid any template errors
      imports: [ FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:[ AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnLabels function to be called', () => {
    const energyComponent = fixture.debugElement.injector.get(EnergyComponent);
    energyComponent.OnLabels(1221221211,1221222211,'+5:30UTC','week');
    energyComponent.OnLabels(1221221211,1221222211,'+5:30UTC','day');
    expect(energyComponent.OnLabels).toHaveBeenCalled;
  });

  it('onChartOptions function to be called', () => {
    const energyComponent = fixture.debugElement.injector.get(EnergyComponent);
    energyComponent.onChartOptions();
    expect(energyComponent.onChartOptions).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=day', () => {
    const energyComponent = fixture.debugElement.injector.get(EnergyComponent);
    energyComponent.reportType='day';
    energyComponent.timeZone='+05:30';    
    energyComponent.chartCBTimeFormat('2020/03/02');
    expect(energyComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=week', () => {
    const energyComponent = fixture.debugElement.injector.get(EnergyComponent);
    energyComponent.reportType='week';
    energyComponent.timeZone='+05:30';
    energyComponent.chartCBTimeFormat('2020/03/02');
    expect(energyComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

  it('chartCBTimeFormat function to be called - reportType=week', () => {
    const energyComponent = fixture.debugElement.injector.get(EnergyComponent);
    energyComponent.reportType='';
    energyComponent.timeZone='+05:30';
    energyComponent.chartCBTimeFormat('2020/03/02');
    expect(energyComponent.chartCBTimeFormat).toHaveBeenCalled;
  });

});
