import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsReceivedComponent } from './notifications-received.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';

describe('NotificationsReceivedComponent', () => {
  let component: NotificationsReceivedComponent;
  let fixture: ComponentFixture<NotificationsReceivedComponent>;
  let httpMock:HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsReceivedComponent ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule,BrowserAnimationsModule,ReactiveFormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule ],
      providers: [ AlertsNotifServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsReceivedComponent);
    component = fixture.componentInstance;
    httpMock=TestBed.get(HttpTestingController);
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`calling getNotificationsData api- sould get called`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/getNotifications`);//http mock-mocking the api call 
    expect(req.request.method).toBe('GET');//expecting the request method
    expect(req.request.responseType).toBe('json');//expecting the response type
    req.flush(null);//flushing any response body and putting mock data that we have created
  });
});
