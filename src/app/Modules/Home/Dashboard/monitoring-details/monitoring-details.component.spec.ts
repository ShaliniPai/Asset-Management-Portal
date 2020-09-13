import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDetailsComponent } from './monitoring-details.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';

describe('MonitoringDetailsComponent', () => {
  let component: MonitoringDetailsComponent;
  let fixture: ComponentFixture<MonitoringDetailsComponent>;
  let httpMock:HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringDetailsComponent ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:  [AssetMonitoringService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDetailsComponent);
    component = fixture.componentInstance;
    const monitoringDetailsComponent = fixture.debugElement.injector.get(MonitoringDetailsComponent);
    monitoringDetailsComponent.ngOnInit=()=>{};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onBack() function shuld get called', () =>{
    const monitoringDetailsComponent = fixture.debugElement.injector.get(MonitoringDetailsComponent);
    monitoringDetailsComponent.onBack();
    expect(monitoringDetailsComponent.onBack).toHaveBeenCalled;
  });

  it('onFontSize() function shuld get called', () =>{
    const monitoringDetailsComponent = fixture.debugElement.injector.get(MonitoringDetailsComponent);
    monitoringDetailsComponent.onFontSize('seven');
    monitoringDetailsComponent.onFontSize('one');
    monitoringDetailsComponent.onFontSize('');
    expect(monitoringDetailsComponent.onFontSize).toHaveBeenCalled;
  });

  it('onSpanRow() function shuld get called', () =>{
    const monitoringDetailsComponent = fixture.debugElement.injector.get(MonitoringDetailsComponent);
    monitoringDetailsComponent.onSpanRow(false);
    monitoringDetailsComponent.onSpanRow(true);
    expect(monitoringDetailsComponent.onSpanRow).toHaveBeenCalled;
  });

});
